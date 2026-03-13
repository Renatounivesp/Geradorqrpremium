import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
    try {
        const { email, name, content, category, isDynamic, fgColor, bgColor, logoUrl, frameStyle } = await req.json()

        // Find or create user
        let user = await prisma.user.findUnique({
            where: { email },
        })

        if (!user) {
            const trialDays = 40
            const trialEndsAt = new Date()
            trialEndsAt.setDate(trialEndsAt.getDate() + trialDays)

            user = await prisma.user.create({
                data: {
                    email,
                    name,
                    trialEndsAt,
                },
            })
        }

        // Check if user can create/active QR codes
        const now = new Date()
        const isTrialActive = now <= user.trialEndsAt
        const isActive = isTrialActive || user.isSubscribed

        if (!isActive) {
            return NextResponse.json(
                { error: 'Trial expired. Please subscribe to continue.' },
                { status: 403 }
            )
        }

        // Create the QR Code entry
        const qrCode = await prisma.qRCode.create({
            data: {
                name: name || `QR ${category} - ${new Date().toLocaleDateString()}`,
                content: 'temp', // We will update this if it's dynamic
                category: category || "URL",
                isDynamic: !!isDynamic,
                redirectUrl: isDynamic ? content : null,
                fgColor: fgColor || "#000000",
                bgColor: bgColor || "#FFFFFF",
                logoUrl: logoUrl || null,
                frameStyle: frameStyle || "none",
                userId: user.id,
            }
        })

        let finalContent = content
        if (isDynamic) {
            // For dynamic QR, the content is the internal redirect URL
            const protocol = req.nextUrl.protocol
            const host = req.nextUrl.host
            finalContent = `${protocol}//${host}/go/${qrCode.id}`
            
            // Update the QR code with the correct redirect URL content
            await prisma.qRCode.update({
                where: { id: qrCode.id },
                data: { content: finalContent }
            })
        } else {
            // If static, the content remains the original content
            await prisma.qRCode.update({
                where: { id: qrCode.id },
                data: { content: content }
            })
        }

        return NextResponse.json({ 
            qrCode: { ...qrCode, content: finalContent }
        })
    } catch (error) {
        console.error('QR_CREATE_ERROR', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
