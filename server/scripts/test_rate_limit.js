const http = require('http');

const makeRequest = (i) => {
    const data = JSON.stringify({
        email: `rate-test-${Date.now()}-${i}@example.com`,
        password: 'password123',
        name: 'Rate Test'
    });

    const options = {
        hostname: 'localhost',
        port: 3000,
        path: '/api/auth/signup',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': data.length
        }
    };

    const req = http.request(options, (res) => {
        console.log(`Request ${i}: Status Code ${res.statusCode}`);
    });

    req.on('error', (error) => {
        console.error(`Request ${i}: Error ${error.message}`);
    });

    req.write(data);
    req.end();
};

console.log('Starting Rate Limit Test (7 requests)...');
for (let i = 1; i <= 7; i++) {
    // Stagger requests slightly to ensure order in logs
    setTimeout(() => makeRequest(i), i * 200);
}
