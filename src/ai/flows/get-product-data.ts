'use server';
/**
 * @fileoverview This file defines a Genkit flow for fetching product data from a Google Sheet.
 * It includes a deterministic de-duplication engine to ensure product models are unique.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { google } from 'googleapis';
import { getGoogleAuth } from '@/ai/lib/google-auth';
import { ProductSchema } from '@/lib/quotation-schemas';

const PRODUCT_SHEET_ID = process.env.GOOGLE_SHEET_ID || "1gZWkQV-2TYIDZ_bFEQG6EHlHPImXjb6p-4oSiCFRKFk";

const GetProductDataOutputSchema = z.array(ProductSchema);
export type GetProductDataOutput = z.infer<typeof GetProductDataOutputSchema>;

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
    const auth = getGoogleAuth(['https://www.googleapis.com/auth/spreadsheets.readonly']);

    const sheets = google.sheets({ version: 'v4', auth });
    const sheetName = "Products";

    try {
      const spreadsheetMeta = await sheets.spreadsheets.get({ spreadsheetId: PRODUCT_SHEET_ID });
      const sheetTitles = spreadsheetMeta.data.sheets?.map(s => s.properties?.title).filter(Boolean) as string[] || [];

      if (!sheetTitles.includes(sheetName)) {
        throw new Error(`Sheet '${sheetName}' not found. Available sheets: [${sheetTitles.join(', ')}]`);
      }
      
      const range = `${sheetName}!A1:N`; // Adjusted to N for 14 columns
      const response = await sheets.spreadsheets.values.get({ spreadsheetId: PRODUCT_SHEET_ID, range });

      const rows = response.data.values;
      if (!rows || rows.length < 2) return [];

      const rawHeaders = rows[0];
      const headers = rawHeaders.map(h => String(h || '').trim().toLowerCase());
      const dataRows = rows.slice(1);
      
      const getIdx = (name: string) => headers.indexOf(name.toLowerCase());

      const skuIdx = getIdx('sku');
      const ftpIdx = getIdx('ftp');
      const modelIdx = getIdx('model');
      const processorIdx = getIdx('processor');
      const memoryIdx = getIdx('memory');
      const hddIdx = getIdx('hdd');
      const hdd2Idx = getIdx('hdd 2');
      const gfxIdx = getIdx('gfx');
      const osIdx = getIdx('os');
      const plantIdx = getIdx('plant');
      const chassisIdx = getIdx('chassis');
      const oddIdx = getIdx('odd');
      const wlanIdx = getIdx('wlan');
      const warrantyIdx = getIdx('warranty');

      if (skuIdx === -1 || ftpIdx === -1) {
          throw new Error(`Missing required columns in "Products" sheet. Required: SKU, FTP. Found: ${headers.join(', ')}`);
      }
      
      const parsedData = dataRows.map((row) => {
        const val = (idx: number) => {
          if (idx === -1 || idx >= row.length) return '-';
          const v = String(row[idx] || '').trim();
          return v === '' ? '-' : v;
        };

        const sku = val(skuIdx);
        if (sku === '-') return null;

        const priceStr = val(ftpIdx);
        const price = parseFloat(priceStr.replace(/[^0-9.]+/g, ''));
        if (isNaN(price)) return null;

        const model = val(modelIdx);
        const processor = val(processorIdx);
        const memory = val(memoryIdx);
        const hdd = val(hddIdx);
        const hdd2 = val(hdd2Idx);
        const gfx = val(gfxIdx);
        const os = val(osIdx);
        const warranty = val(warrantyIdx);

        // Build a display name for the dropdown
        const displayNameParts = [
          model,
          processor,
          memory,
          hdd !== '-' ? hdd : null,
          gfx !== '-' ? gfx : null,
          `₹${price.toLocaleString('en-IN')}`
        ].filter(Boolean);

        return {
          id: sku,
          model,
          plant: val(plantIdx),
          chassis: val(chassisIdx),
          processor,
          memory,
          hdd,
          hdd2,
          gfx,
          os,
          odd: val(oddIdx),
          wlan: val(wlanIdx),
          warranty,
          name: displayNameParts.join(' | '),
          price: price,
          gstRate: 18,
        };
      }).filter((p): p is NonNullable<typeof p> => p !== null);

      // De-duplicate products based on the 'model' name (Prefer model name as unique key)
      // If multiple configurations share the same model name, keep only the first occurrence.
      const uniqueData = Array.from(
        parsedData.reduce((map, product) => {
          // Normalize model name for comparison, fallback to SKU if model is missing or generic
          const key = (product.model && product.model !== '-') 
            ? product.model.trim().toLowerCase() 
            : product.id.trim().toLowerCase();
            
          if (!map.has(key)) {
            map.set(key, product);
          }
          return map;
        }, new Map<string, (typeof parsedData)[0]>()).values()
      );

      return uniqueData;
    } catch (err: any) {
        throw new Error(err.message || "Failed to fetch product data.");
    }
  }
);
