// Handle user registration
document.getElementById('register-form').addEventListener('submit', async (event) => {
    event.preventDefault(); // Prevent the default form submission

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

        // Check if the response is OK (status 200-299)
        if (!response.ok) {
            throw new Error('Registration failed'); // Throw an error for any non-200 responses
        }

        const data = await response.json();
        document.getElementById('register-message').innerText = data.message || data.error;
    } catch (error) {
        console.error('Error during registration:', error);
        document.getElementById('register-message').innerText = 'An error occurred during registration. Please try again.';
    }
});

// Handle showing users
document.getElementById('show-users-btn').addEventListener('click', async () => {
    try {
        const response = await fetch('/admin/users');

        // Check if the response is OK
        if (!response.ok) {
            throw new Error('Failed to fetch users'); // Throw an error for any non-200 responses
        }

        const users = await response.json();
        const usersList = document.getElementById('users-list');
        usersList.innerHTML = ''; // Clear existing list

        users.forEach(user => {
            const li = document.createElement('li');
            li.textContent = user.username; // Display the username
            usersList.appendChild(li);
        });
    } catch (error) {
        console.error('Error fetching users:', error);
        const usersList = document.getElementById('users-list');
        usersList.innerHTML = '<li>Error fetching users. Please try again later.</li>'; // Provide user feedback
    }
});
