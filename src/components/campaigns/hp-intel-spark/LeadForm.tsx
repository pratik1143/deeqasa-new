'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Send, CheckCircle2, ShieldCheck, AlertCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { trackLeadGeneration, trackFormStart, trackFormError } from '@/lib/analytics';
import { getStoredUTMAttribution } from '@/lib/utm-tracker';

interface FormState {
  name: string;
  email: string;
  phone: string;
  company: string;
  city: string;
  requirement: string;
  message: string;
  honeypot: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
  company?: string;
  city?: string;
}

export function LeadForm() {
  const router = useRouter();
  const [formData, setFormData] = useState<FormState>({
    name: '',
    email: '',
    phone: '',
    company: '',
    city: '',
    requirement: 'HP & Intel SPARK AI Acceleration Fleet',
    message: '',
    honeypot: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);

  // Handle first field interaction tracking
  const handleInteraction = () => {
    if (!hasStarted) {
      setHasStarted(true);
      trackFormStart('hp_intel_spark_lead_form', 'hp_intel_spark_2026');
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Please enter your full name.';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters.';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'Please enter your business email address.';
    } else if (!emailRegex.test(formData.email.trim())) {
      newErrors.email = 'Please enter a valid business email.';
    }

    const phoneDigits = formData.phone.replace(/\D/g, '');
    if (!formData.phone.trim()) {
      newErrors.phone = 'Please enter your mobile number.';
    } else if (phoneDigits.length < 10) {
      newErrors.phone = 'Please enter a valid mobile number (min 10 digits).';
    }

    if (!formData.company.trim()) {
      newErrors.company = 'Please enter your company name.';
    }

    if (!formData.city.trim()) {
      newErrors.city = 'Please enter your city.';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      const firstErrorField = Object.keys(newErrors)[0];
      trackFormError('hp_intel_spark_lead_form', firstErrorField, 'validation_error');
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
          utm: utmAttribution,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Failed to process lead request.');
      }

      // CRITICAL: Fire generate_lead ONLY after confirmed 200 OK from server
      trackLeadGeneration({
        lead_source: 'hp_intel_spark',
        campaign: utmAttribution.campaign || 'hp_intel_spark_2026',
        landing_page: '/hp-intel-spark',
        form_name: 'hp_intel_spark_lead_form',
      });

      setIsSubmitted(true);

      // Navigate to dedicated Thank-You page after short delay for smooth UI feedback
      setTimeout(() => {
        router.push('/hp-intel-spark/thank-you');
      }, 600);
    } catch (err: any) {
      console.error('Lead Submission Error:', err);
      setSubmitError(err.message || 'Something went wrong. Please try again.');
      trackFormError('hp_intel_spark_lead_form', 'submit_button', 'api_submission_error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full bg-slate-950/90 border border-cyan-500/30 p-8 sm:p-12 rounded-[2.5rem] shadow-[0_0_50px_rgba(6,182,212,0.15)] backdrop-blur-2xl relative overflow-hidden">
      
      {/* Subtle Glow Overlay */}
      <div className="absolute -top-24 -right-24 w-60 h-60 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-60 h-60 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      {isSubmitted ? (
        <div className="py-12 text-center space-y-6 animate-in fade-in zoom-in duration-500">
          <div className="h-20 w-20 rounded-full bg-cyan-500/20 border border-cyan-400/40 text-cyan-400 flex items-center justify-center mx-auto shadow-[0_0_30px_rgba(6,182,212,0.4)]">
            <CheckCircle2 size={40} />
          </div>
          <h3 className="text-3xl font-bold tracking-tight text-white font-[Outfit]">
            Enquiry Submitted Successfully!
          </h3>
          <p className="text-slate-300 text-sm max-w-md mx-auto leading-relaxed">
            Thank you. Our HP & Intel SPARK program specialists will get in touch with you shortly with customized deployment proposals.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6 relative z-10" noValidate>
          
          <div className="space-y-2 text-left">
            <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-cyan-400 block">
              ENTERPRISE REGISTRATION DESK
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white font-[Outfit] tracking-tight">
              Register for HP & Intel SPARK Program
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 font-normal">
              Fill in your organization details to lock in priority allocation, demo access, and custom partner pricing.
            </p>
          </div>

          {submitError && (
            <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-3">
              <AlertCircle size={18} className="shrink-0" />
              <span>{submitError}</span>
            </div>
          )}

          {/* Honeypot field - Hidden from real users */}
          <div className="hidden" aria-hidden="true">
            <label htmlFor="website">Leave this field blank</label>
            <input
              type="text"
              id="website"
              name="website"
              tabIndex={-1}
              value={formData.honeypot}
              onChange={(e) => setFormData({ ...formData, honeypot: e.target.value })}
              autoComplete="off"
            />
          </div>

          {/* Grid Row 1: Name & Email */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="space-y-2">
              <label className="text-xs font-mono uppercase tracking-widest text-slate-300 block">
                Full Name <span className="text-cyan-400">*</span>
              </label>
              <Input
                required
                value={formData.name}
                onFocus={handleInteraction}
                onChange={(e) => {
                  setFormData({ ...formData, name: e.target.value });
                  if (errors.name) setErrors({ ...errors, name: undefined });
                }}
                placeholder="e.g. Rahul Sharma"
                className={`bg-slate-900/90 border ${
                  errors.name ? 'border-red-500 focus:border-red-500' : 'border-slate-800 focus:border-cyan-400'
                } h-12 text-xs font-medium text-white placeholder:text-slate-600 rounded-2xl transition-all`}
              />
              {errors.name && <p className="text-[11px] text-red-400 font-mono mt-1">{errors.name}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-xs font-mono uppercase tracking-widest text-slate-300 block">
                Business Email <span className="text-cyan-400">*</span>
              </label>
              <Input
                required
                type="email"
                value={formData.email}
                onFocus={handleInteraction}
                onChange={(e) => {
                  setFormData({ ...formData, email: e.target.value });
                  if (errors.email) setErrors({ ...errors, email: undefined });
                }}
                placeholder="e.g. rahul@company.com"
                className={`bg-slate-900/90 border ${
                  errors.email ? 'border-red-500 focus:border-red-500' : 'border-slate-800 focus:border-cyan-400'
                } h-12 text-xs font-medium text-white placeholder:text-slate-600 rounded-2xl transition-all`}
              />
              {errors.email && <p className="text-[11px] text-red-400 font-mono mt-1">{errors.email}</p>}
            </div>
          </div>

          {/* Grid Row 2: Mobile Number & Company Name */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="space-y-2">
              <label className="text-xs font-mono uppercase tracking-widest text-slate-300 block">
                Mobile Number <span className="text-cyan-400">*</span>
              </label>
              <Input
                required
                type="tel"
                value={formData.phone}
                onFocus={handleInteraction}
                onChange={(e) => {
                  setFormData({ ...formData, phone: e.target.value });
                  if (errors.phone) setErrors({ ...errors, phone: undefined });
                }}
                placeholder="e.g. +91 98765 43210"
                className={`bg-slate-900/90 border ${
                  errors.phone ? 'border-red-500 focus:border-red-500' : 'border-slate-800 focus:border-cyan-400'
                } h-12 text-xs font-medium text-white placeholder:text-slate-600 rounded-2xl transition-all`}
              />
              {errors.phone && <p className="text-[11px] text-red-400 font-mono mt-1">{errors.phone}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-xs font-mono uppercase tracking-widest text-slate-300 block">
                Company Name <span className="text-cyan-400">*</span>
              </label>
              <Input
                required
                value={formData.company}
                onFocus={handleInteraction}
                onChange={(e) => {
                  setFormData({ ...formData, company: e.target.value });
                  if (errors.company) setErrors({ ...errors, company: undefined });
                }}
                placeholder="e.g. TechCorp Solutions"
                className={`bg-slate-900/90 border ${
                  errors.company ? 'border-red-500 focus:border-red-500' : 'border-slate-800 focus:border-cyan-400'
                } h-12 text-xs font-medium text-white placeholder:text-slate-600 rounded-2xl transition-all`}
              />
              {errors.company && <p className="text-[11px] text-red-400 font-mono mt-1">{errors.company}</p>}
            </div>
          </div>

          {/* Grid Row 3: City & Requirement */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="space-y-2">
              <label className="text-xs font-mono uppercase tracking-widest text-slate-300 block">
                City <span className="text-cyan-400">*</span>
              </label>
              <Input
                required
                value={formData.city}
                onFocus={handleInteraction}
                onChange={(e) => {
                  setFormData({ ...formData, city: e.target.value });
                  if (errors.city) setErrors({ ...errors, city: undefined });
                }}
                placeholder="e.g. Mumbai, Bengaluru, Delhi NCR"
                className={`bg-slate-900/90 border ${
                  errors.city ? 'border-red-500 focus:border-red-500' : 'border-slate-800 focus:border-cyan-400'
                } h-12 text-xs font-medium text-white placeholder:text-slate-600 rounded-2xl transition-all`}
              />
              {errors.city && <p className="text-[11px] text-red-400 font-mono mt-1">{errors.city}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-xs font-mono uppercase tracking-widest text-slate-300 block">
                Requirement / Interest
              </label>
              <select
                value={formData.requirement}
                onFocus={handleInteraction}
                onChange={(e) => setFormData({ ...formData, requirement: e.target.value })}
                className="w-full bg-slate-900/90 border border-slate-800 focus:border-cyan-400 h-12 text-xs font-medium text-white rounded-2xl px-4 focus:outline-none transition-all"
              >
                <option value="HP & Intel SPARK AI Acceleration Fleet">HP & Intel SPARK AI Acceleration Fleet</option>
                <option value="HP ZBook Mobile Workstations with Intel Core Ultra">HP ZBook Workstations (Intel Core Ultra)</option>
                <option value="HP EliteBook Fleet Modernization">HP EliteBook Commercial Fleet</option>
                <option value="Intel Xeon Powered Enterprise Servers">Intel Xeon Compute Servers</option>
                <option value="Device as a Service (DaaS) & Leasing">DaaS & Hardware Financing</option>
              </select>
            </div>
          </div>

          {/* Message Row */}
          <div className="space-y-2">
            <label className="text-xs font-mono uppercase tracking-widest text-slate-300 block">
              Additional Requirement Details / Message
            </label>
            <textarea
              rows={3}
              value={formData.message}
              onFocus={handleInteraction}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              placeholder="Tell us about your fleet size, compute requirements, or expected procurement timeline..."
              className="w-full bg-slate-900/90 border border-slate-800 focus:border-cyan-400 p-4 text-xs font-medium text-white placeholder:text-slate-600 rounded-2xl focus:outline-none resize-none transition-all"
            />
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-14 bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-600 hover:from-cyan-300 hover:to-blue-600 text-slate-950 font-black uppercase tracking-widest text-xs rounded-full shadow-[0_0_30px_rgba(6,182,212,0.4)] transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <Loader2 className="animate-spin" size={18} /> Submitting...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                Enquire Now <Send size={16} />
              </span>
            )}
          </Button>

          <div className="flex items-center justify-center gap-2 text-[10px] font-mono text-slate-500 pt-2">
            <ShieldCheck size={14} className="text-cyan-400" />
            <span>Authorized HP Gold Partner & Intel Solution Provider. Zero spam guaranteed.</span>
          </div>

        </form>
      )}

    </div>
  );
}
