
'use client';

import { ServiceDetailView } from "@/components/services/service-detail-view";
import { Leaf, Globe, Zap, Activity, Layers, ShieldCheck } from "lucide-react";

export default function SustainableItPage() {
  return (
    <ServiceDetailView 
      title="Sustainable IT"
      tagline="Performance Meets Responsibility. Green Compute. Circular Lifecycle."
      heroImage="https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=1920&q=80"
      overviewImage="https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?w=1200&q=80"
      archImage="https://images.unsplash.com/photo-1466611653911-954ffea113ad?w=1200&q=80"
      overview="Sustainability is a strategic requirement for the modern enterprise. We help you reduce your carbon footprint through energy-efficient hardware and circular IT lifecycle management."
      capabilities={[
        { title: "Green Data Centers", description: "Optimizing cooling and power distribution for maximum energy efficiency.", icon: Zap },
        { title: "Circular Lifecycle", description: "Sustainable hardware procurement and responsible enterprise e-waste management.", icon: Leaf },
        { title: "Carbon Tracking", description: "Real-time monitoring of IT-related carbon emissions and energy expenditure.", icon: Activity },
        { title: "Renewable Integration", description: "Powering critical infrastructure with hybrid renewable energy sources.", icon: Globe },
        { title: "Energy-Efficient HW", description: "HP Sustainable solutions designed with recycled materials and low-power modes.", icon: Layers },
        { title: "Eco-Compliance", description: "Aligning your IT operations with global ESG and environmental reporting standards.", icon: ShieldCheck }
      ]}
      useCases={[
        { sector: "Corporate", description: "Meeting annual sustainability and CSR reporting goals for stakeholders." },
        { sector: "Public Sector", description: "Government-mandated green technology initiatives and efficiency benchmarks." },
        { sector: "Energy", description: "Leading by example with highly efficient internal IT grids and clusters." },
        { sector: "Manufacturing", description: "Reducing factory-side compute energy consumption through optimized hardware." }
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
