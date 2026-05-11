import { NextRequest, NextResponse } from 'next/server';
import { MercadoPagoConfig, Payment } from 'mercadopago';
import { prisma } from '@/lib/prisma';

const client = new MercadoPagoConfig({ 
    accessToken: process.env.MP_ACCESS_TOKEN || '' 
});

export async function POST(req: NextRequest) {
    try {
        const { email } = await req.json();

        if (!email) {
            return NextResponse.json({ error: 'Email  obrigatrio' }, { status: 400 });
        }

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            return NextResponse.json({ error: 'Usurio no encontrado' }, { status: 404 });
        }

        const payment = new Payment(client);

        const paymentData = {
            body: {
                transaction_amount: 9.90,
                description: 'Assinatura QR Premium - Mensal',
                payment_method_id: 'pix',
                payer: {
                    email: email,
                },
                notification_url: process.env.MP_WEBHOOK_URL,
                metadata: {
                    user_email: email,
                    user_id: user.id
                }
            }
        };

        const result = await payment.create(paymentData);

        return NextResponse.json({
            id: result.id,
            status: result.status,
            pix_qrcode: result.point_of_interaction?.transaction_data?.qr_code_base64,
            pix_copypaste: result.point_of_interaction?.transaction_data?.qr_code
        });

    } catch (error: any) {
        console.error('MP_CHECKOUT_ERROR', error);
        return NextResponse.json({ 
            error: 'Erro ao gerar pagamento', 
            details: error.message 
        }, { status: 500 });
    }
}
