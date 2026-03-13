import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params

        const qrCode = await prisma.qRCode.findUnique({
            where: { id },
            include: { user: true }
        })

        if (!qrCode || !qrCode.isDynamic || !qrCode.redirectUrl) {
            return NextResponse.json({ error: 'QR Code dinâmico não encontrado' }, { status: 404 })
        }

        // Business Rule: Only redirect if user has an active subscription or is in trial
        const now = new Date()
        const trialEnds = new Date(qrCode.user.trialEndsAt)
        const isTrialActive = now <= trialEnds
        const isSubscribed = qrCode.user.isSubscribed

        if (!isTrialActive && !isSubscribed) {
            // Redirect to an "Expired" or "Subscription Required" page
            // For now, we suggest the user to subscribe
            return NextResponse.redirect(new URL('/dashboard?error=subscription_expired', req.url))
        }

        // Increment scan count
        await prisma.qRCode.update({
            where: { id },
            data: { scans: { increment: 1 } }
        })

        // Redirect to the real destination
        let destination = qrCode.redirectUrl
        if (!destination.startsWith('http')) {
            destination = `https://${destination}`
        }

        return NextResponse.redirect(new URL(destination))
    } catch (error) {
        console.error('Error in dynamic redirect:', error)
        return NextResponse.json({ error: 'Erro interno ao redirecionar' }, { status: 500 })
    }
}
