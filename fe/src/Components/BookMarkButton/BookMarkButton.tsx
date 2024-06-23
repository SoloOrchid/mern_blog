"use client"

import {Button, rem} from "@mantine/core";
import {LuBookmark} from "react-icons/lu";
import {useEffect, useState} from "react";
import api from "@/Utils/api";
import {useAuth} from "@/Context/AuthContext";
import CustomModal from "@/Components/CustomModal/CustomModal";
import {useDisclosure} from "@mantine/hooks";
import {destroyPost} from "@/Controllers/PostController";
import Link from "next/link";
import RegisterModal from "@/Components/RegisterModal/RegisterModal";

export default function BookMarkButton({username, slug}: { username: string, slug: string }) {
    const [like, setLike] = useState<boolean>(false);
    const {user, loading} = useAuth();
    const [opened, {open, close}] = useDisclosure(false);

    useEffect(() => {
        async function getLiked() {
            const res = await api(`posts/${username}/${slug}/liked`, {
                method: 'GET',
                credentials: 'include'
            })

            return res.json()
        }

        if (!!user && !loading) {
            getLiked().then(res => setLike(res.liked))
        }
    }, [loading]);

    const handleLiked = async () => {
        if (!user) {
            open()
        }

        if (!!user) {
            const res = await api(`posts/${username}/${slug}/like`, {
                method: 'GET',
                credentials: 'include'
            })

            if (res.status === 200) {
                setLike(!like);
            }
        }
    }

    return (
        <>
            <LuBookmark onClick={() => handleLiked()}
                        style={{width: rem(24), height: rem(24), fill: like ? "#999" : "#fff", stroke: '#999'}}/>
            <RegisterModal opened={opened} open={open} close={close} />
        </>

    )
}