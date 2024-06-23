"use client"

import CustomAppShell from "../../Layout/CustomAppShell";
import api from "../../Utils/api";
import React, {useEffect, useState} from "react";
import {useAuth} from "../../Context/AuthContext";
import {Button, Group, PasswordInput, TextInput} from "@mantine/core";
import {DateInput} from "@mantine/dates";
import dayjs from "dayjs";
import {useDisclosure} from "@mantine/hooks";


export default function Settings() {
    const {user, loading} = useAuth()
    const [visible, {toggle}] = useDisclosure(false);
    const [data, setData] = useState({
        email: '',
        name: '',
        password: '',
        passwordConfirm: '',
    });
    const [dob, setDob] = useState<Date | null>(null);

    useEffect(() => {
        if (user !== null) {
            setData({
                ...data,
                name: user.profile.name,
                email: user.profile.email,
            })
            setDob(new Date(user.profile.dob))
        }
    }, [loading]);

    if (loading) {
        return (
            <CustomAppShell>
                Loading...
            </CustomAppShell>
        )
    }

    const handleProfileUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const res = await api('users', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                ...data,
                dob: dayjs(dob).endOf('day').toDate()

            })
        })
    }

    return (
        <CustomAppShell>
            <form onSubmit={handleProfileUpdate}>
                <TextInput
                    withAsterisk
                    label="Name"
                    placeholder="Jhon"
                    key={'fname'}
                    value={data.name}
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
                    value={data.email}
                    label="Email"
                    placeholder="your@email.com"
                    key={'email'}
                    onChange={(e) => setData({...data, email: e.target.value})}
                />
                <PasswordInput
                    visible={visible}
                    onVisibilityChange={toggle}
                    label="Password"
                    description="Please choose a password that is at least 8 characters long, with one uppercase, lowercase and symbol"
                    key={'password'}
                    placeholder="Password"
                    onChange={(e) => setData({...data, password: e.target.value})}
                />
                <PasswordInput
                    visible={visible}
                    onVisibilityChange={toggle}
                    label="Password"
                    key={'passwordConfirm'}
                    placeholder="Password"
                    onChange={(e) => setData({...data, passwordConfirm: e.target.value})}/>
                <Group justify="flex-end" mt="md">
                    <Button type="submit">Submit</Button>
                </Group>
            </form>
        </CustomAppShell>
    )
}