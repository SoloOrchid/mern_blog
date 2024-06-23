"use client"

import React, {ReactNode, useEffect} from "react";
import {useAuth} from "@/Context/AuthContext";
import {useRouter} from "next/navigation";
import CustomAppShell from "../../Layout/CustomAppShell";

export default function ProtectedRoute({children}: { children: ReactNode }) {
    const {user, loading} = useAuth()
    const router = useRouter()

    useEffect(() => {
        if(!loading && !user) {
            router.replace('/')
        }
    }, [loading, user, router]);

    if (loading) {
        return (
            <CustomAppShell>
                <div>Loading...</div>
            </CustomAppShell>
        )
    }

    return (
        <CustomAppShell>
            {children}
        </CustomAppShell>

    )
}