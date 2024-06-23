"use client"

import Link from 'next/link';
import {Card, Image, Text} from '@mantine/core';
import "./PostCard.css"

export default function PostCard({title, slug, body, image, author}: {
    author: string,
    title: string,
    slug: string,
    body: string,
    image?: string
}) {
    return (
        <Card
            shadow="sm"
            padding="xl"
            component="a"
            href={`/posts/${author}/${slug}`}
            maw={400}
            className={"card-container"}
        >
            <Card.Section>
                <Image
                    src={`http://localhost:3000/public/${image}` ?? "http://localhost:3000/public/default.jpeg"}
                    h={160}
                    alt="blog-post"
                />
            </Card.Section>
            <Text fw={500} size="lg" mt="md" className="title-text">
                {title}
            </Text>
            <Text size="sm" mt="sm">
                Author: {author}
            </Text>
            { <div className="body-text" dangerouslySetInnerHTML={{ __html: body }} /> }
        </Card>
    )
}