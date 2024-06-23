"use client"

import {Link} from '@mantine/tiptap';
import {useEditor} from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import React, {useState} from "react";
import ProtectedRoute from "@/Components/ProtectedRoute/ProtectedRoute";
import PostForm from "@/Components/PostForm/PostForm";
import {
    createPost,
    previewPost,
} from '@/Controllers/PostController'
import {useRouter} from "next/navigation";
import {useAuth} from "@/Context/AuthContext";
import {Box, LoadingOverlay} from "@mantine/core";

const defaultContent =
    '<h2>Feel free to edit me as you wish!</h2><p>this is one awesome article</p><h3>reasons why this article rocks</h3><ol><li>it just does!</li><li>do I need more reasons?</li></ol>';
export default function CreatePost() {
    const {user} = useAuth()
    const router = useRouter();
    const editor = useEditor({
        extensions: [
            StarterKit,
            Link,
        ],
        content: defaultContent,
    });
    const [data, setData] = useState({title: '',});
    const [tagsValue, setTagsValue] = useState<string[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [fileValue, setFileValue] = useState<File | null>(null);

    return (
        <ProtectedRoute>
            <PostForm fileValue={fileValue} setFileValue={setFileValue} data={data} loading={loading} setData={setData} tagsValue={tagsValue}
                      setTagsValue={setTagsValue} editor={editor}
                      handleSave={() => {
                          setLoading(true)
                          createPost(data.title, editor?.getHTML() as string, tagsValue, fileValue as File)
                              .then((res) => {
                                  router.push(`/posts/${user?.profile.userName}/${res.slug}`)
                              })
                              .catch((err) => {
                                  console.log(err)
                              })
                              .finally(() => setLoading(false))
                      }} handlePreview={() => {
                previewPost(data.title, editor?.getHTML() as string)
            }}/>
        </ProtectedRoute>
    )
}