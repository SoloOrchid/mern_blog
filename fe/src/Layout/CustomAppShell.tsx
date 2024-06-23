"use client"

import {useDisclosure} from '@mantine/hooks';
import Link from "next/link";
import {useAuth} from "@/Context/AuthContext";
import {AppShell, Menu, Button, Text, rem, Burger, Divider} from '@mantine/core';
import {usePathname} from 'next/navigation'

import {LuHome, LuListMinus, LuSettings} from "react-icons/lu";
import {LuSearch} from "react-icons/lu";
import {LuUser} from "react-icons/lu";
import {LuLogOut} from "react-icons/lu";
import {useRouter} from "next/navigation";
import {LuMenu} from "react-icons/lu";
import {LuFilePlus2} from "react-icons/lu";
import {LuLayoutList} from "react-icons/lu";


export default function CustomAppShell({children}: { children: any }) {
    const [opened, {toggle}] = useDisclosure();
    const {user: user, logout} = useAuth()
    const router = useRouter()
    const pathname = usePathname()

    const handleLogout = () => {
        logout()
        router.push('/')
    }

    return (
        <AppShell
            header={{height: 60}}
            navbar={{
                width: 300,
                breakpoint: 'sm',
                collapsed: {mobile: !opened},
            }}
            padding="md"
        >
            <AppShell.Header style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexDirection: 'row',
                padding: '0 1rem'
            }}>
                <Burger
                    opened={opened}
                    onClick={toggle}
                    hiddenFrom="sm"
                    size="sm"
                />
                <h1>MediumEcho</h1>
            </AppShell.Header>

            <AppShell.Navbar p="md" style={{
                display: 'flex',
                justifyContent: 'space-between',
            }}>
                <div style={{display: 'flex', flexDirection: 'column', gap: '2rem'}}>
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                    }}>
                        <Menu shadow="md" width={200}>
                            <Link href={'/'}>
                                <Menu.Item bg={pathname === '/' ? '#999' : 'white'}
                                           leftSection={<LuHome style={{width: rem(14), height: rem(14)}}/>}>
                                    Home
                                </Menu.Item>
                            </Link>

                            <Link href={'/posts'}>
                                <Menu.Item
                                    bg={pathname === '/posts' ? '#999' : 'white'}
                                    leftSection={<LuListMinus style={{width: rem(14), height: rem(14)}}/>}>
                                    Posts
                                </Menu.Item>
                            </Link>
                        </Menu>
                    </div>

                    {
                        user ?
                            <div>
                                <Divider my="md"/>
                                <p style={{fontWeight: 600, lineHeight: 0}}>Control Panel</p>
                                <Menu shadow="md" width={200}>
                                    <Link href={'/profile'}>
                                        <Menu.Item bg={pathname === '/profile' ? '#999' : 'white'}
                                                   leftSection={<LuUser style={{width: rem(14), height: rem(14)}}/>}>
                                            Profile
                                        </Menu.Item>
                                    </Link>

                                    <Link href={'/settings'}>
                                        <Menu.Item
                                            bg={pathname === '/settings' ? '#999' : 'white'}
                                            leftSection={<LuSettings style={{width: rem(14), height: rem(14)}}/>}>
                                            Settings
                                        </Menu.Item>
                                    </Link>

                                    <Menu.Divider/>

                                    <Menu.Label>Posts</Menu.Label>
                                    <Link href={'/posts/create'}>
                                        <Menu.Item
                                            bg={pathname === '/posts/create' ? '#999' : 'white'}
                                            leftSection={<LuFilePlus2 style={{width: rem(14), height: rem(14)}}/>}>
                                            Create Post
                                        </Menu.Item>
                                    </Link>
                                    <Link href={'/my-posts'}>
                                        <Menu.Item
                                            bg={pathname === '/my-posts' ? '#999' : 'white'}
                                            leftSection={<LuLayoutList style={{width: rem(14), height: rem(14)}}/>}>
                                            My Posts
                                        </Menu.Item>
                                    </Link>

                                    <Menu.Divider/>
                                </Menu>
                            </div>
                            : null
                    }
                </div>
                {
                    user ?
                        <div>
                            <Divider my="md"/>
                            <Button onClick={handleLogout} color={'red'} fullWidth>
                                Logout
                            </Button>
                        </div>
                        : <Link href={'/login'}><Button fullWidth>
                            Login
                        </Button>
                        </Link> 
                }

            </AppShell.Navbar>

            <AppShell.Main>{children}</AppShell.Main>
        </AppShell>
    );
}