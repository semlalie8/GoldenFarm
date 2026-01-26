// Test login directly via API
const testDirectLogin = async () => {
    try {
        console.log('Testing direct login API...\n');

        // Test 1: El Mehdi
        console.log('=== Test 1: El Mehdi ===');
        const response1 = await fetch('http://localhost:5000/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: 'admin@goldenfarm.com',
                password: 'Mehdi@2024'
            })
        });

        console.log('Status:', response1.status);
        const data1 = await response1.json();
        console.log('Response:', data1);

        // Test 2: Ali
        console.log('\n=== Test 2: Ali ===');
        const response2 = await fetch('http://localhost:5000/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: 'admin@goldenfarm.com',
                password: 'Ali@2024'
            })
        });

        console.log('Status:', response2.status);
        const data2 = await response2.json();
        console.log('Response:', data2);

    } catch (error) {
        console.error('Error:', error.message);
    }
};

testDirectLogin();
