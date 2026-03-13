import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PATCH(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        const { redirectUrl } = await req.json()

        if (!id || !redirectUrl) {
            return NextResponse.json({ error: 'ID e novo destino são obrigatórios' }, { status: 400 })
        }

        const qrCode = await prisma.qRCode.findUnique({
            where: { id }
        })

        if (!qrCode || !qrCode.isDynamic) {
            return NextResponse.json({ error: 'QR Code dinâmico não encontrado' }, { status: 404 })
        }

        const updated = await prisma.qRCode.update({
            where: { id },
            data: { redirectUrl }
        })

        return NextResponse.json(updated)
    } catch (error) {
        console.error('Error updating QR Code:', error)
        return NextResponse.json({ error: 'Erro interno ao atualizar QR Code' }, { status: 500 })
    }
}
