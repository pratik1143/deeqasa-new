'use client';

import { ServiceDetailView } from "@/components/services/service-detail-view";
import { Leaf, Globe, Zap, Activity, Layers, ShieldCheck } from "lucide-react";

export default function SustainableItPage() {
  return (
    <ServiceDetailView 
      title="Sustainable IT"
      tagline="Performance Meets Responsibility. Green Compute. Circular Lifecycle."
      heroImage="https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=1080&q=80"
      overview="Sustainability is no longer an option; it's a strategic requirement. Our framework helps enterprises reduce their carbon footprint through energy-efficient hardware and circular IT lifecycle management."
      capabilities={[
        { title: "Green Data Centers", description: "Optimizing cooling and power distribution for energy efficiency.", icon: Zap },
        { title: "Circular Lifecycle", description: "Sustainable hardware procurement and responsible e-waste management.", icon: Leaf },
        { title: "Carbon Tracking", description: "Real-time monitoring of IT-related carbon emissions and energy cost.", icon: Activity },
        { title: "Renewable Integration", description: "Powering infrastructure with renewable energy sources.", icon: Globe },
        { title: "Energy-Efficient HW", description: "HP Sustainable solutions designed with recycled materials.", icon: Layers },
        { title: "Eco-Compliance", description: "Aligning your IT operations with ESG and ESG reporting standards.", icon: ShieldCheck }
      ]}
      useCases={[
        { sector: "Corporate", description: "Meeting annual sustainability and CSR reporting goals." },
        { sector: "Public Sector", description: "Government-mandated green technology initiatives." },
        { sector: "Energy", description: "Leading by example with highly efficient internal IT grids." },
        { sector: "Manufacturing", description: "Reducing factory-side compute energy consumption." }
      ]}
      benefits={[
        "Reduced Long-Term Energy Costs",
        "Enhanced Brand Authority via ESG",
        "Minimized E-Waste Environmental Impact",
        "Government Incentive Eligibility",
        "Responsible Enterprise Leadership"
      ]}
    />
  );
}
