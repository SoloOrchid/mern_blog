import CustomAppShell from "@/Layout/CustomAppShell";
import {Badge, Button, Divider, Image, rem, Textarea} from '@mantine/core';
import PostCard from "@/Components/PostCard/PostCard";
import Link from "next/link";
import {notFound} from 'next/navigation';
import {Post} from '@/types'

import CommentForm from "@/Components/CommentForm/CommentForm";
import BookMarkButton from "@/Components/BookMarkButton/BookMarkButton";


async function getData(username: string, slug: string) {
    const res = await fetch(`http://localhost:3000/posts/${username}/${slug}`, {
        cache: "no-cache"
    })

    if (!res.ok) {
        notFound();
    }

    return res.json();
}
export default async function SinglePost({params}: { params: { slug: string, username: string } }) {
    const { username, slug} = params
    const data: Post = await getData(username, slug);

    if (!data) {
        return <p>loading</p>
    }

    return (
        <CustomAppShell>
            <Image
                mah={400}
                radius="md"
                src={`http://localhost:3000/public/${data.image}`}
                fallbackSrc={'http://localhost:3000/public/default.jpeg'}
            />

            <div style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 0'
            }}>
                <div>
                    <h1 style={{lineHeight: '1rem'}}>{data.title}</h1>
                    <p style={{lineHeight: 0}}>Author: <Link href={`/posts/user/${data.user}`}>{data.user}</Link></p>
                </div>
                <BookMarkButton username={params.username} slug={params.slug} />
            </div>
            {<div style={{paddingTop: '2rem'}} dangerouslySetInnerHTML={{__html: data.body}}/>}


            <div style={{
                display: 'flex',
                flexDirection: 'row',
                flexWrap: 'wrap',
                gap: '0.5rem',
                marginBottom: '1rem'
            }}>
                {
                    data.category.map((item: string) => (
                        <Badge color="blue">{item}</Badge>
                    ))
                }
            </div>
            <CommentForm username={data.user} slug={data.slug} />
            <Divider my="sm" />
            <div style={{
                display: 'flex',
                flexDirection: 'row',
                flexWrap: 'wrap',
                gap: '1rem',
            }}>
                {!!data.relative
                    ? data.relative.map((post: Post) => (
                        <PostCard image={post.image} title={post.title} slug={post.slug} author={post.user}
                                  body={post.body}/>
                    ))
                    : null
                }
            </div>
        </CustomAppShell>
    )
}