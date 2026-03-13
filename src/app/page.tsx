'use client';

import Link from 'next/link';
import { 
  Check, 
  ChevronRight, 
  ShieldCheck, 
  Zap, 
  Layout, 
  Download, 
  Users, 
  Star,
  Github,
  MessageCircle,
  ArrowRight,
  Menu
} from 'lucide-react';
import { useState } from 'react';

export default function Home() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div style={{ background: '#020617' }}>
      {/* Navbar */}
      <nav className="navbar-glass">
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{ width: '32px', height: '32px', background: 'linear-gradient(135deg, var(--primary), var(--secondary))', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Zap size={20} color="white" />
            </div>
            <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'white' }}>QR Premium</span>
          </div>
          
          {/* Desktop Menu */}
          <div className="desktop-menu" style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
            <a href="#features" className="nav-link">Recursos</a>
            <a href="#pricing" className="nav-link">Preços</a>
            <a href="#faq" className="nav-link">FAQ</a>
            <Link href="/dashboard" className="btn" style={{ fontSize: '0.85rem', padding: '0.5rem 1rem' }}>
              Painel Cliente
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="mobile-menu-btn" style={{ display: 'none' }}>
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              style={{ background: 'transparent', border: 'none', color: 'white', cursor: 'pointer' }}
            >
              <Menu size={28} />
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {isMobileMenuOpen && (
          <div className="mobile-dropdown" style={{ padding: '1rem 2rem', background: 'rgba(2, 6, 23, 0.95)', borderBottom: '1px solid var(--border-glass)' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <a href="#features" className="nav-link" onClick={() => setIsMobileMenuOpen(false)}>Recursos</a>
              <a href="#pricing" className="nav-link" onClick={() => setIsMobileMenuOpen(false)}>Preços</a>
              <a href="#faq" className="nav-link" onClick={() => setIsMobileMenuOpen(false)}>FAQ</a>
              <Link href="/dashboard" className="btn" style={{ width: '100%', justifyContent: 'center' }} onClick={() => setIsMobileMenuOpen(false)}>
                Entrar / Painel Cliente
              </Link>
            </div>
          </div>
        )}
      </nav>

      <main>
        {/* Hero Section */}
        <section style={{ 
          padding: '6rem 2rem 4rem 2rem', 
          textAlign: 'center', 
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* Decorative Background Elements */}
          <div style={{ 
            position: 'absolute', 
            top: '-10%', 
            left: '50%', 
            transform: 'translateX(-50%)', 
            width: '800px', 
            height: '400px', 
            background: 'radial-gradient(ellipse at center, rgba(99, 102, 241, 0.15), transparent 70%)',
            pointerEvents: 'none',
            zIndex: 0
          }} />

          <div className="animate-fade-in" style={{ position: 'relative', zIndex: 1, maxWidth: '900px', margin: '0 auto' }}>
            <span style={{ 
              background: 'rgba(99, 102, 241, 0.1)', 
              color: 'var(--primary)', 
              padding: '0.5rem 1rem', 
              borderRadius: '2rem', 
              fontSize: '0.85rem', 
              fontWeight: 700,
              marginBottom: '1.5rem',
              display: 'inline-block'
            }}>
              ✨ NOVA VERSÃO 2.0: WHATSAPP E PIX DISPONÍVEIS
            </span>
            <h1 style={{ 
              fontSize: 'clamp(2.5rem, 8vw, 4.5rem)', 
              fontWeight: 900, 
              lineHeight: 1.1, 
              marginBottom: '1.5rem',
              letterSpacing: '-0.04em'
            }}>
              Transforme Conexões em <br />
              <span className="text-gradient">Resultados Reais</span>
            </h1>
            <p style={{ 
              fontSize: '1.25rem', 
              color: '#94a3b8', 
              maxWidth: '650px', 
              margin: '0 auto 2.5rem auto',
              lineHeight: 1.6
            }}>
              Crie QR Codes profissionais para Pix, WhatsApp, Wi-Fi e mais. 
              <strong> 40 dias gratuitos</strong> para você testar todas as funcionalidades.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
              <Link href="/dashboard" className="btn" style={{ padding: '1rem 2.5rem', fontSize: '1.1rem' }}>
                Gerar Gratuitamente <ChevronRight size={20} />
              </Link>
              <Link href="/dashboard" className="btn" style={{ padding: '1rem 2.5rem', fontSize: '1.1rem', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-glass)' }}>
                Ver Meus Códigos
              </Link>
            </div>

            {/* Stats Bar */}
            <div style={{ 
              marginTop: '5rem', 
              display: 'flex', 
              justifyContent: 'center', 
              gap: '4rem', 
              alignItems: 'center',
              flexWrap: 'wrap',
              opacity: 0.7
            }}>
              <div style={{ textAlign: 'left' }}>
                <p style={{ margin: 0, fontSize: '1.5rem', fontWeight: 800, color: 'white' }}>+10k</p>
                <p style={{ margin: 0, fontSize: '0.8rem', color: '#94a3b8' }}>QR Codes Gerados</p>
              </div>
              <div style={{ textAlign: 'left' }}>
                <p style={{ margin: 0, fontSize: '1.5rem', fontWeight: 800, color: 'white' }}>99.9%</p>
                <p style={{ margin: 0, fontSize: '0.8rem', color: '#94a3b8' }}>Uptime Garantido</p>
              </div>
              <div style={{ textAlign: 'left' }}>
                <p style={{ margin: 0, fontSize: '1.5rem', fontWeight: 800, color: 'white' }}>4.9/5</p>
                <p style={{ margin: 0, fontSize: '0.8rem', color: '#94a3b8' }}>NPS Clientes</p>
              </div>
            </div>
          </div>
        </section>


        {/* Features Section */}
        <section id="features" style={{ padding: '8rem 2rem', background: 'rgba(255,255,255,0.02)' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <h2 className="section-title">Por que escolher o <span className="text-gradient">Premium</span>?</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
              <div className="glass-card">
                <div style={{ color: 'var(--primary)', marginBottom: '1.5rem' }}><ShieldCheck size={40} /></div>
                <h3>Segurança Total</h3>
                <p style={{ color: '#94a3b8' }}>Seus dados são protegidos e os QR Codes são gerados com criptografia de ponta.</p>
              </div>
              <div className="glass-card">
                <div style={{ color: 'var(--primary)', marginBottom: '1.5rem' }}><Layout size={40} /></div>
                <h3>Interface Intuitiva</h3>
                <p style={{ color: '#94a3b8' }}>Nada de menus complicados. Tudo pensado para você gerar seu código em menos de 10 segundos.</p>
              </div>
              <div className="glass-card">
                <div style={{ color: 'var(--primary)', marginBottom: '1.5rem' }}><Download size={40} /></div>
                <h3>Alta Resolução</h3>
                <p style={{ color: '#94a3b8' }}>Downloads em PNG de alta qualidade prontos para impressão em banners ou cartões.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" style={{ padding: '8rem 2rem' }}>
          <div style={{ maxWidth: '900px', margin: '0 auto' }}>
            <h2 className="section-title">Preço justo e transparente</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
              {/* Free Plan */}
              <div className="glass-card" style={{ display: 'flex', flexDirection: 'column' }}>
                <h3 style={{ marginBottom: '0.5rem' }}>Trial Gratuito</h3>
                <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '2rem' }}>Para quem está começando.</p>
                <p style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '2rem' }}>R$ 0</p>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                    <Check size={18} color="#10b981" /> <span>40 dias de acesso total</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                    <Check size={18} color="#10b981" /> <span>Todos os tipos de QR</span>
                  </div>
                </div>
                <button className="btn" style={{ width: '100%', marginTop: '2rem', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-glass)' }}>
                  Começar Agora
                </button>
              </div>

              {/* Premium Plan */}
              <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', border: '2px solid var(--primary)', transform: 'scale(1.05)', position: 'relative' }}>
                <div style={{ position: 'absolute', top: '-12px', right: '2rem', background: 'var(--primary)', color: 'white', padding: '0.25rem 0.75rem', borderRadius: '1rem', fontSize: '0.75rem', fontWeight: 800 }}>RECOMENDADO</div>
                <h3 style={{ marginBottom: '0.5rem' }}>Plano Premium</h3>
                <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '2rem' }}>Para profissionais e empresas.</p>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.25rem', marginBottom: '2rem' }}>
                  <span style={{ fontSize: '1.5rem', fontWeight: 800 }}>R$</span>
                  <span style={{ fontSize: '3rem', fontWeight: 900 }}>9,90</span>
                  <span style={{ color: '#94a3b8' }}>/mês</span>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                    <Check size={18} color="#10b981" /> <span>Geração Ilimitada</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                    <Check size={18} color="#10b981" /> <span>Dashboard de Gestão</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                    <Check size={18} color="#10b981" /> <span>Suporte Prioritário</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                    <Check size={18} color="#10b981" /> <span>Alta Resolução (4k)</span>
                  </div>
                </div>
                <button className="btn" style={{ width: '100%', marginTop: '2rem' }}>
                  Assinar Agora
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section id="faq" style={{ padding: '8rem 2rem', background: 'rgba(255,255,255,0.02)' }}>
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <h2 className="section-title">Dúvidas Frequentes</h2>
            <div className="faq-card">
              <p className="faq-question">O QR Code expira após o trial?</p>
              <p className="faq-answer">Não! Seus QR Codes gerados continuam funcionando. O trial é para você experimentar a facilidade de criar e gerenciar novos códigos dentro da nossa plataforma.</p>
            </div>
            <div className="faq-card">
              <p className="faq-question">Posso cancelar minha assinatura a qualquer momento?</p>
              <p className="faq-answer">Sim! Não há fidelidade. Você pode cancelar sua assinatura diretamente no painel do cliente com apenas um clique.</p>
            </div>
            <div className="faq-card">
              <p className="faq-question">Até quantos QR Codes posso gerar no plano Premium?</p>
              <p className="faq-answer">Não há limites! Você pode gerar quantos códigos precisar para o seu negócio.</p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer style={{ padding: '4rem 2rem', borderTop: '1px solid var(--border-glass)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '2rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <Zap size={20} color="var(--primary)" />
              <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'white' }}>QR Premium</span>
            </div>
            <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>© 2026 QR Premium. Todos os direitos reservados.</p>
          </div>
          <div style={{ display: 'flex', gap: '2rem' }}>
            <a href="#" className="nav-link">Privacidade</a>
            <a href="#" className="nav-link">Termos</a>
            <a href="#" className="nav-link">Contato</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
