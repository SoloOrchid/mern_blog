import bcrypt from "bcrypt";
import * as crypto from "crypto";

function generateToken(token: string) {
    const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(process.env.ENCRYPTION_KEY as string, 'hex'), Buffer.alloc(16, 0));
    let encryptedToken = cipher.update(token, 'utf8', 'hex');
    encryptedToken += cipher.final('hex');

    return encryptedToken;
}

function decryptToken(token: string) {
    const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(process.env.ENCRYPTION_KEY as string, 'hex'), Buffer.alloc(16, 0));
    let decryptedToken = decipher.update(token, 'hex', 'utf8');
    decryptedToken += decipher.final('utf8');

    return decryptedToken;
}

export {
    generateToken,
    decryptToken
}