import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
    try {
        const { email } = await req.json()

        if (!email) {
            return NextResponse.json({ error: 'Email is required' }, { status: 400 })
        }

        const user = await prisma.user.update({
            where: { email },
            data: {
                isSubscribed: true,
                lastPaymentAt: new Date()
            }
        })

        return NextResponse.json({ message: 'Assinatura ativada com sucesso!', user })
    } catch (error) {
        console.error('USER_SUBSCRIBE_ERROR', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
