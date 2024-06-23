import multer from 'multer';
import fs from 'fs';
import path from 'path';
import { Request } from 'express';
import {createSlug} from "../utils/createSlug";

// Define a type for the uploaded file
export interface MulterRequest extends Request {
    files: { [fieldname: string]: Express.Multer.File[] } | Express.Multer.File[];
}

// Configure multer storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadPath = path.join(__dirname, '../uploads'); // Adjust the path according to your project structure

        // Check if the uploads directory exists, if not, create it
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }

        cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        const name = createSlug(file.originalname)
        cb(null, Date.now() + '-' + name); // Generate a unique filename
    },
});

const upload = multer({ storage: storage });

export default upload;
