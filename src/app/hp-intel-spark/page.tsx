'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Script from 'next/script';
import { trackLeadGeneration, trackFormStart, trackFormError, trackCTAClick, trackPageView } from '@/lib/analytics';
import { captureUTMParameters, getStoredUTMAttribution } from '@/lib/utm-tracker';

function HPIntelSparkContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: '',
    emailAddress: '',
    designation: '',
    company: '',
    city: '',
    consentProcessing: false,
    consentMarketing: false,
    honeypot: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [hasStartedForm, setHasStartedForm] = useState(false);
  const [requestType, setRequestType] = useState<'document' | 'demo' | 'quote'>('document');

  useEffect(() => {
    // 1. Capture UTM attribution
    captureUTMParameters();

    // 2. Track page view
    trackPageView('/hp-intel-spark');

    // 3. Handle intent parameter (?intent=demo or ?intent=quote)
    const intent = searchParams.get('intent');
    if (intent === 'demo') {
      setRequestType('demo');
      scrollToForm('intent_param', 'book_a_demo');
    } else if (intent === 'quote') {
      setRequestType('quote');
      scrollToForm('intent_param', 'request_a_quote');
    }
  }, [searchParams]);

  const scrollToForm = (location: string, ctaName: string, targetType?: 'demo' | 'quote' | 'document') => {
    if (targetType) setRequestType(targetType);
    trackCTAClick(ctaName, location, 'hp_intel_spark');

    const formElement = document.getElementById('official-lead-form');
    if (formElement) {
      setTimeout(() => {
        formElement.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };

  const handleFieldFocus = () => {
    if (!hasStartedForm) {
      setHasStartedForm(true);
      trackFormStart('hp_intel_spark_official_form', 'hp_intel_spark');
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Please enter your full name.';
    }

    const phoneClean = formData.phoneNumber.replace(/\D/g, '');
    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = 'Please enter your mobile number.';
    } else if (phoneClean.length < 10) {
      newErrors.phoneNumber = 'Please enter a valid 10-digit mobile number.';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.emailAddress.trim()) {
      newErrors.emailAddress = 'Please enter your email address.';
    } else if (!emailRegex.test(formData.emailAddress.trim())) {
      newErrors.emailAddress = 'Please enter a valid email address.';
    }

    if (!formData.company.trim()) {
      newErrors.company = 'Please enter your company name.';
    }

    if (!formData.city.trim()) {
      newErrors.city = 'Please enter your city.';
    }

    if (!formData.consentProcessing) {
      newErrors.consentProcessing = 'Please accept the processing of your data to proceed.';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      const firstErrorField = Object.keys(newErrors)[0];
      trackFormError('hp_intel_spark_official_form', firstErrorField, 'validation_error');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const utmAttribution = getStoredUTMAttribution();

      const response = await fetch('/api/hp-intel-spark/lead', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          requestType,
          utm: utmAttribution,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Failed to submit enquiry.');
      }

      // CRITICAL: Fire generate_lead ONLY after confirmed 200 OK from server/CRM
      trackLeadGeneration({
        lead_source: 'hp_intel_spark',
        campaign: utmAttribution.campaign || 'hp_intel_spark',
        landing_page: '/hp-intel-spark',
        form_name: 'hp_intel_spark_official_form',
      });

      // Trigger automatic download/opening of the official PDF brochure
      try {
        const link = document.createElement('a');
        link.href = '/campaigns/hp-intel-spark/HP-Deeqasa Brochure.pdf';
        link.target = '_blank';
        link.download = 'HP-Deeqasa Brochure.pdf';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } catch (dlErr) {
        console.warn('Brochure download trigger warning', dlErr);
      }

      // Redirect to Thank-You Page
      router.push('/hp-intel-spark/thank-you');
    } catch (err: any) {
      console.error('Official Lead Submission Error:', err);
      setSubmitError(err.message || 'An error occurred. Please try again.');
      trackFormError('hp_intel_spark_official_form', 'submit_button', 'api_error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="hp-intel-spark-page bg-white text-slate-900 selection:bg-blue-500/20 font-sans">
      
      {/* Load Official Campaign Stylesheets */}
      <link rel="stylesheet" href="/campaigns/hp-intel-spark/css/bootstrap.min.css" />
      <link rel="stylesheet" href="/campaigns/hp-intel-spark/font/stylesheet.css" />
      <link rel="stylesheet" href="/campaigns/hp-intel-spark/css/main.css" />

      {/* Top Banner */}
      <div className="bg-banner">
        <div className="bannerTop">
          <img src="/campaigns/hp-intel-spark/images/banner.jpg" alt="HP Deeqasa Spark Campaign Banner" className="responsive-wth w-full h-auto block" />
        </div>
      </div>
      <div className="gap-2"></div>

      {/* Section 1: Product Intro */}
      <div className="container my-8">
        <div className="row flex flex-wrap items-center">
          <div className="col-sm-5 col-md-5 col-lg-5 col-xs-12 mb-6 sm:mb-0">
            <img src="/campaigns/hp-intel-spark/images/pro-1.png" className="img-responsive max-w-full h-auto mx-auto" alt="HP EliteBook X Series" />
          </div>
          
          <div className="col-sm-7 col-md-7 col-lg-7 col-xs-12">
            <div className="heading-new">
              <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-2">One portfolio. Every role.</h1>
            </div>
            <div className="heading-new">
              <h2 className="text-xl sm:text-2xl font-medium text-slate-700 mb-4">
                Introducing the HP EliteBook X Series AI PCs <br className="hidden sm:inline" />
                Powered by Intel® Core™ Ultra processors
              </h2>
            </div>
            
            <div className="list-1">
              <ul className="space-y-2 text-sm text-slate-700">
                <li>Built to move. Ultra-light, ultra-secure, AI power for all day productivity.</li>
                <li>Ultra-thin power meets AI-ready performance.</li>
                <li>AI muscle. Relentless speed. For leaders on the move.</li>
                <li>Clear voice. Crisp visuals. Confident meetings.</li>
                <li>Transform productivity with the HP IQ-enabled intelligent ecosystem.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Section 2: Product Feature Highlight (Gray Container) */}
      <div className="bg-gray py-12 bg-slate-100 border-y border-slate-200">
        <div className="container">
          <div className="heading-new-2 mb-8 text-center sm:text-left">
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 leading-snug">
              HP EliteBook X Flip G2i 14 inch Notebook Next Gen AI PC <br className="hidden sm:inline" />
              Powered by Intel® Core™ Ultra processors
            </h1>
          </div>
          
          <div className="row flex flex-wrap items-center">
            <div className="col-sm-6 col-md-6 col-lg-6 col-xs-12 mb-6 sm:mb-0">
              <p className="align-new-4 text-slate-600 text-sm sm:text-base leading-relaxed mb-6">
                From sketching ideas to presenting bold visions, the HP EliteBook X Flip G2i 14 inch Notebook AI PC empowers mobile professionals with a lightweight convertible design, touch input, and enterprise-grade security—built to support today’s AI-powered workflows and tomorrow’s innovations.
              </p>
              
              <div className="list-1">
                <ul className="space-y-2 text-sm text-slate-700">
                  <li>Intel® powers next Gen AI PCs</li>
                  <li>Protected by HP Wolf Security</li>
                  <li>Speed up the basics of IT management</li>
                  <li>Business-ready AI with real-world benefits</li>
                  <li>Fast and efficient wireless LAN</li>
                </ul>
              </div>
            </div>
            
            <div className="col-sm-6 col-md-6 col-lg-6 col-xs-12">
              <img src="/campaigns/hp-intel-spark/images/pro-2.png" className="img-responsive max-w-full h-auto mx-auto" alt="HP EliteBook X Flip G2i" />
            </div>
          </div>
        </div>
      </div>

      <div className="gap-2 my-8"></div>

      {/* Section 3: Official Lead Form & Features Grid */}
      <div className="container my-12">
        <div className="row flex flex-wrap">
          
          {/* Left Column: Official Lead Form */}
          <div className="col-sm-6 col-md-6 col-lg-6 col-xs-12 mb-8 sm:mb-0" id="official-lead-form">
            <div className="form-bg p-6 sm:p-8 bg-slate-900 text-white rounded-2xl shadow-xl">
              <div className="form-main space-y-4">
                
                <div className="form-logo mb-4">
                  <img src="/campaigns/hp-intel-spark/images/logo.png" alt="Deeqasa Logo" className="h-10 w-auto" />
                </div>

                <div className="align-new-1">
                  <p className="text-xl font-bold text-white">Download the free guide</p>
                </div>
                <div className="align-new-2">
                  <p className="text-xs text-slate-300">Fill in your details and you will receive the document in your email.</p>
                </div>

                {submitError && (
                  <div className="p-3 bg-red-500/20 border border-red-500/40 text-red-300 text-xs rounded-lg">
                    {submitError}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                  
                  {/* Honeypot field */}
                  <input
                    type="text"
                    name="website_url"
                    value={formData.honeypot}
                    onChange={(e) => setFormData({ ...formData, honeypot: e.target.value })}
                    className="hidden"
                    tabIndex={-1}
                    autoComplete="off"
                  />

                  <div className="row">
                    <div className="col-xs-12 col-sm-6 mb-3">
                      <input
                        type="text"
                        className="form-control w-full bg-slate-800 border-slate-700 text-white text-xs p-3 rounded-lg placeholder-slate-400 focus:outline-none focus:border-cyan-400"
                        id="fullName"
                        placeholder="Name"
                        value={formData.fullName}
                        onFocus={handleFieldFocus}
                        onChange={(e) => {
                          setFormData({ ...formData, fullName: e.target.value });
                          if (errors.fullName) setErrors({ ...errors, fullName: '' });
                        }}
                      />
                      {errors.fullName && <span className="text-red-400 text-[11px] block mt-1">{errors.fullName}</span>}
                    </div>

                    <div className="col-xs-12 col-sm-6 mb-3">
                      <input
                        type="tel"
                        className="form-control w-full bg-slate-800 border-slate-700 text-white text-xs p-3 rounded-lg placeholder-slate-400 focus:outline-none focus:border-cyan-400"
                        id="phoneNumber"
                        placeholder="Mobile Number"
                        value={formData.phoneNumber}
                        onFocus={handleFieldFocus}
                        onChange={(e) => {
                          setFormData({ ...formData, phoneNumber: e.target.value });
                          if (errors.phoneNumber) setErrors({ ...errors, phoneNumber: '' });
                        }}
                      />
                      {errors.phoneNumber && <span className="text-red-400 text-[11px] block mt-1">{errors.phoneNumber}</span>}
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-xs-12 col-sm-6 mb-3">
                      <input
                        type="email"
                        className="form-control w-full bg-slate-800 border-slate-700 text-white text-xs p-3 rounded-lg placeholder-slate-400 focus:outline-none focus:border-cyan-400"
                        id="emailAddress"
                        placeholder="E-mail"
                        value={formData.emailAddress}
                        onFocus={handleFieldFocus}
                        onChange={(e) => {
                          setFormData({ ...formData, emailAddress: e.target.value });
                          if (errors.emailAddress) setErrors({ ...errors, emailAddress: '' });
                        }}
                      />
                      {errors.emailAddress && <span className="text-red-400 text-[11px] block mt-1">{errors.emailAddress}</span>}
                    </div>

                    <div className="col-xs-12 col-sm-6 mb-3">
                      <input
                        type="text"
                        className="form-control w-full bg-slate-800 border-slate-700 text-white text-xs p-3 rounded-lg placeholder-slate-400 focus:outline-none focus:border-cyan-400"
                        id="Designation"
                        placeholder="Designation"
                        value={formData.designation}
                        onFocus={handleFieldFocus}
                        onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-xs-12 col-sm-6 mb-3">
                      <input
                        type="text"
                        className="form-control w-full bg-slate-800 border-slate-700 text-white text-xs p-3 rounded-lg placeholder-slate-400 focus:outline-none focus:border-cyan-400"
                        id="Company"
                        placeholder="Company"
                        value={formData.company}
                        onFocus={handleFieldFocus}
                        onChange={(e) => {
                          setFormData({ ...formData, company: e.target.value });
                          if (errors.company) setErrors({ ...errors, company: '' });
                        }}
                      />
                      {errors.company && <span className="text-red-400 text-[11px] block mt-1">{errors.company}</span>}
                    </div>

                    <div className="col-xs-12 col-sm-6 mb-3">
                      <input
                        type="text"
                        className="form-control w-full bg-slate-800 border-slate-700 text-white text-xs p-3 rounded-lg placeholder-slate-400 focus:outline-none focus:border-cyan-400"
                        id="City"
                        placeholder="City"
                        value={formData.city}
                        onFocus={handleFieldFocus}
                        onChange={(e) => {
                          setFormData({ ...formData, city: e.target.value });
                          if (errors.city) setErrors({ ...errors, city: '' });
                        }}
                      />
                      {errors.city && <span className="text-red-400 text-[11px] block mt-1">{errors.city}</span>}
                    </div>
                  </div>

                  <div className="align-new-3 text-[10px] text-slate-400 leading-normal my-3">
                    <p>
                      To process your request and send you the downloaded document, as well as, if you authorize it, to send you marketing communications and perform segmentation for marketing purposes – Rights: To withdraw your consent. Access, rectification, erasure, restriction or objection to processing, the right not to be subject to automated decisions, as well as the right to obtain clear and transparent information about the processing of your data. – You can consult the privacy policy in more detail{' '}
                      <Link href="/hp-intel-spark/privacy-policy" className="text-cyan-400 underline">
                        here
                      </Link>
                    </p>
                  </div>

                  {/* Consent Checkboxes */}
                  <div className="check-box-main flex items-start gap-3 my-2">
                    <input
                      className="form-check-input mt-1 accent-cyan-500 cursor-pointer"
                      type="checkbox"
                      id="consentProcessing"
                      checked={formData.consentProcessing}
                      onChange={(e) => {
                        setFormData({ ...formData, consentProcessing: e.target.checked });
                        if (errors.consentProcessing) setErrors({ ...errors, consentProcessing: '' });
                      }}
                    />
                    <label htmlFor="consentProcessing" className="check-box-right text-xs text-slate-300 cursor-pointer">
                      I accept the processing of my data to receive the requested document
                    </label>
                  </div>
                  {errors.consentProcessing && (
                    <span className="text-red-400 text-[11px] block mb-2">{errors.consentProcessing}</span>
                  )}

                  <div className="check-box-main flex items-start gap-3 my-2">
                    <input
                      className="form-check-input mt-1 accent-cyan-500 cursor-pointer"
                      type="checkbox"
                      id="consentMarketing"
                      checked={formData.consentMarketing}
                      onChange={(e) => setFormData({ ...formData, consentMarketing: e.target.checked })}
                    />
                    <label htmlFor="consentMarketing" className="check-box-right text-xs text-slate-300 cursor-pointer">
                      I agree to receive marketing communications from Deeqasa
                    </label>
                  </div>

                  {/* Submit Action Button */}
                  <div className="pt-3">
                    <button
                      className="btn btn-primary w-full py-3 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold uppercase tracking-wider text-xs rounded-lg transition-colors disabled:opacity-50"
                      type="submit"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Submitting...' : 'Obtain Document'}
                    </button>
                  </div>

                </form>

              </div>
            </div>
          </div>

          {/* Right Column: AI Features & Intent CTAs */}
          <div className="col-sm-6 col-md-6 col-lg-6 col-xs-12">
            <div className="heading-new mb-4">
              <h1 className="text-3xl font-bold text-slate-900">
                Meet the Next <br />
                Generation of AI PCs
              </h1>
            </div>
            
            <div className="align-new-4 mb-6">
              <p className="text-slate-600 text-sm leading-relaxed">
                Experience exceptional performance that empowers you to do your best work, create with confidence, and make an impact where it matters most.
              </p>
            </div>

            {/* Feature Icons Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
              
              <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                <img src="/campaigns/hp-intel-spark/images/icon-1.png" alt="" className="w-10 h-10 shrink-0" />
                <div>
                  <div className="font-bold text-xs text-slate-900">AI-Powered Performance</div>
                  <div className="text-[11px] text-slate-500">On-device AI with dedicated NPU</div>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                <img src="/campaigns/hp-intel-spark/images/icon-2.png" alt="" className="w-10 h-10 shrink-0" />
                <div>
                  <div className="font-bold text-xs text-slate-900">Built-in Security</div>
                  <div className="text-[11px] text-slate-500">HP Wolf Security protection</div>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                <img src="/campaigns/hp-intel-spark/images/icon-3.png" alt="" className="w-10 h-10 shrink-0" />
                <div>
                  <div className="font-bold text-xs text-slate-900">All-Day Battery Life</div>
                  <div className="text-[11px] text-slate-500">Long-lasting with fast charging</div>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                <img src="/campaigns/hp-intel-spark/images/icon-4.png" alt="" className="w-10 h-10 shrink-0" />
                <div>
                  <div className="font-bold text-xs text-slate-900">Smart Experiences</div>
                  <div className="text-[11px] text-slate-500">AI-enhanced collaboration</div>
                </div>
              </div>

            </div>

            {/* Intent Action Buttons */}
            <div className="flex flex-wrap gap-4 pt-2">
              <button
                type="button"
                onClick={() => scrollToForm('features_grid', 'book_a_demo', 'demo')}
                className="px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider rounded-lg transition-colors"
              >
                Book a Demo
              </button>

              <button
                type="button"
                onClick={() => scrollToForm('features_grid', 'request_a_quote', 'quote')}
                className="px-6 py-3 bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs uppercase tracking-wider rounded-lg transition-colors"
              >
                Request a Quote
              </button>
            </div>

          </div>

        </div>
      </div>

      {/* Official Footer Contact Section */}
      <div className="bg-slate-900 text-white py-10 mt-12 border-t border-slate-800">
        <div className="container">
          <div className="row flex flex-wrap items-center">
            
            <div className="col-sm-10 col-md-10 col-lg-10 col-xs-12 space-y-3">
              
              <div className="flex items-center gap-3 text-xs text-slate-300">
                <img src="/campaigns/hp-intel-spark/images/address-icon.png" alt="" className="w-5 h-5 shrink-0" />
                <span>Jubilee walk, 1st Floor, SCO 105 & 106, Sector 70, Sahibzada Ajit Singh Nagar, Punjab 160071</span>
              </div>

              <div className="flex items-center gap-3 text-xs text-slate-300">
                <img src="/campaigns/hp-intel-spark/images/email-icon.png" alt="" className="w-5 h-5 shrink-0" />
                <a href="mailto:pratikofficial@deeqasa.com" className="text-cyan-400 hover:underline">
                  pratikofficial@deeqasa.com
                </a>
              </div>

              <div className="flex items-center gap-3 text-xs text-slate-300">
                <img src="/campaigns/hp-intel-spark/images/web-icon.png" alt="" className="w-5 h-5 shrink-0" />
                <a href="https://www.deeqasa.com/" target="_blank" rel="noreferrer" className="text-cyan-400 hover:underline">
                  www.deeqasa.com
                </a>
              </div>

              <div className="flex items-center gap-3 text-xs text-slate-300">
                <img src="/campaigns/hp-intel-spark/images/phone.png" alt="" className="w-5 h-5 shrink-0" />
                <span>+91 85952 70950</span>
              </div>

            </div>

            <div className="col-sm-2 col-md-2 col-lg-2 col-xs-12 text-right mt-6 sm:mt-0">
              <img src="/campaigns/hp-intel-spark/images/logo2.png" alt="Deeqasa" className="h-10 w-auto inline-block" />
            </div>

          </div>
        </div>
      </div>

      {/* Copyright & Privacy Bar */}
      <div className="bg-slate-950 py-4 text-xs text-slate-400 border-t border-slate-900">
        <div className="container">
          <div className="row flex flex-wrap items-center justify-between">
            <div className="col-sm-10 col-md-10 col-lg-10 col-xs-12">
              © Copyright 2026. HP Development Company, L.P. The information contained herein is subject to change without notice.
            </div>
            <div className="col-sm-2 col-md-2 col-lg-2 col-xs-12 text-right mt-2 sm:mt-0 font-mono">
              <Link href="/hp-intel-spark/privacy-policy" className="text-cyan-400 hover:underline">
                Privacy Policy
              </Link>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}

export default function HPIntelSparkPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-slate-500 font-mono text-xs">Loading HP & Intel SPARK Campaign...</div>}>
      <HPIntelSparkContent />
    </Suspense>
  );
}
