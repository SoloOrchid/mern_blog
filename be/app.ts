import { PrismaClient } from '@prisma/client'
import express, {Router} from 'express'
import cookieParser from 'cookie-parser';

const prisma = new PrismaClient();
const app = express()
app.use(express.json());
app.disable('x-powered-by')

app.use(cookieParser())
app.set('trust proxy', 1)

const port = 3000
const url = 'localhost'

/**
 * cors config
 */
import cors from 'cors'
const corsOptions = {
    origin: 'http://localhost:3001',
    credentials: true,
    optionsSuccessStatus: 200,
};
/**
 * import all routes
 */
app.use(cors(corsOptions))


import postsRoutes from "./src/routes/posts.routes";
import authRoutes from "./src/routes/auth.routes";
import userRoutes from "./src/routes/user.routes";
import categoryRoute from "./src/routes/category.route";
import fileRoute from "./src/routes/file.route";
import commentRoute from "./src/routes/comment.route";

app.use('/users', userRoutes)
app.use('/auth', authRoutes)
app.use('/posts', postsRoutes)
app.use('/categories', categoryRoute)
app.use('/public', fileRoute)
app.use('/comments', commentRoute)


app.listen(port, () => {
    console.log(`Server listening at http://${url}:${port}`)
});