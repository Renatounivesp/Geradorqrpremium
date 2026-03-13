import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params

        if (!id) {
            return NextResponse.json({ error: 'ID do QR Code é obrigatório' }, { status: 400 })
        }

        await prisma.qRCode.delete({
            where: { id }
        })

        return NextResponse.json({ message: 'QR Code excluído com sucesso' })
    } catch (error) {
        console.error('Erro ao excluir QR Code:', error)
        return NextResponse.json({ error: 'Erro interno ao excluir QR Code' }, { status: 500 })
    }
}
