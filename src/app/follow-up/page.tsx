'use client';

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { CenteredLoader } from "@/components/ui/centered-loader";

/**
 * Decommissioned Follow-Up Page
 * This route has been removed as per administrative request.
 * Redirects users back to the Dashboard.
 */
export default function FollowUpPage() {
    const router = useRouter();

    useEffect(() => {
        // Immediate redirect to Dashboard
        router.push('/dashboard');
    }, [router]);

    return <CenteredLoader text="Redirecting to Dashboard..." />;
}
