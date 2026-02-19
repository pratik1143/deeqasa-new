'use client';

import { ServiceDetailView } from "@/components/services/service-detail-view";
import { Bot, Cpu, TrendingUp, Zap, Layers, Activity } from "lucide-react";

export default function AiAutomationPage() {
  return (
    <ServiceDetailView 
      title="AI & Automation"
      tagline="Intelligent Systems. Accelerated Outcomes. Predictive Insights."
      heroImage="https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1920&q=80"
      overviewImage="https://images.unsplash.com/photo-1509228468518-180dd4864904?w=1200&q=80"
      archImage="https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1200&q=80"
      overview="Harness machine learning and process automation to drive exponential efficiency. We integrate enterprise-ready GenAI into your existing workflows to turn raw data into strategic assets."
      capabilities={[
        { title: "Generative AI Ops", description: "Deploying secure, enterprise-ready Large Language Models behind your firewall.", icon: Bot },
        { title: "Predictive Analytics", description: "Forecasting market trends and operational failures before they impact business.", icon: TrendingUp },
        { title: "Process Automation", description: "Automating routine high-volume tasks with 100% accuracy and scalability.", icon: Zap },
        { title: "AI-Ready Compute", description: "High-performance GPU clusters for model training and real-time inference.", icon: Cpu },
        { title: "Data Pipeline Ops", description: "Intelligent ETL processes for real-time data readiness across the organization.", icon: Layers },
        { title: "Computer Vision", description: "Automated visual inspection and security analytics for physical facilities.", icon: Activity }
      ]}
      useCases={[
        { sector: "Retail", description: "AI-driven inventory optimization and demand forecasting for global chains." },
        { sector: "Tech", description: "Automated code review and DevOps pipeline acceleration for development teams." },
        { sector: "Customer Service", description: "Intelligent agent assistants for large-scale enterprise support desks." },
        { sector: "Manufacturing", description: "Predictive maintenance for heavy machinery and automated assembly lines." }
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