'use server';
/**
 * @fileoverview This file defines a Genkit flow for updating a row in the sales funnel Google Sheet.
 *
 * - updateSheetData - A function that updates a specific row in the sheet.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { google } from 'googleapis';
import serviceAccount from '@/ai/service-account.json';
import { FunnelDataSchema } from '@/lib/schemas';
import type { FunnelData } from '@/lib/types';

export type UpdateSheetDataInput = z.infer<typeof FunnelDataSchema>;

export async function updateSheetData(input: UpdateSheetDataInput): Promise<{ success: boolean; message: string }> {
  return updateSheetDataFlow(input);
}

const updateSheetDataFlow = ai.defineFlow(
  {
    name: 'updateSheetDataFlow',
    inputSchema: FunnelDataSchema,
    outputSchema: z.object({ success: z.boolean(), message: z.string() }),
  },
  async (data) => {
    const SPREADSHEET_ID = "1gZWkQV-2TYIDZ_bFEQG6EHlHPImXjb6p-4oSiCFRKFk";

    const auth = new google.auth.JWT(
      serviceAccount.client_email,
      undefined,
      serviceAccount.private_key,
      ['https://www.googleapis.com/auth/spreadsheets'] // Write scope is required
    );
    const sheets = google.sheets({ version: 'v4', auth });

    try {
      const spreadsheetMeta = await sheets.spreadsheets.get({ spreadsheetId: SPREADSHEET_ID });
      const sheetName = spreadsheetMeta.data.sheets?.[0]?.properties?.title;
      if (!sheetName) {
        throw new Error("Could not find any sheets in the document.");
      }

      const headerResponse = await sheets.spreadsheets.values.get({ spreadsheetId: SPREADSHEET_ID, range: `${sheetName}!1:1` });
      const headers = headerResponse.data.values?.[0];
      if (!headers) {
        throw new Error("Could not read headers from the sheet.");
      }

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
        'last modified': 'lastModified'
      };

      const dataWithTimestamp = { ...data, lastModified: new Date().toISOString() };
      
      const rowValues = headers.map(header => {
        const normalizedHeader = header.trim().toLowerCase();
        
        if (normalizedHeader === 'last modified') {
          return dataWithTimestamp.lastModified;
        }

        const dataKey = headerMap[normalizedHeader];
        if (!dataKey) {
            // For columns that are not in our data model, we cannot update them.
            // We return an empty string to clear them, or we would need to read the row first.
            // For this implementation, we assume all important columns are mapped.
            return '';
        }

        const value = dataWithTimestamp[dataKey as keyof FunnelData];

        if (dataKey === 'revenue' && typeof value === 'number') {
            return value / 1000;
        }
        if (dataKey === 'probability' && typeof value === 'number') {
            return value * 100;
        }

        return value ?? '';
      });
      
      const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
      const lastColumn = alphabet[headers.length - 1];
      const range = `${sheetName}!A${data.rowNumber}:${lastColumn}${data.rowNumber}`;

      await sheets.spreadsheets.values.update({
        spreadsheetId: SPREADSHEET_ID,
        range,
        valueInputOption: 'USER_ENTERED',
        requestBody: {
          values: [rowValues],
        },
      });

      return { success: true, message: "Sheet updated successfully." };

    } catch (err: any) {
      console.error('Google Sheets update error: ', err);
      let friendlyMessage = 'An unexpected error occurred while updating the Google Sheet.';
      if (err.code === 403) {
          friendlyMessage = `Permission Denied: The service account ('${serviceAccount.client_email}') does not have Editor access to the Google Sheet. Please share the sheet and grant Editor permissions.`;
      } else if (err.message) {
          friendlyMessage = err.message;
      }
      throw new Error(friendlyMessage);
    }
  }
);
