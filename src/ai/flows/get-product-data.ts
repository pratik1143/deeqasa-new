'use server';
/**
 * @fileoverview This file defines a Genkit flow for fetching product data from a Google Sheet.
 *
 * - getProductData - A function that fetches data from the specified Google Sheet.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { google } from 'googleapis';
import serviceAccount from '@/ai/service-account.json';
import { ProductSchema } from '@/lib/quotation-schemas';

// NOTE: Replace this with your actual Google Sheet ID containing product data
const PRODUCT_SHEET_ID = "1gZWkQV-2TYIDZ_bFEQG6EHlHPImXjb6p-4oSiCFRKFk"; // Example ID, replace

const GetProductDataOutputSchema = z.array(ProductSchema);

export type GetProductDataOutput = z.infer<typeof GetProductDataOutputSchema>;

/**
 * Fetches and parses product data from a specified Google Sheet.
 * @returns A promise that resolves to an array of product objects.
 */
export async function getProductData(): Promise<GetProductDataOutput> {
  return getProductDataFlow();
}

const getProductDataFlow = ai.defineFlow(
  {
    name: 'getProductDataFlow',
    inputSchema: z.void(),
    outputSchema: GetProductDataOutputSchema,
  },
  async () => {
    const auth = new google.auth.JWT(
      serviceAccount.client_email,
      undefined,
      serviceAccount.private_key,
      ['https://www.googleapis.com/auth/spreadsheets.readonly']
    );

    const sheets = google.sheets({ version: 'v4', auth });

    try {
      const spreadsheetMeta = await sheets.spreadsheets.get({ spreadsheetId: PRODUCT_SHEET_ID });
      const firstSheetName = spreadsheetMeta.data.sheets?.[0]?.properties?.title;

      if (!firstSheetName) {
        throw new Error("Could not find any sheets in the specified Product Google Sheet document.");
      }
      
      const range = `${firstSheetName}!A:Z`;
      
      const response = await sheets.spreadsheets.values.get({ spreadsheetId: PRODUCT_SHEET_ID, range });

      const rows = response.data.values;
      if (!rows || rows.length < 2) {
        console.warn("Product sheet is empty or has only a header row.");
        return [];
      };

      const headers = rows[0].map(h => String(h || '').trim().toUpperCase());
      const dataRows = rows.slice(1);
      
      const headerIndexMap: { [key: string]: number } = {};
      headers.forEach((header, index) => {
        if(header) headerIndexMap[header] = index;
      });
       
      if (headerIndexMap['SKU'] === undefined || headerIndexMap['FTP'] === undefined) {
          throw new Error("Missing required columns in Product sheet. The header must contain 'SKU' and 'FTP'.");
      }
      
      const parsedData = dataRows.map((row) => {
        const sku = String(row[headerIndexMap['SKU']] || '').trim();
        if (!sku) return null;

        const priceStr = String(row[headerIndexMap['FTP']] || '');
        if (!priceStr) return null;
        
        const price = parseFloat(priceStr.replace(/[^0-9.]+/g, ''));
        if (isNaN(price)) return null;

        const descriptionParts = [
            sku,
            row[headerIndexMap['PROCESSOR']],
            row[headerIndexMap['MEMORY']],
            row[headerIndexMap['HDD']],
            row[headerIndexMap['GFX']]
        ].filter(part => part && String(part).trim() !== '');
        
        const name = descriptionParts.join(' / ');
        
        return {
          id: sku,
          name: name || 'Product details not available',
          processor: headerIndexMap['PROCESSOR'] !== undefined ? String(row[headerIndexMap['PROCESSOR']] || '') : undefined,
          memory: headerIndexMap['MEMORY'] !== undefined ? String(row[headerIndexMap['MEMORY']] || '') : undefined,
          storage: headerIndexMap['HDD'] !== undefined ? String(row[headerIndexMap['HDD']] || '') : undefined,
          gpu: headerIndexMap['GFX'] !== undefined ? String(row[headerIndexMap['GFX']] || '') : undefined,
          os: headerIndexMap['OS'] !== undefined ? String(row[headerIndexMap['OS']] || '') : undefined,
          warranty: headerIndexMap['WARRANTY'] !== undefined ? String(row[headerIndexMap['WARRANTY']] || '') : undefined,
          price: price,
          gstRate: 18, // Defaulting to 18% as it's not in the sheet
        };
      }).filter((p): p is NonNullable<typeof p> => p !== null);

      const validationResult = GetProductDataOutputSchema.safeParse(parsedData);
      if (validationResult.success) {
        return validationResult.data;
      } else {
        console.error("Zod validation error for products (invalid rows will be filtered out):", validationResult.error.flatten().fieldErrors);
        const invalidIndexes = new Set(validationResult.error.issues.map(issue => issue.path[0]));
        const validData = parsedData.filter((_, index) => !invalidIndexes.has(index));
        return validData;
      }

    } catch (err: any) {
        console.error('Google Sheets API error (Products): ', err.message);
        let friendlyMessage = 'An unexpected error occurred while fetching product data from Google Sheets.';
        if (err.code === 403) {
            friendlyMessage = `Permission Denied: The service account ('${serviceAccount.client_email}') does not have Viewer access to the Product Google Sheet. Please share the sheet with this email address.`;
        } else if (err.code === 404) {
            friendlyMessage = `Not Found: The Google Sheet with ID "${PRODUCT_SHEET_ID}" could not be found.`;
        } else if (err.message) {
            friendlyMessage = err.message;
        }
        throw new Error(friendlyMessage);
    }
  }
);
