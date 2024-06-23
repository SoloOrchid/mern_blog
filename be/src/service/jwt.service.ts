import jwt from 'jsonwebtoken';
// import db from "../models";
import {decryptToken} from '../utils/crypto';
import prisma from '../config/prisma';

function generateToken(userId: number) {
    return jwt.sign({id: userId}, process.env.JWT_SECRET as string, {
        expiresIn: process.env.JWT_REFRESH_EXPIRATION
    });
}

const userIdFromToken = (token: string) => {
    const jwtCookie = decryptToken(token);
    const verifiedToken: any = jwt.verify(jwtCookie, process.env.JWT_SECRET as string);

    if('id' in verifiedToken) {
        return verifiedToken.id;
    }
}

async function verifyToken(token: string) {
    try {
        const invalidToken = await prisma.token.findFirstOrThrow(
            {
                where: {value: token}
            }
        )

        return true;
    } catch (err) {
        return false
    }

}


export {
    generateToken,
    userIdFromToken,
    verifyToken
}