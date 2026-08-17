// Centralized Google Analytics 4 (GA4) Tracking Utility
// Measurement ID: G-DTLTZJ0DEH

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    dataLayer?: any[];
  }
}

export const GA_MEASUREMENT_ID = 'G-DTLTZJ0DEH';

/**
 * Standardized GA4 Event Tracker
 */
export function trackGAEvent(eventName: string, params: Record<string, any> = {}) {
  // Never send PII (name, email, phone) to Google Analytics
  const safeParams = { ...params };
  delete safeParams.name;
  delete safeParams.email;
  delete safeParams.phone;
  delete safeParams.mobile;
  delete safeParams.fullName;

  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, safeParams);
  }

  // Development Analytics Debug Mode
  if (process.env.NODE_ENV === 'development') {
    console.log(`[Analytics Debug] Event: ${eventName}`, safeParams);
  }
}

/**
 * Pageview tracking for Single Page Application navigation
 */
export function trackPageView(url: string) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', GA_MEASUREMENT_ID, {
      page_path: url,
    });
  }

  if (process.env.NODE_ENV === 'development') {
    console.log(`[Analytics Debug] PageView: ${url}`);
  }
}

/**
 * Lead Generation Conversion Event (generate_lead)
 * Must ONLY be called AFTER server confirms successful lead creation
 */
export function trackLeadGeneration({
  lead_source = 'hp_intel_spark',
  campaign = 'hp_intel_spark_2026',
  landing_page = '/hp-intel-spark',
  form_name = 'hp_intel_spark_lead_form',
}: {
  lead_source?: string;
  campaign?: string;
  landing_page?: string;
  form_name?: string;
} = {}) {
  trackGAEvent('generate_lead', {
    lead_source,
    campaign,
    landing_page,
    form_name,
    timestamp: new Date().toISOString(),
  });
}

/**
 * Call-To-Action (CTA) click tracking (cta_click)
 */
export function trackCTAClick(
  cta_name: string,
  location: string,
  campaign: string = 'hp_intel_spark_2026'
) {
  trackGAEvent('cta_click', {
    cta_name,
    location,
    campaign,
  });
}

/**
 * Form interaction start event (form_start)
 * Fired when the user starts typing/interacting with the first field
 */
export function trackFormStart(
  form_name: string = 'hp_intel_spark_lead_form',
  campaign: string = 'hp_intel_spark_2026'
) {
  trackGAEvent('form_start', {
    form_name,
    campaign,
  });
}

/**
 * Form error event (form_error)
 * Fired when client-side validation fails
 */
export function trackFormError(
  form_name: string = 'hp_intel_spark_lead_form',
  field_name: string = '',
  error_type: string = 'validation_error'
) {
  trackGAEvent('form_error', {
    form_name,
    field_name,
    error_type,
  });
}
