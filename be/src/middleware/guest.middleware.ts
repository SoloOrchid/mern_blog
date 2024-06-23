/**
 * This file exports middleware functions for authentication.
 */
import jwt from 'jsonwebtoken';
import prisma from "../config/prisma";
import {decryptToken} from "../utils/crypto";

export default async function guest(req: any, res: any, next: any) {

    //use cookie if it exists
    const session = req.cookies?.session;
    if(session !== undefined) {
        const jwtCookie = decryptToken(session);
        const verifiedToken: any = jwt.verify(jwtCookie, process.env.JWT_SECRET as string);

        if('id' in verifiedToken) {
            return res.status(401).json({error: 'Already Authenticated'});
        }
    }

    //this should run if the cookie does not exist
    const token = req.header('Authorization');
    if (!token) return res.status(401).json({error: 'Access denied'});

    const cleanToken = token.replace('Bearer ', '')
    try {
        const verifiedToken: any = jwt.verify(cleanToken, process.env.JWT_SECRET as string);

        if('id' in verifiedToken) {
            return res.status(401).json({error: 'Already Authenticated'});
        }else {
            return next();
        }
    } catch (error) {
        res.status(401).json({error: 'Already Authenticated'});
    }
}