import { google } from 'googleapis';

/**
 * Creates a Google JWT authentication client using environment variables.
 * Ensures the PRIVATE_KEY is correctly formatted (handles escaped newlines).
 */
export function getGoogleAuth(scopes: string[]) {
  const clientEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n');

  if (!clientEmail || !privateKey) {
    throw new Error(
      "Mission Critical: Google Service Account credentials missing from environment. " +
      "Ensure GOOGLE_SERVICE_ACCOUNT_EMAIL and GOOGLE_PRIVATE_KEY are set."
    );
  }

  return new google.auth.JWT(
    clientEmail,
    undefined,
    privateKey,
    scopes
  );
}
