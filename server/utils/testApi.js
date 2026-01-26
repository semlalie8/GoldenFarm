const testLoginHistory = async () => {
    try {
        // 1. Login
        console.log('Logging in...');
        const loginRes = await fetch('http://localhost:5000/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: 'admin@goldenfarm.com',
                password: 'mehdi123'
            })
        });

        const loginData = await loginRes.json();

        if (!loginRes.ok) {
            throw new Error(`Login failed: ${JSON.stringify(loginData)}`);
        }

        const token = loginData.token;
        console.log('Login successful. Token obtained.');

        // 2. Fetch History
        console.log('Fetching history...');
        const historyRes = await fetch('http://localhost:5000/api/analytics/logins', {
            headers: { Authorization: `Bearer ${token}` }
        });

        const historyData = await historyRes.json();

        console.log('History Response Status:', historyRes.status);
        if (historyRes.ok) {
            console.log('Logs found:', historyData.logs.length);
            if (historyData.logs.length > 0) {
                console.log('First log:', historyData.logs[0]);
            }
        } else {
            console.log('Error data:', historyData);
        }

    } catch (error) {
        console.error('Error:', error);
    }
};

testLoginHistory();
