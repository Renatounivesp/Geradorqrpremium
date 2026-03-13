const testCategories = async () => {
    const email = `test-cat-${Date.now()}@example.com`;
    console.log(`Testing with email: ${email}`);

    const types = ['WHATSAPP', 'SMS', 'EMAIL', 'LOCATION'];

    for (const type of types) {
        console.log(`Testing category: ${type}`);
        const res = await fetch('http://localhost:3000/api/qrcode', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email,
                qrName: `Test ${type}`,
                content: `test-content-for-${type}`,
                category: type
            })
        });

        const data = await res.json();
        if (res.ok && data.category === type) {
            console.log(`✅ Category ${type} saved correctly.`);
        } else {
            console.log(`❌ Category ${type} failed to save correctly.`, data);
        }
    }
};

testCategories();
