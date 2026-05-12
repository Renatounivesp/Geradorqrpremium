'use client';

import { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import {
    Link as LinkIcon,
    QrCode as QrIcon,
    Smartphone,
    Wifi,
    CreditCard,
    Sparkles,
    Download,
    AlertCircle,
    User,
    Building,
    MessageCircle,
    Mail,
    MapPin,
    Send,
    ChevronRight,
    Palette,
    Settings
} from 'lucide-react';
import { generatePixPayload } from '@/lib/pix';

type QRType = 'URL' | 'PIX' | 'WIFI' | 'PHONE' | 'AI' | 'VCARD' | 'CNPJ' | 'WHATSAPP' | 'SMS' | 'EMAIL' | 'LOCATION';

export default function QRGenerator({ defaultEmail = '', onGenerated }: { defaultEmail?: string, onGenerated?: () => void }) {
    const [type, setType] = useState<QRType>('URL');
    const [content, setContent] = useState('');
    const [qrCode, setQrCode] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [email, setEmail] = useState(defaultEmail);
    const [qrName, setQrName] = useState('');
    const [isDynamic, setIsDynamic] = useState(true);

    // PIX State
    const [pixKey, setPixKey] = useState('');
    const [pixName, setPixName] = useState('');
    const [pixCity, setPixCity] = useState('');
    const [pixAmount, setPixAmount] = useState('');
    const [pixDesc, setPixDesc] = useState('');

    // WiFi State
    const [ssid, setSsid] = useState('');
    const [password, setPassword] = useState('');
    const [encryption, setEncryption] = useState('WPA');

    // VCard State
    const [vFirstName, setVFirstName] = useState('');
    const [vLastName, setVLastName] = useState('');
    const [vPhone, setVPhone] = useState('');
    const [vEmail, setVEmail] = useState('');

    // CNPJ State
    const [cnpj, setCnpj] = useState('');

    // WhatsApp/SMS State
    const [message, setMessage] = useState('');
    const [phone, setPhone] = useState('');

    // Email State
    const [subject, setSubject] = useState('');
    const [body, setBody] = useState('');

    // Location State
    const [latitude, setLatitude] = useState('');
    const [longitude, setLongitude] = useState('');

    // AI State
    const [aiPrompt, setAiPrompt] = useState('');

    // Customization State
    const [fgColor, setFgColor] = useState('#000000');
    const [bgColor, setBgColor] = useState('#ffffff');
    const [logoUrl, setLogoUrl] = useState('');
    const [frameStyle, setFrameStyle] = useState('none');

    const generate = async () => {
        if (!email) {
            setError('Por favor, faça login ou insira seu e-mail para salvar.');
            return;
        }

        setLoading(true);
        setError('');
        let finalContent = content;

        try {
            if (type === 'PIX') {
                if (!pixKey || !pixName || !pixCity) throw new Error('Preencha os campos obrigatórios do PIX.');
                finalContent = generatePixPayload({
                    key: pixKey,
                    name: pixName,
                    city: pixCity,
                    amount: pixAmount ? parseFloat(pixAmount.replace(',', '.')) : undefined,
                    description: pixDesc
                });
            } else if (type === 'WIFI') {
                finalContent = `WIFI:S:${ssid};T:${encryption};P:${password};;`;
            } else if (type === 'PHONE') {
                finalContent = `tel:${content}`;
            } else if (type === 'VCARD') {
                finalContent = `BEGIN:VCARD\nVERSION:3.0\nN:${vLastName};${vFirstName}\nFN:${vFirstName} ${vLastName}\nTEL;TYPE=CELL:${vPhone}\nEMAIL:${vEmail}\nEND:VCARD`;
            } else if (type === 'CNPJ') {
                finalContent = `https://consultacnpj.com/cnpj/${cnpj.replace(/\D/g, '')}`;
            } else if (type === 'WHATSAPP') {
                let cleanPhone = phone.replace(/\D/g, '');
                if (cleanPhone.length === 10 || cleanPhone.length === 11) cleanPhone = '55' + cleanPhone;
                finalContent = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
            } else if (type === 'SMS') {
                let cleanPhone = phone.replace(/\D/g, '');
                if (cleanPhone.length === 10 || cleanPhone.length === 11) cleanPhone = '+55' + cleanPhone;
                finalContent = `SMSTO:${cleanPhone}:${message}`;
            } else if (type === 'EMAIL') {
                finalContent = `mailto:${vEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
            } else if (type === 'LOCATION') {
                finalContent = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
            } else if (type === 'AI') {
                if (!aiPrompt) throw new Error('Digite algo para a IA processar.');
                processAI(aiPrompt);
                return;
            }

            const response = await fetch('/api/qrcode', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email,
                    name: qrName || `QR ${type} - ${new Date().toLocaleDateString()}`,
                    content: finalContent,
                    category: type,
                    isDynamic,
                    fgColor,
                    bgColor,
                    logoUrl,
                    frameStyle
                })
            });

            const result = await response.json();
            if (!response.ok) throw new Error(result.error || 'Erro ao processar.');

            const dataUrl = await QRCode.toDataURL(finalContent, {
                width: 1000,
                margin: 4,
                color: { dark: fgColor, light: bgColor },
                errorCorrectionLevel: logoUrl ? 'H' : 'M'
            });

            if (logoUrl) {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                const qrImg = new Image();
                await new Promise((resolve, reject) => {
                    qrImg.onload = resolve;
                    qrImg.onerror = reject;
                    qrImg.src = dataUrl;
                });
                canvas.width = qrImg.width;
                canvas.height = qrImg.height;
                ctx?.drawImage(qrImg, 0, 0);
                const logo = new Image();
                await new Promise((resolve, reject) => {
                    logo.crossOrigin = "anonymous";
                    logo.onload = resolve;
                    logo.onerror = reject;
                    logo.src = logoUrl;
                });
                const logoSize = canvas.width * 0.2;
                const x = (canvas.width - logoSize) / 2;
                const y = (canvas.height - logoSize) / 2;
                if (ctx) {
                    ctx.fillStyle = bgColor;
                    ctx.fillRect(x - 5, y - 5, logoSize + 10, logoSize + 10);
                    ctx.drawImage(logo, x, y, logoSize, logoSize);
                }
                setQrCode(canvas.toDataURL());
            } else {
                setQrCode(dataUrl);
            }
            if (onGenerated) onGenerated();
        } catch (err: any) {
            setError(err.message || 'Erro ao gerar QR Code.');
        } finally {
            setLoading(false);
        }
    };

    const processAI = (prompt: string) => {
        setLoading(true);
        setTimeout(() => {
            const lower = prompt.toLowerCase();
            if (lower.includes('pix')) {
                setType('PIX');
                const keyMatch = prompt.match(/[0-9]{11}|[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
                if (keyMatch) setPixKey(keyMatch[0]);
                setPixName('Usuário AI');
                setPixCity('SAO PAULO');
                const amountMatch = prompt.match(/[0-9]+([,.][0-9]{2})?/);
                if (amountMatch) setPixAmount(amountMatch[0].replace(',', '.'));
            } else if (lower.includes('wifi') || lower.includes('wi-fi')) {
                setType('WIFI');
                const ssidMatch = prompt.match(/rede\s+([^\s,]+)/i);
                if (ssidMatch) setSsid(ssidMatch[1]);
            } else {
                setType('URL');
                const urlMatch = prompt.match(/https?:\/\/[^\s]+/);
                if (urlMatch) setContent(urlMatch[0]);
            }
            setLoading(false);
            setAiPrompt('');
        }, 1500);
    };

    return (
        <div className="glass-card" style={{ maxWidth: '900px', margin: '0 auto', background: 'rgba(15, 23, 42, 0.4)', padding: '2.5rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '3rem' }}>
                <div>
                    {/* Identification */}
                    <div style={{ marginBottom: '2.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                            <Settings size={18} color="var(--primary)" />
                            <h4 style={{ margin: 0, fontSize: '0.9rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Identificação</h4>
                        </div>
                        <input className="input" placeholder="Nome do QR Code (ex: Cardápio Digital)" value={qrName} onChange={e => setQrName(e.target.value)} />
                        {!defaultEmail && (
                            <input className="input" type="email" placeholder="Seu e-mail" value={email} onChange={e => setEmail(e.target.value)} />
                        )}
                    </div>

                    {/* Dynamic Toggle */}
                    <div style={{ marginBottom: '2.5rem', padding: '1.25rem', background: 'rgba(99, 102, 241, 0.05)', borderRadius: '1.25rem', border: '1px solid rgba(99, 102, 241, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <Sparkles size={20} color="var(--primary)" />
                            <div>
                                <p style={{ margin: 0, fontWeight: 700, fontSize: '0.85rem' }}>Modo Dinâmico</p>
                                <p style={{ margin: 0, fontSize: '0.7rem', color: '#64748b' }}>Edite o link depois de impresso</p>
                            </div>
                        </div>
                        <div onClick={() => setIsDynamic(!isDynamic)} style={{ width: '44px', height: '24px', background: isDynamic ? 'var(--primary)' : '#1e293b', borderRadius: '12px', padding: '3px', cursor: 'pointer', transition: 'all 0.3s', display: 'flex', justifyContent: isDynamic ? 'flex-end' : 'flex-start' }}>
                            <div style={{ width: '18px', height: '18px', background: 'white', borderRadius: '50%' }} />
                        </div>
                    </div>

                    {/* Types */}
                    <div className="qr-type-selector" style={{ marginBottom: '2.5rem' }}>
                        {[
                            { id: 'URL', label: 'Link', icon: <LinkIcon size={18} /> },
                            { id: 'PIX', label: 'PIX', icon: <CreditCard size={18} /> },
                            { id: 'WIFI', label: 'WiFi', icon: <Wifi size={18} /> },
                            { id: 'WHATSAPP', label: 'WhatsApp', icon: <MessageCircle size={18} /> },
                            { id: 'VCARD', label: 'Contato', icon: <User size={18} /> },
                            { id: 'AI', label: 'AI', icon: <Sparkles size={18} /> },
                        ].map((t) => (
                            <button key={t.id} onClick={() => setType(t.id as QRType)} className={`qr-type-btn ${type === t.id ? 'active' : ''}`} style={{ padding: '0.75rem' }}>
                                {t.icon}
                                <span style={{ fontSize: '0.7rem', marginTop: '0.4rem', fontWeight: 700 }}>{t.label}</span>
                            </button>
                        ))}
                    </div>

                    {/* Inputs based on type */}
                    <div style={{ marginBottom: '2.5rem' }}>
                        {type === 'URL' && <input className="input" placeholder="https://exemplo.com" value={content} onChange={e => setContent(e.target.value)} />}
                        {type === 'PIX' && (
                            <>
                                <input className="input" placeholder="Chave PIX" value={pixKey} onChange={e => setPixKey(e.target.value)} />
                                <input className="input" placeholder="Nome" value={pixName} onChange={e => setPixName(e.target.value)} />
                                <input className="input" placeholder="Cidade" value={pixCity} onChange={e => setPixCity(e.target.value)} />
                            </>
                        )}
                        {type === 'WIFI' && (
                            <>
                                <input className="input" placeholder="SSID (Nome da Rede)" value={ssid} onChange={e => setSsid(e.target.value)} />
                                <input className="input" type="password" placeholder="Senha" value={password} onChange={e => setPassword(e.target.value)} />
                            </>
                        )}
                        {type === 'WHATSAPP' && (
                            <>
                                <input className="input" placeholder="Número (ex: 5511...)" value={phone} onChange={e => setPhone(e.target.value)} />
                                <textarea className="input" placeholder="Mensagem inicial..." value={message} onChange={e => setMessage(e.target.value)} style={{ minHeight: '80px' }} />
                            </>
                        )}
                        {type === 'VCARD' && (
                            <>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                                    <input className="input" placeholder="Nome" value={vFirstName} onChange={e => setVFirstName(e.target.value)} />
                                    <input className="input" placeholder="Sobrenome" value={vLastName} onChange={e => setVLastName(e.target.value)} />
                                </div>
                                <input className="input" placeholder="Telefone" value={vPhone} onChange={e => setVPhone(e.target.value)} />
                            </>
                        )}
                        {type === 'AI' && (
                            <textarea className="input" placeholder="Fale com a IA..." style={{ minHeight: '100px' }} value={aiPrompt} onChange={e => setAiPrompt(e.target.value)} />
                        )}
                    </div>
                </div>

                <div>
                    {/* Customization */}
                    <div className="glass-card" style={{ background: 'rgba(255,255,255,0.02)', padding: '1.5rem', marginBottom: '2rem', border: '1px solid var(--border-glass)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
                            <Palette size={18} color="var(--secondary)" />
                            <h4 style={{ margin: 0, fontSize: '0.9rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Design & Estilo</h4>
                        </div>
                        
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                            <div>
                                <label style={{ fontSize: '0.7rem', color: '#64748b', display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Cor do QR</label>
                                <input type="color" value={fgColor} onChange={e => setFgColor(e.target.value)} style={{ width: '100%', height: '42px', borderRadius: '0.75rem', border: '1px solid var(--border-glass)', background: 'transparent', cursor: 'pointer' }} />
                            </div>
                            <div>
                                <label style={{ fontSize: '0.7rem', color: '#64748b', display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Fundo</label>
                                <input type="color" value={bgColor} onChange={e => setBgColor(e.target.value)} style={{ width: '100%', height: '42px', borderRadius: '0.75rem', border: '1px solid var(--border-glass)', background: 'transparent', cursor: 'pointer' }} />
                            </div>
                        </div>

                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={{ fontSize: '0.7rem', color: '#64748b', display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>URL do Logo Central</label>
                            <input className="input" placeholder="https://.../logo.png" value={logoUrl} onChange={e => setLogoUrl(e.target.value)} style={{ marginBottom: 0 }} />
                        </div>

                        <div>
                            <label style={{ fontSize: '0.7rem', color: '#64748b', display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Estilo de Moldura</label>
                            <select className="input" value={frameStyle} onChange={e => setFrameStyle(e.target.value)} style={{ background: '#0f172a', marginBottom: 0 }}>
                                <option value="none">Sem Moldura</option>
                                <option value="simple">Borda Fina</option>
                                <option value="rounded">Arredondada</option>
                                <option value="thick">Borda Larga</option>
                                <option value="glow">Brilho Neon</option>
                            </select>
                        </div>
                    </div>

                    {error && (
                        <div style={{ padding: '0.75rem 1rem', borderRadius: '0.75rem', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', marginBottom: '1.5rem', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <AlertCircle size={16} /> {error}
                        </div>
                    )}

                    <button className="btn" style={{ width: '100%', height: '54px', fontSize: '1rem' }} onClick={generate} disabled={loading}>
                        {loading ? 'Processando...' : 'Gerar & Salvar QR Code'}
                        {!loading && <ChevronRight size={20} />}
                    </button>
                </div>
            </div>

            {qrCode && (
                <div className="animate-fade-in" style={{ marginTop: '3rem', paddingTop: '3rem', borderTop: '1px solid var(--border-glass)', textAlign: 'center' }}>
                    <div style={{ display: 'inline-block', background: bgColor, padding: frameStyle === 'none' ? '1rem' : '2rem', borderRadius: frameStyle === 'rounded' ? '3rem' : '1.5rem', border: frameStyle === 'simple' ? '2px solid' + fgColor : frameStyle === 'thick' ? '8px solid' + fgColor : 'none', boxShadow: frameStyle === 'glow' ? `0 0 30px ${fgColor}60` : '0 20px 50px rgba(0,0,0,0.3)' }}>
                        <img src={qrCode} alt="QR Code" style={{ width: '280px', height: '280px', borderRadius: frameStyle === 'rounded' ? '2rem' : '0' }} />
                    </div>
                    <div style={{ marginTop: '2rem' }}>
                        <a href={qrCode} download={`qrcode.png`} className="btn">
                            <Download size={20} /> Baixar PNG
                        </a>
                    </div>
                </div>
            )}
        </div>
    );
}
