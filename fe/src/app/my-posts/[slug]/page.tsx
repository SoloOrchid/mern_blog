"use client"

import CustomAppShell from "../../../Layout/CustomAppShell";
import {notFound, useRouter} from "next/navigation";
import React, {useEffect, useState} from "react";
import {useAuth} from "@/Context/AuthContext";
import ProtectedRoute from "@/Components/ProtectedRoute/ProtectedRoute";
import {Post} from "@/types";
import {useEditor} from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import {Link} from "@mantine/tiptap";
import {createPost, previewPost, updatePost} from "@/Controllers/PostController";
import PostForm from "@/Components/PostForm/PostForm";

async function getData(slug: string, username: string) {
    const res = await fetch(`http://localhost:3000/posts/${username}/${slug}`, {
        cache: "no-cache"
    })

    if (!res.ok) {
        notFound();
    }

    return res.json();
}

export default function SingleMyPosts({params}: { params: { slug: string } }) {
    const {slug} = params
    const {user} = useAuth();
    const [data, setData] = useState<Post>();
    const [editorContent, setEditorContent] = useState();
    let editor = useEditor({
        extensions: [
            StarterKit,
            Link,
        ],
        content: "loading...",
    });
    const [tagsValue, setTagsValue] = useState<string[]>([]);
    const [fileValue, setFileValue] = useState<File | null>(null);
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    //get the data from the server
    useEffect(() => {
        if (!!user) {
            getData(slug, user?.profile.userName as string)
                .then(res => {
                    setData(res)
                    //update the editor content to the res.body
                    editor?.commands.setContent(res.body)
                    setTagsValue(res.category)
                })
                .catch(err => console.log(err))
        }
    }, [user])

    return (
        <ProtectedRoute>
            {
                data !== undefined ?
                    <PostForm fileValue={fileValue} setFileValue={setFileValue} loading={loading} data={data} setData={setData} tagsValue={tagsValue} setTagsValue={setTagsValue}
                              editor={editor}
                              handleSave={() => {
                                  setLoading(true)
                                  updatePost(user?.profile.userName as string, slug, data.title, editor?.getHTML() as string, tagsValue)
                                      .then((res) => {
                                          router.push(`/posts/${user?.profile.userName}/${res.slug}`)
                                          setLoading(false)
                                      })
                                      .catch(e => console.log(`Happy mistake: ${e}`))
                                      .finally(() => setLoading(false))
                              }} handlePreview={() => previewPost(data.title, editor?.getHTML() as string)}/> : null
            }
        </ProtectedRoute>
    )
}