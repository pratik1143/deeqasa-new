
'use client';

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUserWithRole } from "@/firebase";
import { CenteredLoader } from "@/components/ui/centered-loader";
import AccessDenied from "@/components/auth/access-denied";
import { AdminLayout } from "@/components/layout/admin-layout";
import { ExpenseManager } from "@/components/expenses/expense-manager";

export default function ExpensesPage() {
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
                <CenteredLoader text="Authenticating Financial Terminal..." />
            </div>
        );
    }
    
    if (!user) {
         return (
            <div className="flex flex-col min-h-screen bg-background items-center justify-center">
                <CenteredLoader text="Redirecting to gateway..." />
            </div>
        );
    }

    if (!profile || profile.role !== 'admin') {
        return <AccessDenied />;
    }
    
    return (
        <AdminLayout>
            <ExpenseManager />
        </AdminLayout>
    );
}
