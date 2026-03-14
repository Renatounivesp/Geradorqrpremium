import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url)
        const email = searchParams.get('email')

        if (!email) {
            return NextResponse.json({ error: 'Email is required' }, { status: 400 })
        }

        let user = await prisma.user.findUnique({
            where: { email },
            include: {
                qrcodes: {
                    orderBy: { createdAt: 'desc' }
                }
            }
        })

        // If user doesn't exist, create a new one (Seamless Sign Up/Login)
        if (!user) {
            const trialEndsAt = new Date()
            trialEndsAt.setDate(trialEndsAt.getDate() + 40) // 40 days trial

            user = await prisma.user.create({
                data: {
                    email,
                    trialEndsAt,
                },
                include: {
                    qrcodes: true
                }
            })
        }

        return NextResponse.json(user)
    } catch (error) {
        console.error('USER_GET_ERROR', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
