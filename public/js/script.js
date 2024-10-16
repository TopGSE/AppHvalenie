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

// Function to handle promoting a user
function handlePromoteUser() {
    console.log('Promote user button clicked');
    document.getElementById('promotion-modal').style.display = 'block';
    populateUserSelect();
}

// Function to populate user select dropdown
async function populateUserSelect() {
    try {
        const response = await fetch('/admin/users');
        const users = await response.json();
        const userSelect = document.getElementById('user-select');
        userSelect.innerHTML = ''; // Clear existing options

        users.forEach(user => {
            const option = document.createElement('option');
            option.value = user._id; // MongoDB ID
            option.text = `${user.username} (${user.role})`;
            userSelect.appendChild(option);
        });
    } catch (error) {
        console.error('Error populating user select:', error);
    }
}

// Function to close the promotion modal
function closePromotionModal() {
    document.getElementById('promotion-modal').style.display = 'none';
}

// Function to submit promotion
async function submitPromotion() {
    const userId = document.getElementById('user-select').value;
    const newRole = document.getElementById('role-select').value;

    try {
        const response = await fetch('/admin/promote-user', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userId, newRole })
        });
        const data = await response.json();
        alert(data.message || 'User updated successfully');
        closePromotionModal();
    } catch (err) {
        alert('An error occurred: ' + err.message);
    }
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








