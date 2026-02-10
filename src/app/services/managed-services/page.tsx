
'use client';

import { ServiceDetailView } from "@/components/services/service-detail-view";
import { Zap, Activity, Terminal, ShieldCheck, Cpu, Globe } from "lucide-react";

export default function ManagedServicesPage() {
  return (
    <ServiceDetailView 
      title="Managed Services"
      tagline="Mission-Critical Operations, Managed 24/7. Proactive Support."
      heroImage="https://images.unsplash.com/photo-1531482615713-2afd69097998?w=1920&q=80"
      overviewImage="https://images.unsplash.com/photo-1551434678-e076c223a692?w=1200&q=80"
      archImage="https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&q=80"
      overview="Offload the complexity of daily IT management to our expert architects. We provide full-stack monitoring and support, ensuring your team can focus on innovation rather than maintenance."
      capabilities={[
        { title: "24/7 NOC Monitoring", description: "Global network operation center tracking system health around the clock.", icon: Globe },
        { title: "Managed Security", description: "Real-time SOC monitoring and proactive endpoint threat detection and response.", icon: ShieldCheck },
        { title: "Strategic Consulting", description: "C-level roadmap planning, infrastructure auditing, and future-proofing.", icon: Activity },
        { title: "Patch Management", description: "Automated security updates and patching for all enterprise systems.", icon: Terminal },
        { title: "VDI Management", description: "Full-stack management of secure virtual desktop infrastructures.", icon: Cpu },
        { title: "Omni-Channel Helpdesk", description: "Tier-1 to Tier-3 technical support for all global enterprise users.", icon: Zap }
      ]}
      useCases={[
        { sector: "Enterprise", description: "Offloading routine server maintenance to free up internal development teams." },
        { sector: "Education", description: "Managed campus-wide WiFi and student laboratory infrastructure support." },
        { sector: "Healthcare", description: "Ensuring 24/7 availability of critical patient diagnostic and monitoring systems." },
        { sector: "Small-Mid Business", description: "Enterprise-grade IT management at a fractional internal operational cost." }
      ]}
      benefits={[
        "Predictable Monthly IT Expenditure",
        "Elimination of Operational Bottlenecks",
        "99.99% Guaranteed Infrastructure Uptime",
        "Access to Specialized Technical Talent",
        "Rapid Disaster Recovery Response"
      ]}
    />
  );
}
