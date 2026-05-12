'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
    QrCode, CreditCard, Clock, CheckCircle, AlertCircle, LogOut, 
    ExternalLink, Trash2, Edit2, Save, X, BarChart3, Smartphone, 
    Monitor, Download, Eye, Lock, Mail, User as UserIcon, 
    ArrowLeft, ChevronRight, Sparkles, Chrome
} from 'lucide-react'
import QRGenerator from '@/components/QRGenerator'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts'
import QRCode from 'qrcode'

export default function UserDashboard() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [name, setName] = useState('')
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [user, setUser] = useState<any>(null)
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState('')
    const [authMode, setAuthMode] = useState<'login' | 'signup' | 'forgot'>('login')
    
    // Recovery states
    const [recoveryEmail, setRecoveryEmail] = useState('')
    const [recoverySent, setRecoverySent] = useState(false)
    const [resetToken, setResetToken] = useState<string | null>(null)
    const [newPassword, setNewPassword] = useState('')

    const [editingQrId, setEditingQrId] = useState<string | null>(null)
    const [newRedirectUrl, setNewRedirectUrl] = useState('')
    const [chartData, setChartData] = useState<any[]>([])
    const [deviceData, setDeviceData] = useState<any[]>([])
    const [selectedQr, setSelectedQr] = useState<any | null>(null)
    const [previewQrDataUrl, setPreviewQrDataUrl] = useState<string>('')
    const [paymentData, setPaymentData] = useState<{ qrcode: string, copypaste: string } | null>(null)

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search)
        const token = urlParams.get('token')
        if (token) {
            setResetToken(token)
            setAuthMode('forgot')
        }

        const savedEmail = localStorage.getItem('qr_user_email')
        if (savedEmail) {
            setEmail(savedEmail)
        }
    }, [])

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setMessage('')
        try {
            const res = await fetch('/api/user', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    email, 
                    password, 
                    action: authMode,
                    name: authMode === 'signup' ? name : undefined 
                })
            })
            const data = await res.json()
            if (res.ok) {
                setUser(data)
                setIsLoggedIn(true)
                localStorage.setItem('qr_user_email', email)
            } else {
                setMessage(data.error || 'Erro na autenticação.')
            }
        } catch (error) {
            console.error('Auth error', error)
            setMessage('Erro de conexão.')
        } finally {
            setLoading(false)
        }
    }

    const handleGoogleLogin = () => {
        alert('Integração com Google em andamento. Use e-mail e senha por enquanto!')
    }

    const handleForgotPassword = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        try {
            const res = await fetch('/api/user/forgot-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: recoveryEmail })
            })
            const data = await res.json()
            setRecoverySent(true)
            setMessage(data.message)
        } catch (error) {
            setMessage('Erro ao processar solicitação.')
        } finally {
            setLoading(false)
        }
    }

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        try {
            const res = await fetch('/api/user/reset-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token: resetToken, newPassword })
            })
            const data = await res.json()
            if (res.ok) {
                alert('Senha atualizada com sucesso! Faça login agora.')
                setAuthMode('login')
                setResetToken(null)
                window.history.replaceState({}, '', '/dashboard')
            } else {
                setMessage(data.error)
            }
        } catch (error) {
            setMessage('Erro ao atualizar senha.')
        } finally {
            setLoading(false)
        }
    }

    const handleLogout = () => {
        setIsLoggedIn(false)
        setUser(null)
        setPassword('')
        localStorage.removeItem('qr_user_email')
    }

    const handleSubscribe = async () => {
        setLoading(true)
        try {
            const res = await fetch('/api/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: user.email })
            })
            const data = await res.json()
            if (res.ok) {
                setPaymentData({
                    qrcode: data.pix_qrcode,
                    copypaste: data.pix_copypaste
                })
            } else {
                alert('Erro ao gerar pagamento: ' + (data.details || data.error || 'Erro desconhecido'));
            }
        } catch (error: any) {
            console.error('Subscription error', error)
            alert('Erro na conexão: ' + error.message);
        } finally {
            setLoading(false)
        }
    }

    const handleDeleteQR = async (qrId: string) => {
        if (!window.confirm('Tem certeza que deseja excluir este QR Code?')) return
        try {
            const res = await fetch(`/api/qrcode/${qrId}`, { method: 'DELETE' })
            if (res.ok) {
                setUser({ ...user, qrcodes: user.qrcodes.filter((qr: any) => qr.id !== qrId) })
            }
        } catch (error) {
            console.error('Delete error', error)
        }
    }

    const handleUpdateRedirect = async (qrId: string) => {
        setLoading(true)
        try {
            const res = await fetch(`/api/qrcode/${qrId}/update`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ redirectUrl: newRedirectUrl })
            })
            if (res.ok) {
                setUser({
                    ...user,
                    qrcodes: user.qrcodes.map((qr: any) => 
                        qr.id === qrId ? { ...qr, redirectUrl: newRedirectUrl } : qr
                    )
                })
                setEditingQrId(null)
                setMessage('Destino atualizado com sucesso!')
                setTimeout(() => setMessage(''), 3000)
            }
        } catch (error) {
            console.error('Update error', error)
        } finally {
            setLoading(false)
        }
    }

    const openQrPreview = async (qr: any) => {
        setSelectedQr(qr);
        const urlToEncode = qr.isDynamic 
            ? `${window.location.origin}/go/${qr.id}` 
            : qr.content;
        try {
            const dataUrl = await QRCode.toDataURL(urlToEncode, {
                width: 800,
                margin: 2,
                color: {
                    dark: qr.fgColor || '#000000',
                    light: qr.bgColor || '#ffffff',
                },
                errorCorrectionLevel: qr.logoUrl ? 'H' : 'M'
            });
            setPreviewQrDataUrl(dataUrl);
        } catch (err) {
            console.error(err);
        }
    }

    useEffect(() => {
        if (user?.qrcodes) {
            const last7Days = Array.from({length: 7}, (_, i) => {
                const d = new Date()
                d.setDate(d.getDate() - (6 - i))
                return {
                    date: d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
                    scans: 0
                }
            })
            let desktop = 0, mobile = 0;
            user.qrcodes.forEach((qr: any) => {
                if (qr.scansList) {
                    qr.scansList.forEach((scan: any) => {
                        if (scan.device?.toLowerCase() === 'mobile') mobile++
                        else desktop++
                        const dateStr = new Date(scan.scannedAt).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })
                        const dayItem = last7Days.find(d => d.date === dateStr)
                        if (dayItem) dayItem.scans += 1
                    })
                }
            })
            setChartData(last7Days)
            setDeviceData([
                { name: 'Mobile', value: mobile, color: '#10b981' },
                { name: 'Desktop', value: desktop, color: '#3b82f6' }
            ])
        }
    }, [user])

    if (!isLoggedIn) {
        return (
            <main style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', background: 'radial-gradient(circle at 50% 50%, #1e1b4b 0%, #020617 100%)' }}>
                <div className="glass-card animate-fade-in" style={{ maxWidth: '480px', width: '100%', padding: '0', overflow: 'hidden', position: 'relative' }}>
                    
                    {/* Header Image/Pattern */}
                    <div style={{ height: '120px', background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                         <div style={{ width: '60px', height: '60px', background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(10px)', borderRadius: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 16px rgba(0,0,0,0.2)' }}>
                            <QrCode size={32} color="white" />
                         </div>
                    </div>

                    <div style={{ padding: '2.5rem' }}>
                        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                            <h1 style={{ fontSize: '1.75rem', fontWeight: 900, marginBottom: '0.5rem', color: 'white' }}>
                                {authMode === 'forgot' ? 'Recuperar Senha' : 'Painel QR Premium'}
                            </h1>
                            <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Acesse sua conta profissional</p>
                        </div>

                        {/* Tabs */}
                        {authMode !== 'forgot' && (
                            <div style={{ display: 'flex', background: 'rgba(0,0,0,0.3)', borderRadius: '0.75rem', padding: '0.25rem', marginBottom: '2.5rem' }}>
                                <button 
                                    onClick={() => setAuthMode('login')}
                                    style={{ 
                                        flex: 1, 
                                        height: '42px', 
                                        borderRadius: '0.6rem', 
                                        border: 'none', 
                                        fontSize: '0.9rem', 
                                        fontWeight: 700,
                                        cursor: 'pointer',
                                        transition: 'all 0.2s',
                                        background: authMode === 'login' ? 'var(--primary)' : 'transparent',
                                        color: authMode === 'login' ? 'white' : '#64748b'
                                    }}
                                >
                                    Entrar
                                </button>
                                <button 
                                    onClick={() => setAuthMode('signup')}
                                    style={{ 
                                        flex: 1, 
                                        height: '42px', 
                                        borderRadius: '0.6rem', 
                                        border: 'none', 
                                        fontSize: '0.9rem', 
                                        fontWeight: 700,
                                        cursor: 'pointer',
                                        transition: 'all 0.2s',
                                        background: authMode === 'signup' ? 'var(--primary)' : 'transparent',
                                        color: authMode === 'signup' ? 'white' : '#64748b'
                                    }}
                                >
                                    Cadastrar
                                </button>
                            </div>
                        )}

                        {message && (
                            <div style={{ 
                                background: message.includes('sucesso') || message.includes('enviará') ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)', 
                                color: message.includes('sucesso') || message.includes('enviará') ? '#10b981' : '#ef4444', 
                                padding: '0.75rem 1rem', 
                                borderRadius: '0.75rem', 
                                marginBottom: '2rem', 
                                fontSize: '0.85rem',
                                textAlign: 'center',
                                border: '1px solid rgba(255,255,255,0.05)'
                            }}>
                                {message}
                            </div>
                        )}

                        <form onSubmit={handleAuth} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                            {authMode === 'signup' && (
                                <div style={{ position: 'relative' }}>
                                    <UserIcon size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#475569', zIndex: 1 }} />
                                    <input className="input" type="text" name="name" autoComplete="name" placeholder="Seu nome" value={name} onChange={e => setName(e.target.value)} required style={{ paddingLeft: '3rem' }} />
                                </div>
                            )}

                            <div style={{ position: 'relative' }}>
                                <Mail size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#475569', zIndex: 1 }} />
                                <input className="input" type="email" name="email" autoComplete="email" placeholder="E-mail" value={email} onChange={e => setEmail(e.target.value)} required style={{ paddingLeft: '3rem' }} />
                            </div>

                            {authMode !== 'forgot' && (
                                <div style={{ position: 'relative' }}>
                                    <Lock size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#475569', zIndex: 1 }} />
                                    <input className="input" type="password" name="password" autoComplete={authMode === 'login' ? 'current-password' : 'new-password'} placeholder="Senha" value={password} onChange={e => setPassword(e.target.value)} required style={{ paddingLeft: '3rem' }} />
                                </div>
                            )}

                            {authMode === 'login' && (
                                <div style={{ textAlign: 'right' }}>
                                    <button type="button" onClick={() => setAuthMode('forgot')} style={{ background: 'transparent', border: 'none', color: '#64748b', fontSize: '0.75rem', cursor: 'pointer' }}>
                                        Esqueceu a senha?
                                    </button>
                                </div>
                            )}

                            <button className="btn" style={{ marginTop: '0.5rem' }} disabled={loading}>
                                {loading ? 'Aguarde...' : authMode === 'login' ? 'Entrar no Sistema' : authMode === 'signup' ? 'Criar Minha Conta' : 'Recuperar'}
                            </button>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', margin: '0.5rem 0' }}>
                                <div style={{ flex: 1, height: '1px', background: 'var(--border-glass)' }} />
                                <span style={{ fontSize: '0.7rem', color: '#475569', fontWeight: 800 }}>OU</span>
                                <div style={{ flex: 1, height: '1px', background: 'var(--border-glass)' }} />
                            </div>

                            <button 
                                type="button" 
                                onClick={handleGoogleLogin}
                                className="btn" 
                                style={{ background: 'white', color: '#1e293b', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}
                            >
                                <Chrome size={20} color="#4285F4" /> Continuar com Google
                            </button>
                        </form>

                        {authMode === 'forgot' && (
                            <button type="button" onClick={() => setAuthMode('login')} style={{ display: 'block', margin: '2rem auto 0', background: 'transparent', border: 'none', color: 'var(--primary)', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer' }}>
                                Voltar para o Login
                            </button>
                        )}
                        
                        <div style={{ marginTop: '3rem', textAlign: 'center' }}>
                            <Link href="/" style={{ color: '#475569', fontSize: '0.8rem', textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                                <ArrowLeft size={14} /> Voltar para o site
                            </Link>
                        </div>
                    </div>
                </div>
            </main>
        )
    }

    const trialEnds = new Date(user.trialEndsAt)
    const isTrialActive = new Date() <= trialEnds
    const status = user.isSubscribed ? 'ASSINANTE PREMIUM' : (isTrialActive ? 'PERÍODO TRIAL' : 'CONTA EXPIRED')

    return (
        <main style={{ padding: '2rem 1rem', maxWidth: '1200px', margin: '0 auto', minHeight: '100vh' }}>
            {/* Top Bar */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem', flexWrap: 'wrap', gap: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ width: '48px', height: '48px', background: 'linear-gradient(135deg, var(--primary), var(--secondary))', borderRadius: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 16px rgba(99, 102, 241, 0.3)' }}>
                        <QrCode size={24} color="white" />
                    </div>
                    <div>
                        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, margin: 0 }}>Olá, {user.name?.split(' ')[0] || 'Usuário'}</h1>
                        <p style={{ color: '#94a3b8', fontSize: '0.85rem', margin: 0 }}>Gestão de QR Codes & Inteligência</p>
                    </div>
                </div>
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                    <button onClick={handleLogout} className="btn" style={{ background: 'rgba(239, 68, 68, 0.05)', border: '1px solid rgba(239, 68, 68, 0.15)', color: '#ef4444', boxShadow: 'none', width: 'auto', padding: '0 1.5rem' }}>
                        <LogOut size={16} /> <span className="desktop-only">Sair</span>
                    </button>
                </div>
            </div>

            {message && (
                <div className="animate-fade-in" style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', padding: '1rem', borderRadius: '1rem', marginBottom: '2rem', textAlign: 'center', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                    {message}
                </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem', marginBottom: '4rem' }}>
                {/* Subscription Card */}
                <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>
                    <div style={{ position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', background: user.isSubscribed ? 'var(--success)' : (isTrialActive ? 'var(--primary)' : 'var(--error)') }} />
                    
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                        <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700 }}>Minha Assinatura</h3>
                        <span style={{ 
                            fontSize: '0.7rem', 
                            padding: '0.35rem 0.75rem', 
                            borderRadius: '2rem', 
                            background: user.isSubscribed ? 'rgba(16, 185, 129, 0.15)' : 'rgba(99, 102, 241, 0.15)',
                            color: user.isSubscribed ? 'var(--success)' : 'var(--primary)',
                            fontWeight: 800,
                            letterSpacing: '0.05em'
                        }}>
                            {status}
                        </span>
                    </div>

                    {!user.isSubscribed ? (
                        <>
                            <div style={{ marginBottom: '2rem' }}>
                                <p style={{ fontSize: '0.9rem', color: '#94a3b8', lineHeight: 1.6, margin: '0 0 1rem 0' }}>
                                    {isTrialActive 
                                        ? `Seu trial gratuito termina em ${trialEnds.toLocaleDateString('pt-BR')}.`
                                        : 'Seu período de teste expirou.'
                                    }
                                </p>
                                <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1.25rem', borderRadius: '1rem', border: '1px solid var(--border-glass)' }}>
                                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.25rem' }}>
                                        <span style={{ fontSize: '1.5rem', fontWeight: 800 }}>R$ 9,90</span>
                                        <span style={{ fontSize: '0.8rem', color: '#64748b' }}>/mês</span>
                                    </div>
                                    <p style={{ fontSize: '0.75rem', color: '#64748b', margin: '0.5rem 0 0 0' }}>Acesso vitalício, dinâmico e 4K.</p>
                                </div>
                            </div>
                            <button className="btn" style={{ width: '100%' }} onClick={handleSubscribe} disabled={loading}>
                                <CreditCard size={18} />
                                {loading ? 'Gerando Pix...' : 'Ativar Premium agora'}
                            </button>
                        </>
                    ) : (
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginBottom: '1.5rem' }}>
                                <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <CheckCircle size={28} color="var(--success)" />
                                </div>
                                <div>
                                    <p style={{ margin: 0, fontWeight: 700, fontSize: '1rem' }}>Premium Ativo</p>
                                    <p style={{ margin: 0, fontSize: '0.8rem', color: '#94a3b8' }}>Acesso total liberado</p>
                                </div>
                            </div>
                            <p style={{ fontSize: '0.85rem', color: '#64748b', lineHeight: 1.5 }}>
                                Sua assinatura está em dia. Continue criando QR Codes ilimitados com alta performance.
                            </p>
                        </div>
                    )}
                </div>

                {/* Stats Card */}
                <div className="glass-card" style={{ gridColumn: 'span 2' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2.5rem' }}>
                        <div>
                            <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <BarChart3 size={20} color="var(--primary)" /> Insights de Acesso
                            </h3>
                            <p style={{ color: '#64748b', fontSize: '0.8rem', margin: 0 }}>Desempenho dos seus códigos nos últimos 7 dias</p>
                        </div>
                        <div style={{ display: 'flex', gap: '1.5rem' }}>
                            <div style={{ textAlign: 'right' }}>
                                <span style={{ color: '#64748b', fontSize: '0.7rem', textTransform: 'uppercase', fontWeight: 700 }}>Total Scans</span>
                                <p style={{ margin: 0, fontSize: '1.5rem', fontWeight: 900, color: 'var(--success)' }}>
                                    {user.qrcodes?.reduce((acc: number, qr: any) => acc + (qr.scans || 0), 0) || 0}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '2.5rem' }}>
                        <div style={{ height: '180px', width: '100%' }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={chartData}>
                                    <defs>
                                        <linearGradient id="colorScans" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3}/>
                                            <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <XAxis dataKey="date" hide />
                                    <YAxis hide />
                                    <Tooltip 
                                        contentStyle={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.75rem', fontSize: '0.8rem' }}
                                        itemStyle={{ color: 'var(--primary)' }}
                                    />
                                    <Area type="monotone" dataKey="scans" stroke="var(--primary)" strokeWidth={3} fillOpacity={1} fill="url(#colorScans)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '1rem' }}>
                            {deviceData.map((d, i) => (
                                <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(255,255,255,0.02)', padding: '0.75rem 1rem', borderRadius: '0.75rem', border: '1px solid var(--border-glass)' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                        {d.name === 'Mobile' ? <Smartphone size={16} color={d.color} /> : <Monitor size={16} color={d.color} />}
                                        <span style={{ fontSize: '0.85rem', fontWeight: 500 }}>{d.name}</span>
                                    </div>
                                    <span style={{ fontWeight: 800, color: d.color }}>{d.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div style={{ marginBottom: '5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
                    <div style={{ padding: '0.5rem', background: 'rgba(99, 102, 241, 0.1)', borderRadius: '0.5rem' }}>
                        <Sparkles size={20} color="var(--primary)" />
                    </div>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 800, margin: 0 }}>Criar novo QR Code</h2>
                </div>
                <QRGenerator defaultEmail={user.email} onGenerated={() => {
                    fetch(`/api/user?email=${user.email}`).then(res => res.json()).then(data => setUser(data))
                }} />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
                <div style={{ padding: '0.5rem', background: 'rgba(168, 85, 247, 0.1)', borderRadius: '0.5rem' }}>
                    <QrCode size={20} color="var(--secondary)" />
                </div>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 800, margin: 0 }}>Meus QR Codes</h2>
            </div>

            {user.qrcodes?.length > 0 ? (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1.5rem' }}>
                    {user.qrcodes.map((qr: any) => (
                        <div key={qr.id} className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', transition: 'all 0.3s' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                                <div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                                        {qr.isDynamic && (
                                            <span style={{ fontSize: '0.6rem', background: 'var(--primary)', color: 'white', padding: '0.15rem 0.5rem', borderRadius: '1rem', fontWeight: 800 }}>DINÂMICO</span>
                                        )}
                                        <span style={{ fontSize: '0.65rem', color: '#64748b', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{qr.category}</span>
                                    </div>
                                    <h4 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 700 }}>{qr.name}</h4>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <span style={{ fontSize: '0.7rem', color: '#64748b', display: 'block', marginBottom: '0.25rem' }}>{new Date(qr.createdAt).toLocaleDateString('pt-BR')}</span>
                                    <span style={{ fontSize: '0.85rem', color: 'var(--success)', fontWeight: 800 }}>{qr.scans || 0} scans</span>
                                </div>
                            </div>

                            {qr.isDynamic && (
                                <div style={{ marginBottom: '1.5rem', background: 'rgba(255,255,255,0.02)', padding: '1rem', borderRadius: '1rem', border: '1px solid var(--border-glass)' }}>
                                    <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.7rem', color: '#64748b', fontWeight: 700 }}>DESTINO:</p>
                                    {editingQrId === qr.id ? (
                                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                                            <input className="input" style={{ margin: 0, padding: '0.5rem', fontSize: '0.8rem', height: '38px', flex: 1 }} value={newRedirectUrl} onChange={e => setNewRedirectUrl(e.target.value)} />
                                            <button className="btn" style={{ padding: '0.5rem', height: '38px', width: 'auto' }} onClick={() => handleUpdateRedirect(qr.id)}><Save size={16}/></button>
                                            <button className="btn" style={{ padding: '0.5rem', height: '38px', background: 'transparent', boxShadow: 'none', width: 'auto' }} onClick={() => setEditingQrId(null)}><X size={16}/></button>
                                        </div>
                                    ) : (
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
                                            <span style={{ fontSize: '0.85rem', color: '#f1f5f9', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{qr.redirectUrl}</span>
                                            <button 
                                                style={{ background: 'transparent', border: 'none', color: 'var(--primary)', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: '0.5rem', borderRadius: '0.5rem', transition: 'background 0.2s' }}
                                                onClick={() => { setEditingQrId(qr.id); setNewRedirectUrl(qr.redirectUrl); }}
                                                className="hover-bg-glass"
                                            >
                                                <Edit2 size={16} />
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}

                            <div style={{ display: 'flex', gap: '0.75rem', marginTop: 'auto' }}>
                                <button className="btn" style={{ padding: '0.65rem 1rem', fontSize: '0.85rem', flex: 1, background: 'rgba(255,255,255,0.05)', boxShadow: 'none', border: '1px solid var(--border-glass)' }} onClick={() => openQrPreview(qr)}>
                                    <Eye size={18} /> Ver QR
                                </button>
                                <button className="btn" style={{ padding: '0.65rem', background: 'rgba(239, 68, 68, 0.05)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.1)', boxShadow: 'none', width: 'auto' }} onClick={() => handleDeleteQR(qr.id)}>
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="glass-card" style={{ textAlign: 'center', padding: '5rem 2rem', border: '2px dashed var(--border-glass)', background: 'transparent' }}>
                    <div style={{ width: '80px', height: '80px', background: 'rgba(255,255,255,0.02)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2rem auto' }}>
                        <QrCode size={40} color="#334155" />
                    </div>
                    <h3 style={{ margin: '0 0 0.5rem 0' }}>Nenhum QR Code gerado</h3>
                    <p style={{ color: '#64748b', marginBottom: '2rem', fontSize: '0.9rem' }}>Seus códigos salvos aparecerão aqui para gestão e análise.</p>
                    <button onClick={() => window.scrollTo({ top: 400, behavior: 'smooth' })} className="btn" style={{ width: 'auto', padding: '0 2rem' }}>Criar meu primeiro QR</button>
                </div>
            )}

            {/* Modal de Preview do QR Code */}
            {selectedQr && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(2, 6, 23, 0.9)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1.5rem' }} onClick={() => setSelectedQr(null)}>
                    <div className="glass-card animate-fade-in" style={{ maxWidth: '450px', width: '100%', textAlign: 'center', position: 'relative', border: '1px solid rgba(255,255,255,0.1)', padding: '2.5rem' }} onClick={e => e.stopPropagation()}>
                        <button onClick={() => setSelectedQr(null)} style={{ position: 'absolute', top: '1.25rem', right: '1.25rem', background: 'rgba(255,255,255,0.05)', border: 'none', color: '#94a3b8', cursor: 'pointer', width: '36px', height: '36px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <X size={20} />
                        </button>
                        
                        <div style={{ marginBottom: '2rem' }}>
                            <h3 style={{ marginBottom: '0.5rem', fontSize: '1.25rem' }}>{selectedQr.name}</h3>
                            <div style={{ padding: '0.5rem 1rem', background: 'rgba(0,0,0,0.2)', borderRadius: '0.5rem', fontSize: '0.75rem', color: '#64748b', wordBreak: 'break-all', fontFamily: 'monospace' }}>
                                {selectedQr.isDynamic ? `${window.location.origin}/go/${selectedQr.id}` : selectedQr.content}
                            </div>
                        </div>

                        <div style={{ background: 'white', padding: '1.5rem', borderRadius: '1.5rem', display: 'inline-block', marginBottom: '2rem', boxShadow: '0 20px 50px rgba(0,0,0,0.5)' }}>
                            {previewQrDataUrl ? (
                                <img src={previewQrDataUrl} alt="QR Code Preview" style={{ width: '250px', height: '250px', display: 'block' }} />
                            ) : (
                                <div style={{ width: '250px', height: '250px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#020617' }}>Gerando...</div>
                            )}
                        </div>

                        <button className="btn" style={{ width: '100%' }} onClick={() => {
                            const link = document.createElement('a');
                            link.download = `QR_${selectedQr.name}.png`;
                            link.href = previewQrDataUrl;
                            link.click();
                        }}>
                            <Download size={20} /> Baixar em Alta Resolução
                        </button>
                    </div>
                </div>
            )}

            {/* Modal de Pagamento Pix */}
            {paymentData && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(2, 6, 23, 0.95)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1001, padding: '1.5rem' }} onClick={() => setPaymentData(null)}>
                    <div className="glass-card animate-fade-in" style={{ maxWidth: '420px', width: '100%', textAlign: 'center', position: 'relative', padding: '2.5rem' }} onClick={e => e.stopPropagation()}>
                        <button onClick={() => setPaymentData(null)} style={{ position: 'absolute', top: '1.25rem', right: '1.25rem', background: 'rgba(255,255,255,0.05)', border: 'none', color: '#94a3b8', cursor: 'pointer', width: '36px', height: '36px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <X size={20} />
                        </button>
                        
                        <h3 style={{ marginBottom: '1rem', fontSize: '1.5rem', fontWeight: 800 }}>Assinatura Premium</h3>
                        <p style={{ fontSize: '0.9rem', color: '#94a3b8', marginBottom: '2rem' }}>Escaneie ou copie o código Pix abaixo:</p>

                        <div style={{ background: 'white', padding: '1.5rem', borderRadius: '1.5rem', display: 'inline-block', marginBottom: '2rem', boxShadow: '0 10px 30px rgba(0,0,0,0.3)' }}>
                            <img src={`data:image/png;base64,${paymentData.qrcode}`} alt="Pix QR Code" style={{ width: '220px', height: '220px' }} />
                        </div>

                        <div style={{ marginBottom: '2rem', textAlign: 'left' }}>
                            <label style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 800, textTransform: 'uppercase', marginBottom: '0.5rem', display: 'block', marginLeft: '0.5rem' }}>Código Pix Copia e Cola</label>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <input className="input" readOnly value={paymentData.copypaste} style={{ margin: 0, fontSize: '0.75rem', height: '42px', fontFamily: 'monospace' }} />
                                <button className="btn" style={{ height: '42px', padding: '0 1rem', width: 'auto' }} onClick={() => { navigator.clipboard.writeText(paymentData.copypaste); alert('Copiado!'); }}>
                                    Copiar
                                </button>
                            </div>
                        </div>

                        <div style={{ padding: '1.25rem', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '1rem', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                            <p style={{ margin: 0, fontSize: '0.85rem', color: '#10b981', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                                <CheckCircle size={18} /> Ativação automática após o pagamento
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </main>
    )
}
