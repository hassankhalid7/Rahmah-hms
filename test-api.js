fetch('http://localhost:3000/api/organizations/register', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Cookie': 'session={"userId":"a1b2c3d4-e5f6-7890-1234-56789abcdef0"}'
  },
  body: JSON.stringify({
    name: 'jj',
    address: '123 Test St',
    phone: '1234567890'
  })
})
.then(r => r.text())
.then(console.log)
.catch(console.error);
