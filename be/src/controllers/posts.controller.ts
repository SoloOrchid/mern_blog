import {Request, Response} from 'express'
import prisma from '../config/prisma'
import {createSlug} from '../utils/createSlug'
import {userIdFromToken} from '../service/jwt.service'
import {MulterRequest} from '../middleware/upload';
import path from "path"; // Import the MulterRequest type

const index = async (req: Request, res: Response) => {
    try {
        const posts = await prisma.post.findMany({
            orderBy: [
                {
                    createdAt: 'desc'
                }
            ],
            include: {
                user: {
                    select: {
                        name: true,
                        userName: true,
                    }
                },
                category: {
                    select: {
                        title: true
                    }
                },
                File: {
                    select: {
                        path: true
                    }
                }
            },
        })

        const result = posts.map((post => ({
            title: post.title,
            slug: post.slug,
            body: post.body,
            user: post.user.userName,
            category: post.category.map((category) => category.title),
            image: post.File.path
        })))

        res.status(200).json(result)
    } catch (e) {
        res.status(500).json({error: e})
    }
}

const getByUser = async (req: Request, res: Response) => {
    const {username} = req.params

    try {
        const posts = await prisma.post.findMany({
            orderBy: [
                {
                    createdAt: 'desc'
                }
            ],
            where: {
                user: {
                    userName: String(username)
                }
            },
            include: {
                user: {
                    select: {
                        name: true,
                        userName: true,
                    }
                },
                category: {
                    select: {
                        title: true
                    }
                },
                File: {
                    select: {
                        path: true
                    }
                }
            }
        })

        const result = posts.map((post => ({
            title: post.title,
            slug: post.slug,
            body: post.body,
            user: post.user.userName,
            category: post.category.map((category) => category.title),
            image: post.File.path
        })))

        res.status(200).json(result)
    } catch (e) {
        res.status(500).json({error: e})
    }
}

const show = async (req: Request, res: Response) => {
    const {username, slug} = req.params

    try {
        const post = await prisma.post.findFirstOrThrow({
            orderBy: [
                {
                    createdAt: 'desc'
                }
            ],
            where: {slug: String(slug), user: {userName: String(username)}},
            include: {
                user: {
                    select: {
                        userName: true
                    }
                },
                category: {
                    select: {
                        title: true
                    }
                },
                File: {
                    select: {
                        path: true
                    }
                }
            }
        })

        const relative = [];
        for (const index in post.category) {
            const relativePost = await prisma.post.findMany({
                where: {
                    id: {
                        not: post.id
                    },
                    category: {
                        some: {
                            title: post.category[index].title
                        }
                    }
                },
                include: {
                    user: true,
                    category: true,
                    File: {
                        select: {
                            path: true
                        }
                    }
                },
                take: 2
            })

            if (relativePost.length >= 1) {
                relative.push(...relativePost)
            }
        }

        const result = {
            title: post.title,
            slug: post.slug,
            body: post.body,
            user: post.user.userName,
            category: post.category.map(item => item.title),
            image: post.File.path,
            relative: relative.map(item => (
                {
                    title: item.title,
                    slug: item.slug,
                    body: item.body,
                    user: item.user.userName,
                    category: item.category.map(item => item.title),
                    image: item.File.path
                }
            )),
        }

        res.json(result).status(200)
    } catch (e: unknown) {
        // @ts-ignore
        if (e.code === 'P2025') {
            res.status(404).json({error: 'Post not found'});
        } else {
            res.status(500).json({error: 'An unexpected error occurred'});
        }
    }
}

const liked = async (req: Request, res: Response) => {
    const { session } = req.cookies
    const { username, slug } = req.params

    try {
        const post = await prisma.post.findFirstOrThrow({
            where: {
                user: {
                    userName: String(username)
                },
                slug: slug
            }
        })

        let like = false
        const user = await prisma.user.findFirstOrThrow({
            where: {
                id: userIdFromToken(session)
            },
            include: {
                Like: true
            }
        })
        //check to see if the user is liking the same post
        like = !!user.Like.find(like => like.postId === post.id);

        res.status(200).json({liked: like})
    }catch (e) {
        res.status(500).json({error: e})
    }
}

