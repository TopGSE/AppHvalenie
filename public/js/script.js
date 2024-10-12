console.log("Script is loaded and running");
document.addEventListener("DOMContentLoaded", loadSongs);
const showUsersBtn = document.getElementById('show-users-btn');
const hideUsersBtn = document.getElementById('hide-users-btn');

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

    let chordsHTML = '';
    let lyricsHTML = '';

    for (let i = 0; i < song.lyrics.length; i++) {
        chordsHTML += `<span class="chords">${song.chords[i] || ''}</span><br>`;
        lyricsHTML += `<span>${song.lyrics[i]}</span><br>`;
    }

    songContainer.innerHTML = `
        <div class="lyrics-container">${lyricsHTML}</div>
        <div class="chords-container">${chordsHTML}</div>
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
        const response = await fetch('http://localhost:8888/admin/users');
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const users = await response.json();
        console.log(users);

		document.getElementById('users-list').innerHTML = '';

		const userListItems = users.map(user => {
            return ` <li>${user.username}</li> `;
        }).join(''); 

		showUsersBtn.style.display = 'none';
		hideUsersBtn.style.display = 'block';

        document.getElementById('users-list').innerHTML = userListItems;

    } catch (error) {
        console.error('Error fetching users:', error);
    }
};
showUsersBtn.addEventListener('click', fetchUsers);
const hideUsers = () => {
	document.getElementById('users-list').innerHTML = '';
	showUsersBtn.style.display = 'block';
	hideUsersBtn.style.display = 'none';
}

hideUsersBtn.addEventListener('click', hideUsers);

const forms = document.querySelector(".forms"),
  pwShowHide = document.querySelectorAll(".eye-icon"),
  links = document.querySelectorAll(".link");
pwShowHide.forEach(eyeIcon => {
  eyeIcon.addEventListener("click", () => {
    let pwFields = eyeIcon.parentElement.parentElement.querySelectorAll(".password");
    pwFields.forEach(password => {
      if (password.type === "password") { 
        password.type = "text"; 
        eyeIcon.classList.replace("bx-hide", "bx-show"); 
        return;
      }
      password.type = "password"; 
      eyeIcon.classList.replace("bx-show", "bx-hide");
    });
  });
});
links.forEach(link => {
  link.addEventListener("click", e => {
    e.preventDefault(); 
    forms.classList.toggle("show-signup");
  });
});



