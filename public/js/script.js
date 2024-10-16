console.log("Script is loaded and running");
document.addEventListener("DOMContentLoaded", loadSongs);
const showUsersBtn = document.getElementById('show-users-btn');
const hideUsersBtn = document.getElementById('hide-users-btn');
const usernameLogin = document.getElementById('welcome-message');
usernameLogin.textContent = `Welcome, ${req.user.username}!`;

function loadSongs() {
    const songList = document.getElementById('song-list');

    songs.sort((a, b) => a.title.localeCompare(b.title));

    songs.forEach((song, index) => {
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.textContent = song.title;
        a.href = '#';
        a.addEventListener('click', (event) => {
            event.preventDefault();
            loadSongDetails(index);
        });
        li.appendChild(a);
        songList.appendChild(li);
    });
}
function loadSongDetails(index) {
    const song = songs[index];
    const songContainer = document.getElementById('song-container');
    const songTitle = document.getElementById('song-title');
    const songList = document.getElementById('song-list');

    songTitle.textContent = song.title;
    songList.style.display = "none";
    songTitle.style.display = "block";
    songContainer.style.display = "flex";
    songContainer.style.flexDirection = "row";
    songContainer.style.alignItems = "flex-start";

    let chordsHTML = '';
    let lyricsHTML = '';

    for (let i = 0; i < song.lyrics.length; i++) {
        chordsHTML += `<span class="chords">${song.chords[i] || ''}</span><br>`;
        lyricsHTML += `<span>${song.lyrics[i]}</span><br>`;
    }

    const youtubeButton = `<button onclick="window.location.href='${song.url}'" class="youtube-button">Watch on YouTube</button>`;

    songContainer.innerHTML = `
        <div class="lyrics-container">${lyricsHTML}</div>
        <div class="chords-container">${chordsHTML}</div>
        ${youtubeButton}
    `;
}

function filterSongs() {
    const searchInput = document.getElementById('search-bar').value.toLowerCase();
    const songList = document.getElementById('song-list');
    const songsLi = songList.getElementsByTagName('li');

    for (let i = 0; i < songsLi.length; i++) {
        const songTitle = songsLi[i].textContent.toLowerCase();
        songsLi[i].style.display = songTitle.includes(searchInput) ? '' : 'none';
    }
}
async function fetchUsers() {
    try {
        const response = await fetch('/admin/users');
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const users = await response.json();
        console.log(users);

		document.getElementById('users-list').innerHTML = '';

		const userListItems = users.map(user => {
            return ` 
				<li>${user.username} - ${user.role} </li>
			`;
        }).join(''); 

		showUsersBtn.style.display = 'none';
		hideUsersBtn.style.display = 'block';

        document.getElementById('users-list').innerHTML = userListItems;

    } catch (error) {
        console.error('Error fetching users:', error);
    }
}

showUsersBtn.addEventListener('click', () => {
	console.log('Fetching users...');
	fetchUsers();
});
function hideUsers () {
	document.getElementById('users-list').innerHTML = '';
	showUsersBtn.style.display = 'block';
	hideUsersBtn.style.display = 'none';
}

function handlePromoteUser() {
    console.log('Promote user button clicked');
    document.getElementById('promotion-modal').style.display = 'block';
    populateUserSelect();
}

async function populateUserSelect() {
    try {
        const response = await fetch('/admin/users');
        const users = await response.json();
        const userSelect = document.getElementById('user-select');
        userSelect.innerHTML = '';

        users.forEach(user => {
            const option = document.createElement('option');
            option.value = user._id;
            option.text = `${user.username} (${user.role})`;
            userSelect.appendChild(option);
        });
    } catch (error) {
        console.error('Error populating user select:', error);
    }
}

function closePromotionModal() {
    document.getElementById('promotion-modal').style.display = 'none';
}

// Function to submit promotion
function submitPromotion() {
    // Get the form values
    const userId = document.getElementById('user-select').value;
    const newRole = document.getElementById('role-select').value;

    // Create a form element dynamically
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = '/admin/promote-user';

    // Create hidden input fields for userId and newRole
    const userIdInput = document.createElement('input');
    userIdInput.type = 'hidden';
    userIdInput.name = 'userId';
    userIdInput.value = userId;

    const newRoleInput = document.createElement('input');
    newRoleInput.type = 'hidden';
    newRoleInput.name = 'newrole'; // Correct spelling for your backend to pick up
    newRoleInput.value = newRole;

    // Append the inputs to the form
    form.appendChild(userIdInput);
    form.appendChild(newRoleInput);

    // Append the form to the body and submit it
    document.body.appendChild(form);
    form.submit();
}

// Event listeners
document.getElementById('promoteButton').addEventListener('click', handlePromoteUser);
document.getElementById('close-promotion-modal').addEventListener('click', closePromotionModal);
document.getElementById('submit-promotion').addEventListener('click', submitPromotion);


hideUsersBtn.addEventListener('click', hideUsers);

const forms = document.querySelector(".forms"),
    pwShowHide = document.querySelectorAll(".eye-icon"),
    links = document.querySelectorAll(".link");

pwShowHide.forEach((eyeIcon, index) => {
    eyeIcon.addEventListener("click", () => {
        let pwField = eyeIcon.previousElementSibling; 
        
        if (pwField.type === "password") { 
            pwField.type = "text"; 
            eyeIcon.classList.replace("bx-hide", "bx-show"); 
        } else {
            pwField.type = "password";
            eyeIcon.classList.replace("bx-show", "bx-hide");
        }
    });
});

links.forEach(link => {
    link.addEventListener("click", e => {
        e.preventDefault(); // Prevent default link behavior
        forms.classList.toggle("show-signup");
    });
});

function showToast(title, message, type) {
    const toast = document.createElement('div');
    toast.className = `toast ${type} show`;
    toast.innerHTML = `<strong>${title}</strong><p>${message}</p>`;

    const toastContainer = document.getElementById('toast-container');
    toastContainer.appendChild(toast);

    setTimeout(() => {
        toast.classList.remove('show');
        toast.style.opacity = 0;
        toast.style.transform = 'translateY(-20px)';

        setTimeout(() => {
            toastContainer.removeChild(toast);
        }, 500);
    }, 3000);
}








