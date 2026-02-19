
'use client';

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/firebase";
import { CenteredLoader } from "@/components/ui/centered-loader";
import { AdminLayout } from "@/components/layout/admin-layout";
import { ExpenseManager } from "@/components/expenses/expense-manager";

const ADMIN_EMAILS = ['deeqasa@admin.in'];

export default function ExpensesPage() {
    const { user, isUserLoading } = useUser();
    const router = useRouter();

    const isAdmin = user && ADMIN_EMAILS.includes(user.email || '');

    useEffect(() => {
        if (!isUserLoading && !user) {
            router.push('/login');
        } else if (!isUserLoading && user && !isAdmin) {
            router.push('/dashboard');
        }
    }, [user, isUserLoading, isAdmin, router]);

    if (isUserLoading) {
        return (
            <div className="flex flex-col min-h-screen bg-background items-center justify-center">
                <CenteredLoader text="Authenticating..." />
            </div>
        );
    }
    
    if (!user || !isAdmin) {
         return (
            <div className="flex flex-col min-h-screen bg-background items-center justify-center">
                <CenteredLoader text="Redirecting..." />
            </div>
        );
    }
    
    return (
        <AdminLayout className="pt-24 px-6 lg:px-10">
            <ExpenseManager />
        </AdminLayout>
    );
}
