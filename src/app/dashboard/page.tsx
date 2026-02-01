import { FunnelAnalyzerDashboard } from "@/components/dashboard/funnel-analyzer-dashboard";
import { Header } from "@/components/layout/header";

export default function DashboardPage() {
    return (
        <div className="flex flex-col min-h-screen bg-background">
            <Header />
            <main className="flex-1 pt-16">
                <FunnelAnalyzerDashboard />
            </main>
        </div>
    );
}
