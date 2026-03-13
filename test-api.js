const testAPI = async () => {
    const email = `test-${Date.now()}@example.com`;
    console.log(`Testing with email: ${email}`);

    // 1. Generate QR Code
    const res = await fetch('http://localhost:3000/api/qrcode', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            email,
            qrName: 'Test QR',
            content: 'https://google.com'
        })
    });

    const data = await res.json();
    console.log('Generate Response:', data);

    if (res.ok) {
        console.log('✅ QR Code generated and saved.');
    } else {
        console.log('❌ QR Code generation failed.');
    }
};

testAPI();
