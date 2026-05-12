import bcrypt from 'bcryptjs'
import crypto from 'crypto'

export async function hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10)
    return bcrypt.hash(password, salt)
}

export async function comparePasswords(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash)
}

export function generateResetToken(): string {
    return crypto.randomBytes(32).toString('hex')
}
