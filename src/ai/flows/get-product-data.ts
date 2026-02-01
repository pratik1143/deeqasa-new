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
      // Assuming product data is on a sheet named 'Products'
      const sheetName = 'Products'; 
      const range = `${sheetName}!A:J`; // SKU, Name, Processor, Memory, Storage, GPU, OS, Warranty, FTP, GST
      
      const response = await sheets.spreadsheets.values.get({ spreadsheetId: PRODUCT_SHEET_ID, range });

      const rows = response.data.values;
      if (!rows || rows.length < 2) return [];

      const headers = rows[0].map(h => h.trim().toLowerCase());
      const dataRows = rows.slice(1);
      
      const headerMap: { [key: string]: string } = {
        'sku': 'id',
        'product name': 'name',
        'processor': 'processor',
        'memory': 'memory',
        'storage': 'storage',
        'gpu': 'gpu',
        'os': 'os',
        'warranty': 'warranty',
        'ftp': 'price',
        'gst_percentage': 'gstRate'
      };
      
      const indexMap: { [key: string]: number } = {};
       for (const header in headerMap) {
          const idx = headers.indexOf(header);
          if (idx !== -1) {
            indexMap[headerMap[header]] = idx;
          }
       }
       
      if (indexMap['id'] === undefined || indexMap['name'] === undefined || indexMap['price'] === undefined || indexMap['gstRate'] === undefined) {
          throw new Error("Missing required columns in Product sheet. Expected at least: 'SKU', 'Product Name', 'FTP', 'GST_Percentage'.");
      }
      
      const parsedData = dataRows.map((row) => {
        const price = parseFloat(String(row[indexMap['price']]).replace(/[^0-9.-]+/g,""));
        const gstRate = parseFloat(String(row[indexMap['gstRate']]).replace(/[^0-9.-]+/g,""));
        
        return {
          id: String(row[indexMap['id']] || ''),
          name: String(row[indexMap['name']] || ''),
          processor: indexMap['processor'] !== undefined ? String(row[indexMap['processor']]) : undefined,
          memory: indexMap['memory'] !== undefined ? String(row[indexMap['memory']]) : undefined,
          storage: indexMap['storage'] !== undefined ? String(row[indexMap['storage']]) : undefined,
          gpu: indexMap['gpu'] !== undefined ? String(row[indexMap['gpu']]) : undefined,
          os: indexMap['os'] !== undefined ? String(row[indexMap['os']]) : undefined,
          warranty: indexMap['warranty'] !== undefined ? String(row[indexMap['warranty']]) : undefined,
          price: isNaN(price) ? 0 : price,
          gstRate: isNaN(gstRate) ? 0 : gstRate,
        };
      }).filter(p => p.name && p.price > 0); // Filter out items without a name or price

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
