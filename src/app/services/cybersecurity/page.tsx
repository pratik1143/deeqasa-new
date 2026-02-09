
import { ServiceDetailView } from "@/components/services/service-detail-view";
import { ShieldCheck, Lock, Eye, Terminal, Activity, Zap } from "lucide-react";

export default function CybersecurityPage() {
  return (
    <ServiceDetailView 
      title="Cybersecurity Suite"
      tagline="Resilience Built on Zero Trust. Proactive Threat Hunting."
      heroImage="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1080&q=80"
      overview="We deliver an iron-clad security posture through our Zero Trust architecture. By assuming no entity is safe, we protect your enterprise assets from internal and external threats using AI-driven telemetry."
      capabilities={[
        { title: "Zero Trust Architecture", description: "Identity-based perimeter defense and granular access controls.", icon: Lock },
        { title: "Threat Intelligence", description: "Continuous monitoring and proactive hunting for emerging cyber threats.", icon: Eye },
        { title: "Endpoint Protection", description: "Advanced HP Wolf Security integration for all hardware endpoints.", icon: ShieldCheck },
        { title: "SOC-as-a-Service", description: "24/7 managed security operation center with incident response.", icon: Terminal },
        { title: "Compliance Suite", description: "Automated auditing for ISO 27001, GDPR, and HIPAA standards.", icon: Activity },
        { title: "Data Encryption", description: "Military-grade encryption for data at rest and in transit.", icon: Zap }
      ]}
      useCases={[
        { sector: "Banking", description: "Fraud detection and secure perimeter for digital banking portals." },
        { sector: "Public Sector", description: "Secure government network defense and information sovereignty." },
        { sector: "Energy", description: "Protecting critical national infrastructure and SCADA systems." },
        { sector: "Healthcare", description: "Securing patient records against ransomware and data leaks." }
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
