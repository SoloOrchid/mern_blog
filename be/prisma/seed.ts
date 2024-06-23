import prisma from '../src/config/prisma'
import {faker} from '@faker-js/faker'
import bcrypt from 'bcrypt'
import {roles} from '../src/config/app'

const category = [
    'horror', 'teenage', 'romance', 'fiction',
    'nonfiction', 'thriller', 'historical', 'fantasy',
    'adventure', 'young adult', 'mystery', 'short story',
    'crime', 'sci-fi', 'memoir', 'history',
    'poetry'
];

async function main() {
    for(const index in category) {
        await prisma.category.create({
            data: {
                title: category[index]
            }
        })
    }

    for(const index in roles) {
        await prisma.role.create({
            data: {
                name: roles[index]
            }
        })
    }

    await prisma.user.create({
        data: {
            email: "admin@admin.com",
            dob: new Date(),
            name: "admin",
            userName: 'Raa',
            password: bcrypt.hashSync("pass", 10),
            roles: {
                connect: [
                    {
                        id: 1 //admin
                    }
                ]
            },
            files: {
                create: [
                    {
                        path: "default.jpeg"
                    }
                ]
            }
        }
    })

    await prisma.user.create({
        data: {
            email: "user@admin.com",
            dob: new Date(),
            name: "user",
            userName: 'user',
            password: bcrypt.hashSync("pass", 10),
            roles: {
                connect: [
                    {
                        id: 2 //admin
                    }
                ]
            },
            files: {
                create: [
                    {
                        path: "default.jpeg"
                    }
                ]
            }
        }
    })

        for(let i = 0; i <= 25; i++) {
            const title = faker.company.name();
            await prisma.post.create({
                data: {
                    title: title,
                    body: "<h2>Feel free to edit me as you wish!</h2><p>This is one awesome article</p><h3>Reasons why this article rocks</h3><ol><li><p>It just does!</p></li><li><p>Do I need more reasons?</p></li></ol><h2>Feel free to edit me as you wish!</h2><p>This is one awesome article</p><h3>Reasons why this article rocks</h3><ol><li><p>It just does!</p></li><li><p>Do I need more reasons?</p></li></ol>",
                    slug: title.toLowerCase().replace(/ /g, "-").replace(/[^\w-]+/g, ""),
                    userId: Math.random() > 0.5 ? 1 : 2,
                    category: {
                        connect: [
                            {
                                id: Math.floor(Math.random() * category.length) + 1,
                            },
                            {
                                id: Math.floor(Math.random() * category.length) + 1,
                            }
                        ]
                    },
                    fileId: 1
                }
            })
    }

    console.log({Seeder: "Database seeded and ready 🚀"})
}

main()
.then(async () => {
    await prisma.$disconnect()
})
.catch(async (e) => {
    console.log(e)
    await prisma.$disconnect()
    process.exit(1)
})