'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ShieldAlert } from "lucide-react";
import { Header } from "../layout/header";

export default function AccessDenied() {
    return (
        <div className="flex flex-col min-h-screen bg-background">
            <Header />
            <main className="flex-1 flex items-center justify-center p-4">
                <Card className="w-full max-w-md text-center">
                    <CardHeader>
                        <CardTitle className="flex justify-center items-center gap-2 text-2xl font-headline text-destructive">
                            <ShieldAlert size={28} />
                            Access Denied
                        </CardTitle>
                        <CardDescription>
                            You do not have the required permissions to view this page.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground mb-6">
                            This area is restricted to administrators only. If you believe this is an error, please contact support.
                        </p>
                        <Button asChild>
                            <Link href="/">Return to Homepage</Link>
                        </Button>
                    </CardContent>
                </Card>
            </main>
        </div>
    );
}
