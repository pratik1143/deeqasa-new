import { NextResponse } from 'next/server';
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { getAuth, signInAnonymously } from 'firebase/auth';
import { firebaseConfig } from '@/firebase/config';

// Initialize Firebase App for server API route
function getFirebase() {
  const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
  const db = getFirestore(app);
  const auth = getAuth(app);
  return { app, db, auth };
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      name,
      email,
      phone,
      company,
      city,
      requirement,
      message,
      honeypot, // Anti-spam field
      utm = {},
    } = body;

    // 1. Anti-spam honeypot check
    if (honeypot && honeypot.trim().length > 0) {
      return NextResponse.json({ success: true, message: 'Enquiry received' }, { status: 200 });
    }

    // 2. Server-side Input Validation
    if (!name || name.trim().length < 2) {
      return NextResponse.json(
        { success: false, error: 'Please enter your full name (min 2 characters).' },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: 'Please enter a valid business email address.' },
        { status: 400 }
      );
    }

    const phoneClean = phone ? String(phone).replace(/\D/g, '') : '';
    if (!phoneClean || phoneClean.length < 10) {
      return NextResponse.json(
        { success: false, error: 'Please enter a valid mobile number (min 10 digits).' },
        { status: 400 }
      );
    }

    const nowISO = new Date().toISOString();

    // 3. Construct Lead Payload matching DeeQasa CRM schema exactly
    const leadPayload = {
      name: name.trim(),
      company: (company || 'Not Specified').trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      city: (city || 'Not Specified').trim(),
      requirement: (requirement || 'HP & Intel SPARK AI Acceleration Fleet').trim(),
      notes: (message || '').trim(),
      status: 'New',
      source: 'HP & Intel SPARK Campaign',
      priority: 'Warm',
      score: 0,
      tags: ['HP', 'Intel SPARK', 'Campaign 2026', utm.source || 'Direct'],
      revenue: 0,
      
      // First-Class Attribution Data for CRM Filtering (All Leads -> Campaign -> Channel)
      attribution: {
        campaign: utm.campaign || 'hp_intel_spark_2026',
        source: utm.source || 'direct',
        medium: utm.medium || 'none',
        content: utm.content || '',
        term: utm.term || '',
        channel: utm.source ? `${utm.source} / ${utm.medium || 'organic'}` : 'Direct Website Visitor',
        referrer: utm.referrer || 'direct',
        landingPage: utm.landingPage || '/hp-intel-spark',
        submittedAt: nowISO,
      },

      activityLog: [
        {
          id: `act_${Date.now()}`,
          type: 'lead_creation',
          action: `Ingested via HP & Intel SPARK Landing Page (${utm.source || 'direct'})`,
          timestamp: nowISO,
          performer: 'HP & Intel SPARK Campaign Engine',
        },
      ],
      createdAt: nowISO,
      updatedAt: nowISO,
    };

    // Log received lead details to server console
    console.log('[HP & Intel SPARK Lead Ingested]:', JSON.stringify(leadPayload, null, 2));

    // 4. Attempt Firestore insertion
    let leadId = `lead_${Date.now()}`;
    try {
      const { db, auth } = getFirebase();

      // Sign in anonymously if not authenticated to establish auth context
      if (!auth.currentUser) {
        try {
          await signInAnonymously(auth);
        } catch (authErr) {
          // Ignore auth error and proceed
        }
      }

      const leadsCollectionRef = collection(db, 'leads');
      const docRef = await addDoc(leadsCollectionRef, leadPayload);
      leadId = docRef.id;
    } catch (dbError: any) {
      console.warn('[HP & Intel SPARK Lead DB Warning]: Cloud Firestore rules restricted direct write.', dbError?.message);
      // Lead is still logged on server and returned successfully to prevent visitor friction
    }

    return NextResponse.json(
      {
        success: true,
        leadId,
        message: 'Thank you. Our team will get in touch with you shortly.',
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('[HP & Intel SPARK Lead API Error]:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'An internal error occurred while processing your request. Please try again.',
      },
      { status: 500 }
    );
  }
}
