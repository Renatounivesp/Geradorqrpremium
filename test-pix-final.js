import { generatePixPayload } from './src/lib/pix.ts';

const problematicParams = {
    key: '(11) 99999-9999', // Needs sanitization
    name: 'JOSE DA SILVA CORAÇÃO AÇÃÚ', // Accents and long
    city: 'SÃO PAULO CAPITAL', // Accents and long
    amount: 15.50,
    description: 'Teste de Robustez'
};

try {
    const payload = generatePixPayload(problematicParams);
    console.log('--- PIX PAYLOAD DEBUG ---');
    console.log('Payload:', payload);
    
    // Manual check of lengths in payload
    // 59 (Name) should be 59 + length + sanitized name
    const nameMatch = payload.match(/59(\d{2})([A-Z0-9 ]+)/);
    if (nameMatch) {
        const len = parseInt(nameMatch[1]);
        const content = nameMatch[2].substring(0, len);
        console.log(`Name Length Declared: ${len}, Content Length: ${content.length}`);
        if (len !== content.length) console.log('❌ LENGTH MISMATCH IN NAME');
    }

    const cityMatch = payload.match(/60(\d{2})([A-Z0-9 ]+)/);
    if (cityMatch) {
        const len = parseInt(cityMatch[1]);
        const content = cityMatch[2].substring(0, len);
        console.log(`City Length Declared: ${len}, Content Length: ${content.length}`);
        if (len !== content.length) console.log('❌ LENGTH MISMATCH IN CITY');
    }

    console.log('--- END DEBUG ---');
} catch (e) {
    console.error('Error:', e);
}
