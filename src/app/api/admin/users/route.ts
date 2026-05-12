import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
    try {
        const auth = req.headers.get('Authorization')
        if (auth !== process.env.ADMIN_PASSWORD) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }
        const users = await prisma.user.findMany({
            include: {
                _count: {
                    select: { qrcodes: true }
                }
            },
            orderBy: { createdAt: 'desc' }
        })

        return NextResponse.json(users)
    } catch (error) {
        console.error('ADMIN_USERS_ERROR', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
export async function DELETE(req: NextRequest) {
    try {
        const auth = req.headers.get('Authorization')
        if (auth !== process.env.ADMIN_PASSWORD) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { searchParams } = new URL(req.url)
        const userId = searchParams.get('userId')

        if (!userId) {
            return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
        }

        // Delete user (Prisma will handle cascades if configured, but here we should be careful)
        // In our schema, QRCode has onDelete: Cascade for scans, but User -> QRCode might need manual or cascade
        // Let's check schema for User -> QRCode relation
        await prisma.user.delete({
            where: { id: userId }
        })

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('ADMIN_DELETE_USER_ERROR', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
