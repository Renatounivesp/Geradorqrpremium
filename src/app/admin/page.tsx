'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function AdminDashboard() {
    const [users, setUsers] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [password, setPassword] = useState('')

    const fetchUsers = async (pass: string = password) => {
        setLoading(true)
        try {
            const res = await fetch('/api/admin/users', {
                headers: { 'Authorization': pass }
            })
            const data = await res.json()
            
            if (res.ok) {
                setUsers(data)
                setIsAuthenticated(true)
                localStorage.setItem('admin_pass', pass)
            } else if (res.status === 401) {
                // If it was auto-login from localStorage and failed
                localStorage.removeItem('admin_pass')
                setIsAuthenticated(false)
            } else {
                alert(data.error || 'Erro ao carregar dados')
            }
        } catch (error) {
            console.error('Error fetching users', error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        const savedPass = localStorage.getItem('admin_pass')
        if (savedPass) {
            setPassword(savedPass)
            fetchUsers(savedPass)
        } else {
            setLoading(false)
        }
    }, [])

    const handleSubscriptionToggle = async (userId: string, currentStatus: boolean) => {
        try {
            const action = currentStatus ? 'cancel' : 'activate'
            const res = await fetch('/api/admin/subscription', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': password
                },
                body: JSON.stringify({ userId, action })
            })

            if (res.ok) {
                setUsers(prev => prev.map(u =>
                    u.id === userId ? { ...u, isSubscribed: !currentStatus } : u
                ))
            } else {
                const data = await res.json()
                alert(data.error || 'Erro ao alterar assinatura')
            }
        } catch (error) {
            console.error('Error toggling subscription', error)
        }
    }

    const handleLogout = () => {
        localStorage.removeItem('admin_pass')
        setIsAuthenticated(false)
        setPassword('')
        setUsers([])
    }

    if (loading && !isAuthenticated) return <div style={{ padding: '2rem' }}>Carregando...</div>

    if (!isAuthenticated) {
        return (
            <div style={{ height: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div className="glass-card" style={{ maxWidth: '400px', width: '100%', textAlign: 'center' }}>
                    <h1 style={{ marginBottom: '1.5rem' }}>Acesso Restrito</h1>
                    <p style={{ color: '#94a3b8', marginBottom: '1.5rem' }}>Digite a senha mestre para acessar o painel administrativo.</p>
                    <input 
                        type="password" 
                        className="input" 
                        placeholder="Senha" 
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && fetchUsers()}
                    />
                    <button className="btn" style={{ width: '100%' }} onClick={() => fetchUsers()}>Acessar</button>
                    <Link href="/" style={{ display: 'block', marginTop: '1.5rem', color: '#94a3b8', textDecoration: 'none' }}>Voltar para o site</Link>
                </div>
            </div>
        )
    }

    const stats = {
        totalUsers: users.length,
        activeSubs: users.filter(u => u.isSubscribed).length,
        totalQrs: users.reduce((acc, u) => acc + (u._count?.qrcodes || 0), 0),
        estimatedRevenue: users.filter(u => u.isSubscribed).length * 9.90
    }

    return (
        <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '2rem' }}>Painel Administrativo</h1>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button onClick={handleLogout} className="btn" style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444' }}>Sair</button>
                    <Link href="/" className="btn" style={{ textDecoration: 'none' }}>Voltar para Início</Link>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
                <div className="glass-card" style={{ textAlign: 'center' }}>
                    <p style={{ color: '#94a3b8', fontSize: '0.8rem', margin: '0 0 0.5rem 0' }}>Usuários Totais</p>
                    <p style={{ fontSize: '1.8rem', fontWeight: 'bold', margin: 0 }}>{stats.totalUsers}</p>
                </div>
                <div className="glass-card" style={{ textAlign: 'center' }}>
                    <p style={{ color: '#94a3b8', fontSize: '0.8rem', margin: '0 0 0.5rem 0' }}>Assinantes Ativos</p>
                    <p style={{ fontSize: '1.8rem', fontWeight: 'bold', margin: 0, color: '#10b981' }}>{stats.activeSubs}</p>
                </div>
                <div className="glass-card" style={{ textAlign: 'center' }}>
                    <p style={{ color: '#94a3b8', fontSize: '0.8rem', margin: '0 0 0.5rem 0' }}>QR Codes Totais</p>
                    <p style={{ fontSize: '1.8rem', fontWeight: 'bold', margin: 0 }}>{stats.totalQrs}</p>
                </div>
                <div className="glass-card" style={{ textAlign: 'center' }}>
                    <p style={{ color: '#94a3b8', fontSize: '0.8rem', margin: '0 0 0.5rem 0' }}>Receita Estimada</p>
                    <p style={{ fontSize: '1.8rem', fontWeight: 'bold', margin: 0, color: '#f59e0b' }}>R$ {stats.estimatedRevenue.toFixed(2).replace('.', ',')}</p>
                </div>
            </div>

            <div className="glass-card" style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid var(--border-glass)' }}>
                            <th style={{ padding: '1rem' }}>Usuário</th>
                            <th style={{ padding: '1rem' }}>Email</th>
                            <th style={{ padding: '1rem' }}>QR Codes</th>
                            <th style={{ padding: '1rem' }}>Trial Termina em</th>
                            <th style={{ padding: '1rem' }}>Status</th>
                            <th style={{ padding: '1rem' }}>Assinatura</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => {
                            const now = new Date()
                            const trialEnds = new Date(user.trialEndsAt)
                            const isTrialActive = now <= trialEnds
                            const status = user.isSubscribed ? 'Assinante' : (isTrialActive ? 'Trial Ativo' : 'Expirado')
                            const statusColor = user.isSubscribed ? '#10b981' : (isTrialActive ? '#3b82f6' : '#ef4444')

                            return (
                                <tr key={user.id} style={{ borderBottom: '1px solid var(--border-glass)' }}>
                                    <td style={{ padding: '1rem' }}>{user.name || 'Sem nome'}</td>
                                    <td style={{ padding: '1rem' }}>{user.email}</td>
                                    <td style={{ padding: '1rem' }}>{user._count?.qrcodes || 0}</td>
                                    <td style={{ padding: '1rem' }}>{trialEnds.toLocaleDateString('pt-BR')}</td>
                                    <td style={{ padding: '1rem', color: statusColor, fontWeight: 'bold' }}>{status}</td>
                                    <td style={{ padding: '1rem' }}>
                                        <button
                                            className="btn"
                                            style={{
                                                padding: '0.5rem 1rem',
                                                fontSize: '0.8rem',
                                                background: user.isSubscribed ? '#ef4444' : 'var(--primary)'
                                            }}
                                            onClick={() => handleSubscriptionToggle(user.id, user.isSubscribed)}
                                        >
                                            {user.isSubscribed ? 'Cancelar' : 'Ativar'}
                                        </button>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
