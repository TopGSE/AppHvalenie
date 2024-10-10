// Handle user registration
console.log('auth.js loaded');
document.getElementById('register-form').addEventListener('submit', async (event) => {
    event.preventDefault(); 
    const username = document.getElementById('register-username').value;
    const password = document.getElementById('register-password').value;

    try {
        const response = await fetch('/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        });

        if (!response.ok) {
            throw new Error('Registration failed');
        }

        const data = await response.json();
        document.getElementById('register-message').innerText = data.message || data.error;
    } catch (error) {
        console.error('Error during registration:', error);
        document.getElementById('register-message').innerText = 'An error occurred during registration. Please try again.';
    }
});


