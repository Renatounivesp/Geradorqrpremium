import { NextRequest, NextResponse } from 'next/server';
import { MercadoPagoConfig, Payment } from 'mercadopago';
import { prisma } from '@/lib/prisma';

const client = new MercadoPagoConfig({ 
    accessToken: process.env.MP_ACCESS_TOKEN || '' 
});

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        console.log('MP_WEBHOOK_RECEIVED', body);

        // Mercado Pago sends notifications for different topics
        // We only care about "payment"
        if (body.type === 'payment' || body.action === 'payment.created' || body.action === 'payment.updated') {
            const paymentId = body.data?.id || body.resource?.split('/').pop();

            if (!paymentId) return NextResponse.json({ message: 'No payment ID' });

            const payment = new Payment(client);
            const paymentInfo = await payment.get({ id: paymentId });

            if (paymentInfo.status === 'approved') {
                const userEmail = paymentInfo.metadata?.user_email;

                if (userEmail) {
                    await prisma.user.update({
                        where: { email: userEmail },
                        data: {
                            isSubscribed: true,
                            lastPaymentAt: new Date()
                        }
                    });
                    console.log(`User ${userEmail} subscription activated via Webhook`);
                }
            }
        }

        return NextResponse.json({ received: true });
    } catch (error: any) {
        console.error('MP_WEBHOOK_ERROR', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
