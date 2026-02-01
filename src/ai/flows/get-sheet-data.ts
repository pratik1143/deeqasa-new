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
  range: z.string().describe('The A1 notation of the range to retrieve.'),
});

const GetSheetDataOutputSchema = z.array(FunnelDataSchema);

export type GetSheetDataInput = z.infer<typeof GetSheetDataInputSchema>;
export type GetSheetDataOutput = z.infer<typeof GetSheetDataOutputSchema>;

/**
 * Fetches and parses sales funnel data from a specified Google Sheet.
 * This function should be called from the frontend to get live data.
 * @param input The spreadsheet ID and range.
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
  async ({ spreadsheetId, range }) => {
    // This uses Application Default Credentials.
    // Ensure your service account credentials are available in the environment.
    const auth = new google.auth.GoogleAuth({
      scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
    });

    const sheets = google.sheets({ version: 'v4', auth });

    try {
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
            // If status is invalid, we might default it or skip the row.
            // For now, we'll let it pass and Zod validation will catch it if it's strict.
            // A safer approach for production might be to filter it out.
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
      console.error('The API returned an error: ', err);
      // Provide a more user-friendly error message
      if (err.code === 404) {
          throw new Error('Google Sheet not found. Please verify the Spreadsheet ID.');
      }
      if (err.code === 403) {
          throw new Error('Permission denied. Ensure the service account has viewer access to the Google Sheet.');
      }
      throw new Error('Failed to fetch data from Google Sheet. Check server logs for details.');
    }
  }
);
