import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { hashPassword } from '@/lib/auth'

export async function POST(req: NextRequest) {
    try {
        const { token, newPassword } = await req.json()

        if (!token || !newPassword) {
            return NextResponse.json({ error: 'Token and new password are required' }, { status: 400 })
        }

        const user = await prisma.user.findFirst({
            where: {
                resetToken: token,
                resetTokenExpires: { gt: new Date() }
            }
        })

        if (!user) {
            return NextResponse.json({ error: 'Token inválido ou expirado.' }, { status: 400 })
        }

        const hashedPassword = await hashPassword(newPassword)

        await prisma.user.update({
            where: { id: user.id },
            data: {
                password: hashedPassword,
                resetToken: null,
                resetTokenExpires: null
            }
        })

        return NextResponse.json({ message: 'Senha atualizada com sucesso!' })
    } catch (error) {
        console.error('RESET_PASSWORD_ERROR', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
