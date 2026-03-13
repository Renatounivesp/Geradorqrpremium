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
    Send
} from 'lucide-react';
import { generatePixPayload } from '@/lib/pix';

type QRType = 'URL' | 'PIX' | 'WIFI' | 'PHONE' | 'AI' | 'VCARD' | 'CNPJ' | 'WHATSAPP' | 'SMS' | 'EMAIL' | 'LOCATION';

export default function QRGenerator() {
    const [type, setType] = useState<QRType>('URL');
    const [content, setContent] = useState('');
    const [qrCode, setQrCode] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [email, setEmail] = useState('');
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
            setError('Por favor, insira seu e-mail para continuar.');
            return;
        }

        setLoading(true);
        setError('');
        let finalContent = content;

        try {
            if (type === 'PIX') {
                if (!pixKey || !pixName || !pixCity) {
                    throw new Error('Preencha os campos obrigatórios do PIX.');
                }
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
                finalContent = `https://wa.me/${phone.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`;
            } else if (type === 'SMS') {
                finalContent = `SMSTO:${phone.replace(/\D/g, '')}:${message}`;
            } else if (type === 'EMAIL') {
                finalContent = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
            } else if (type === 'LOCATION') {
                finalContent = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
            } else if (type === 'AI') {
                if (!aiPrompt) throw new Error('Digite algo para a IA processar.');
                processAI(aiPrompt);
                return;
            }

            // Call backend to save and check trial
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

            if (!response.ok) {
                throw new Error(result.error || 'Erro ao processar sua solicitação.');
            }

            const dataUrl = await QRCode.toDataURL(finalContent, {
                width: 1000,
                margin: 4,
                color: {
                    dark: fgColor,
                    light: bgColor,
                },
                errorCorrectionLevel: logoUrl ? 'H' : 'M'
            });

            // If logo exists, overlay it using a canvas
            if (logoUrl) {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                const img = new Image();
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

                // Draw a white background for the logo
                if (ctx) {
                    ctx.fillStyle = bgColor;
                    ctx.fillRect(x - 5, y - 5, logoSize + 10, logoSize + 10);
                    ctx.drawImage(logo, x, y, logoSize, logoSize);
                }
                
                setQrCode(canvas.toDataURL());
            } else {
                setQrCode(dataUrl);
            }
        } catch (err: any) {
            setError(err.message || 'Erro ao gerar QR Code.');
        } finally {
            setLoading(false);
        }
    };

    const processAI = (prompt: string) => {
        setLoading(true);
        // Simulation of AI processing
        setTimeout(() => {
            const lower = prompt.toLowerCase();
            if (lower.includes('pix')) {
                setType('PIX');
                // Simple extraction logic
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
        <div className="glass-card" style={{ maxWidth: '800px', margin: '2rem auto' }}>
            {/* User Identification Section */}
            <div style={{ marginBottom: '2rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                    <label style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: '0.4rem', display: 'block' }}>Seu E-mail (necessário para trial)</label>
                    <input
                        className="input"
                        type="email"
                        placeholder="exemplo@email.com"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        style={{ margin: 0 }}
                    />
                </div>
                <div>
                    <label style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: '0.4rem', display: 'block' }}>Nome do QR (opcional)</label>
                    <input
                        className="input"
                        placeholder="Ex: Wi-Fi da Loja"
                        value={qrName}
                        onChange={e => setQrName(e.target.value)}
                        style={{ margin: 0 }}
                    />
                </div>
            </div>

            {/* Dynamic QR Toggle */}
            <div className="glass-card" style={{ marginBottom: '2rem', padding: '1rem', background: 'rgba(99, 102, 241, 0.05)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ color: 'var(--primary)' }}><Sparkles size={24} /></div>
                    <div>
                        <p style={{ margin: 0, fontWeight: 'bold', fontSize: '0.9rem' }}>QR Code Dinâmico (Recomendado)</p>
                        <p style={{ margin: 0, fontSize: '0.75rem', color: '#94a3b8' }}>Permite editar o link depois de impresso e rastrear acessos.</p>
                    </div>
                </div>
                <div 
                    onClick={() => setIsDynamic(!isDynamic)}
                    style={{ 
                        width: '50px', 
                        height: '26px', 
                        background: isDynamic ? 'var(--primary)' : 'rgba(255,255,255,0.1)', 
                        borderRadius: '20px', 
                        padding: '3px', 
                        cursor: 'pointer',
                        transition: 'all 0.3s',
                        display: 'flex',
                        justifyContent: isDynamic ? 'flex-end' : 'flex-start'
                    }}
                >
                    <div style={{ width: '20px', height: '20px', background: 'white', borderRadius: '50%', boxShadow: '0 2px 4px rgba(0,0,0,0.2)' }} />
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
                {[
                    { id: 'URL', label: 'Link/Texto', icon: <LinkIcon size={20} /> },
                    { id: 'PIX', label: 'PIX', icon: <CreditCard size={20} /> },
                    { id: 'WIFI', label: 'WiFi', icon: <Wifi size={20} /> },
                    { id: 'PHONE', label: 'Telefone', icon: <Smartphone size={20} /> },
                    { id: 'VCARD', label: 'Contato', icon: <User size={20} /> },
                    { id: 'CNPJ', label: 'Empresa', icon: <Building size={20} /> },
                    { id: 'WHATSAPP', label: 'WhatsApp', icon: <MessageCircle size={20} /> },
                    { id: 'SMS', label: 'SMS', icon: <Send size={20} /> },
                    { id: 'EMAIL', label: 'E-mail', icon: <Mail size={20} /> },
                    { id: 'LOCATION', label: 'Localização', icon: <MapPin size={20} /> },
                    { id: 'AI', label: 'AI Assistant', icon: <Sparkles size={20} /> },
                ].map((t) => (
                    <button
                        key={t.id}
                        onClick={() => setType(t.id as QRType)}
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            padding: '1rem',
                            borderRadius: '0.75rem',
                            border: type === t.id ? '2px solid var(--primary)' : '1px solid var(--border-glass)',
                            background: type === t.id ? 'rgba(99, 102, 241, 0.1)' : 'transparent',
                            cursor: 'pointer',
                            color: type === t.id ? 'var(--primary)' : '#94a3b8',
                            transition: 'all 0.3s'
                        }}
                    >
                        {t.icon}
                        <span style={{ fontSize: '0.8rem', marginTop: '0.5rem', fontWeight: 'bold' }}>{t.label}</span>
                    </button>
                ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: qrCode ? '1fr 1fr' : '1fr', gap: '2rem' }}>
                <div>
                    {type === 'URL' && (
                        <input
                            className="input"
                            type="text"
                            placeholder="Digite a URL ou texto..."
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                        />
                    )}

                    {type === 'PIX' && (
                        <>
                            <input className="input" placeholder="Chave PIX (CPF, Email, Telefone, Aleatória)" value={pixKey} onChange={e => setPixKey(e.target.value)} />
                            <input className="input" placeholder="Nome do Recebedor" value={pixName} onChange={e => setPixName(e.target.value)} />
                            <input className="input" placeholder="Cidade" value={pixCity} onChange={e => setPixCity(e.target.value)} />
                            <input className="input" type="number" placeholder="Valor (opcional)" value={pixAmount} onChange={e => setPixAmount(e.target.value)} />
                            <input className="input" placeholder="Descrição (opcional)" value={pixDesc} onChange={e => setPixDesc(e.target.value)} />
                        </>
                    )}

                    {type === 'WIFI' && (
                        <>
                            <input className="input" placeholder="Nome da Rede (SSID)" value={ssid} onChange={e => setSsid(e.target.value)} />
                            <input className="input" type="password" placeholder="Senha" value={password} onChange={e => setPassword(e.target.value)} />
                            <select className="input" value={encryption} onChange={e => setEncryption(e.target.value)} style={{ background: '#020617' }}>
                                <option value="WPA">WPA/WPA2</option>
                                <option value="WEP">WEP</option>
                                <option value="nopass">Sem senha</option>
                            </select>
                        </>
                    )}

                    {type === 'PHONE' && (
                        <input className="input" placeholder="Número de Telefone (ex: 5511...)" value={content} onChange={e => setContent(e.target.value)} />
                    )}

                    {type === 'VCARD' && (
                        <>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                                <input className="input" placeholder="Nome" value={vFirstName} onChange={e => setVFirstName(e.target.value)} />
                                <input className="input" placeholder="Sobrenome" value={vLastName} onChange={e => setVLastName(e.target.value)} />
                            </div>
                            <input className="input" placeholder="Telefone" value={vPhone} onChange={e => setVPhone(e.target.value)} />
                            <input className="input" placeholder="E-mail" value={vEmail} onChange={e => setVEmail(e.target.value)} />
                        </>
                    )}

                    {type === 'CNPJ' && (
                        <input className="input" placeholder="CNPJ (apenas números)" value={cnpj} onChange={e => setCnpj(e.target.value)} />
                    )}
                    
                    {type === 'WHATSAPP' && (
                        <>
                            <input className="input" placeholder="Número do WhatsApp (ex: 5511...)" value={phone} onChange={e => setPhone(e.target.value)} />
                            <textarea className="input" placeholder="Mensagem pré-definida" value={message} onChange={e => setMessage(e.target.value)} style={{ minHeight: '80px' }} />
                        </>
                    )}

                    {type === 'SMS' && (
                        <>
                            <input className="input" placeholder="Número do Telefone (ex: 5511...)" value={phone} onChange={e => setPhone(e.target.value)} />
                            <textarea className="input" placeholder="Mensagem SMS" value={message} onChange={e => setMessage(e.target.value)} style={{ minHeight: '80px' }} />
                        </>
                    )}

                    {type === 'EMAIL' && (
                        <>
                            <input className="input" placeholder="Para (e-mail)" value={vEmail} onChange={e => setVEmail(e.target.value)} />
                            <input className="input" placeholder="Assunto" value={subject} onChange={e => setSubject(e.target.value)} />
                            <textarea className="input" placeholder="Corpo do e-mail" value={body} onChange={e => setBody(e.target.value)} style={{ minHeight: '80px' }} />
                        </>
                    )}

                    {type === 'LOCATION' && (
                        <>
                            <input className="input" placeholder="Latitude" value={latitude} onChange={e => setLatitude(e.target.value)} />
                            <input className="input" placeholder="Longitude" value={longitude} onChange={e => setLongitude(e.target.value)} />
                            <p style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '-0.5rem', marginBottom: '1rem' }}>
                                Dica: Obtenha as coordenadas no Google Maps.
                            </p>
                        </>
                    )}

                    {type === 'AI' && (
                        <textarea
                            className="input"
                            placeholder="Fale com a IA: 'Quero um pix de 50 reais para a chave email@teste.com nome João em SP'"
                            style={{ minHeight: '120px' }}
                            value={aiPrompt}
                            onChange={e => setAiPrompt(e.target.value)}
                        />
                    )}

                    {/* Customization Section */}
                    <div className="glass-card" style={{ padding: '1.5rem', marginBottom: '1.5rem', background: 'rgba(255,255,255,0.02)' }}>
                        <p style={{ margin: '0 0 1rem 0', fontWeight: 'bold', fontSize: '0.9rem', color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Sparkles size={16} /> Personalização
                        </p>
                        
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                            <div>
                                <label style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'block', marginBottom: '0.4rem' }}>Cor do QR</label>
                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                    <input 
                                        type="color" 
                                        value={fgColor} 
                                        onChange={e => setFgColor(e.target.value)}
                                        style={{ width: '100%', height: '38px', borderRadius: '0.5rem', border: '1px solid var(--border-glass)', background: 'transparent', cursor: 'pointer' }}
                                    />
                                </div>
                            </div>
                            <div>
                                <label style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'block', marginBottom: '0.4rem' }}>Fundo</label>
                                <input 
                                    type="color" 
                                    value={bgColor} 
                                    onChange={e => setBgColor(e.target.value)}
                                    style={{ width: '100%', height: '38px', borderRadius: '0.5rem', border: '1px solid var(--border-glass)', background: 'transparent', cursor: 'pointer' }}
                                />
                            </div>
                        </div>

                        <div style={{ marginBottom: '1rem' }}>
                            <label style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'block', marginBottom: '0.4rem' }}>URL do Logo (ex: https://.../logo.png)</label>
                            <input 
                                className="input" 
                                placeholder="https://exemplo.com/seu-logo.png" 
                                value={logoUrl} 
                                onChange={e => setLogoUrl(e.target.value)}
                                style={{ margin: 0 }}
                            />
                        </div>

                        <div>
                            <label style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'block', marginBottom: '0.4rem' }}>Estilo da Moldura</label>
                            <select 
                                className="input" 
                                value={frameStyle} 
                                onChange={e => setFrameStyle(e.target.value)} 
                                style={{ margin: 0, background: '#020617' }}
                            >
                                <option value="none">Sem Moldura</option>
                                <option value="simple">Borda Simples</option>
                                <option value="rounded">Borda Arredondada</option>
                                <option value="thick">Borda Grossa</option>
                                <option value="glow">Efeito Brilho</option>
                            </select>
                        </div>
                    </div>

                    {error && (
                        <div style={{ padding: '0.75rem', borderRadius: '0.5rem', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <AlertCircle size={18} />
                            <span style={{ fontSize: '0.85rem' }}>{error}</span>
                        </div>
                    )}

                    <button className="btn" style={{ width: '100%' }} onClick={generate} disabled={loading}>
                        {loading ? 'Processando...' : (type === 'AI' ? 'Analisar com IA' : 'Gerar QR Code')}
                    </button>
                </div>

                {qrCode && (
                    <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                        <div 
                            style={{ 
                                background: bgColor, 
                                padding: frameStyle === 'none' ? '1rem' : '2rem', 
                                borderRadius: frameStyle === 'rounded' ? '2.5rem' : '1rem',
                                border: frameStyle === 'simple' ? '2px solid' + fgColor : 
                                        frameStyle === 'thick' ? '8px solid' + fgColor : 'none',
                                boxShadow: frameStyle === 'glow' ? `0 0 20px ${fgColor}80` : 'none'
                            }}
                        >
                            <img src={qrCode} alt="QR Code" style={{ maxWidth: '100%', height: 'auto', borderRadius: frameStyle === 'rounded' ? '1.5rem' : '0' }} />
                        </div>
                        <div style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem' }}>
                            <a href={qrCode} download={`qrcode-${type.toLowerCase()}.png`} className="btn" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <Download size={18} />
                                PNG
                            </a>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
