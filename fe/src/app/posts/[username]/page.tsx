import CustomAppShell from "../../../Layout/CustomAppShell";
import { notFound } from 'next/navigation';
import { use } from 'react';
import PostCard from "../../../Components/PostCard/PostCard";
import {Post} from "@/types";

async function getData(username: string) {
    const res = await fetch(`http://localhost:3000/posts/${username}`, {
        cache: 'no-store', // Ensure the data is not cached
    });

    if (!res.ok) {
        throw new Error('Failed to fetch data');
    }

    return res.json();
}

export default async function UserPosts({ params }: { params: { username: string } }) {
    const { username } = params;
    let data;

    try {
        data = await getData(username);
    } catch (error) {
        return notFound();
    }

    return (
        <CustomAppShell>
            <h1>User Posts</h1>
            <div style={{
                display: 'flex',
                flexDirection: 'row',
                flexWrap: 'wrap',
                gap: '1rem',
            }}>
                {data.map((post: Post) => (
                    <PostCard image={post.image} author={post.user} key={post.id} title={post.title} slug={post.slug} body={post.body}/>
                ))}
            </div>
        </CustomAppShell>
    )
}