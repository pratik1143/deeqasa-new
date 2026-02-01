'use client';

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUserWithRole } from "@/firebase";
import { Header } from "@/components/layout/header";
import { CenteredLoader } from "@/components/ui/centered-loader";
import AccessDenied from "@/components/auth/access-denied";
import { QuotationBuilder } from "@/components/quotation/quotation-builder";

export default function QuotationBuilderPage() {
    const { user, profile, isUserLoading, isProfileLoading } = useUserWithRole();
    const router = useRouter();

    const isLoading = isUserLoading || isProfileLoading;

    useEffect(() => {
        if (!isLoading && !user) {
            router.push('/login');
        }
    }, [user, isLoading, router]);

    if (isLoading) {
        return (
            <div className="flex flex-col min-h-screen bg-background">
                <Header />
                <main className="flex-1 pt-16 flex items-center justify-center">
                    <CenteredLoader text="Verifying permissions..." />
                </main>
            </div>
        );
    }
    
    if (!user) {
         return (
            <div className="flex flex-col min-h-screen bg-background">
                <Header />
                <main className="flex-1 pt-16 flex items-center justify-center">
                    <CenteredLoader text="Redirecting to login..." />
                </main>
            </div>
        );
    }

    if (!profile || profile.role !== 'admin') {
        return <AccessDenied />;
    }
    
    return (
        <div className="flex flex-col h-screen bg-secondary/40">
            <main className="flex-1 overflow-hidden">
                <QuotationBuilder />
            </main>
        </div>
    );
}
