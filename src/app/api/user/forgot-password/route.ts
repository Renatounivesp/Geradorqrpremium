import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { generateResetToken } from '@/lib/auth'

export async function POST(req: NextRequest) {
    try {
        const { email } = await req.json()

        if (!email) {
            return NextResponse.json({ error: 'Email is required' }, { status: 400 })
        }

        const user = await prisma.user.findUnique({ where: { email } })

        if (user) {
            const token = generateResetToken()
            const expires = new Date(Date.now() + 3600000) // 1 hour from now

            await prisma.user.update({
                where: { id: user.id },
                data: {
                    resetToken: token,
                    resetTokenExpires: expires
                }
            })

            // MOCK EMAIL SENDING
            console.log('------------------------------------------')
            console.log(`RESET PASSWORD LINK FOR ${email}:`)
            console.log(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/dashboard?token=${token}`)
            console.log('------------------------------------------')
        }

        // Always return success for security (don't reveal if email exists)
        return NextResponse.json({ message: 'Se este e-mail estiver cadastrado, você receberá um link de recuperação em instantes.' })
    } catch (error) {
        console.error('FORGOT_PASSWORD_ERROR', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