const create = async (req: MulterRequest, res: Response) => {
    const {title, body, category} = req.body;
    const {session} = req.cookies;
    const userId = userIdFromToken(String(session));

    try {
        const slug = createSlug(title);

        // Split categories from the comma-separated string
        const categories = String(category).replace(/\s+/g, '').split(',');

        // Find or create categories in the database
        const categoryIds = [];
        for (const cat of categories) {
            let categoryRecord = await prisma.category.findFirst({
                where: {
                    title: cat
                }
            });

            if (!categoryRecord) {
                categoryRecord = await prisma.category.create({
                    data: {
                        title: cat
                    }
                });
            }

            categoryIds.push(categoryRecord.id);
        }

        let filePath: string | undefined;

        if (Array.isArray(req.files)) {
            // Handle the case where `req.files` is an array of files
            if (req.files.length > 0) {
                filePath = req.files[0].path;
            }
        } else {
            // Handle the case where `req.files` is an object with keys mapping to arrays of files
            const fileArray = req.files['image'];
            if (fileArray && fileArray.length > 0) {
                filePath = fileArray[0].path;
            }
        }

        if (!filePath) {
            return res.status(400).json({error: 'No image file provided'});
        }
        const postImage = await prisma.file.create({
            data: {
                userId: Number(userId),
                path: path.relative(__dirname + '/../uploads', filePath),
            },
        });

        const post = await prisma.post.create({
            data: {
                title: title,
                slug: slug,
                body: body,
                category: {
                    connect: categoryIds.map((id) => ({id: id}))
                },
                fileId: postImage.id,
                userId: Number(userIdFromToken(String(session)))
            }
        });

        const newPost = await prisma.post.findFirst({
            where: {
                id: post.id
            },
            include: {
                user: {
                    select: {
                        name: true,
                        userName: true
                    }
                },
                File: true,
                category: {
                    select: {
                        title: true
                    }
                }
            }
        })

        const result = {
            title: newPost?.title,
            slug: newPost?.slug,
            body: newPost?.body,
            user: newPost?.user.userName,
            category: newPost?.category.map(item => item.title),
            image: newPost?.File.path
        }

        res.status(200).json(result);
    } catch (e) {
        res.status(500).json(e);
    }
};

const update = async (req: Request, res: Response) => {
    const {username, slug} = req.params
    const {title, body, category: incomingCategories} = req.body
    const {session} = req.cookies //check if the user id matches up to the author of the post

    try {
        const post = await prisma.post.findFirstOrThrow({
            where: {
                user: {
                    userName: String(username)
                },
                slug: String(slug)
            },
            include: {
                category: true
            }
        })
        if (!post) {
            return res.status(404).json({error: 'Post not found'});
        }

        if (userIdFromToken(session) !== post.userId) {
            res.json({error: 'You do not have permission to perform this action'}).status(401)
        }

        let categoriesToConnect = []
        for (const index in incomingCategories) {
            const item = await prisma.category.findFirst({
                where: {
                    title: incomingCategories[index]
                }
            })

            if (item !== null) {
                categoriesToConnect.push(item.id)
            }
        }

        const newSlug = createSlug(title)
        const updatedPost = await prisma.post.update({
            where: {id: Number(post.id)},
            data: {
                title: title !== post.title ? title : post.title,
                slug: newSlug !== post.slug ? newSlug : post.slug,
                body: body !== post.body ? body : post.body,
                category: {
                    set: [],
                    connect: categoriesToConnect.map((id) => ({id: id}))
                },
            }
        })

        res.status(200).json(updatedPost)

    } catch (e) {
        res.status(500).json({error: e})
    }
}

const like = async (req: Request, res: Response) => {
    const {username, slug} = req.params
    const {session} = req.cookies
    const userId = userIdFromToken(session);
    try {
        const post = await prisma.post.findFirstOrThrow({
            where: {
                user: {
                    userName: String(username)
                },
                slug: String(slug)
            }
        })

        const likedPost = await prisma.like.findFirst({
            where: {
                postId: post.id,
                userId: userId
            }
        })

        if (!likedPost) {
            await prisma.like.create({
                data: {
                    userId: userId,
                    postId: post.id
                }
            })
        } else {
            await prisma.like.delete({
                where: {
                    id: likedPost.id
                }
            })
        }

        res.status(200).json('success')

    } catch (e) {
        res.status(500).json()
    }
}

const search = async (req: Request, res: Response) => {
    const {query} = req.params

    try {
        const posts = await prisma.post.findMany({
            where: {
                OR: [
                    {title: {contains: String(query)}},
                    {body: {contains: String(query)}},
                ],
            },
            include: {
                user: {
                    select: {
                        name: true,
                        userName: true,
                    }
                },
                category: {
                    select: {
                        title: true
                    }
                }
            }
        })

        const result = posts.map((post => ({
            title: post.title,
            slug: post.slug,
            body: post.body,
            user: post.user.userName,
            category: post.category.map((category) => category.title)
        })))

        res.status(200).json(result)

    } catch (e) {
        res.status(500).json()
    }
}

const destroy = async (req: Request, res: Response) => {
    const {username, slug} = req.params
    const {session} = req.cookies //check if the user id matches up to the author of the post

    try {
        const post = await prisma.post.findFirstOrThrow({
            where: {
                user: {
                    userName: String(username)
                },
                slug: String(slug)
            }
        })

        if (!post) {
            res.json("post not found").status(404);
        }

        //todo: let admin and service delete whatever post they want
        if (userIdFromToken(session) !== post.userId) {
            res.json({error: 'You do not have permission to perform this action'}).status(401)
        }

        await prisma.post.delete({
            where: {id: Number(post.id)}
        })

        res.status(204).json('')

    } catch (e) {
        res.status(500).json({error: e})
    }
}

export {
    index,
    show,
    create,
    update,
    like,
    liked,
    getByUser,
    search,
    destroy
}