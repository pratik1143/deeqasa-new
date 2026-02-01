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
      if (!rows || rows.length < 2) return [];

      const headers = rows[0].map(h => String(h || '').trim().toLowerCase());
      const dataRows = rows.slice(1);
      
      const headerMap: { [key: string]: string } = {
        'sku': 'id',
        'processor': 'processor',
        'memory': 'memory',
        'hdd': 'storage',
        'hdd 2': 'hdd2',
        'gfx': 'gpu',
        'os': 'os',
        'warranty': 'warranty',
        'ftp': 'price',
      };
      
      const indexMap: { [key: string]: number } = {};
      for (const header in headerMap) {
          const idx = headers.indexOf(header);
          if (idx !== -1) {
            indexMap[headerMap[header]] = idx;
          }
      }
       
      if (indexMap['id'] === undefined || indexMap['price'] === undefined) {
          throw new Error("Missing required columns in Product sheet. Expected at least: 'SKU' and 'FTP'.");
      }
      
      const parsedData = dataRows.map((row) => {
        const descriptionParts = [
            row[indexMap['processor']],
            row[indexMap['memory']],
            row[indexMap['storage']], // Mapped from HDD
            row[indexMap['hdd2']],    // Mapped from HDD 2
            row[indexMap['gpu']]      // Mapped from GFX
        ].filter(part => part && String(part).trim() !== '');
        
        const name = descriptionParts.join(' / ');

        const priceStr = indexMap['price'] !== undefined ? String(row[indexMap['price']] || '0') : '0';
        const price = parseFloat(priceStr.replace(/[^0-9.-]+/g,""));
        
        const sku = String(row[indexMap['id']] || '').trim();
        if (!sku) return null;

        return {
          id: sku,
          name: name || 'Product details not available',
          processor: indexMap['processor'] !== undefined ? String(row[indexMap['processor']] || '') : undefined,
          memory: indexMap['memory'] !== undefined ? String(row[indexMap['memory']] || '') : undefined,
          storage: indexMap['storage'] !== undefined ? String(row[indexMap['storage']] || '') : undefined,
          gpu: indexMap['gpu'] !== undefined ? String(row[indexMap['gpu']] || '') : undefined,
          os: indexMap['os'] !== undefined ? String(row[indexMap['os']] || '') : undefined,
          warranty: indexMap['warranty'] !== undefined ? String(row[indexMap['warranty']] || '') : undefined,
          price: isNaN(price) ? 0 : price,
          gstRate: 18, // Defaulting to 18% as it's not in the sheet
        };
      }).filter((p): p is NonNullable<typeof p> => p !== null && p.price > 0);

      const validationResult = GetProductDataOutputSchema.safeParse(parsedData);
      if (validationResult.success) {
        return validationResult.data;
      } else {
        console.error("Zod validation error for products:", validationResult.error.flatten());
        // Filter out invalid items before returning
        return parsedData.filter((_, index) => 
            !validationResult.error.issues.some(issue => issue.path.includes(index))
        );
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
