import prisma from '../config/prisma'
import fs from 'fs';
import express from 'express';
import path from 'path';


type MimeTypesKeys = keyof typeof mimeTypes;
const mimeTypes = {
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.png': 'image/png',
};


const show = async (req: any, res: any) => {
    const {file} = req.params
    try {
        // Construct the file path
        const filePath = path.join(__dirname, '..', 'uploads', `/${String(file)}`);

        // Check if the file exists
        if (!fs.existsSync(filePath)) {
            return res.status(404).send('File not found');
        }

        // Read the file
        const fileData = fs.readFileSync(filePath);

        const ext = path.extname(filePath).toLowerCase() as MimeTypesKeys;

        // Get the MIME type for the file extension
        const contentType = mimeTypes[ext] || 'application/octet-stream';

        // Send the file as a response
        res.setHeader('Content-Type', contentType);
        res.send(fileData);
    }catch (e) {
        res.json(e).status(500)
    }
}

const update = async (req: any, res: any) => {
    res.json('file updated').status(201)
}

export {
    show,
    update
}