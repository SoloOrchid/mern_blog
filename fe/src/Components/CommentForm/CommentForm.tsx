"use client"

import {Button, Divider, Pagination, Textarea} from "@mantine/core";
import React, {useEffect, useState} from "react";
import api from "@/Utils/api";
import {Comment} from '@/types'
import dayjs from "dayjs";
import relativeTime from 'dayjs/plugin/relativeTime'
import utc from "dayjs/plugin/utc"
import {useAuth} from "@/Context/AuthContext";
import RegisterModal from "@/Components/RegisterModal/RegisterModal";
import {useDisclosure} from "@mantine/hooks";

dayjs.extend(utc)
dayjs.extend(relativeTime)

//get all comments for the post and also show a form to comment

export default function CommentForm({username, slug}: { username: string, slug: string }) {
    const [data, setData] = useState<string>('');
    const [comments, setComments] = useState<Comment[]>();
    const {user, loading} = useAuth()
    const [opened, {open, close}] = useDisclosure(false);

    useEffect(() => {
        async function getComment() {
            const res = await api(`comments/${username}/${slug}`, {
                method: 'GET'
            })


            return res.json()
        }

        getComment().then(res => setComments(res))

    }, []);

    async function handleComment() {
        const res = await api(`comments/${username}/${slug}`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({comment: data})
        })


        setData('');
        return res.json();
    }

    return (
        <form style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem'
        }}>
            <Divider/>
            <Textarea
                disabled={!user}
                size="md"
                label="Comment"
                description="Write a comment on the post"
                placeholder="Input placeholder"
                value={data}
                onChange={(event) => setData(event.currentTarget.value)}
            />
            <Button onClick={() => {
                if(!user) {
                    open()
                }
                if(!!user) {
                    handleComment()
                        // @ts-ignore
                        .then(res => setComments([...comments, res]))
                        .catch(e => console.log(e))
                }
            }}>Comment!</Button>
            <RegisterModal opened={opened} open={open} close={close} />
            {
                comments !== undefined && comments?.length > -1
                    ?
                    comments.map((comment) => (
                        <div key={comment.id}>
                            <p>{comment.comment}</p>
                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                flexDirection: 'row'
                            }}>
                                <p>By: {comment.author}</p>
                                <p>{dayjs(comment.updatedAt).fromNow()}</p>
                            </div>
                        </div>
                    ))
                    : null
            }
        </form>
    )
}