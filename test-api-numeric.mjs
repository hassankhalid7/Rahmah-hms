async function test() {
    try {
        const res = await fetch('http://localhost:3005/api/public/register-institute', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: 12, // Passing as number
                address: 'Test Address',
                phone: '03001234567',
                email: 'test@example.com',
                password: 'password123',
                adminName: 'Test Admin'
            }),
        });

        const data = await res.json();
        console.log('Response:', data);
    } catch (err) {
        console.error('Test failed:', err);
    }
}

test();
