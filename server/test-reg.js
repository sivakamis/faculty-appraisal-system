const axios = require('axios');

const testRegister = async () => {
    try {
        const response = await axios.post('http://localhost:5000/api/auth/register', {
            name: 'Test Node User',
            email: `test_node_${Date.now()}@example.com`,
            password: 'password123',
            department: 'CS',
            designation: 'Professor',
            role: 'faculty'
        });
        console.log('Registration Success:', response.data);
    } catch (error) {
        console.error('Registration Error:', error.response ? error.response.data : error.message);
    }
};

testRegister();
