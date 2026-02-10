
'use client';

import { ServiceDetailView } from "@/components/services/service-detail-view";
import { Database, Cpu, Layout, Activity, ShieldCheck, Zap } from "lucide-react";

export default function DatacenterPage() {
  return (
    <ServiceDetailView 
      title="Data Center Core"
      tagline="Future-proof your Core. Intelligent Compute. High-Density Storage."
      heroImage="https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1920&q=80"
      overviewImage="https://images.unsplash.com/photo-1563986768609-322da13575f3?w=1200&q=80"
      archImage="https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&q=80"
      overview="Transform your traditional data center into a software-defined powerhub. Our modernization services focus on Hyper-Converged Infrastructure (HCI) and Edge Computing to bring processing power closer to your operations."
      capabilities={[
        { title: "HCI Deployment", description: "Consolidating compute, storage, and networking into a single intelligent software tier.", icon: Layout },
        { title: "Next-Gen Compute", description: "HP ProLiant and Z-Series systems engineered for massive parallel processing tasks.", icon: Cpu },
        { title: "Storage Array Modernization", description: "NVMe-based low-latency storage solutions for mission-critical enterprise apps.", icon: Database },
        { title: "Edge Computing", description: "Deploying high-performance infrastructure at the edge for real-time data analytics.", icon: Activity },
        { title: "DR-as-a-Service", description: "Automated failover and redundancy protocols for 99.999% guaranteed uptime.", icon: ShieldCheck },
        { title: "Power & Thermal Ops", description: "AI-driven monitoring of environmental and power consumption metrics.", icon: Zap }
      ]}
      useCases={[
        { sector: "Manufacturing", description: "Edge compute for real-time factory floor IoT sensor data processing." },
        { sector: "Education", description: "Centralized server farms supporting university-wide research VDI environments." },
        { sector: "Logistics", description: "High-density storage for global supply chain tracking and database operations." },
        { sector: "Corporate", description: "Consolidated branch-office infrastructure into hybrid-ready technical stacks." }
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
