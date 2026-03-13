const testPix = async () => {
    const email = `test-pix-debug@example.com`;
    console.log(`Testing PIX with email: ${email}`);

    // Simulate a long PIX payload (approx 200 chars)
    const pixPayload = '00020101021126580014br.gov.bcb.pix0111123456789090211Pagamento Teste520400005303986540510.505802BR5925JOSE DA SILVA TESTE NOME L6015SAO PAULO CIDAD62070503***6304ABCD';

    const res = await fetch('http://localhost:3000/api/qrcode', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            email,
            qrName: 'Debug PIX',
            content: pixPayload,
            category: 'PIX'
        })
    });

    const data = await res.json();
    console.log('Status:', res.status);
    console.log('Response:', data);

    if (res.ok) {
        console.log('✅ PIX API call successful.');
    } else {
        console.log('❌ PIX API call failed.');
    }
};

testPix();
