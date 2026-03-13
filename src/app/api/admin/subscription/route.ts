import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
    try {
        const auth = req.headers.get('Authorization')
        if (auth !== process.env.ADMIN_PASSWORD) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }
        
        const { userId, action } = await req.json()

        if (!userId || !action) {
            return NextResponse.json({ error: 'Missing userId or action' }, { status: 400 })
        }

        const isSubscribed = action === 'activate'

        const user = await prisma.user.update({
            where: { id: userId },
            data: {
                isSubscribed,
                lastPaymentAt: isSubscribed ? new Date() : undefined
            }
        })

        return NextResponse.json(user)
    } catch (error) {
        console.error('ADMIN_SUB_ERROR', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
