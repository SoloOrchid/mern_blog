/**
 * This file exports middleware functions for authentication.
 */
import jwt from 'jsonwebtoken';
import prisma from "../config/prisma";
import {decryptToken} from "../utils/crypto";

export default async function verifyToken(req: any, res: any, next: any) {

    //use cookie if it exists
    const session = req.cookies?.session;
    if(session !== undefined) {
        const jwtCookie = decryptToken(session);
        const verifiedToken: any = jwt.verify(jwtCookie, process.env.JWT_SECRET as string);
        if('id' in verifiedToken) {
            req.userId = verifiedToken.id;
            req.user = await prisma.user.findFirstOrThrow({
                where: {
                    id: req.userId
                },
                include: {
                    roles: {
                        select: {
                            name: true,
                        }
                    }
                }
            })

            return next();
        }
    }

    //this should run if the cookie does not exist
    const token = req.header('Authorization');
    if (!token) return res.status(401).json({error: 'Access denied'});

    const cleanToken = token.replace('Bearer ', '')
    try {
        const verifiedToken: any = jwt.verify(cleanToken, process.env.JWT_SECRET as string);

        if('id' in verifiedToken) {
            req.userId = verifiedToken.id;
            req.user = await prisma.user.findFirstOrThrow({
                where: {
                    id: req.userId
                },
                include: {
                    roles: {
                        select: {
                            name: true,
                        }
                    }
                }
            })

            next();
        }else {
            return res.status(401).json({error: 'Unauthorized'});
        }
    } catch (error) {
        res.status(401).json({error: 'Unauthorized'});
    }
}