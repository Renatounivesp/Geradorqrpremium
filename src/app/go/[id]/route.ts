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

        // Capture Metadata
        const userAgent = req.headers.get('user-agent') || ''
        const ipAddress = req.headers.get('x-forwarded-for') || 'unknown'
        
        // Simple User Agent Parsing
        let device = 'Desktop'
        if (/Mobile|Android|iP(hone|od|ad)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(userAgent)) {
            device = 'Mobile'
        }
        
        let os = 'Unknown'
        if (userAgent.includes('Windows')) os = 'Windows'
        else if (userAgent.includes('Mac OS')) os = 'Mac OS'
        else if (userAgent.includes('Linux')) os = 'Linux'
        else if (userAgent.includes('Android')) os = 'Android'
        else if (userAgent.includes('iOS') || userAgent.includes('iPhone') || userAgent.includes('iPad')) os = 'iOS'

        // Log the detailed scan AND increment the total count counter
        await prisma.qRCode.update({
            where: { id },
            data: { 
                scans: { increment: 1 },
                scansList: {
                    create: {
                        ipAddress,
                        userAgent,
                        device,
                        os
                    }
                }
            }
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
