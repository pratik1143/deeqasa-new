'use client';

import React, { useState, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Cloud, 
  ShieldCheck, 
  Database, 
  Leaf, 
  Zap, 
  Bot, 
  ArrowRight,
  Monitor,
  Search,
  CheckCircle2,
  XCircle,
  SlidersHorizontal,
  Layers,
  Sparkles,
  TrendingUp,
  Cpu,
  Building2,
  Server,
  Maximize2,
  Globe,
  Camera,
  Printer,
  HeartPulse,
  GraduationCap,
  Wrench,
  Code2
} from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { SolutionDetailModal, SolutionData } from "@/components/solutions/solution-detail-modal";
import { SolutionsMatchmaker } from "@/components/solutions/solutions-matchmaker";
import { SmoothScrollProvider } from "@/components/ui/smooth-scroll-provider";
import { CustomCursor } from "@/components/ui/custom-cursor";

const solutionsData: SolutionData[] = [
  { 
    id: "infrastructure",
    title: "Enterprise IT Infrastructure", 
    category: "Hardware & Network",
    badgeText: "Enterprise Grade",
    description: "Build a reliable and scalable IT environment with desktops, workstations, servers, structured cabling, and data center solutions.", 
    fullOverview: "Complete IT infrastructure suite featuring HP Elite Workstations, HPE ProLiant Gen11 servers, HPE Alletra storage, enterprise switching, structured cabling, Wi-Fi deployment, and rack power management.",
    icon: Server,
    image: "/images/india_datacenter_racks.png",
    href: "/solutions#infrastructure",
    heroColor: "from-blue-600 to-cyan-500",
    metrics: [
      { label: "Hardware Reliability", value: "99.999%", sub: "Enterprise SLA Guarantee" },
      { label: "Fleet Scalability", value: "Unlimited", sub: "Modular rack expansion" },
      { label: "Deployment Speed", value: "15 min", sub: "Zero-touch cloud enrollment" }
    ],
    capabilities: [
      "Enterprise Desktops & Workstations (HP Z-Series)",
      "Business Laptops (HP Elite & ProBook Series)",
      "Servers & Storage Solutions (HPE ProLiant & Alletra)",
      "Networking, Switching & Wi-Fi 6E Deployment",
      "Structured Cabling & Rack Power Management"
    ],
    techStack: ["HPE ProLiant", "Aruba CX Switching", "HP Z-Workstations", "APC Smart-UPS", "Cat6A Cabling"],
    hpEquipment: ["HPE ProLiant DL380 Gen11", "HP Z8 Fury G5", "Aruba CX 6300 Switch"],
    roadmap: [
      { step: "Phase 01", title: "Site & Load Audit", desc: "Evaluate electrical power, rack density & workload requirements" },
      { step: "Phase 02", title: "Rack & Network Sizing", desc: "Design structured cabling & server node hierarchy" },
      { step: "Phase 03", title: "Hardware Dispatch", desc: "Deploy pre-configured HP hardware & switches" },
      { step: "Phase 04", title: "Continuous Telemetry", desc: "24/7 proactive hardware health monitoring" }
    ],
    targetIndustries: ["Corporate Offices", "Government", "Hospitals", "Manufacturing"]
  },
  { 
    id: "cloud",
    title: "Cloud Solutions & Migration", 
    category: "Cloud Services",
    badgeText: "Multi-Cloud Elasticity",
    description: "Modern cloud services designed for high performance, security, data backup, email systems, and business continuity.", 
    fullOverview: "Deploy Microsoft 365, Google Workspace, hybrid cloud storage, automated cloud backup, email security, and disaster recovery planning with zero downtime.",
    icon: Cloud,
    image: "/images/india_cloud_server_facility.png",
    href: "/solutions#cloud",
    heroColor: "from-blue-600 to-cyan-500",
    metrics: [
      { label: "Uptime SLA Guarantee", value: "99.999%", sub: "Zero unplanned outages" },
      { label: "OpEx Savings", value: "42%", sub: "Eliminate hardware over-provisioning" },
      { label: "Recovery Time (RTO)", value: "< 15 min", sub: "Automated cloud snapshot failover" }
    ],
    capabilities: [
      "Microsoft 365 & Google Workspace Deployment",
      "Cloud Storage & Automated Cloud Backup",
      "Hybrid Cloud Architecture & Seamless Migration",
      "Email Security & Disaster Recovery Planning"
    ],
    techStack: ["Microsoft 365", "Google Workspace", "Veeam Cloud", "AWS Outposts", "Azure Hybrid"],
    hpEquipment: ["HPE GreenLake Cloud Platform", "HPE StoreOnce Backup"],
    roadmap: [
      { step: "Phase 01", title: "Cloud Readiness Audit", desc: "Inventory legacy mailboxes & local server data" },
      { step: "Phase 02", title: "Cloud Architecture Design", desc: "Configure tenant security, M365 & backup schedules" },
      { step: "Phase 03", title: "Automated Cutover", desc: "Zero-loss data migration & MX record switch" },
      { step: "Phase 04", title: "Managed SLA Support", desc: "Continuous identity & backup monitoring" }
    ],
    targetIndustries: ["SMEs & Startups", "Corporate", "Financial Institutions", "Education"]
  },
  { 
    id: "security",
    title: "Cyber Security & Zero Trust", 
    category: "Enterprise Defense",
    badgeText: "NIST & ISO 27001 Ready",
    description: "Protect your organization against modern cyber threats with endpoint isolation, next-gen firewalls, and security audits.", 
    fullOverview: "Protect every endpoint, network perimeter, and cloud mailbox with HP Wolf Security hardware-level isolation, Fortinet firewalls, identity access control, and 24/7 SOC threat monitoring.",
    icon: ShieldCheck,
    image: "/images/india_cyber_command_center.png",
    href: "/solutions#security",
    heroColor: "from-emerald-500 to-teal-700",
    metrics: [
      { label: "Threat Containment", value: "< 60s", sub: "Hardware-enforced isolation" },
      { label: "Ransomware Loss", value: "$0", sub: "Self-healing BIOS protection" },
      { label: "Compliance Benchmark", value: "100%", sub: "ISO 27001 & NIST ready" }
    ],
    capabilities: [
      "HP Wolf Security Hardware Endpoint Isolation",
      "Next-Gen Firewall & Network Micro-Segmentation",
      "Antivirus Management & Email Security Shields",
      "Security Audits, Data Protection & Access Control"
    ],
    techStack: ["HP Wolf Security", "Fortinet FortiGate", "CrowdStrike", "Splunk SIEM", "Aruba ClearPass"],
    hpEquipment: ["HP Wolf Security Enterprise Edition", "HP EliteBook 800 Series"],
    roadmap: [
      { step: "Phase 01", title: "Vulnerability Audit", desc: "Scan endpoints, firewalls & open network ports" },
      { step: "Phase 02", title: "Perimeter Shield Setup", desc: "Deploy next-gen firewalls & micro-segmentation" },
      { step: "Phase 03", title: "Zero-Trust Enforcement", desc: "Enroll endpoints into HP Wolf Security isolation" },
      { step: "Phase 04", title: "24/7 SOC Telemetry", desc: "Continuous active threat hunting" }
    ],
    targetIndustries: ["Government & Defense", "Banking & Finance", "Healthcare", "Legal"]
  },
  { 
    id: "software",
    title: "Software Development & ERP", 
    category: "Software Engineering",
    badgeText: "Custom Business Apps",
    description: "Custom enterprise software built specifically for your business workflow, inventory, HRMS, and hospital management.", 
    fullOverview: "Custom enterprise software development including ERP systems, CRM platforms, Inventory Management, Hospital Management, POS Billing, HRMS, and School Management Software.",
    icon: Code2,
    image: "/images/india_tech_park_software_office.png",
    href: "/solutions#software",
    heroColor: "from-purple-600 to-indigo-600",
    metrics: [
      { label: "Workflow Efficiency", value: "+300%", sub: "Automated business operations" },
      { label: "Data Accuracy", value: "99.9%", sub: "Single source of truth" },
      { label: "Deployment Cycle", value: "Agile", sub: "Continuous CI/CD releases" }
    ],
    capabilities: [
      "ERP & CRM System Development",
      "Inventory & POS Billing Software",
      "Hospital & Pharmacy Management Systems",
      "HRMS & School/College Management Portals"
    ],
    techStack: ["React", "Next.js", "Node.js", "Python", "PostgreSQL", "Docker", "Tailwind CSS"],
    hpEquipment: ["HP Z-Workstations for High-Speed Software Building"],
    roadmap: [
      { step: "Phase 01", title: "Requirement Workshop", desc: "Map business processes & database schema" },
      { step: "Phase 02", title: "UI/UX Prototype", desc: "Design interactive dashboards & user roles" },
      { step: "Phase 03", title: "Agile Development", desc: "Build backend microservices & frontend UI" },
      { step: "Phase 04", title: "Deployment & Training", desc: "Staff training & cloud deployment" }
    ],
    targetIndustries: ["Manufacturing", "Retail", "Healthcare", "Education", "Corporate"]
  },
  { 
    id: "ai",
    title: "AI & Automation Solutions", 
    category: "Artificial Intelligence",
    badgeText: "GenAI & Automation",
    description: "Increase productivity using Artificial Intelligence chatbots, WhatsApp automation, OCR document processing, and predictive analytics.", 
    fullOverview: "Transform enterprise operations with private LLM deployment, AI chatbots, WhatsApp business automation, OCR invoice parsing, AI customer support, and intelligent analytics dashboards.",
    icon: Bot,
    image: "/images/india_ai_supercomputing_lab.png",
    href: "/solutions#ai",
    heroColor: "from-purple-600 to-indigo-600",
    metrics: [
      { label: "Response Latency", value: "< 5ms", sub: "Real-time AI inference" },
      { label: "Manual Effort Saved", value: "85%", sub: "Automated OCR & chatbots" },
      { label: "Data Security", value: "100%", sub: "On-premises private execution" }
    ],
    capabilities: [
      "AI Chatbots & WhatsApp Business Automation",
      "OCR Document & Invoice Auto-Processing",
      "AI Customer Support & Workflow Automation",
      "Intelligent Reporting & AI Analytics Dashboards"
    ],
    techStack: ["PyTorch", "TensorRT", "Ollama", "LangChain", "OpenCV", "Python"],
    hpEquipment: ["HP Z8 Fury G5 Workstations", "NVIDIA RTX 6000 Ada GPUs"],
    roadmap: [
      { step: "Phase 01", title: "Process Audit", desc: "Identify repetitive tasks & invoice bottlenecks" },
      { step: "Phase 02", title: "AI Model Fine-Tuning", desc: "Train local LLM / OCR on client documents" },
      { step: "Phase 03", title: "Workflow Integration", desc: "Connect AI agents to ERP / CRM APIs" },
      { step: "Phase 04", title: "Dashboard Launch", desc: "Real-time analytics & performance tracking" }
    ],
    targetIndustries: ["Logistics", "Healthcare", "E-Commerce", "Finance", "Corporate"]
  },
  { 
    id: "web",
    title: "Website & E-Commerce Development", 
    category: "Web Engineering",
    badgeText: "SEO & High Speed",
    description: "Professional corporate websites, e-commerce stores, admin dashboards, and customer portals designed to scale digital revenue.", 
    fullOverview: "Engineered web development including corporate brand sites, high-converting e-commerce stores, landing pages, customer portals, admin dashboards, payment gateway integration, and SEO optimization.",
    icon: Globe,
    image: "/images/modern_workplace_laptop.png",
    href: "/solutions#web",
    heroColor: "from-sky-500 to-blue-700",
    metrics: [
      { label: "Page Speed Score", value: "99/100", sub: "Google Lighthouse benchmark" },
      { label: "Conversion Lift", value: "+45%", sub: "High-performance UI design" },
      { label: "Security Standard", value: "SSL / PCI-DSS", sub: "Encrypted payment gateways" }
    ],
    capabilities: [
      "Corporate Brand Websites & Landing Pages",
      "E-Commerce Stores with Payment Gateways",
      "Customer Portals & Admin Management Dashboards",
      "SEO-Ready Architecture & Speed Optimization"
    ],
    techStack: ["Next.js", "TypeScript", "Tailwind CSS", "Stripe / Razorpay", "PostgreSQL"],
    hpEquipment: ["HP EliteBook Laptops for Web Development"],
    roadmap: [
      { step: "Phase 01", title: "Wireframing & Sitemap", desc: "Plan page hierarchy & user journeys" },
      { step: "Phase 02", title: "Lucien Motion UI", desc: "Implement dark glassmorphism & smooth animations" },
      { step: "Phase 03", title: "E-Commerce Integration", desc: "Connect payment gateways & inventory sync" },
      { step: "Phase 04", title: "SEO Launch", desc: "Deploy on CDN with 99.99% uptime" }
    ],
    targetIndustries: ["Retail & D2C", "Corporate", "Real Estate", "Hospitality"]
  },
  { 
    id: "surveillance",
    title: "Surveillance & Security Systems", 
    category: "Physical Security",
    badgeText: "AI CCTV & Access Control",
    description: "Complete security infrastructure including IP CCTV surveillance, biometric attendance, access control, and visitor management.", 
    fullOverview: "Protect corporate physical premises with AI IP CCTV cameras, biometric face/fingerprint attendance, RFID access control, video door phones, boom barriers, and automated visitor management.",
    icon: Camera,
    image: "/images/india_cyber_command_center.png",
    href: "/solutions#surveillance",
    heroColor: "from-slate-700 to-slate-900",
    metrics: [
      { label: "Camera Uptime", value: "99.9%", sub: "24/7 NVR recording" },
      { label: "Recognition Speed", value: "< 0.3s", sub: "Biometric face matching" },
      { label: "Facility Protection", value: "100%", sub: "Perimeter intrusion alerts" }
    ],
    capabilities: [
      "AI IP CCTV Camera Surveillance & NVR Recording",
      "Biometric Face & Fingerprint Attendance Systems",
      "RFID Access Control & Video Door Phones",
      "Automated Boom Barriers & Visitor Management"
    ],
    techStack: ["Hikvision AI", "Dahua NVR", "Matrix Access", "ZKTeco Biometrics"],
    hpEquipment: ["HPE Storage Nodes for Video Surveillance Archives"],
    roadmap: [
      { step: "Phase 01", title: "Site Survey", desc: "Identify camera blind spots & entry/exit gates" },
      { step: "Phase 02", title: "Cabling & NVR Installation", desc: "Deploy PoE cameras & central NVR storage" },
      { step: "Phase 03", title: "Biometric Integration", desc: "Setup face recognition & attendance software" },
      { step: "Phase 04", title: "Live Command Monitoring", desc: "Remote viewing setup on mobile & desktop" }
    ],
    targetIndustries: ["Warehouses", "Factories", "Corporate Offices", "Hospitals", "Schools"]
  },
  { 
    id: "printing",
    title: "Printing & Office Automation", 
    category: "Office Productivity",
    badgeText: "Industrial Printing",
    description: "Modern office productivity with enterprise laser printers, barcode/label printers, thermal devices, and multi-function copiers.", 
    fullOverview: "Streamline physical document workflows with enterprise HP LaserJet printers, Zebra barcode label printers, thermal billing devices, multi-function copiers, high-speed document scanners, and managed print services.",
    icon: Printer,
    image: "/images/modern_workplace_laptop.png",
    href: "/solutions#printing",
    heroColor: "from-blue-600 to-slate-800",
    metrics: [
      { label: "Print Cost Reduction", value: "35%", sub: "Managed toner & page tracking" },
      { label: "Scanning Speed", value: "120 ppm", sub: "High-speed document digitizer" },
      { label: "Hardware Reliability", value: "Heavy-Duty", sub: "Industrial duty cycles" }
    ],
    capabilities: [
      "Enterprise HP LaserJet Printers & Copiers",
      "Barcode & Label Printers (Zebra / TSC)",
      "Thermal Printers & Multi-Function Devices",
      "High-Speed Document Scanners & Managed Print Services"
    ],
    techStack: ["HP Web Jetadmin", "PaperCut MF", "Zebra Designer"],
    hpEquipment: ["HP LaserJet Enterprise MFP", "HP Digital Sender Flow Scanner"],
    roadmap: [
      { step: "Phase 01", title: "Print Usage Audit", desc: "Analyze page volume & toner costs" },
      { step: "Phase 02", title: "Fleet Replacement", desc: "Deploy multi-function HP laser printers" },
      { step: "Phase 03", title: "Print Management Setup", desc: "Enforce badge printing & cost center tracking" },
      { step: "Phase 04", title: "Auto-Toner Replenishment", desc: "Proactive supplies dispatch before depletion" }
    ],
    targetIndustries: ["Logistics", "Healthcare", "Legal", "Banking", "Retail"]
  },
  { 
    id: "healthcare",
    title: "Healthcare IT & Smart Pharmacy", 
    category: "Healthcare Solutions",
    badgeText: "Hospital ERP & QR Track",
    description: "Specialized technology built for hospitals, clinics, pharmacies, patient registration, and QR-based medicine inventory.", 
    fullOverview: "Transform healthcare delivery with Hospital ERP software, Pharmacy Management, Medicine Inventory control, Patient Registration, Billing Management, QR-based medicine tracking, and smart pharmacy automation.",
    icon: HeartPulse,
    image: "/images/india_modern_hospital_it_room.png",
    href: "/solutions#healthcare",
    heroColor: "from-emerald-600 to-teal-800",
    metrics: [
      { label: "Patient Check-in Speed", value: "-60%", sub: "Automated QR registration" },
      { label: "Pharmacy Stock Accuracy", value: "99.9%", sub: "Batch & expiry tracking" },
      { label: "HIPAA / NABH Audit", value: "Compliant", sub: "Encrypted patient EHR records" }
    ],
    capabilities: [
      "Complete Hospital ERP & Clinic Software",
      "Pharmacy Management & Medicine Inventory Control",
      "Patient Registration & OPD/IPD Billing",
      "QR-Based Medicine Tracking & Digital Rack Automation"
    ],
    techStack: ["DEEQASA Health ERP", "HL7 / FHIR Standards", "PostgreSQL", "BarTender QR"],
    hpEquipment: ["HP Healthcare Edition Laptops & Touchscreen Kiosks"],
    roadmap: [
      { step: "Phase 01", title: "Hospital Workflow Study", desc: "Map OPD, IPD, Pathology & Pharmacy data" },
      { step: "Phase 02", title: "ERP Deployment", desc: "Setup doctor consultation & billing modules" },
      { step: "Phase 03", title: "Pharmacy QR Setup", desc: "Tag medicine racks with QR barcode tracking" },
      { step: "Phase 04", title: "NABH Compliance Certification", desc: "Ensure audit-ready data logs" }
    ],
    targetIndustries: ["Hospitals", "Diagnostic Labs", "Chain Pharmacies", "Clinics"]
  },
  { 
    id: "education",
    title: "Education & Campus IT Solutions", 
    category: "Education Technology",
    badgeText: "Smart Campus 2.0",
    description: "Digital infrastructure for schools and colleges including smart classrooms, computer labs, LMS, and campus networking.", 
    fullOverview: "Empower educational institutions with Smart Classrooms, high-performance Computer Labs, Campus Wi-Fi Networking, Student Attendance Systems, Learning Management Systems (LMS), and Student Information Portals.",
    icon: GraduationCap,
    image: "/images/india_university_smart_lab.png",
    href: "/solutions#education",
    heroColor: "from-indigo-600 to-purple-800",
    metrics: [
      { label: "Campus Wi-Fi Capacity", value: "5000+ Users", sub: "High-density Aruba APs" },
      { label: "Lab PC Reliability", value: "99.9%", sub: "Pre-configured student image" },
      { label: "Student CSAT", value: "98%", sub: "Interactive digital learning" }
    ],
    capabilities: [
      "Smart Interactive Classrooms & Digital Panels",
      "High-Density Computer Labs (HP ProBooks & Desktops)",
      "Campus Wi-Fi 6E Networking & Firewall Security",
      "LMS & Student Information Management Systems"
    ],
    techStack: ["Moodle LMS", "Aruba Central", "Google Classroom", "Windows 11 Pro Education"],
    hpEquipment: ["HP ProBook Education Edition", "HP Chromebooks", "Aruba Instant On APs"],
    roadmap: [
      { step: "Phase 01", title: "Campus Coverage Mapping", desc: "Map Wi-Fi heatmaps & computer lab layout" },
      { step: "Phase 02", title: "Lab & Panel Installation", desc: "Deploy HP PCs & interactive panels" },
      { step: "Phase 03", title: "LMS Portal Integration", desc: "Upload student database & course materials" },
      { step: "Phase 04", title: "Faculty Training", desc: "Hands-on smart classroom workshops" }
    ],
    targetIndustries: ["Universities", "Engineering Colleges", "K-12 Schools", "Coaching Institutes"]
  },
  { 
    id: "amc",
    title: "Annual Maintenance Contract (AMC)", 
    category: "Managed IT Services",
    badgeText: "24/7 SLA Support",
    description: "Reliable post-sales support with preventive maintenance, on-site engineers, hardware health checks, and asset monitoring.", 
    fullOverview: "Keep enterprise technology running smoothly with DEEQASA AMC plans. Includes preventive maintenance, on-site engineer support, remote troubleshooting, hardware health checks, software updates, and asset tracking.",
    icon: Wrench,
    image: "/images/india_tech_park_software_office.png",
    href: "/solutions#amc",
    heroColor: "from-slate-800 to-blue-900",
    metrics: [
      { label: "Response SLA", value: "< 2 Hours", sub: "Dedicated on-site engineer" },
      { label: "Downtime Prevention", value: "99.9%", sub: "Proactive health diagnostics" },
      { label: "Coverage", value: "PAN India", sub: "Nationwide service network" }
    ],
    capabilities: [
      "Preventive Maintenance & Hardware Health Checks",
      "On-Site Engineer Support & Remote Troubleshooting",
      "Software Patch Updates & Network Monitoring",
      "IT Asset Management & Priority Escalation Service"
    ],
    techStack: ["DEEQASA Remote Monitoring Agent", "HP TechPulse Telemetry", "Jira Service Desk"],
    hpEquipment: ["Genuine HP Spare Parts Replacement & Direct Manufacturer SLA"],
    roadmap: [
      { step: "Phase 01", title: "Asset Audit", desc: "Tag & catalogue all company IT hardware assets" },
      { step: "Phase 02", title: "SLA Tier Assignment", desc: "Define response times & preventive visit schedule" },
      { step: "Phase 03", title: "24/7 Monitoring Agent", desc: "Install proactive telemetry for hardware alerts" },
      { step: "Phase 04", title: "Continuous Maintenance", desc: "Quarterly health checks & emergency dispatch" }
    ],
    targetIndustries: ["Corporate Offices", "Factories", "Banks", "Hospitals", "Retail Chains"]
  }
];

