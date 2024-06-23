import {Request, Response} from 'express'
import prisma from '../config/prisma'
import {userIdFromToken} from "../service/jwt.service";

const getByPost = async (req: Request, res: Response) => {
    try {
        const { username, slug } = req.params

        const post = await prisma.post.findFirstOrThrow({
            where: {
                user: {
                    userName: username
                },
                slug: slug
            }
        })

        const response = await prisma.comment.findMany({
            where: {
                postId: post.id
            },
            include: {
                user: {
                    select: {
                        userName: true
                    }
                }
            }
        })

        const result = response.map(item => ({
            id:  item.id,
            comment: item.comment,
            author: item.user.userName,
            updatedAt: item.updatedAt
        }))

        res.status(200).json(result)
    } catch (error) {
        res.status(500).json(error)
    }
}

const create = async (req: Request, res: Response) => {
    const { comment } = req.body
    const { session } = req.cookies
    const { username, slug } = req.params

    try {
        const post = await prisma.post.findFirstOrThrow({
            where: {
                user: {
                    userName: username
                },
                slug: slug
            }
        })

        const response = await prisma.comment.create({
            data: {
                comment: comment,
                userId: userIdFromToken(session),
                postId: post.id
            },
            include: {
                user: {
                    select: {
                        userName: true
                    }
                }
            }
        })

        const result = {
            id: response.id,
            comment: response.comment,
            author: response.user.userName,
            updatedAt: response.updatedAt
        }

        res.status(201).json(result)
    } catch (error) {
        res.status(500).json(error)
    }
}

const update = async (req: Request, res: Response) => {
    try {
        const { id } = req.params
        const { comment } = req.body

        const response = await prisma.comment.update({
            where: {
                id: Number(id)
            },
            data: {
                comment: comment
            }
        })

        res.status(200).json(response)
    } catch (error) {
        res.status(500).json(error)
    }
}

const destroy = async (req: Request, res: Response) => {
    try {
        const { id } = req.params

        const response = await prisma.comment.delete({
            where: {
                id: Number(id)
            }
        })

        res.status(200).json(response)
    } catch (error) {
        res.status(500).json(error)
    }
}

export {
    getByPost,
    create,
    update,
    destroy
}