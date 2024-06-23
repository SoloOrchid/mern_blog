"use client"

import CustomAppShell from "../../Layout/CustomAppShell";
import {useAuth} from "../../Context/AuthContext";
import {useRouter} from "next/navigation";
import {useEffect, useState} from "react";
import api from "../../Utils/api";
import ProtectedRoute from "../../Components/ProtectedRoute/ProtectedRoute";
import {Carousel} from '@mantine/carousel';
import '@mantine/carousel/styles.css';
import PostCard from "@/Components/PostCard/PostCard";
import {ActionIcon, Table} from "@mantine/core";
import {LuEye, LuFileEdit, LuTrash2} from "react-icons/lu";
import {User} from "@/types";


const regex = /(<([^>]+)>)/gi;
export default function Profile() {
    const [data, setData] = useState<User>()
    const {user} = useAuth()
    const router = useRouter()

    useEffect(() => {
        async function getUser() {
            const res = await api(`users`, {
                method: 'GET',
                credentials: 'include'
            })

            return res.json()
        }

        getUser().then(res => setData(res))
    }, []);

    const bookmarkRows = data?.bookmarked.map((element) => (
        <Table.Tr key={`${element.slug} ${element.user}`}>
            <Table.Td>{element.title}</Table.Td>
            <Table.Td>{element.body.replace(regex, "").slice(0, 120)}...</Table.Td>
            <Table.Td style={{
                display: 'flex', justifyContent: 'space-around', flexFlow: 'row', gap: '0.3rem'
            }}>
                <ActionIcon
                    component="a"
                    href={`/posts/${element.user}/${element.slug}`}
                    aria-label="Edit Post"
                    variant="filled">
                    <LuEye style={{width: '70%', height: '70%'}}/>
                </ActionIcon>
                <ActionIcon component="button"
                            onClick={() => {
                                api(`posts/${element.user}/${element.slug}/like`, {
                                    method: 'GET',
                                    credentials: 'include'
                                }).then(() => {
                                    setData({
                                        ...data,
                                        bookmarked: data?.bookmarked.filter(item => item.slug !== element.slug)
                                    })
                                })
                                    .catch((e) => {
                                        console.log(e)
                                    })
                            }}
                            aria-label="View Post"
                            variant="filled">
                    <LuFileEdit style={{width: '70%', height: '70%'}}/>
                </ActionIcon>
            </Table.Td>
        </Table.Tr>
    ));

    const commentRows = data?.commented.map((element) => (
        <Table.Tr key={`${element.slug} ${element.user}`}>
            <Table.Td>{element.title}</Table.Td>
            <Table.Td>{element.body.replace(regex, "").slice(0, 120)}...</Table.Td>
            <Table.Td style={{
                display: 'flex', justifyContent: 'space-around', flexFlow: 'row', gap: '0.3rem'
            }}>
                <ActionIcon
                    component="a"
                    href={`/posts/${element.user}/${element.slug}`}
                    aria-label="Edit Post"
                    variant="filled">
                    <LuEye style={{width: '70%', height: '70%'}}/>
                </ActionIcon>
            </Table.Td>
        </Table.Tr>
    ));

    return (
        <ProtectedRoute>
            <h1>{
                user?.profile?.name
            }</h1>

            <h2>Bookmarked</h2>
            { data?.bookmarked &&
                <Table>
                    <Table.Thead>
                        <Table.Tr>
                            <Table.Th>Title</Table.Th>
                            <Table.Th>Body</Table.Th>
                            <Table.Th>Actions</Table.Th>
                        </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>{bookmarkRows}</Table.Tbody>
                </Table>
            }
            <h2>recently commented</h2>
            {
                data?.commented &&
                <Table>
                    <Table.Thead>
                        <Table.Tr>
                            <Table.Th>Title</Table.Th>
                            <Table.Th>Body</Table.Th>
                            <Table.Th>Actions</Table.Th>
                        </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>{commentRows}</Table.Tbody>
                </Table>
            }
        </ProtectedRoute>
    )
}