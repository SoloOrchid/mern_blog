import prisma from '../config/prisma'
import {Request, Response} from "express";
import {generateToken} from '../service/jwt.service'
import bcrypt from 'bcrypt';
import * as encrypt from '../utils/crypto'
import {decryptToken} from "../utils/crypto";
import jwt from "jsonwebtoken";


const authProfile = async (req: Request, res: Response) => {
    const session = req.cookies?.session;
    try {
        const jwtCookie = decryptToken(session);
        const verifiedToken: any = jwt.verify(jwtCookie, process.env.JWT_SECRET as string);
        if ('id' in verifiedToken) {
            const user = await prisma.user.findFirstOrThrow({
                where: {
                    id: verifiedToken.id
                },
                include: {
                    roles: {
                        select: {
                            name: true,
                        }
                    },
                    Post: {
                        orderBy: {
                            createdAt: 'desc'
                        },
                        select: {
                            title: true,
                            body: true,
                            slug: true,
                        }
                    },
                    Like: true,
                    Comment: true
                },
            })

            const liked = await prisma.post.findMany({
                where: {
                    id: {
                        in: user.Like.map((like) => like.postId)
                    }
                },
                include: {
                    user: {
                        select: {
                            name: true
                        }
                    },
                    File: {
                        select: {
                            path: true
                        }
                    }
                }
            })

            const commented = await prisma.comment.findMany({
                where: {
                    userId: user.id,
                },
                include: {
                    post: {
                        select: {
                            title: true,
                            body: true,
                            slug: true,
                            File: true
                        },
                    },
                    user: true
                }
            })

            const result = {
                profile: {
                    id: user.id,
                    name: user.name,
                    userName: user.userName,
                    email: user.email,
                    dob: user.dob,
                    roles: user.roles.map((role) => role.name)
                },
                bookmarked: liked.map((post) => ({
                    title: post.title,
                    body: post.body,
                    slug: post.slug,
                    user: post.user.name,
                    file: post.File.path
                })),
                commented: commented.map((comment) => ({
                    title: comment.post.title,
                    body: comment.post.body,
                    slug: comment.post.slug,
                    user: comment.user.userName
                }))
            }

            return res.status(200).json(result);
        }
        res.status(401).json({'error': "Access denied"});
    } catch (e) {
        console.error(e); // Log any unexpected error
        return res.status(500).json({error: e});
    }
};

const show = async (req: Request, res: Response) => {
    try {
        const user = await prisma.user.findFirst({
            where: {id: Number(req.params.id)}
        })

        res.json(user).status(200)
    } catch (e) {
        return res.json({error: e}).status(500)
    }
};

const update = async (req: Request, res: Response) => {
    const {name, email, dob, userName} = req.body

    const session = req.cookies?.session;
    try {
        const jwtCookie = decryptToken(session);
        const verifiedToken: any = jwt.verify(jwtCookie, process.env.JWT_SECRET as string);
        if ('id' in verifiedToken) {
            const user = await prisma.user.findFirstOrThrow({
                where: {
                    id: verifiedToken.id
                },
                include: {
                    roles: {
                        select: {
                            name: true,
                        }
                    }
                },
            })

            const updatedUser = await prisma.user.update({
                where: {
                    id: user.id
                },
                data: {
                    name,
                    email,
                    userName,
                    dob
                }
            })

            return res.status(200).json(updatedUser);
        }
    } catch (e) {
        console.log(e)
    }


    res.json('test').status(200)
}

const destroy = async (req: Request, res: Response) => {
    //
}

export {
    authProfile,
    show,
    update,
    destroy
}
