"use client"

import CustomAppShell from "../../Layout/CustomAppShell";
import {Container, Button, Checkbox, Group, TextInput, PasswordInput} from '@mantine/core';
import { DateInput } from '@mantine/dates';
import {useState} from "react";
import dayjs from 'dayjs';
import api from "../../Utils/api";
import { useRouter } from 'next/navigation'
import {useAuth} from "../../Context/AuthContext";
import GuestRoute from "../../Components/GuestRoute/GuestRoute";

export default function Page() {
    const router = useRouter()
    const { login } = useAuth();


    const demoProps = {
        bg: 'var(--mantine-color-blue-light)',
        mt: 'md',
        p: 'md'
    };
    const [data, setData] = useState({
        email: '',
        password: ''
    })
    const [dob, setDob] = useState<Date | null>(null);



    const handleSignIn = async (e: { preventDefault: () => void; }) => {
        e.preventDefault()

        try {
            await login(data.email, data.password);
            router.replace('/')
        } catch (error) {
            console.log('Failed to login:', error);
        }
    }

    return (
        <GuestRoute>
            <Container {...demoProps}>
                <form onSubmit={handleSignIn}>
                    <TextInput
                        label="Email"
                        placeholder="your@email.com"
                        key={'email'}
                        onChange={(e) => setData({...data, email: e.target.value})}
                    />
                    <PasswordInput
                        label="Password"
                        description="Please choose a password that is at least 8 characters long, with one uppercase, lowercase and symbol"
                        key={'password'}
                        placeholder="Password"
                        onChange={(e) => setData({...data, password: e.target.value})}
                    />

                    <Group justify="flex-end" mt="md">
                        <Button type="submit">Submit</Button>
                    </Group>
                </form>
            </Container>
        </GuestRoute>
    )
}