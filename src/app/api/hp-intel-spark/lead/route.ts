import { NextResponse } from 'next/server';
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { getAuth, signInAnonymously } from 'firebase/auth';
import { firebaseConfig } from '@/firebase/config';

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
      fullName,
      name,
      phoneNumber,
      phone,
      emailAddress,
      email,
      designation,
      Company,
      company,
      City,
      city,
      requestType = 'document',
      consentProcessing = false,
      consentMarketing = false,
      honeypot = '',
      utm = {},
    } = body;

    // 1. Anti-spam honeypot check
    if (honeypot && honeypot.trim().length > 0) {
      return NextResponse.json({ success: true, message: 'Enquiry received' }, { status: 200 });
    }

    // 2. Server-side Input Validation
    const leadName = (fullName || name || '').trim();
    if (!leadName || leadName.length < 2) {
      return NextResponse.json(
        { success: false, error: 'Please enter your full name (min 2 characters).' },
        { status: 400 }
      );
    }

    const leadEmail = (emailAddress || email || '').trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!leadEmail || !emailRegex.test(leadEmail)) {
      return NextResponse.json(
        { success: false, error: 'Please enter a valid email address.' },
        { status: 400 }
      );
    }

    const rawPhone = (phoneNumber || phone || '').trim();
    const phoneClean = rawPhone.replace(/\D/g, '');
    if (!phoneClean || phoneClean.length < 10) {
      return NextResponse.json(
        { success: false, error: 'Please enter a valid mobile number (min 10 digits).' },
        { status: 400 }
      );
    }

    const leadCompany = (Company || company || 'Not Specified').trim();
    const leadCity = (City || city || 'Not Specified').trim();
    const leadDesignation = (designation || 'Not Specified').trim();

    const nowISO = new Date().toISOString();

    // 3. Construct Lead Payload matching DeeQasa CRM schema exactly
    const leadPayload = {
      name: leadName,
      company: leadCompany,
      email: leadEmail,
      phone: rawPhone,
      city: leadCity,
      designation: leadDesignation,
      requestType: requestType, // 'demo' | 'quote' | 'document'
      consentProcessing: Boolean(consentProcessing),
      consentMarketing: Boolean(consentMarketing),
      notes: `Request Type: ${requestType.toUpperCase()} | Designation: ${leadDesignation} | City: ${leadCity}`,
      status: 'New',
      source: 'HP & Intel SPARK',
      campaign: 'HP & Intel SPARK Program',
      priority: 'Warm',
      score: 0,
      tags: ['HP', 'Intel SPARK', 'Official Campaign', requestType],
      revenue: 0,
      
      // First-Class Attribution Data for CRM Filtering
      attribution: {
        campaign: utm.campaign || 'hp_intel_spark',
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
          action: `Ingested via Official HP & Intel SPARK Landing Page (${requestType.toUpperCase()})`,
          timestamp: nowISO,
          performer: 'HP & Intel SPARK Campaign Engine',
        },
      ],
      createdAt: nowISO,
      updatedAt: nowISO,
    };

    console.log('[HP & Intel SPARK Official Lead Ingested]:', JSON.stringify(leadPayload, null, 2));

    // 4. Attempt Firestore insertion
    let leadId = `lead_${Date.now()}`;
    try {
      const { db, auth } = getFirebase();

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
    }

    return NextResponse.json(
      {
        success: true,
        leadId,
        downloadUrl: '/campaigns/hp-intel-spark/HP-Deeqasa Brochure.pdf',
        message: 'Thank you for your interest. Your enquiry has been received.',
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
