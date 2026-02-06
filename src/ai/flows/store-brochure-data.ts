'use server';
/**
 * @fileoverview Logs brochure generation events to a Google Sheet.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { google } from 'googleapis';
import serviceAccount from '@/ai/service-account.json';

const StoreBrochureInputSchema = z.object({
  customerName: z.string(),
  companyName: z.string(),
  products: z.array(z.string()),
  quotationRef: z.string(),
});

export async function storeBrochureLog(input: z.infer<typeof StoreBrochureInputSchema>) {
  return storeBrochureFlow(input);
}

const storeBrochureFlow = ai.defineFlow(
  {
    name: 'storeBrochureFlow',
    inputSchema: StoreBrochureInputSchema,
    outputSchema: z.object({ success: z.boolean() }),
  },
  async (input) => {
    const SPREADSHEET_ID = process.env.GOOGLE_SHEET_ID || "1gZWkQV-2TYIDZ_bFEQG6EHlHPImXjb6p-4oSiCFRKFk";
    
    const auth = new google.auth.JWT(
      serviceAccount.client_email,
      undefined,
      serviceAccount.private_key,
      ['https://www.googleapis.com/auth/spreadsheets']
    );

    const sheets = google.sheets({ version: 'v4', auth });
    const sheetName = "BrochureLogs";

    try {
      // Check if sheet exists, if not create it
      const meta = await sheets.spreadsheets.get({ spreadsheetId: SPREADSHEET_ID });
      const sheetExists = meta.data.sheets?.some(s => s.properties?.title === sheetName);
      
      if (!sheetExists) {
        await sheets.spreadsheets.batchUpdate({
          spreadsheetId: SPREADSHEET_ID,
          requestBody: {
            requests: [{ addSheet: { properties: { title: sheetName } } }]
          }
        });
        // Add headers
        await sheets.spreadsheets.values.update({
          spreadsheetId: SPREADSHEET_ID,
          range: `${sheetName}!A1:E1`,
          valueInputOption: 'USER_ENTERED',
          requestBody: { values: [['Timestamp', 'Customer', 'Organization', 'Products', 'Quotation Ref']] }
        });
      }

      await sheets.spreadsheets.values.append({
        spreadsheetId: SPREADSHEET_ID,
        range: `${sheetName}!A:E`,
        valueInputOption: 'USER_ENTERED',
        requestBody: {
          values: [[
            new Date().toISOString(),
            input.customerName,
            input.companyName,
            input.products.join(', '),
            input.quotationRef
          ]]
        }
      });

      return { success: true };
    } catch (err) {
      console.error('Failed to log brochure:', err);
      return { success: false };
    }
  }
);
