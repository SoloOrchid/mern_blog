import {Flex} from "@mantine/core"
import CustomAppShell from '../../Layout/CustomAppShell'
import PostCard from "../../Components/PostCard/PostCard";

async function getData() {
    const res = await fetch('http://localhost:3000/posts', {
        cache: 'no-store'
    })
    // The return value is *not* serialized
    // You can return Date, Map, Set, etc.

    if (!res.ok) {
        // This will activate the closest `error.js` Error Boundary
        throw new Error('Failed to fetch data')
    }

    return res.json()
}

export default async function Posts() {
    const data = await getData()

    return (
        <CustomAppShell>
            <h1>Posts</h1>
            <div style={{
                display: 'flex',
                flexDirection: 'row',
                flexWrap: 'wrap',
                gap: '1rem',
            }}>
                {
                    data.map((post: any) => (
                        <PostCard key={post.id} image={post.image} title={post.title} author={post.user} slug={post.slug} body={post.body}/>
                    ))
                }
            </div>
        </CustomAppShell>
    )
}