const categories = [
  "All", 
  "Hardware & Network", 
  "Cloud Services", 
  "Enterprise Defense", 
  "Software Engineering", 
  "Artificial Intelligence", 
  "Web Engineering", 
  "Physical Security", 
  "Office Productivity", 
  "Healthcare Solutions", 
  "Education Technology", 
  "Managed IT Services"
];

const comparisonData = [
  {
    feature: "Infrastructure Architecture",
    legacy: "Siloed legacy servers with high power consumption & manual patching",
    deeqasa: "Hyperconverged, liquid-cooled, software-defined multi-cloud architecture"
  },
  {
    feature: "Security Perimeter",
    legacy: "Basic network firewall prone to zero-day endpoint breaches",
    deeqasa: "Hardware-isolated Zero Trust defense with self-healing BIOS protection"
  },
  {
    feature: "Workload Provisioning",
    legacy: "Days or weeks of manual engineering & physical imaging",
    deeqasa: "Under 15-minute automated zero-touch cloud enrollment"
  },
  {
    feature: "AI & Data Workloads",
    legacy: "High-latency public cloud APIs with data privacy risk",
    deeqasa: "On-premises high-density GPU nodes with zero data leakage"
  },
  {
    feature: "Operational SLA Uptime",
    legacy: "99.0% - 99.5% with reactive manual troubleshooting",
    deeqasa: "99.999% SLA backed by AI telemetry & 24/7 SOC response"
  }
];

