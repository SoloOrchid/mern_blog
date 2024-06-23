"use client"

import {ReactNode, useEffect} from "react";
import {useAuth} from "../../Context/AuthContext";
import {useRouter} from "next/navigation";

export default function GuestRoute({children}: {children: ReactNode}) {
    const {user, loading} = useAuth()
    const router = useRouter()

    useEffect(() => {
        if(!loading && !!user) {
            router.replace('/')
        }
    }, [loading, user, router]);


    if(loading) {
        return (
            <div>Loading...</div>
        )
    }

    return (
        <>
            {children}
        </>
    )
}