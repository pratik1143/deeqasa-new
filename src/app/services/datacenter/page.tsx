'use client';

import { ServiceDetailView } from "@/components/services/service-detail-view";
import { Database, Cpu, Layout, Activity, ShieldCheck, Zap } from "lucide-react";

export default function DatacenterPage() {
  return (
    <ServiceDetailView 
      title="Data Center Modernization"
      tagline="Future-proof your Core. Intelligent Compute. High-Density Storage."
      heroImage="https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1080&q=80"
      overview="Transform your traditional data center into a software-defined powerhub. Our modernization services focus on Hyper-Converged Infrastructure (HCI) and Edge Computing to bring processing power closer to where data is generated."
      capabilities={[
        { title: "HCI Deployment", description: "Consolidating compute, storage, and networking into a single intelligent tier.", icon: Layout },
        { title: "Next-Gen Compute", description: "HP ProLiant and Z-Series systems engineered for massive parallel processing.", icon: Cpu },
        { title: "Storage Array Modernization", description: "NVMe-based low-latency storage solutions for mission-critical applications.", icon: Database },
        { title: "Edge Computing", description: "Deploying high-performance infrastructure at the edge for real-time analytics.", icon: Activity },
        { title: "DR-as-a-Service", description: "Automated failover and redundancy protocols for 99.999% uptime.", icon: ShieldCheck },
        { title: "Power & Thermal Ops", description: "AI-driven monitoring of data center environmental and power consumption.", icon: Zap }
      ]}
      useCases={[
        { sector: "Manufacturing", description: "Edge compute for real-time factory floor IoT sensor data." },
        { sector: "Education", description: "Centralized server farms supporting university-wide research VDI." },
        { sector: "Logistics", description: "High-density storage for global supply chain tracking databases." },
        { sector: "Corporate", description: "Consolidated branch-office infrastructure into hybrid-ready stacks." }
      ]}
      benefits={[
        "60% Increase in Compute Performance",
        "Reduced Physical Floor-Space Requirements",
        "Hardware-Level Security Integration",
        "Simplified Management Interface",
        "Future-Proof Hardware Lifecycle"
      ]}
    />
  );
}
