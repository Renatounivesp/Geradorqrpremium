'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { QrCode, CreditCard, Clock, CheckCircle, AlertCircle, LogOut, ExternalLink, Trash2, Edit2, Save, X } from 'lucide-react'
import QRGenerator from '@/components/QRGenerator'

export default function UserDashboard() {
    const [email, setEmail] = useState('')
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [user, setUser] = useState<any>(null)
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState('')
    const [editingQrId, setEditingQrId] = useState<string | null>(null)
    const [newRedirectUrl, setNewRedirectUrl] = useState('')

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        try {
            const res = await fetch(`/api/user?email=${email}`)
            const data = await res.json()
            if (res.ok) {
                setUser(data)
                setIsLoggedIn(true)
                localStorage.setItem('qr_user_email', email)
            } else {
                alert(data.error || 'Usuário não encontrado.')
            }
        } catch (error) {
            console.error('Login error', error)
        } finally {
            setLoading(false)
        }
    }

    const handleSubscribe = async () => {
        setLoading(true)
        try {
            const res = await fetch('/api/user/subscribe', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: user.email })
            })
            const data = await res.json()
            if (res.ok) {
                setUser(data.user)
                setMessage('Assinatura ativada com sucesso!')
                // Force refresh user data
                const refreshRes = await fetch(`/api/user?email=${user.email}`)
                const refreshData = await refreshRes.json()
                setUser(refreshData)
            }
        } catch (error) {
            console.error('Subscription error', error)
        } finally {
            setLoading(false)
        }
    }

    const handleDeleteQR = async (qrId: string) => {
        if (!window.confirm('Tem certeza que deseja excluir este QR Code? Esta ação não pode ser desfeita.')) {
            return
        }

        try {
            const res = await fetch(`/api/qrcode/${qrId}`, {
                method: 'DELETE',
            })

            if (res.ok) {
                // Update local state to remove the deleted QR code
                setUser({
                    ...user,
                    qrcodes: user.qrcodes.filter((qr: any) => qr.id !== qrId)
                })
            } else {
                const data = await res.json()
                alert(data.error || 'Erro ao excluir QR Code.')
            }
        } catch (error) {
            console.error('Delete error', error)
            alert('Erro de conexão ao excluir QR Code.')
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
            } else {
                const data = await res.json()
                alert(data.error || 'Erro ao atualizar destino.')
            }
        } catch (error) {
            console.error('Update error', error)
        } finally {
            setLoading(false)
        }
    }

    const handleLogout = () => {
        setIsLoggedIn(false)
        setUser(null)
        setEmail('')
        localStorage.removeItem('qr_user_email')
    }

    useEffect(() => {
        const savedEmail = localStorage.getItem('qr_user_email')
        if (savedEmail) {
            setEmail(savedEmail)
        }
    }, [])

    if (!isLoggedIn) {
        return (
            <main style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div className="glass-card" style={{ maxWidth: '400px', width: '100%', textAlign: 'center' }}>
                    <h1 style={{ marginBottom: '1.5rem', fontSize: '1.5rem' }}>Acessar meu Painel</h1>
                    <form onSubmit={handleLogin}>
                        <input
                            className="input"
                            type="email"
                            placeholder="Seu melhor e-mail"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            required
                            style={{ marginBottom: '1rem' }}
                        />
                        <button className="btn" style={{ width: '100%', justifyContent: 'center' }} disabled={loading}>
                            {loading ? 'Entrando...' : 'Entrar / Cadastrar'}
                        </button>
                    </form>
                    <p style={{ marginTop: '1.5rem', fontSize: '0.8rem', color: '#94a3b8' }}>
                        Se for seu primeiro acesso, uma conta será criada automaticamente com 40 dias grátis!
                    </p>

                    <Link href="/" style={{ display: 'block', marginTop: '1rem', color: 'var(--primary)', fontSize: '0.8rem', textDecoration: 'none' }}>
                        Voltar para a Home
                    </Link>
                </div>
            </main>
        )
    }

    const trialEnds = new Date(user.trialEndsAt)
    const isTrialActive = new Date() <= trialEnds
    const status = user.isSubscribed ? 'ASSINANTE PREMIUM' : (isTrialActive ? 'PERÍODO TRIAL' : 'CONTA EXPIRED')

    return (
        <main style={{ padding: '2rem', maxWidth: '1000px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
                <div>
                    <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Olá, {user.name || 'Usuário'}</h1>
                    <p style={{ color: '#94a3b8' }}>Gerencie seus QR Codes e sua assinatura.</p>
                </div>
                <button onClick={handleLogout} className="btn" style={{ background: 'transparent', border: '1px solid var(--border-glass)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <LogOut size={16} /> Sair
                </button>
            </div>

            {message && (
                <div style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', padding: '1rem', borderRadius: '0.5rem', marginBottom: '2rem', textAlign: 'center' }}>
                    {message}
                </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginBottom: '3rem' }}>
                {/* Subscription Card */}
                <div className="glass-card" style={{ borderLeft: `4px solid ${user.isSubscribed ? '#10b981' : (isTrialActive ? '#6366f1' : '#ef4444')}` }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1.5rem' }}>
                        <h3 style={{ margin: 0 }}>Sua Assinatura</h3>
                        <span style={{ 
                            fontSize: '0.7rem', 
                            padding: '0.25rem 0.5rem', 
                            borderRadius: '1rem', 
                            background: user.isSubscribed ? 'rgba(16, 185, 129, 0.1)' : 'rgba(99, 102, 241, 0.1)',
                            color: user.isSubscribed ? '#10b981' : '#6366f1',
                            fontWeight: 'bold'
                        }}>
                            {status}
                        </span>
                    </div>

                    {!user.isSubscribed ? (
                        <>
                            <p style={{ fontSize: '0.9rem', color: '#94a3b8', marginBottom: '1.5rem' }}>
                                {isTrialActive 
                                    ? `Seu trial gratuito termina em ${trialEnds.toLocaleDateString('pt-BR')}.`
                                    : 'Seu período de teste expirou. Assine agora para continuar usando sem interrupções.'
                                }
                            </p>
                            <div style={{ background: 'rgba(255,255,255,0.05)', padding: '1rem', borderRadius: '0.5rem', marginBottom: '1.5rem' }}>
                                <p style={{ fontSize: '1.2rem', fontWeight: 'bold', margin: '0 0 0.25rem 0' }}>R$ 9,90 / mês</p>
                                <p style={{ fontSize: '0.75rem', color: '#94a3b8', margin: 0 }}>Acesso ilimitado e alta resolução.</p>
                            </div>
                            <button className="btn" style={{ width: '100%' }} onClick={handleSubscribe} disabled={loading}>
                                <CreditCard size={18} style={{ marginRight: '0.5rem' }} />
                                {loading ? 'Processando...' : 'Assinar Agora'}
                            </button>
                        </>
                    ) : (
                        <>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                                <CheckCircle size={32} color="#10b981" />
                                <div>
                                    <p style={{ margin: 0, fontWeight: 'bold' }}>Plano Premium Ativo</p>
                                    <p style={{ margin: 0, fontSize: '0.8rem', color: '#94a3b8' }}>Próxima renovação: {new Date(new Date().setMonth(new Date().getMonth() + 1)).toLocaleDateString('pt-BR')}</p>
                                </div>
                            </div>
                            <p style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Obrigado por apoiar o QR Premium!</p>
                        </>
                    )}
                </div>

                {/* Statistics Card */}
                <div className="glass-card">
                    <h3 style={{ marginBottom: '1.5rem' }}>Estatísticas</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ color: '#94a3b8', fontSize: '0.9rem' }}>QR Codes Gerados</span>
                            <span style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>{user.qrcodes?.length || 0}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Total de Scans</span>
                            <span style={{ color: '#10b981', fontWeight: 'bold', fontSize: '1.2rem' }}>
                                {user.qrcodes?.reduce((acc: number, qr: any) => acc + (qr.scans || 0), 0) || 0}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <div style={{ marginBottom: '4rem' }}>
                <h2 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <QrCode size={24} /> Criar Novo QR Code
                </h2>
                <div style={{ background: 'rgba(2, 6, 23, 0.5)', borderRadius: '1.5rem', padding: '1rem', border: '1px solid var(--border-glass)' }}>
                    <QRGenerator defaultEmail={user.email} onGenerated={() => {
                        // Refresh user data after generating to update the list and stats
                        fetch(`/api/user?email=${user.email}`)
                            .then(res => res.json())
                            .then(data => setUser(data))
                    }} />
                </div>
            </div>

            <h2 id="my-qrs" style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <QrCode size={24} /> Seus QR Codes Salvos
            </h2>

            {user.qrcodes?.length > 0 ? (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
                    {user.qrcodes.map((qr: any) => (
                        <div key={qr.id} className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    {qr.isDynamic && (
                                        <span style={{ fontSize: '0.6rem', background: 'var(--primary)', color: 'white', padding: '0.1rem 0.4rem', borderRadius: '0.25rem', fontWeight: 'bold' }}>DINÂMICO</span>
                                    )}
                                    <span style={{ fontSize: '0.7rem', color: '#94a3b8', fontWeight: 'bold' }}>{qr.category}</span>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <span style={{ fontSize: '0.65rem', color: '#64748b', display: 'block' }}>{new Date(qr.createdAt).toLocaleDateString('pt-BR')}</span>
                                    <span style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 'bold' }}>{qr.scans || 0} scans</span>
                                </div>
                            </div>

                            <h4 style={{ margin: '0 0 1rem 0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{qr.name}</h4>

                            {qr.isDynamic && (
                                <div style={{ marginBottom: '1.5rem', background: 'rgba(255,255,255,0.03)', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--border-glass)' }}>
                                    <p style={{ margin: '0 0 0.4rem 0', fontSize: '0.7rem', color: '#94a3b8' }}>Destino Atual:</p>
                                    {editingQrId === qr.id ? (
                                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                                            <input 
                                                className="input" 
                                                style={{ margin: 0, padding: '0.4rem', fontSize: '0.8rem', height: 'auto', flex: 1 }}
                                                value={newRedirectUrl}
                                                onChange={e => setNewRedirectUrl(e.target.value)}
                                            />
                                            <button className="btn" style={{ padding: '0.4rem', height: 'auto' }} onClick={() => handleUpdateRedirect(qr.id)}><Save size={16}/></button>
                                            <button className="btn" style={{ padding: '0.4rem', height: 'auto', background: 'transparent' }} onClick={() => setEditingQrId(null)}><X size={16}/></button>
                                        </div>
                                    ) : (
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.5rem' }}>
                                            <span style={{ fontSize: '0.8rem', color: 'white', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{qr.redirectUrl}</span>
                                            <button 
                                                style={{ background: 'transparent', border: 'none', color: 'var(--primary)', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                                                onClick={() => {
                                                    setEditingQrId(qr.id)
                                                    setNewRedirectUrl(qr.redirectUrl)
                                                }}
                                                title="Editar Link"
                                            >
                                                <Edit2 size={14} />
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}

                            <div style={{ display: 'flex', gap: '0.5rem', marginTop: 'auto' }}>
                                <button 
                                    className="btn" 
                                    style={{ 
                                        padding: '0.5rem', 
                                        background: 'rgba(239, 68, 68, 0.1)', 
                                        color: '#ef4444', 
                                        border: '1px solid rgba(239, 68, 68, 0.2)',
                                        borderRadius: '0.5rem'
                                    }} 
                                    onClick={() => handleDeleteQR(qr.id)}
                                    title="Excluir"
                                >
                                    <Trash2 size={16} />
                                </button>
                                <button className="btn" style={{ padding: '0.5rem 0.75rem', fontSize: '0.75rem', flex: 1, background: 'rgba(255,255,255,0.05)' }} onClick={() => alert(`Conteúdo: ${qr.content}`)}>
                                    Ver QR
                                </button>
                                <button className="btn" style={{ padding: '0.5rem 0.75rem', fontSize: '0.75rem', flex: 1 }} onClick={() => alert('Em breve: Download em alta resolução')}>
                                    Download
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="glass-card" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
                    <QrCode size={48} color="#1e293b" style={{ marginBottom: '1.5rem' }} />
                    <p style={{ color: '#94a3b8', marginBottom: '1.5rem' }}>Você ainda não gerou nenhum QR Code.</p>
                    <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="btn">Criar meu primeiro QR</button>
                </div>
            )}
        </main>
    )
}
