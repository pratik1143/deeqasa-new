// UTM & Lead Attribution Capture Utility

export interface UTMAttribution {
  source: string;
  medium: string;
  campaign: string;
  content: string;
  term: string;
  landingPage: string;
  referrer: string;
  capturedAt: string;
}

const STORAGE_KEY = 'deeqasa_utm_attribution';

/**
 * Parses current URL query parameters and captures UTM parameters.
 * Stores attribution in sessionStorage and localStorage for persistence across pages.
 */
export function captureUTMParameters(): UTMAttribution {
  if (typeof window === 'undefined') {
    return {
      source: 'direct',
      medium: 'none',
      campaign: 'hp_intel_spark_2026',
      content: '',
      term: '',
      landingPage: '/hp-intel-spark',
      referrer: '',
      capturedAt: new Date().toISOString(),
    };
  }

  const searchParams = new URLSearchParams(window.location.search);
  
  const freshAttribution: UTMAttribution = {
    source: searchParams.get('utm_source') || searchParams.get('source') || 'direct',
    medium: searchParams.get('utm_medium') || searchParams.get('medium') || 'none',
    campaign: searchParams.get('utm_campaign') || searchParams.get('campaign') || 'hp_intel_spark_2026',
    content: searchParams.get('utm_content') || searchParams.get('content') || '',
    term: searchParams.get('utm_term') || searchParams.get('term') || '',
    landingPage: window.location.pathname,
    referrer: document.referrer || 'direct',
    capturedAt: new Date().toISOString(),
  };

  // If new UTM source is present in query parameters, update stored attribution
  if (searchParams.get('utm_source') || searchParams.get('utm_campaign')) {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(freshAttribution));
      localStorage.setItem(STORAGE_KEY, JSON.stringify(freshAttribution));
    } catch (e) {
      console.warn('Storage permission error saving UTM params', e);
    }
    return freshAttribution;
  }

  // Fallback to stored attribution if available
  try {
    const cachedSession = sessionStorage.getItem(STORAGE_KEY);
    if (cachedSession) return JSON.parse(cachedSession);

    const cachedLocal = localStorage.getItem(STORAGE_KEY);
    if (cachedLocal) return JSON.parse(cachedLocal);
  } catch (e) {
    // Ignore storage read errors
  }

  return freshAttribution;
}

/**
 * Returns stored or currently captured attribution payload
 */
export function getStoredUTMAttribution(): UTMAttribution {
  return captureUTMParameters();
}
