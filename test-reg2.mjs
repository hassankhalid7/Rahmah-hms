// Test with exact same data user would submit
const res = await fetch('http://localhost:3000/api/public/register-institute', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'My Institute',
    address: 'Lahore',
    phone: '03001234567',
    email: 'uzohaib295@gmail.com',
    password: 'mypassword123',
    adminName: 'Zohaib Ahmed',
  }),
});

const text = await res.text();
console.log('Status:', res.status);
console.log('Response:', text);
