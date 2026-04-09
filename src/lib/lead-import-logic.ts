import { LeadSchema } from './schemas';
import { z } from 'zod';

export interface CleanedLead {
  name: string;
  company: string;
  email: string;
  phone: string;
  isValid: boolean;
  errors: string[];
  originalRow: any;
}

const FIELD_MAPPINGS: Record<string, string[]> = {
  name: ['name', 'customer name', 'client name', 'person name', 'lead name', 'full name'],
  company: ['company', 'company name', 'organization', 'org', 'firm', 'account name'],
  email: ['email', 'email id', 'mail', 'email address', 'e-mail'],
  phone: ['phone', 'mobile', 'mobile no.', 'mobile no', 'number', 'contact', 'contact no', 'whatsapp', 'phone number'],
};

/**
 * Normalizes phone numbers by extracting the first 10 digits found in the string.
 */
export function cleanPhone(phone: string | number): string {
  const str = String(phone).replace(/\D/g, ''); // Remove non-numerics
  if (str.length === 10) return str;
  if (str.length > 10) return str.substring(0, 10);
  return str; // Return as is if less than 10, validation will catch it
}

/**
 * Cleans and normalizes lead data.
 */
export function cleanLeadData(row: any, mapping: Record<string, string>): CleanedLead {
  const name = String(row[mapping.name] || "").trim();
  const company = String(row[mapping.company] || "").trim();
  const email = String(row[mapping.email] || "").trim().toLowerCase();
  const phone = cleanPhone(row[mapping.phone] || "");

  const leadData = {
    name,
    company,
    email,
    phone,
    source: "CSV Ingestion",
    status: "New" as const,
    revenue: 0,
    priority: "Warm" as const,
    tags: [],
    activityLog: [{
      id: crypto.randomUUID(),
      type: 'system',
      action: 'Genesis: Entity Ingested via CSV',
      timestamp: new Date().toISOString()
    }],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const result = LeadSchema.omit({ 
    id: true, 
    assignedTo: true, 
    assignedToName: true,
    followUpDate: true,
    notes: true 
  }).safeParse(leadData);

  return {
    name,
    company,
    email,
    phone,
    isValid: result.success,
    errors: result.success ? [] : result.error.errors.map(e => e.message),
    originalRow: row
  };
}

/**
 * Intelligent header mapper.
 */
export function mapCSVHeaders(headers: string[]): Record<string, string> {
  const mapping: Record<string, string> = {
    name: '',
    company: '',
    email: '',
    phone: '',
  };

  const lowerHeaders = headers.map(h => h.toLowerCase().trim());

  Object.entries(FIELD_MAPPINGS).forEach(([field, variations]) => {
    // Exact match first
    const exactIndex = lowerHeaders.findIndex(h => variations.includes(h));
    if (exactIndex !== -1) {
        mapping[field] = headers[exactIndex];
        return;
    }

    // Fuzzy match (contains variation)
    const fuzzyIndex = lowerHeaders.findIndex(h => 
        variations.some(v => h.includes(v) || v.includes(h))
    );
    if (fuzzyIndex !== -1) {
        mapping[field] = headers[fuzzyIndex];
    }
  });

  return mapping;
}