export default function SolutionsPage() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeModalSolution, setActiveModalSolution] = useState<SolutionData | null>(null);
  const [scrambleTitle, setScrambleTitle] = useState("");

  const targetHeading = "Empowering Businesses with Smart Technology Solutions";

  useEffect(() => {
    let iteration = 0;
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()';
    const interval = setInterval(() => {
      setScrambleTitle(
        targetHeading
          .split('')
          .map((char, idx) => (idx < iteration ? targetHeading[idx] : chars[Math.floor(Math.random() * chars.length)]))
          .join('')
      );
      if (iteration >= targetHeading.length) clearInterval(interval);
      iteration += 1 / 2;
    }, 25);
    return () => clearInterval(interval);
  }, []);

  const filteredSolutions = useMemo(() => {
    return solutionsData.filter(item => {
      const matchesCategory = selectedCategory === "All" || item.category === selectedCategory;
      const matchesSearch = 
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.badgeText.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.capabilities.some(c => c.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  return (
    <SmoothScrollProvider>
      <CustomCursor />

      <div className="relative min-h-screen bg-[#040a1b] text-white font-[Outfit] selection:bg-blue-500/30">
        
        {/* Header */}
        <Header />

        {/* Lucien Signature Radial Aura Glow */}
        <div 
          className="absolute inset-0 pointer-events-none z-0 opacity-85"
          style={{
            background: 'radial-gradient(ellipse 65% 50% at 50% 35%, rgba(147, 197, 253, 0.35) 0%, rgba(59, 130, 246, 0.18) 45%, rgba(4, 10, 27, 0.95) 75%)'
          }}
        />

        <main className="relative z-10 pt-36 pb-32 space-y-24">

          {/* Hero Banner with Scramble Animation & Lucien Light Font */}
          <section className="container-enterprise text-center px-6 space-y-6">
            <span className="text-xs font-mono uppercase tracking-[0.4em] text-blue-400 block">
              DEEQASA TECH END-TO-END SOLUTIONS —
            </span>
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-light tracking-tight text-white leading-[1.05] select-none max-w-5xl mx-auto">
              {scrambleTitle || targetHeading}
            </h1>
            <p className="text-slate-400 text-lg md:text-xl font-normal max-w-3xl mx-auto leading-relaxed">
              At Deeqasa Tech, we help organizations transform digitally with enterprise hardware, cloud solutions, cybersecurity, custom software, AI automation, and managed IT support.
            </p>
          </section>

          {/* Enterprise Stats Bar */}
          <section className="container-enterprise px-6">
            <div className="bg-slate-900/80 border border-slate-800/80 rounded-[2.5rem] p-8 md:p-12 backdrop-blur-xl shadow-2xl relative overflow-hidden">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 relative z-10">
                <div className="border-r border-slate-800 pr-6">
                  <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-blue-400 block mb-2">OPERATIONAL SLA</span>
                  <div className="text-3xl md:text-4xl font-light text-white tracking-tight mb-1 font-mono">99.999%</div>
                  <div className="text-xs text-slate-400 font-medium">Zero Unplanned Downtime</div>
                </div>

                <div className="border-r border-slate-800 pr-6">
                  <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-blue-400 block mb-2">SERVICE COVERAGE</span>
                  <div className="text-3xl md:text-4xl font-light text-white tracking-tight mb-1 font-mono">PAN INDIA</div>
                  <div className="text-xs text-slate-400 font-medium">Nationwide Engineer Network</div>
                </div>

                <div className="border-r border-slate-800 pr-6">
                  <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-blue-400 block mb-2">SECURITY BASELINE</span>
                  <div className="text-3xl md:text-4xl font-light text-white tracking-tight mb-1 font-mono">ZERO TRUST</div>
                  <div className="text-xs text-slate-400 font-medium">Hardware-Enforced Isolation</div>
                </div>

                <div>
                  <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-blue-400 block mb-2">PARTNERSHIP TIER</span>
                  <div className="text-3xl md:text-4xl font-light text-white tracking-tight mb-1 font-mono">HP GOLD</div>
                  <div className="text-xs text-slate-400 font-medium">Authorized HP Connect Partner</div>
                </div>
              </div>
            </div>
          </section>

          {/* Filter & Search Bar */}
          <section className="container-enterprise px-6 space-y-8">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div>
                <span className="text-xs font-mono uppercase tracking-[0.3em] text-blue-400 block mb-2 flex items-center gap-2">
                  <SlidersHorizontal size={14} /> SOLUTION CATALOG
                </span>
                <h2 className="text-3xl md:text-4xl font-light tracking-tight text-white">
                  11 Enterprise Solution Verticals
                </h2>
              </div>

              {/* Search Input */}
              <div className="relative w-full lg:w-96">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <Input
                  type="text"
                  placeholder="Search IT infrastructure, ERP, AI, CCTV..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 h-14 bg-slate-900/80 border-slate-800 text-white placeholder:text-slate-500 rounded-2xl focus-visible:ring-blue-500 text-sm font-medium shadow-sm backdrop-blur-xl"
                />
                {searchQuery && (
                  <button 
                    onClick={() => setSearchQuery("")}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 hover:text-white"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap gap-2 pt-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-5 py-2.5 rounded-2xl text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
                    selectedCategory === cat
                      ? "bg-blue-500 text-white shadow-[0_0_20px_rgba(59,130,246,0.5)] scale-105"
                      : "bg-slate-900/80 border border-slate-800 text-slate-400 hover:border-slate-700 hover:text-white"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </section>

          {/* Dynamic Solutions Grid with Generated AI Images & Lucien Typography */}
          <section className="container-enterprise px-6">
            {filteredSolutions.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredSolutions.map((solution, i) => {
                  const Icon = solution.icon as any;
                  return (
                    <motion.div
                      key={solution.id}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: (i % 6) * 0.08, duration: 0.6 }}
                      viewport={{ once: true }}
                    >
                      <Card className="h-full bg-slate-900/70 border border-slate-800 hover:border-blue-500/50 backdrop-blur-xl transition-all duration-500 group overflow-hidden relative rounded-[2.5rem] p-4 shadow-2xl flex flex-col justify-between text-white">
                        
                        <div>
                          {/* Generated AI Image Banner */}
                          {solution.image && (
                            <div className="relative h-48 w-full rounded-2xl overflow-hidden mb-4 border border-slate-800/80">
                              <img 
                                src={solution.image} 
                                alt={solution.title} 
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                              <Badge variant="outline" className="absolute top-3 right-3 px-3 py-1 rounded-full border-blue-500/40 text-blue-300 font-mono font-bold text-[10px] uppercase tracking-wider bg-slate-950/80 backdrop-blur-md">
                                {solution.badgeText}
                              </Badge>
                            </div>
                          )}

                          <CardHeader className="relative z-10 pb-4 pt-2 px-4">
                            <div className="flex items-center gap-3 mb-3">
                              <div className="h-10 w-10 rounded-xl bg-slate-800 border border-slate-700/80 flex items-center justify-center text-blue-400 group-hover:bg-blue-500 group-hover:text-white transition-all duration-500 shrink-0">
                                <Icon size={20} />
                              </div>
                              <span className="text-[10px] font-mono uppercase tracking-widest text-blue-400 block">
                                {solution.category}
                              </span>
                            </div>

                            <CardTitle className="text-2xl font-light tracking-tight text-white leading-snug mb-2 group-hover:text-blue-300 transition-colors">
                              {solution.title}
                            </CardTitle>
                          </CardHeader>

                          <CardContent className="relative z-10 px-4 pb-4">
                            <p className="text-slate-400 text-sm leading-relaxed mb-6 font-normal">
                              {solution.description}
                            </p>

                            {/* Quick Specs Tags */}
                            <div className="space-y-3 mb-6 bg-slate-950/80 p-4 rounded-2xl border border-slate-800">
                              <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500 block">
                                KEY ENTERPRISE METRIC
                              </span>
                              <div className="flex items-center justify-between text-xs font-bold text-white">
                                <span>{solution.metrics[0].label}</span>
                                <span className="text-blue-400 font-bold font-mono">{solution.metrics[0].value}</span>
                              </div>
                            </div>
                          </CardContent>
                        </div>

                        {/* Card Action Buttons */}
                        <div className="px-4 pb-4 space-y-3 relative z-10">
                          <Button 
                            onClick={() => setActiveModalSolution(solution)}
                            className="w-full h-12 bg-white hover:bg-slate-100 text-slate-950 font-bold uppercase tracking-wider text-[11px] transition-all rounded-2xl flex items-center justify-center gap-2 group/btn shadow-lg"
                          >
                            <Maximize2 size={14} /> Architectural Blueprint
                          </Button>
                        </div>

                      </Card>
                    </motion.div>
                  );
                })}
              </div>
            ) : (
              <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] p-16 text-center space-y-4">
                <div className="h-16 w-16 rounded-full bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
                  <Search size={32} />
                </div>
                <h3 className="text-2xl font-light text-white tracking-tight">No Solutions Found</h3>
                <p className="text-slate-400 text-sm max-w-md mx-auto">
                  We couldn't find any architectural solution matching "{searchQuery}". Try selecting another category or resetting filters.
                </p>
                <Button 
                  onClick={() => { setSelectedCategory("All"); setSearchQuery(""); }}
                  className="bg-white text-slate-950 font-bold uppercase tracking-wider text-xs rounded-full px-6"
                >
                  Reset Search Filters
                </Button>
              </div>
            )}
          </section>

          {/* Interactive Matchmaker Wizard Section */}
          <section className="container-enterprise px-6">
            <SolutionsMatchmaker />
          </section>

          {/* Comparison Matrix */}
          <section className="container-enterprise px-6 space-y-8">
            <div className="text-center max-w-3xl mx-auto space-y-3">
              <span className="text-xs font-mono uppercase tracking-[0.3em] text-blue-400 block">
                THE DEEQASA ADVANTAGE
              </span>
              <h2 className="text-4xl md:text-5xl font-light tracking-tight text-white">
                Legacy IT vs Deeqasa End-to-End Solutions
              </h2>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] shadow-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-950 text-slate-400 border-b border-slate-800 text-xs font-mono uppercase tracking-widest">
                      <th className="p-6 md:p-8">Feature Dimension</th>
                      <th className="p-6 md:p-8 text-slate-500">Traditional Legacy Setup</th>
                      <th className="p-6 md:p-8 text-blue-400 bg-blue-500/10">Deeqasa Integrated Solution</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 text-sm">
                    {comparisonData.map((row, idx) => (
                      <tr key={idx} className="hover:bg-slate-800/40 transition-colors">
                        <td className="p-6 md:p-8 font-normal text-white uppercase text-xs tracking-wider">
                          {row.feature}
                        </td>
                        <td className="p-6 md:p-8 text-slate-400 font-normal">
                          <div className="flex items-start gap-3">
                            <XCircle size={18} className="text-red-400 shrink-0 mt-0.5" />
                            <span>{row.legacy}</span>
                          </div>
                        </td>
                        <td className="p-6 md:p-8 font-normal text-white bg-blue-500/5 border-l border-blue-500/20">
                          <div className="flex items-start gap-3">
                            <CheckCircle2 size={18} className="text-blue-400 shrink-0 mt-0.5" />
                            <span>{row.deeqasa}</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          {/* Mission & Vision Section */}
          <section className="container-enterprise px-6 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-slate-900/80 border border-slate-800 p-8 md:p-12 rounded-[2.5rem] space-y-4 backdrop-blur-xl">
              <span className="text-xs font-mono uppercase tracking-[0.4em] text-blue-400 block">OUR MISSION —</span>
              <h3 className="text-2xl font-light text-white tracking-tight">Driving Digital Growth & Efficiency</h3>
              <p className="text-slate-400 text-sm leading-relaxed font-normal">
                To empower businesses with innovative, secure, and scalable technology solutions that drive digital transformation, operational efficiency, and long-term growth.
              </p>
            </div>

            <div className="bg-slate-900/80 border border-slate-800 p-8 md:p-12 rounded-[2.5rem] space-y-4 backdrop-blur-xl">
              <span className="text-xs font-mono uppercase tracking-[0.4em] text-blue-400 block">OUR VISION —</span>
              <h3 className="text-2xl font-light text-white tracking-tight">India's Most Trusted IT Partner</h3>
              <p className="text-slate-400 text-sm leading-relaxed font-normal">
                To become one of India's most trusted technology solution providers by delivering innovation, quality, reliability, and exceptional customer service across every industry.
              </p>
            </div>
          </section>

          {/* Quotation CTA Banner */}
          <section className="container-enterprise px-6">
            <div className="bg-gradient-to-r from-slate-900 via-slate-950 to-slate-900 border border-slate-800 rounded-[2.5rem] p-10 md:p-16 text-center space-y-6 relative overflow-hidden shadow-2xl">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-blue-500/20 rounded-full blur-[140px] pointer-events-none" />
              
              <div className="relative z-10 space-y-6 max-w-3xl mx-auto">
                <span className="text-xs font-mono uppercase tracking-[0.4em] text-blue-400 block">
                  READY TO TRANSFORM YOUR BUSINESS?
                </span>
                <h2 className="text-4xl md:text-6xl font-light tracking-tight text-white leading-tight">
                  Let's Build the Future of Your Business Together
                </h2>
                <p className="text-slate-300 text-lg leading-relaxed font-normal">
                  Whether you need enterprise IT infrastructure, cloud services, cybersecurity, custom software, AI automation, or managed IT support, Deeqasa Tech is your trusted technology partner.
                </p>
                <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Button 
                    asChild 
                    className="w-full sm:w-auto h-16 px-10 bg-white hover:bg-slate-100 text-slate-950 font-bold uppercase tracking-widest text-xs rounded-full shadow-xl transition-transform hover:scale-105 group"
                  >
                    <Link href="/quotation">
                      Request Solution Proposal <ArrowRight size={18} className="ml-3 group-hover:translate-x-2 transition-transform" />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </section>

        </main>

        {/* Modal */}
        <SolutionDetailModal 
          solution={activeModalSolution}
          isOpen={!!activeModalSolution}
          onClose={() => setActiveModalSolution(null)}
        />

        <Footer />
      </div>
    </SmoothScrollProvider>
  );
}