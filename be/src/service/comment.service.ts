/**
 * this is a future plan as well as liked on both posts and comments but its not really needed.
 */

import prisma from '../config/prisma'

const create = async (comment: string) => {
    return await prisma.comment.create({
        data: {
            comment: comment
        }
    })
}

const update = async (id: number, comment: string) => {
    return await prisma.comment.update({
        where: {id: id},
        data: {
            comment: comment
        }
    })
}

const destroy = async (id: number) => {
    await prisma.comment.delete({
        where: {id: id}
    })
}

export {
    create,
    update,
    destroy
}