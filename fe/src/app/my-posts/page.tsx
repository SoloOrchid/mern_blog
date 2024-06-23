"use client"

import CustomAppShell from "@/Layout/CustomAppShell";
import {useAuth} from "@/Context/AuthContext";
import CustomModal from "@/Components/CustomModal/CustomModal";
import {useRouter} from "next/navigation";
import {ActionIcon, Button, Table} from '@mantine/core';


import {LuFileEdit} from "react-icons/lu";
import {LuEye} from "react-icons/lu";
import ProtectedRoute from "../../Components/ProtectedRoute/ProtectedRoute";
import {LuTrash2} from "react-icons/lu";
import {useDisclosure} from "@mantine/hooks";

import {getPostByUser, destroyPost } from "@/Controllers/PostController";
import {useEffect, useState} from "react";
import {Post} from "@/types";

const regex = /(<([^>]+)>)/gi;
export default function MyPosts() {
    const {user, loading: userLoading} = useAuth()
    const router = useRouter()
    const [opened, {open, close}] = useDisclosure(false);
    const [toDelete, setToDelete] = useState<string>()
    const [posts, setPosts] = useState<Post[]>([])
    const [loading, setLoading] = useState<boolean>(true)

    useEffect(() => {
        if(!userLoading && !!user) {
            getPostByUser(user.profile.userName)
                .then((res) => {
                    setPosts(res)
                    setLoading(false)
                })
                .catch(() => {
                    router.push("/404")
                })
                .catch(() => setLoading(false))
        }
    }, [userLoading]);

    if (loading) {
        return (
            <ProtectedRoute>
                <h1>Loading...</h1>
            </ProtectedRoute>
        )
    }

    const rows = posts?.map((element) => (
        <Table.Tr key={element.title}>
            <Table.Td>{element.title}</Table.Td>
            <Table.Td>{element.body.replace(regex, "").slice(0, 120)}...</Table.Td>
            <Table.Td style={{
                display: 'flex', justifyContent: 'space-around', flexFlow: 'row', gap: '0.3rem'
            }}>
                <ActionIcon
                    component="a"
                    href={`/my-posts/${element.slug}`}
                    aria-label="Edit Post"
                    variant="filled">
                    <LuFileEdit style={{width: '70%', height: '70%'}}/>
                </ActionIcon>
                <ActionIcon component="a"
                            href={`/posts/${user?.profile.userName}/${element.slug}`}
                            aria-label="View Post"
                            variant="filled">
                    <LuEye style={{width: '70%', height: '70%'}}/>
                </ActionIcon>

                <ActionIcon component="button"
                            onClick={() => {
                                setToDelete(element.slug)
                                open()
                            }}
                            aria-label="View Post"
                            variant="filled"
                            color={"red"}
                >
                    <LuTrash2 style={{width: '70%', height: '70%'}}/>
                </ActionIcon>
            </Table.Td>
        </Table.Tr>
    ));

    return (
        <ProtectedRoute>
            <Table>
                <Table.Thead>
                    <Table.Tr>
                        <Table.Th>Title</Table.Th>
                        <Table.Th>Body</Table.Th>
                        <Table.Th>Actions</Table.Th>
                    </Table.Tr>
                </Table.Thead>
                <Table.Tbody>{rows}</Table.Tbody>
            </Table>
            <CustomModal title={"do you really want to delete this item?"} close={close} opened={opened}>
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.8rem',
                    alignItems: 'center'
                }}>
                    <h1>{toDelete}</h1>
                    <div style={{
                        display: 'flex', flexFlow: 'row', gap: '0.3rem'
                    }}>
                        <Button onClick={() => {
                            destroyPost(user?.profile.userName as string, toDelete as string)
                                .then(() => {
                                    setPosts((prevPosts) => prevPosts.filter((post) => post.slug !== toDelete));
                                    close()
                                })
                                .catch(err => console.log(err))
                        }}>Yes</Button>
                        <Button onClick={close}>no</Button>
                    </div>
                </div>
            </CustomModal>
        </ProtectedRoute>
    )
}