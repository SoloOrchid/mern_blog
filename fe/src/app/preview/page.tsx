"use client"

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import ProtectedRoute from "@/Components/ProtectedRoute/ProtectedRoute";
import {useAuth} from "@/Context/AuthContext";
import Link from "next/link";

export default function Preview() {
    const router = useRouter();
    const { user } = useAuth()
    const [article, setArticle] = useState<{ title: string; body: string }>({
        title: '',
        body: ''
    });

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const previewData = sessionStorage.getItem('previewArticle');
            if (previewData) {
                setArticle(JSON.parse(previewData));
            } else {
                router.push('/posts/create'); // Redirect to the create page if no data
            }
        }
    }, []);

    return (
        <ProtectedRoute>
            <h1>{article.title}</h1>
            <p>Author: <Link href={`/posts/user/${user?.profile.userName}`}>{user?.profile.userName}</Link></p>
            {<div dangerouslySetInnerHTML={{__html: article.body}}/>}
        </ProtectedRoute>
    );
}
