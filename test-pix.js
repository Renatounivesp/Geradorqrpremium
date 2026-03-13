import { generatePixPayload } from './src/lib/pix.ts';

const params = {
    key: '12345678909',
    name: 'JOSE DA SILVA TESTE NOME LONGO',
    city: 'SAO PAULO CIDADE LONGA',
    amount: 10.50,
    description: 'Teste'
};

try {
    const payload = generatePixPayload(params);
    console.log('Payload:', payload);
} catch (e) {
    console.error('Error:', e);
}
