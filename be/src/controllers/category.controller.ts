import {Request, Response} from 'express'
import prisma from '../config/prisma'
import {createSlug} from '../utils/createSlug'
import { userIdFromToken } from '../service/jwt.service'

const index = async (req: Request, res: Response) => {
    try {
        const response = await prisma.category.findMany()

        const result = response.map(item => item.title)

        res.json(result).status(200)
    } catch (e) {
        res.json({error: e}).status(500)
    }
}

const create = async (req: Request, res: Response) => {
    const { title } = req.body

    try {
        const category = await prisma.category.create({
            data: {
                title: title
            }
        })

        res.json(category).status(201)
    }catch(e) {
        res.json({error: e}).status(500)
    }
}

const update = async (req: Request, res: Response) => {
    const{ id } = req.params
    const {title} = req.body

    try {
        const updatedCategory = await prisma.category.update({
            where: {id: Number(id)},
            data: {
                title: title
            }
        })

        res.json(updatedCategory).status(200)

    }catch (e) {
        res.json({error: e}).status(500)
    }
}


const destroy = async (req: Request, res: Response) => {
    const {id} = req.params

    try {
        await prisma.category.delete({
            where: {id: Number(id)}
        })

        res.json('').status(204)
    }catch(e) {
        res.json({error: e}).send(500)
    }
}

export {
    index,
    create,
    update,
    destroy
}