import axios from 'axios';

async function testChat() {
    try {
        console.log('Testing AI Chat endpoint...');
        const response = await axios.post('http://localhost:5000/api/ai/chat', {
            message: "hi",
            agent: "Sales & Partnerships Agent"
        }, { timeout: 200000 });
        console.log('Response:', JSON.stringify(response.data, null, 2));
    } catch (error) {
        console.error('Chat Failed:', error.response?.data || error.message);
    }
}

testChat();
