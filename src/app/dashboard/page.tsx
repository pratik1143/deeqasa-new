'use client';

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUserWithRole } from "@/firebase";
import { DashboardHome } from "@/components/dashboard/dashboard-home";
import { CenteredLoader } from "@/components/ui/centered-loader";
import AccessDenied from "@/components/auth/access-denied";
import { AdminLayout } from "@/components/layout/admin-layout";

export default function DashboardPage() {
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
            <div className="flex flex-col min-h-screen bg-[#f8fafc] items-center justify-center">
                <CenteredLoader text="Verifying mission protocols..." />
            </div>
        );
    }
    
    if (!user) {
         return (
            <div className="flex flex-col min-h-screen bg-[#f8fafc] items-center justify-center">
                <CenteredLoader text="Redirecting to terminal login..." />
            </div>
        );
    }

    if (!profile || profile.role !== 'admin') {
        return <AccessDenied />;
    }
    
    return (
        <AdminLayout>
            <DashboardHome />
        </AdminLayout>
    );
}