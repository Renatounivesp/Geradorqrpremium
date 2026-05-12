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
  Menu,
  QrCode
} from 'lucide-react';
import { useState } from 'react';

export default function Home() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div style={{ background: '#020617' }}>
      {/* Navbar */}
      <nav className="navbar-glass">
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem', height: '80px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ width: '36px', height: '36px', background: 'linear-gradient(135deg, var(--primary), var(--secondary))', borderRadius: '0.6rem', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 10px rgba(99, 102, 241, 0.3)' }}>
              <QrCode size={22} color="white" />
            </div>
            <span style={{ fontSize: '1.4rem', fontWeight: 900, color: 'white', letterSpacing: '-0.03em' }}>QR Premium</span>
          </div>
          
          {/* Desktop Menu */}
          <div className="desktop-menu" style={{ display: 'flex', gap: '2.5rem', alignItems: 'center' }}>
            <a href="#features" className="nav-link" style={{ fontSize: '0.95rem' }}>Recursos</a>
            <a href="#pricing" className="nav-link" style={{ fontSize: '0.95rem' }}>Preços</a>
            <a href="#faq" className="nav-link" style={{ fontSize: '0.95rem' }}>FAQ</a>
            <Link href="/dashboard" className="btn" style={{ fontSize: '0.9rem', width: 'auto', padding: '0 1.5rem', height: '44px' }}>
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
          <div className="mobile-dropdown" style={{ padding: '1.5rem 2rem', background: 'rgba(2, 6, 23, 0.98)', borderBottom: '1px solid var(--border-glass)', backdropFilter: 'blur(10px)' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
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
          padding: '8rem 2rem 6rem 2rem', 
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
            width: '1000px', 
            height: '500px', 
            background: 'radial-gradient(ellipse at center, rgba(99, 102, 241, 0.12), transparent 70%)',
            pointerEvents: 'none',
            zIndex: 0
          }} />

          <div className="animate-fade-in" style={{ position: 'relative', zIndex: 1, maxWidth: '900px', margin: '0 auto' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(99, 102, 241, 0.1)', color: 'var(--primary)', padding: '0.6rem 1.25rem', borderRadius: '3rem', fontSize: '0.85rem', fontWeight: 800, marginBottom: '2rem', border: '1px solid rgba(99, 102, 241, 0.2)' }}>
              <Sparkles size={16} /> NOVIDADE: MODO DINÂMICO LIBERADO
            </div>
            <h1 style={{ 
              fontSize: 'clamp(2.8rem, 8vw, 5rem)', 
              fontWeight: 950, 
              lineHeight: 1.05, 
              marginBottom: '1.75rem',
              letterSpacing: '-0.05em',
              color: 'white'
            }}>
              QR Codes que <br />
              <span className="text-gradient">Convertem Clientes</span>
            </h1>
            <p style={{ 
              fontSize: '1.35rem', 
              color: '#94a3b8', 
              maxWidth: '700px', 
              margin: '0 auto 3.5rem auto',
              lineHeight: 1.6,
              fontWeight: 400
            }}>
              Gere códigos inteligentes para Pix, WhatsApp, Wi-Fi e Redes Sociais. 
              Experimente o <strong>Plano Pro</strong> por 10 dias sem compromisso.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '1.25rem', flexWrap: 'wrap' }}>
              <Link href="/dashboard" className="btn" style={{ width: 'auto', padding: '0 2.5rem', height: '60px', fontSize: '1.15rem' }}>
                Começar Gratuitamente <ChevronRight size={22} />
              </Link>
              <Link href="/dashboard" className="btn" style={{ width: 'auto', padding: '0 2.5rem', height: '60px', fontSize: '1.15rem', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-glass)', boxShadow: 'none' }}>
                Ver Meus Códigos
              </Link>
            </div>

            {/* Stats Bar */}
            <div style={{ 
              marginTop: '6rem', 
              display: 'flex', 
              justifyContent: 'center', 
              gap: '5rem', 
              alignItems: 'center',
              flexWrap: 'wrap',
            }}>
              <div style={{ textAlign: 'center' }}>
                <p style={{ margin: 0, fontSize: '1.75rem', fontWeight: 900, color: 'white' }}>12.5k+</p>
                <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.85rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Gerados</p>
              </div>
              <div style={{ height: '40px', width: '1px', background: 'var(--border-glass)', display: 'block' }} className="desktop-only" />
              <div style={{ textAlign: 'center' }}>
                <p style={{ margin: 0, fontSize: '1.75rem', fontWeight: 900, color: 'white' }}>99.9%</p>
                <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.85rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Uptime</p>
              </div>
              <div style={{ height: '40px', width: '1px', background: 'var(--border-glass)', display: 'block' }} className="desktop-only" />
              <div style={{ textAlign: 'center' }}>
                <p style={{ margin: 0, fontSize: '1.75rem', fontWeight: 900, color: 'white' }}>4.9/5</p>
                <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.85rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Avaliação</p>
              </div>
            </div>
          </div>
        </section>


        {/* Features Section */}
        <section id="features" style={{ padding: '8rem 2rem', background: 'rgba(15, 23, 42, 0.4)' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
             <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
                <h2 className="section-title" style={{ marginBottom: '1rem' }}>Recursos que impulsionam seu <span className="text-gradient">Negócio</span></h2>
                <p style={{ color: '#64748b', fontSize: '1.1rem' }}>Tudo o que você precisa para uma gestão de QR Codes eficiente</p>
             </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2.5rem' }}>
              <div className="glass-card" style={{ padding: '3rem' }}>
                <div style={{ width: '56px', height: '56px', background: 'rgba(99, 102, 241, 0.1)', borderRadius: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', marginBottom: '2rem' }}>
                    <ShieldCheck size={32} />
                </div>
                <h3 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '1rem' }}>Segurança Total</h3>
                <p style={{ color: '#94a3b8', lineHeight: 1.6 }}>Seus dados e de seus clientes são protegidos por criptografia de nível bancário e infraestrutura AWS.</p>
              </div>
              <div className="glass-card" style={{ padding: '3rem' }}>
                <div style={{ width: '56px', height: '56px', background: 'rgba(168, 85, 247, 0.1)', borderRadius: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--secondary)', marginBottom: '2rem' }}>
                    <Layout size={32} />
                </div>
                <h3 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '1rem' }}>Gestão Dinâmica</h3>
                <p style={{ color: '#94a3b8', lineHeight: 1.6 }}>Alterou o link? Não precisa imprimir outro QR. Basta atualizar o destino no seu painel em tempo real.</p>
              </div>
              <div className="glass-card" style={{ padding: '3rem' }}>
                <div style={{ width: '56px', height: '56px', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10b981', marginBottom: '2rem' }}>
                    <BarChart3 size={32} />
                </div>
                <h3 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '1rem' }}>Analytics Avançado</h3>
                <p style={{ color: '#94a3b8', lineHeight: 1.6 }}>Saiba quem, quando e de onde estão escaneando seus códigos com gráficos detalhados de performance.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" style={{ padding: '10rem 2rem' }}>
          <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
                <h2 className="section-title" style={{ marginBottom: '1rem' }}>Escolha o plano ideal</h2>
                <p style={{ color: '#64748b', fontSize: '1.1rem' }}>Comece grátis e evolua conforme sua necessidade</p>
             </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '3rem', alignItems: 'center' }}>
              {/* Free Plan */}
              <div className="glass-card" style={{ padding: '3rem', border: '1px solid var(--border-glass)' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.5rem' }}>Degustação</h3>
                <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '2.5rem' }}>Perfeito para testar a plataforma</p>
                <div style={{ marginBottom: '2.5rem' }}>
                    <span style={{ fontSize: '3rem', fontWeight: 900, color: 'white' }}>Grátis</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <Check size={20} color="#10b981" /> <span style={{ color: '#f1f5f9' }}>10 dias de acesso total</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <Check size={20} color="#10b981" /> <span style={{ color: '#f1f5f9' }}>Todos os tipos de QR</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <Check size={20} color="#10b981" /> <span style={{ color: '#f1f5f9' }}>Suporte via E-mail</span>
                  </div>
                </div>
                <Link href="/dashboard" className="btn" style={{ marginTop: '3rem', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-glass)', boxShadow: 'none' }}>
                    Começar Agora
                </Link>
              </div>

              {/* Premium Plan */}
              <div className="glass-card" style={{ padding: '3.5rem 3rem', border: '2px solid var(--primary)', background: 'rgba(99, 102, 241, 0.05)', position: 'relative', boxShadow: '0 30px 60px -12px rgba(99, 102, 241, 0.25)' }}>
                <div style={{ position: 'absolute', top: '-14px', left: '50%', transform: 'translateX(-50%)', background: 'var(--primary)', color: 'white', padding: '0.4rem 1.25rem', borderRadius: '2rem', fontSize: '0.75rem', fontWeight: 900, letterSpacing: '0.05em' }}>MAIS POPULAR</div>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 900, marginBottom: '0.5rem' }}>Plano Premium</h3>
                <p style={{ color: '#94a3b8', fontSize: '0.95rem', marginBottom: '2.5rem' }}>Para quem busca performance</p>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.4rem', marginBottom: '2.5rem' }}>
                  <span style={{ fontSize: '1.75rem', fontWeight: 800, color: 'white' }}>R$</span>
                  <span style={{ fontSize: '4rem', fontWeight: 950, color: 'white', lineHeight: 1 }}>9,90</span>
                  <span style={{ color: '#64748b', fontWeight: 600 }}>/mês</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <Check size={20} color="#10b981" /> <span style={{ color: '#f1f5f9', fontWeight: 600 }}>Geração Ilimitada</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <Check size={20} color="#10b981" /> <span style={{ color: '#f1f5f9', fontWeight: 600 }}>QR Codes Dinâmicos</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <Check size={20} color="#10b981" /> <span style={{ color: '#f1f5f9', fontWeight: 600 }}>Dashboard de Analytics</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <Check size={20} color="#10b981" /> <span style={{ color: '#f1f5f9', fontWeight: 600 }}>Alta Resolução (4K)</span>
                  </div>
                </div>
                
                <Link href="/dashboard" className="btn" style={{ marginTop: '3rem' }}>
                    Assinar Agora
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section id="faq" style={{ padding: '8rem 2rem', background: 'rgba(15, 23, 42, 0.4)' }}>
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <h2 className="section-title">Dúvidas Frequentes</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div className="glass-card" style={{ padding: '2rem' }}>
                <p style={{ margin: '0 0 1rem 0', fontWeight: 800, fontSize: '1.15rem', color: 'white' }}>O QR Code expira após o trial?</p>
                <p style={{ margin: 0, color: '#94a3b8', lineHeight: 1.6 }}>Não! Seus QR Codes gerados continuam funcionando para sempre. O trial é apenas um período para você explorar as ferramentas avançadas de gestão e analytics.</p>
                </div>
                <div className="glass-card" style={{ padding: '2rem' }}>
                <p style={{ margin: '0 0 1rem 0', fontWeight: 800, fontSize: '1.15rem', color: 'white' }}>Posso editar um QR Code já impresso?</p>
                <p style={{ margin: 0, color: '#94a3b8', lineHeight: 1.6 }}>Sim! Com o <strong>Modo Dinâmico</strong> do plano Premium, você pode alterar o link de destino a qualquer momento sem precisar reimprimir o código físico.</p>
                </div>
                <div className="glass-card" style={{ padding: '2rem' }}>
                <p style={{ margin: '0 0 1rem 0', fontWeight: 800, fontSize: '1.15rem', color: 'white' }}>Quais são as formas de pagamento?</p>
                <p style={{ margin: 0, color: '#94a3b8', lineHeight: 1.6 }}>Aceitamos Pix com ativação instantânea e Cartão de Crédito. O processo é 100% seguro através do Mercado Pago.</p>
                </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer style={{ padding: '6rem 2rem 4rem 2rem', borderTop: '1px solid var(--border-glass)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '4rem' }}>
          <div style={{ maxWidth: '300px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
              <QrCode size={28} color="var(--primary)" />
              <span style={{ fontSize: '1.5rem', fontWeight: 950, color: 'white', letterSpacing: '-0.04em' }}>QR Premium</span>
            </div>
            <p style={{ color: '#64748b', fontSize: '0.95rem', lineHeight: 1.6 }}>A solução definitiva para criação e gestão inteligente de QR Codes para negócios modernos.</p>
          </div>
          <div style={{ display: 'flex', gap: '5rem', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <span style={{ fontWeight: 800, color: 'white', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Produto</span>
              <a href="#features" className="nav-link">Recursos</a>
              <a href="#pricing" className="nav-link">Preços</a>
              <a href="/dashboard" className="nav-link">Painel</a>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <span style={{ fontWeight: 800, color: 'white', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Suporte</span>
              <a href="#" className="nav-link">Privacidade</a>
              <a href="#" className="nav-link">Termos</a>
              <a href="https://wa.me/55..." className="nav-link">WhatsApp</a>
            </div>
          </div>
        </div>
        <div style={{ maxWidth: '1200px', margin: '4rem auto 0 auto', paddingTop: '2rem', borderTop: '1px solid rgba(255,255,255,0.05)', textAlign: 'center' }}>
            <p style={{ color: '#475569', fontSize: '0.9rem' }}>© 2026 QR Premium. Todos os direitos reservados. Feito com ❤️ para empreendedores.</p>
        </div>
      </footer>
    </div>
  );
}
