'use client';

import { ServiceDetailView } from "@/components/services/service-detail-view";
import { Cloud, Layers, ShieldCheck, TrendingUp, Zap, Globe } from "lucide-react";

export default function CloudTransformationPage() {
  return (
    <ServiceDetailView 
      title="Cloud Transformation"
      tagline="Seamless Migration. Scalable Architecture. Unified Governance."
      heroImage="https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1080&q=80"
      overview="We empower enterprises to transition from legacy silos to dynamic, cloud-native environments. Our framework focuses on multi-cloud orchestration and hybrid architectures that balance performance with cost efficiency."
      capabilities={[
        { title: "Multi-Cloud Strategy", description: "Design and governance across AWS, Azure, and Google Cloud platforms.", icon: Globe },
        { title: "Hybrid Architecture", description: "Seamless bridge between on-premise infrastructure and public cloud resources.", icon: Layers },
        { title: "Migration Factory", description: "Automated lift-and-shift or refactoring of legacy applications with zero downtime.", icon: Zap },
        { title: "Cloud Security", description: "Zero-trust networking and continuous compliance monitoring in the cloud.", icon: ShieldCheck },
        { title: "FinOps Optimization", description: "Granular cost tracking and resource right-sizing to eliminate cloud waste.", icon: TrendingUp },
        { title: "Serverless Ops", description: "Modernizing workloads with serverless and containerized deployment paths.", icon: Cloud }
      ]}
      useCases={[
        { sector: "Government", description: "Secure sovereign cloud deployments for sensitive citizen data." },
        { sector: "Finance", description: "Real-time scaling for transaction processing during peak trading." },
        { sector: "Healthcare", description: "HIPAA-compliant data storage and AI-ready health records." },
        { sector: "Corporate", description: "Unified remote workforce access across global branch offices." }
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
