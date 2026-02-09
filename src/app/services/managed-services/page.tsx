
import { ServiceDetailView } from "@/components/services/service-detail-view";
import { Zap, Activity, Terminal, ShieldCheck, Cpu, Globe } from "lucide-react";

export default function ManagedServicesPage() {
  return (
    <ServiceDetailView 
      title="Managed Services"
      tagline="Your Mission-Critical Operations, Managed 24/7. Proactive Support."
      heroImage="https://images.unsplash.com/photo-1531482615713-2afd69097998?w=1080&q=80"
      overview="Offload the complexity of daily IT management to our expert architects. We provide full-stack monitoring and support, ensuring your internal team can focus on innovation rather than maintenance."
      capabilities={[
        { title: "24/7 NOC Monitoring", description: "Global network operation center tracking system health around the clock.", icon: Globe },
        { title: "Managed Security", description: "Real-time SOC monitoring and endpoint threat response.", icon: ShieldCheck },
        { title: "Strategic IT Consulting", description: "C-level roadmap planning and infrastructure auditing.", icon: Activity },
        { title: "Patch Management", description: "Automated updates and security patching for all systems.", icon: Terminal },
        { title: "VDI Management", description: "Full-stack management of virtual desktop infrastructures.", icon: Cpu },
        { title: "Omni-Channel Helpdesk", description: "Tier-1 to Tier-3 technical support for all enterprise users.", icon: Zap }
      ]}
      useCases={[
        { sector: "Enterprise", description: "Offloading routine server maintenance to free up internal devs." },
        { sector: "Education", description: "Managed campus-wide WiFi and student laboratory infrastructure." },
        { sector: "Healthcare", description: "Ensuring 24/7 availability of critical patient diagnostic systems." },
        { sector: "Small-Mid Business", description: "Enterprise-grade IT management at a fractional cost." }
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
