function loadSongs() {
    const songList = document.getElementById('song-list');

    songs.forEach((song, index) => {
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.textContent = song.title;
        a.href = '#';

        a.addEventListener('click', () => loadSongDetails(index));

        li.appendChild(a);
        songList.appendChild(li);
    });
}

function loadSongDetails(index) {
    const song = songs[index];

    const main = document.querySelector('main');
    main.innerHTML = `
	<main class="song-card-home">
		<h1>${song.title}</h1>
		<button id="toggleChords">Show Chords</button>
        <div id="lyrics">
            <pre>${song.lyrics}</pre>
        </div>
        <div id="lyricsWithChords" style="display: none;">
            <pre>${song.chords}</pre>
        </div>
	</main>
    `;

    const toggleChordsBtn = document.getElementById('toggleChords');
    const lyrics = document.getElementById('lyrics');
    const lyricsWithChords = document.getElementById('lyricsWithChords');

    toggleChordsBtn.addEventListener('click', function () {
        if (lyrics.style.display === "none") {
            lyrics.style.display = "block";
            lyricsWithChords.style.display = "none";
            toggleChordsBtn.textContent = "Show Chords";
        } else {
            lyrics.style.display = "none";
            lyricsWithChords.style.display = "block";
            toggleChordsBtn.textContent = "Show Lyrics";
        }
    });
}

function filterSongs() {
    const searchInput = document.getElementById('search-bar').value.toLowerCase();
    const songList = document.getElementById('song-list');
    const songsLi = songList.getElementsByTagName('li');

    for (let i = 0; i < songsLi.length; i++) {
        const songTitle = songsLi[i].textContent.toLowerCase();

        if (songTitle.includes(searchInput)) {
            songsLi[i].style.display = '';
        } else {
            songsLi[i].style.display = 'none';
        }
    }
}

document.addEventListener("DOMContentLoaded", loadSongs);
