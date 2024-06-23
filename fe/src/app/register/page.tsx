"use client"

import CustomAppShell from "../../Layout/CustomAppShell";
import {Container, Button, Checkbox, Group, TextInput, PasswordInput} from '@mantine/core';
import { DateInput } from '@mantine/dates';
import {useState} from "react";
import dayjs from 'dayjs';
import api from "../../Utils/api";
import {useRouter} from "next/navigation";
import GuestRoute from "../../Components/GuestRoute/GuestRoute";

export default function Page() {
    const router = useRouter()
    const demoProps = {
        bg: 'var(--mantine-color-blue-light)',
        mt: 'md',
        p: 'md'
    };
    const [data, setData] = useState({
        name: '',
        dob: '',
        email: '',
        password: ''
    })
    const [dob, setDob] = useState<Date | null>(null);


    const handleSignup = async (e: { preventDefault: () => void; }) => {
        e.preventDefault()

        const res = await api('auth/register', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: data.name,
                dob: dayjs(dob).endOf('day').toDate(),
                email: data.email,
                password: data.password
            })
        })

        if(res.status === 201) {
            router.replace('/')
        }
    }

    return (
        <GuestRoute>
            <Container {...demoProps}>
                <form onSubmit={handleSignup}>
                    <TextInput
                        withAsterisk
                        label="Name"
                        placeholder="Jhon"
                        key={'fname'}
                        onChange={(e) => setData({...data, name: e.target.value})}
                    />
                    <DateInput
                        value={dob}
                        onChange={setDob}
                        maxDate={dayjs(new Date()).subtract(13, 'years').toDate()}
                        label="Date input"
                        placeholder="Date input"
                    />
                    <TextInput
                        withAsterisk
                        label="Email"
                        placeholder="your@email.com"
                        key={'email'}
                        onChange={(e) => setData({...data, email: e.target.value})}
                    />
                    <PasswordInput
                        withAsterisk
                        label="Password"
                        description="Please choose a password that is at least 8 characters long, with one uppercase, lowercase and symbol"
                        key={'password'}
                        placeholder="Password"
                        onChange={(e) => setData({...data, password: e.target.value})}
                    />

                    <Checkbox
                        mt="md"
                        label="I agree to the terms of service"
                        key={'termsOfService'}
                    />

                    <Group justify="flex-end" mt="md">
                        <Button type="submit">Submit</Button>
                    </Group>
                </form>
            </Container>
        </GuestRoute>
    )
}