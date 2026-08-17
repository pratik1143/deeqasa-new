'use client';

import React from 'react';
import Link from 'next/link';
import Script from 'next/script';
import { ArrowLeft, ShieldCheck } from 'lucide-react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';

export default function CampaignPrivacyPolicyPage() {
  return (
    <div className="hp-intel-spark-privacy bg-[#030716] text-slate-200 min-h-screen font-[Outfit] selection:bg-blue-500/30">
      
      <Header />

      <main className="container-enterprise px-4 sm:px-6 lg:px-8 pt-36 pb-24 max-w-4xl mx-auto space-y-8">
        
        <div className="flex items-center gap-4">
          <Link
            href="/hp-intel-spark"
            className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-cyan-400 hover:text-white transition-colors"
          >
            <ArrowLeft size={16} /> Back to HP & Intel SPARK Campaign
          </Link>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 p-8 sm:p-14 rounded-[2.5rem] shadow-2xl backdrop-blur-xl space-y-8 text-sm leading-relaxed font-normal">
          
          <div className="border-b border-slate-800 pb-6 space-y-2">
            <span className="text-[10px] font-mono uppercase tracking-[0.4em] text-cyan-400 block">
              LEGAL & PRIVACY COMPLIANCE
            </span>
            <h1 className="text-3xl sm:text-5xl font-bold text-white tracking-tight">
              Privacy Policy
            </h1>
            <p className="text-xs font-mono text-slate-400">
              HP & Intel SPARK Campaign — DeeQasa Technologies
            </p>
          </div>

          <div className="space-y-6 text-slate-300">
            
            <p>
              <strong>Dee Qasa</strong> ("Dee Qasa", "we", "us", or "our") respects your privacy and is committed to protecting the personal information you share with us through our website, advertisements, enquiry forms, and other digital channels.
            </p>

            <p>
              This Privacy Policy explains how we collect, use, store, and protect your information when you visit or interact with our website.
            </p>

            <h3 className="text-lg font-bold text-white pt-2">1. About Dee Qasa</h3>
            <p>
              Dee Qasa is a retail and business technology products provider based in India.
            </p>
            <p>
              Dee Qasa is an HP Authorised Reseller and offers genuine HP products and related solutions to customers. HP is a trademark of HP Inc. and its affiliates. Dee Qasa is an independent reseller and is not HP Inc. itself.
            </p>
            <p>
              For information regarding HP's authorised reseller and partner ecosystem, customers may refer to HP's official website and support resources:
            </p>
            <p>
              <a
                href="https://www.hp.com/in-en/services/smart-support.html"
                target="_blank"
                rel="noreferrer"
                className="text-cyan-400 hover:underline font-mono text-xs"
              >
                https://www.hp.com/in-en/services/smart-support.html
              </a>
            </p>
            <p>
              Where applicable, HP product warranties, support services, and product terms are governed by the applicable terms and policies of HP Inc.
            </p>

            <h3 className="text-lg font-bold text-white pt-2">2. Information We Collect</h3>
            <p>We may collect the following information when you interact with our website or contact us:</p>
            <ul className="list-disc pl-6 space-y-1 font-mono text-xs text-slate-300">
              <li>Name</li>
              <li>Mobile number</li>
              <li>Email address</li>
              <li>Company or organisation name</li>
              <li>Designation / Job Role</li>
              <li>Billing or delivery information</li>
              <li>Product or service requirements</li>
              <li>Enquiry details</li>
              <li>Information submitted through contact or enquiry forms</li>
              <li>Website usage information</li>
              <li>IP address and browser/device information</li>
              <li>Information collected through cookies and similar technologies</li>
            </ul>

            <h3 className="text-lg font-bold text-white pt-2">3. How We Use Your Information</h3>
            <p>We may use the information collected to:</p>
            <ul className="list-disc pl-6 space-y-1 text-slate-300">
              <li>Respond to product and service enquiries</li>
              <li>Provide quotations and product information</li>
              <li>Process orders and transactions</li>
              <li>Arrange delivery or fulfilment</li>
              <li>Provide customer support</li>
              <li>Communicate regarding products, services, offers, or enquiries</li>
              <li>Improve our website and customer experience</li>
              <li>Understand website usage and advertising performance</li>
              <li>Prevent fraud, misuse, or unauthorised activity</li>
              <li>Comply with applicable legal and regulatory requirements</li>
            </ul>

            <p>
              If you submit an enquiry for an HP product, your information may be used by Dee Qasa to respond to your request and provide relevant product, pricing, availability, warranty, or support information.
            </p>

            <h3 className="text-lg font-bold text-white pt-2">4. HP Products and Services</h3>
            <p>
              Dee Qasa may advertise, promote, sell, or provide information about HP-branded products as an HP Authorised Reseller.
            </p>
            <p>
              HP and the HP logo are trademarks of HP Inc. and/or its affiliates. Dee Qasa is an independent reseller and should not be understood to be HP Inc. or a subsidiary of HP Inc.
            </p>
            <p>
              Customers seeking official HP product information may visit:
            </p>
            <p>
              <a
                href="https://www.hp.com/in-en/"
                target="_blank"
                rel="noreferrer"
                className="text-cyan-400 hover:underline font-mono text-xs"
              >
                https://www.hp.com/in-en/
              </a>
            </p>

            <h3 className="text-lg font-bold text-white pt-2">5. Contact Information</h3>
            <p className="font-mono text-xs text-slate-400">
              Dee Qasa Technologies<br />
              Jubilee Walk, 1st Floor, SCO 105 & 106, Sector 70, Sahibzada Ajit Singh Nagar, Punjab 160071<br />
              Email: <a href="mailto:pratikofficial@deeqasa.com" className="text-cyan-400">pratikofficial@deeqasa.com</a> | Phone: +91 85952 70950
            </p>

          </div>

        </div>

      </main>

      <Footer />

    </div>
  );
}
