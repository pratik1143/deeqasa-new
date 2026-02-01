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

// Use environment variable for Sheet ID, with a fallback to the known ID.
const PRODUCT_SHEET_ID = process.env.GOOGLE_SHEET_ID || "1gZWkQV-2TYIDZ_bFEQG6EHlHPImXjb6p-4oSiCFRKFk";

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
    
    const sheetName = "Products";
    const range = `${sheetName}!A1:M`; // Use the exact range as requested.

    try {
      const response = await sheets.spreadsheets.values.get({ spreadsheetId: PRODUCT_SHEET_ID, range });

      const rows = response.data.values;
      if (!rows || rows.length < 2) {
        console.warn(`[get-product-data] The "${sheetName}" sheet is empty or has only a header row.`);
        return [];
      };

      const rawHeaders = rows[0];
      console.log("[get-product-data] Raw headers found in sheet:", rawHeaders);
      
      const headers = rawHeaders.map(h => String(h || '').trim().toUpperCase());
      console.log("[get-product-data] Normalized headers:", headers);

      const dataRows = rows.slice(1);
      
      const headerIndexMap: { [key: string]: number } = {};
      headers.forEach((header, index) => {
        if(header) headerIndexMap[header] = index;
      });
       
      if (headerIndexMap['SKU'] === undefined || headerIndexMap['FTP'] === undefined) {
          throw new Error(`Missing required columns in "${sheetName}" sheet. The header must contain 'SKU' and 'FTP'. Detected headers: ${headers.join(', ')}`);
      }
      
      const parsedData = dataRows.map((row) => {
        const sku = String(row[headerIndexMap['SKU']] || '').trim();
        if (!sku) return null; // Skip rows without SKU

        const priceStr = String(row[headerIndexMap['FTP']] || '');
        if (!priceStr) return null; // Skip rows without FTP
        
        const price = parseFloat(priceStr.replace(/[^0-9.]+/g, ''));
        if (isNaN(price)) return null; // Skip rows with invalid FTP

        const processor = row[headerIndexMap['PROCESSOR']] ? String(row[headerIndexMap['PROCESSOR']]) : undefined;
        const memory = row[headerIndexMap['MEMORY']] ? String(row[headerIndexMap['MEMORY']]) : undefined;
        const hdd1 = row[headerIndexMap['HDD']] ? String(row[headerIndexMap['HDD']]) : undefined;
        const hdd2 = row[headerIndexMap['HDD 2']] ? String(row[headerIndexMap['HDD 2']]) : undefined;
        const gpu = row[headerIndexMap['GFX']] ? String(row[headerIndexMap['GFX']]) : undefined;
        const os = row[headerIndexMap['OS']] ? String(row[headerIndexMap['OS']]) : undefined;
        const warranty = row[headerIndexMap['WARRANTY']] ? String(row[headerIndexMap['WARRANTY']]) : undefined;

        const storage = [hdd1, hdd2].filter(Boolean).join(' + ');

        const name = [
            sku,
            processor,
            memory,
            storage,
            gpu
        ].filter(part => part && String(part).trim() !== '').join(' / ');
        
        return {
          id: sku,
          name: name || 'Product details not available',
          processor,
          memory,
          storage: storage || undefined,
          gpu,
          os,
          warranty,
          price: price,
          gstRate: 18, // Defaulting to 18% as it's not in the sheet
        };
      }).filter((p): p is NonNullable<typeof p> => p !== null);

      const validationResult = GetProductDataOutputSchema.safeParse(parsedData);
      if (validationResult.success) {
        return validationResult.data;
      } else {
        console.error("[get-product-data] Zod validation error (invalid rows will be filtered out):", validationResult.error.flatten().fieldErrors);
        const invalidIndexes = new Set(validationResult.error.issues.map(issue => issue.path[0]));
        const validData = parsedData.filter((_, index) => !invalidIndexes.has(index));
        return validData;
      }

    } catch (err: any) {
        console.error('Google Sheets API error (Products): ', err.message);
        
        let friendlyMessage = `An unexpected error occurred while fetching product data. Details: ${err.message}`;
        
        // Add more context to the error message.
        if (err.code === 403) {
            friendlyMessage = `Permission Denied: The service account ('${serviceAccount.client_email}') does not have Viewer access to the Google Sheet with ID "${PRODUCT_SHEET_ID}". Please share the sheet with this email address.`;
        } else if (err.code === 404) {
            friendlyMessage = `Not Found: The Google Sheet with ID "${PRODUCT_SHEET_ID}" could not be found.`;
        } else if (err.message && err.message.includes('Unable to parse range')) {
            try {
                // Fetch sheet names to provide more context.
                const spreadsheetMeta = await sheets.spreadsheets.get({ spreadsheetId: PRODUCT_SHEET_ID });
                const sheetTitles = spreadsheetMeta.data.sheets?.map(s => s.properties?.title).filter(Boolean) || [];
                friendlyMessage = `Unable to parse range: "${range}". Please ensure the sheet name is correct. Available sheets in this document: [${sheetTitles.join(', ')}].`;
            } catch (metaErr: any) {
                 friendlyMessage = `Unable to parse range "${range}" and could not fetch sheet metadata. Please check the Spreadsheet ID and permissions. Original error: ${err.message}`;
            }
        }
        
        throw new Error(friendlyMessage);
    }
  }
);
