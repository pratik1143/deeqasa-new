
import { ServiceDetailView } from "@/components/services/service-detail-view";
import { Bot, Cpu, TrendingUp, Zap, Layers, Activity } from "lucide-react";

export default function AiAutomationPage() {
  return (
    <ServiceDetailView 
      title="AI & Automation"
      tagline="Intelligent Systems. Accelerated Outcomes. Predictive Insights."
      heroImage="https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1080&q=80"
      overview="Harness the power of machine learning and process automation to drive efficiency. We integrate GenAI and predictive analytics into your existing workflows to turn raw data into strategic decision-making assets."
      capabilities={[
        { title: "Generative AI Ops", description: "Deploying secure, enterprise-ready Large Language Models.", icon: Bot },
        { title: "Predictive Analytics", description: "Forecasting market trends and operational failures before they happen.", icon: TrendingUp },
        { title: "Robotic Process Automation", description: "Automating routine high-volume tasks with 100% accuracy.", icon: Zap },
        { title: "AI-Ready Compute", description: "High-performance GPU clusters for training and inference.", icon: Cpu },
        { title: "Data Pipeline Automation", description: "Intelligent ETL processes for real-time data readiness.", icon: Layers },
        { title: "Computer Vision", description: "Automated visual inspection and security analytics.", icon: Activity }
      ]}
      useCases={[
        { sector: "Retail", description: "AI-driven inventory optimization and demand forecasting." },
        { sector: "Tech", description: "Automated code review and DevOps pipeline acceleration." },
        { sector: "Customer Service", description: "Intelligent agent assistants for enterprise support desks." },
        { sector: "Manufacturing", description: "Predictive maintenance for heavy machinery and assembly lines." }
      ]}
      benefits={[
        "Exponential Productivity Gains",
        "Elimination of Human-Error in Data Ops",
        "Actionable Real-Time Insights",
        "Seamless AI Model Scalability",
        "Automated Strategic Reporting"
      ]}
    />
  );
}
