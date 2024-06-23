import prisma from '../config/prisma'
import {Request, Response} from "express";
import {generateToken} from '../service/jwt.service'
import bcrypt from 'bcrypt';
import * as encrypt from '../utils/crypto'

const register = async (req: Request, res: Response) => {
    const { name, email, password, dob, userName } = req.body;

    try {
        const existingUser = await prisma.user.findFirst({where: {email: req.body.email}});
        if (!!existingUser) {
            res.status(400).json({message: 'Email already exists.'});
            return;
        }

        //encrypt the password
        const encryptedPass = bcrypt.hashSync(password, 10);
        const user = await prisma.user.create({
            data: {
                name: name,
                userName: userName,
                dob: new Date(dob),
                email: email,
                password: encryptedPass
            }
        });

        const token = generateToken(user.id)
        res.cookie('session', encrypt.generateToken(token), {
            httpOnly: true,
            secure: true,
            sameSite: 'lax',
            maxAge: 24 * 60 * 60 * 1000 // 1 day
        })
        res.status(201).json({
            id: user.id,
            name: user.name,
            email: user.email,
            token: token
        });
    } catch (error) {
        res.status(500).json({message: error});
    }
};

const login = async (req: Request, res: Response) => {
    const {email, password} = req.body;

    try {
        const user = await prisma.user.findFirst({
            where: {email: email}
        });
        if (!user) {
            return res.json('Email not found').status(404);
        }

        // Verify password
        if (!bcrypt.compareSync(password, user.password)) {
            return res.status(404).json('Incorrect email and password combination');
        }

        const token = generateToken(user.id)
        res.cookie('session', encrypt.generateToken(token), {
            httpOnly: true,
            secure: true,
            sameSite: 'lax',
            maxAge: 24 * 60 * 60 * 1000 // 1 day
        })

        res.status(200).json({
            profile: {
                id: user.id,
                name: user.name,
                userName: user.userName,
                email: user.email,
                token: token
            }
        });
    } catch (err) {
        return res.status(500).json({errorMessage: err});
    }
}

const logout = async (req: Request, res: Response) => {
    try {
        const jwtCookie = encrypt.decryptToken(req.cookies.session);
        await prisma.token.create({
            data: {
                userId: Number(jwtCookie),
                value: jwtCookie,
            }
        })
    } catch (e) {
        return res.json({error: e}).status(500)
    }

    try {
        res.clearCookie('session')
        res.status(200).json('Logged out successfully')
    } catch (err) {
        res.status(500).json({errorMessage: err})
    }
}

export {
    register,
    login,
    logout
}
