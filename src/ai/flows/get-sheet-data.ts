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

// Define the Zod schema for validation, consistent with the FunnelData type
const FunnelDataSchema = z.object({
  id: z.number(),
  status: z.enum(['Won', 'Lost', 'Pipeline']),
  revenue: z.number(),
  closureMonth: z.string(),
  region: z.string(),
  segment: z.string(),
  product: z.string(),
  accountName: z.string(),
  owner: z.string(),
  probability: z.number(),
});

const GetSheetDataInputSchema = z.object({
  spreadsheetId: z.string().describe('The ID of the Google Sheet.'),
});

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
    const serviceAccountEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
    const privateKey = process.env.GOOGLE_PRIVATE_KEY;

    if (!serviceAccountEmail || !privateKey) {
      throw new Error('Authentication Error: Google service account credentials (GOOGLE_SERVICE_ACCOUNT_EMAIL and GOOGLE_PRIVATE_KEY) are not configured in the environment.');
    }
    
    const auth = new google.auth.JWT(
      serviceAccountEmail,
      undefined,
      privateKey.replace(/\\n/g, '\n'),
      ['https://www.googleapis.com/auth/spreadsheets.readonly']
    );

    const sheets = google.sheets({ version: 'v4', auth });

    try {
      // Step 1: Get spreadsheet metadata to find the first sheet's name
      const spreadsheetMeta = await sheets.spreadsheets.get({
        spreadsheetId,
      });

      const firstSheetName = spreadsheetMeta.data.sheets?.[0]?.properties?.title;

      if (!firstSheetName) {
        throw new Error("Could not find any sheets in the specified Google Sheet document. Please ensure it's not empty.");
      }
      
      // Step 2: Construct the range dynamically for columns A to I
      const range = `${firstSheetName}!A:I`;

      const response = await sheets.spreadsheets.values.get({
        spreadsheetId,
        range,
      });

      const rows = response.data.values;
      if (!rows || rows.length < 2) {
        // Not enough data (at least 1 header row and 1 data row)
        return [];
      }

      const headers = rows[0].map(h => h.trim());
      const dataRows = rows.slice(1);

      const headerMap: { [key: string]: keyof FunnelData | string } = {
        'Funnel status': 'status',
        'Revenue': 'revenue',
        'Closure Month': 'closureMonth',
        'Region': 'region',
        'Segment': 'segment',
        'Product': 'product',
        'Account Name': 'accountName',
        'BDM / ISR': 'owner',
        'Probability %': 'probability',
      };
      
      const parsedData = dataRows.map((row, index) => {
        const item: any = { id: index + 1 };
        headers.forEach((header, i) => {
          const key = headerMap[header] || header.toLowerCase().replace(/\s/g, '_');
          if (key && i < row.length) {
              item[key] = row[i];
          }
        });

        // Data cleaning and type conversion
        item.revenue = parseFloat(String(item.revenue || '0').replace(/[^0-9.-]+/g,""));
        item.probability = parseFloat(String(item.probability || '0').replace('%','')) / 100;
        
        if (isNaN(item.revenue)) item.revenue = 0;
        if (isNaN(item.probability)) item.probability = 0;
        
        const validStatus = ['Won', 'Lost', 'Pipeline'];
        if (!validStatus.includes(item.status)) {
           item.status = 'Pipeline'; // Default to pipeline if status is invalid
        }

        return item;
      }).filter(item => item.accountName && item.accountName.trim() !== ''); // Filter out empty rows

      // Validate data with Zod
      const validationResult = GetSheetDataOutputSchema.safeParse(parsedData);
      if (validationResult.success) {
        return validationResult.data;
      } else {
        console.error("Zod validation error:", validationResult.error.flatten());
        // Filter out invalid items before returning
        return parsedData.filter((_, index) => 
            !validationResult.error.issues.some(issue => issue.path.includes(index))
        );
      }

    } catch (err: any) {
        console.error('Google Sheets API returned an error: ', err.message);

        let friendlyMessage = 'An unexpected error occurred while fetching data from Google Sheets.';

        if (err.code) {
            switch (err.code) {
                case 400:
                    friendlyMessage = `Invalid Request: There might be an issue with the spreadsheet structure. Please check the sheet and try again.`;
                    break;
                case 403:
                    friendlyMessage = `Permission Denied: The service account ('${serviceAccountEmail}') does not have Viewer access to the Google Sheet. Please share the sheet with this email address.`;
                    break;
                case 404:
                    friendlyMessage = `Not Found: The Google Sheet with ID "${spreadsheetId}" could not be found. Please verify the Spreadsheet ID.`;
                    break;
            }
        } else if (err.message?.includes('invalid_grant')) {
            friendlyMessage = 'Authentication Failed: The service account credentials are not valid. Please check the private key and service account email in your environment variables.';
        } else if (err.message) {
            friendlyMessage = err.message;
        }

        throw new Error(friendlyMessage);
    }
  }
);