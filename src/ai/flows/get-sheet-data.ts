'use server';
/**
 * @fileoverview This file defines a Genkit flow for fetching and parsing sales funnel data from a Google Sheet.
 * It provides a secure, server-side mechanism to read live spreadsheet data.
 *
 * - getSheetData - A function that fetches data from the specified Google Sheet.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { google } from 'googleapis';
import type { FunnelData } from '@/lib/types';
import serviceAccount from '@/ai/service-account.json';
import { FunnelDataSchema } from '@/lib/schemas';

const GetSheetDataInputSchema = z.object({
  spreadsheetId: z.string().describe('The ID of the Google Sheet.'),
});

// The output schema is now an array of the updated FunnelDataSchema
const GetSheetDataOutputSchema = z.array(FunnelDataSchema);

export type GetSheetDataInput = z.infer<typeof GetSheetDataInputSchema>;
export type GetSheetDataOutput = z.infer<typeof GetSheetDataOutputSchema>;

/**
 * Fetches and parses sales funnel data from a specified Google Sheet.
 * This function should be called from the frontend to get live data.
 * @param input The spreadsheet ID.
 * @returns A promise that resolves to an array of funnel data objects.
 */
export async function getSheetData(input: GetSheetDataInput): Promise<GetSheetDataOutput> {
  return getSheetDataFlow(input);
}

const getSheetDataFlow = ai.defineFlow(
  {
    name: 'getSheetDataFlow',
    inputSchema: GetSheetDataInputSchema,
    outputSchema: GetSheetDataOutputSchema,
  },
  async ({ spreadsheetId }) => {
    const auth = new google.auth.JWT(
      serviceAccount.client_email,
      undefined,
      serviceAccount.private_key,
      ['https://www.googleapis.com/auth/spreadsheets.readonly']
    );

    const sheets = google.sheets({ version: 'v4', auth });

    try {
      const spreadsheetMeta = await sheets.spreadsheets.get({ spreadsheetId });
      const firstSheetName = spreadsheetMeta.data.sheets?.[0]?.properties?.title;
      if (!firstSheetName) {
        throw new Error("Could not find any sheets in the specified Google Sheet document.");
      }
      
      const range = `${firstSheetName}!A:Z`;
      const response = await sheets.spreadsheets.values.get({ spreadsheetId, range });

      const rows = response.data.values;
      if (!rows || rows.length < 2) return [];

      const rawHeaders = rows[0];
      const dataRows = rows.slice(1);

      // Normalization map from sheet header (lowercase, trimmed) to FunnelData key
      const headerMap: { [key: string]: keyof FunnelData } = {
        'funnel': 'status',
        'revenue ($k)': 'revenue',
        'bdm/isr': 'owner',
        'region': 'region',
        'state': 'state',
        'segment (please select from drop down)': 'segment',
        'closure month': 'closureMonth',
        'opp. close month': 'oppCloseMonth',
        'account name': 'accountName',
        'pl (please select from drop down)': 'productLine',
        'hp model (product name)': 'product',
        'probability %': 'probability',
        'last modified': 'lastModified',
      };

      const indexToKeyMap: { [index: number]: keyof FunnelData } = {};
      rawHeaders.forEach((header, index) => {
          const normalizedHeader = header.trim().toLowerCase();
          if (headerMap[normalizedHeader]) {
              indexToKeyMap[index] = headerMap[normalizedHeader];
          }
      });

      const parsedData = dataRows.map((row, index) => {
        const item: any = { id: index + 1, rowNumber: index + 2 };
        
        Object.entries(indexToKeyMap).forEach(([colIndexStr, key]) => {
            const colIndex = parseInt(colIndexStr, 10);
            if (colIndex < row.length) item[key] = row[colIndex];
        });

        // Data cleaning and type conversion
        if (item.revenue) {
            const revenueInK = parseFloat(String(item.revenue).replace(/[^0-9.-]+/g,""));
            item.revenue = isNaN(revenueInK) ? 0 : revenueInK * 1000;
        } else {
            item.revenue = 0;
        }

        if (item.probability) {
            const prob = parseFloat(String(item.probability).replace('%',''));
            item.probability = isNaN(prob) ? 0 : prob / 100;
        } else {
            item.probability = 0;
        }
        
        const statusStr = String(item.status || '').trim().toLowerCase();
        if (statusStr === 'won') item.status = 'Won';
        else if (statusStr === 'lost') item.status = 'Lost';
        else item.status = 'Pipeline';

        // Provide defaults for required fields to ensure validation passes
        if (!item.closureMonth) item.closureMonth = "N/A";
        if (!item.region) item.region = "N/A";
        if (!item.segment) item.segment = "N/A";
        if (!item.product) item.product = "N/A";
        if (!item.accountName) item.accountName = "Unknown";
        if (!item.owner) item.owner = "Unassigned";

        return item;
      }).filter(item => item.accountName && item.accountName.trim() !== '' && item.accountName.trim() !== 'Unknown');

      console.log(`[getSheetData] Total rows fetched: ${dataRows.length}`);
      console.log(`[getSheetData] Total rows after parsing & filtering: ${parsedData.length}`);
      if (parsedData.length > 0) {
        console.log('[getSheetData] Sample normalized row:', JSON.stringify(parsedData[0], null, 2));
      }

      if (dataRows.length > 0 && parsedData.length === 0) {
          throw new Error('Data mapping failed: Zero rows were produced after normalization. Check sheet headers.');
      }

      const validationResult = GetSheetDataOutputSchema.safeParse(parsedData);
      if (validationResult.success) {
        return validationResult.data;
      } else {
        console.error("Zod validation error:", validationResult.error.flatten());
        return parsedData.filter((_, index) => 
            !validationResult.error.issues.some(issue => issue.path.includes(index))
        );
      }

    } catch (err: any) {
        console.error('Google Sheets API error: ', err.message);
        let friendlyMessage = 'An unexpected error occurred while fetching data from Google Sheets.';
        if (err.code === 403) {
            friendlyMessage = `Permission Denied: The service account ('${serviceAccount.client_email}') does not have Viewer access to the Google Sheet. Please share the sheet with this email address.`;
        } else if (err.code === 404) {
            friendlyMessage = `Not Found: The Google Sheet with ID "${spreadsheetId}" could not be found.`;
        } else if (err.message) {
            friendlyMessage = err.message;
        }
        throw new Error(friendlyMessage);
    }
  }
);
