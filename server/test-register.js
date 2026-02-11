const testRegister = async () => {
    try {
        const response = await fetch('http://localhost:5000/api/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: 'Test User 2',
                email: 'test' + Date.now() + '@example.com',
                password: 'password123',
                department: 'CS',
                designation: 'Prof'
            })
        });

        const data = await response.json();
        console.log('Status:', response.status);
        console.log('Response:', data);
    } catch (error) {
        console.error('Error:', error.message);
    }
};

testRegister();
