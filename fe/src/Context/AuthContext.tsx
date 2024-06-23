"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
    profile: {
        id: string;
        userName: string;
        name: string;
        email: string;
        dob: Date;
    }
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
    fetchCurrentUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    const login = async (email: string, password: string) => {
        const response = await fetch('http://localhost:3000/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({ email, password }),
        });

        if (response.ok) {
            const userData = await response.json();
            setUser(userData);
        } else {
            throw new Error('Login failed');
        }
    };

    const logout = () => {
        fetch('http://localhost:3000/auth/logout', {
            method: 'POST',
            credentials: 'include',
        }).then(() => {
            setUser(null)
            localStorage.removeItem('user');
        });
    };

    const  fetchCurrentUser = async () => {
        const response = await fetch('http://localhost:3000/users/', {
            credentials: 'include',
        });
        if (response.ok) {
            const userData = await response.json();
            setUser(userData);
        }else {
            setUser(null)
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchCurrentUser();
    }, []);

    console.log(user)

    return (
        <AuthContext.Provider value={{ user, loading, login, logout, fetchCurrentUser }}>
            {children}
        </AuthContext.Provider>
    );
};
