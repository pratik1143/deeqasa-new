
'use client';

import { ServiceDetailView } from "@/components/services/service-detail-view";
import { Cloud, Layers, ShieldCheck, TrendingUp, Zap, Globe } from "lucide-react";

export default function CloudTransformationPage() {
  return (
    <ServiceDetailView 
      title="Cloud Transformation"
      tagline="Seamless Migration. Scalable Architecture. Unified Governance."
      heroImage="https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1920&q=80"
      overviewImage="https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=1200&q=80"
      archImage="https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1200&q=80"
      overview="Harness the power of multi-cloud orchestration to drive enterprise agility. We modernize legacy silos into dynamic, cloud-native environments that balance performance with extreme cost efficiency."
      capabilities={[
        { title: "Multi-Cloud Strategy", description: "Seamless design and unified governance across AWS, Azure, and Google Cloud platforms.", icon: Globe },
        { title: "Hybrid Architecture", description: "Reliable bridging between legacy on-premise infrastructure and modern public cloud resources.", icon: Layers },
        { title: "Migration Factory", description: "Automated lift-and-shift or refactoring of legacy applications with guaranteed zero downtime.", icon: Zap },
        { title: "Cloud Security", description: "Zero-trust networking and continuous compliance monitoring in the cloud environment.", icon: ShieldCheck },
        { title: "FinOps Optimization", description: "Granular cost tracking and resource right-sizing to eliminate 100% of cloud waste.", icon: TrendingUp },
        { title: "Serverless Ops", description: "Modernizing enterprise workloads with serverless and containerized deployment paths.", icon: Cloud }
      ]}
      useCases={[
        { sector: "Government", description: "Secure sovereign cloud deployments for sensitive citizen data management." },
        { sector: "Finance", description: "Real-time scaling for transaction processing during critical peak trading hours." },
        { sector: "Healthcare", description: "HIPAA-compliant data storage and AI-ready health record infrastructure." },
        { sector: "Corporate", description: "Unified remote workforce access across global branch offices and regions." }
      ]}
      benefits={[
        "40% Reduction in Infrastructure Overhead",
        "Instant Global Resource Provisioning",
        "Enterprise-Grade Disaster Recovery",
        "Seamless Application Scalability",
        "Unified Governance & Compliance"
      ]}
    />
  );
}
