'use client';

import { FunnelAnalyzerDashboard } from "@/components/dashboard/funnel-analyzer-dashboard";
import { Header } from "@/components/layout/header";
import { useUser } from "@/firebase";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { CenteredLoader } from "@/components/ui/centered-loader";

export default function DashboardPage() {
    const { user, isUserLoading } = useUser();
    const router = useRouter();

    useEffect(() => {
        if (!isUserLoading && !user) {
            router.push('/login');
        }
    }, [user, isUserLoading, router]);

    if (isUserLoading || !user) {
        return (
            <div className="flex flex-col min-h-screen bg-background">
                <Header />
                <main className="flex-1 pt-16 flex items-center justify-center">
                    <CenteredLoader text="Authenticating..." />
                </main>
            </div>
        );
    }
    
    return (
        <div className="flex flex-col min-h-screen bg-background">
            <Header />
            <main className="flex-1 pt-16">
                <FunnelAnalyzerDashboard />
            </main>
        </div>
    );
}
