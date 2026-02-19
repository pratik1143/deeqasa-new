
'use client';

import { ServiceDetailView } from "@/components/services/service-detail-view";
import { ShieldCheck, Lock, Eye, Terminal, Activity, Zap } from "lucide-react";

export default function CybersecurityPage() {
  return (
    <ServiceDetailView 
      title="Cybersecurity Suite"
      tagline="Resilience Built on Zero Trust. Proactive Threat Hunting."
      heroImage="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1920&q=80"
      overviewImage="https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1200&q=80"
      archImage="https://images.unsplash.com/photo-1510511459019-5dee997ddfef?w=1200&q=80"
      overview="Deliver an iron-clad security posture through our Zero Trust architecture. We protect your enterprise assets from emerging threats using AI-driven telemetry and proactive monitoring."
      capabilities={[
        { title: "Zero Trust Architecture", description: "Identity-based perimeter defense and granular access controls for all users.", icon: Lock },
        { title: "Threat Intelligence", description: "Continuous monitoring and proactive hunting for emerging global cyber threats.", icon: Eye },
        { title: "Endpoint Protection", description: "Advanced HP Wolf Security integration for all hardware endpoints and mobile devices.", icon: ShieldCheck },
        { title: "SOC-as-a-Service", description: "24/7 managed security operation center with rapid incident response protocols.", icon: Terminal },
        { title: "Compliance Suite", description: "Automated auditing for ISO 27001, GDPR, and sector-specific standards.", icon: Activity },
        { title: "Data Encryption", description: "Military-grade encryption for enterprise data at rest and in transit.", icon: Zap }
      ]}
      useCases={[
        { sector: "Banking", description: "Fraud detection and secure perimeter for digital banking portals and apps." },
        { sector: "Public Sector", description: "Secure government network defense and information sovereignty infrastructure." },
        { sector: "Energy", description: "Protecting critical national infrastructure and industrial SCADA systems." },
        { sector: "Healthcare", description: "Securing patient records against ransomware and unauthorized data leaks." }
      ]}
      benefits={[
        "Real-Time Incident Mitigation",
        "Zero-Downtime Threat Responses",
        "Comprehensive Compliance Alignment",
        "Total Visibility across Network Layers",
        "Hardened Endpoint Identity"
      ]}
    />
  );
}
