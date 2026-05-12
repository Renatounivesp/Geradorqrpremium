import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { hashPassword, comparePasswords } from '@/lib/auth'

// GET: Check if user exists (to prevent accidental signups)
export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url)
        const email = searchParams.get('email')

        if (!email) {
            return NextResponse.json({ error: 'Email is required' }, { status: 400 })
        }

        const user = await prisma.user.findUnique({
            where: { email },
            select: { id: true, email: true, name: true, trialEndsAt: true, isSubscribed: true }
        })

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 })
        }

        return NextResponse.json(user)
    } catch (error) {
        console.error('USER_GET_ERROR', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}

// POST: Login or Register
export async function POST(req: NextRequest) {
    try {
        const { email, password, action, name } = await req.json()

        if (!email || !password) {
            return NextResponse.json({ error: 'Email and password are required' }, { status: 400 })
        }

        if (action === 'signup') {
            // Check if user already exists
            const existingUser = await prisma.user.findUnique({ where: { email } })
            if (existingUser) {
                return NextResponse.json({ error: 'Este e-mail já está cadastrado. Tente fazer login.' }, { status: 400 })
            }

            const hashedPassword = await hashPassword(password)
            const trialEndsAt = new Date()
            trialEndsAt.setDate(trialEndsAt.getDate() + 10) // 10 days trial

            const newUser = await prisma.user.create({
                data: {
                    email,
                    password: hashedPassword,
                    name: name || '',
                    trialEndsAt,
                }
            })

            return NextResponse.json(newUser)
        } else {
            // Login
            const user = await prisma.user.findUnique({
                where: { email },
                include: {
                    qrcodes: {
                        orderBy: { createdAt: 'desc' },
                        include: {
                            scansList: {
                                orderBy: { scannedAt: 'asc' }
                            }
                        }
                    }
                }
            })

            if (!user) {
                return NextResponse.json({ error: 'Usuário não encontrado. Verifique o e-mail ou crie uma conta.' }, { status: 404 })
            }

            // For existing users with no password (legacy), we allow them to set one or we handle it
            if (!user.password) {
                // Legacy user: set password on first login or redirect to set password
                // For simplicity, we'll set it now if it's the first time
                const hashedPassword = await hashPassword(password)
                await prisma.user.update({
                    where: { id: user.id },
                    data: { password: hashedPassword }
                })
                return NextResponse.json(user)
            }

            const isValid = await comparePasswords(password, user.password)
            if (!isValid) {
                return NextResponse.json({ error: 'Senha incorreta.' }, { status: 401 })
            }

            return NextResponse.json(user)
        }
    } catch (error) {
        console.error('USER_POST_ERROR', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
