import "@mantine/core/styles.css";
import React from "react";
import {MantineProvider, ColorSchemeScript} from "@mantine/core";
import {theme} from "../../theme";
import '../main.css'
import '@mantine/dates/styles.css';
import {AuthProvider} from "../Context/AuthContext";
import '@mantine/tiptap/styles.css';

export const metadata = {
    title: "Mantine Next.js template",
    description: "I am using Mantine with Next.js!",
};

export default function RootLayout({children}: { children: any }) {
    return (
        <html lang="en">
        <head>
            <ColorSchemeScript/>
            <link rel="shortcut icon" href="/favicon.svg"/>
            <meta
                name="viewport"
                content="minimum-scale=1, initial-scale=1, width=device-width, user-scalable=no"
            />
        </head>
        <body>
        <MantineProvider theme={theme}>
            <AuthProvider>
                {children}
            </AuthProvider>
        </MantineProvider>
        </body>
        </html>
    );
}
