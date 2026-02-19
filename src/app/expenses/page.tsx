
'use client';

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { CenteredLoader } from "@/components/ui/centered-loader";

/**
 * Decommissioned Expense Management Page
 * Redirects users back to the Dashboard.
 */
export default function ExpensesPage() {
    const router = useRouter();

    useEffect(() => {
        // Immediate redirect to Dashboard
        router.push('/dashboard');
    }, [router]);

    return <CenteredLoader text="Redirecting to Dashboard..." />;
}
