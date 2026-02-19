'use client';

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUserWithRole } from "@/firebase";
import { CenteredLoader } from "@/components/ui/centered-loader";
import AccessDenied from "@/components/auth/access-denied";
import { QuotationBuilder } from "@/components/quotation/quotation-builder";
import { AdminLayout } from "@/components/layout/admin-layout";

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
            <div className="flex flex-col min-h-screen bg-background items-center justify-center">
                <CenteredLoader text="Verifying permissions..." />
            </div>
        );
    }
    
    if (!user) {
         return (
            <div className="flex flex-col min-h-screen bg-background items-center justify-center">
                <CenteredLoader text="Redirecting to login..." />
            </div>
        );
    }

    if (!profile || profile.role !== 'admin') {
        return <AccessDenied />;
    }
    
    return (
        <AdminLayout className="px-0 py-0 pt-20 lg:pt-20">
            <QuotationBuilder />
        </AdminLayout>
    );
}