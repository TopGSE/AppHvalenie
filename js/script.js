document.addEventListener("DOMContentLoaded", loadSongs);

function loadSongs() {
    const songList = document.getElementById('song-list');

    songs.forEach((song, index) => {
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.textContent = song.title;
        a.href = '#';  // Prevents page reload
        a.addEventListener('click', (event) => {
            event.preventDefault();  // Stops the anchor from reloading the page
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
    const toggleChordsBtn = document.getElementById('toggleChords');

    songTitle.textContent = song.title;
    songContainer.innerHTML = '';  // Clear previous content

    // Add lyrics and chords
    for (let i = 0; i < song.lyrics.length; i++) {
        const chordSpan = document.createElement('span');
        chordSpan.classList.add('chords');
        chordSpan.textContent = song.chords[i] || '';
        chordSpan.style.display = "none";  // Initially hide chords
        songContainer.appendChild(chordSpan);
        songContainer.appendChild(document.createElement('br'));

        const lyricsSpan = document.createElement('span');
        lyricsSpan.textContent = song.lyrics[i];
        songContainer.appendChild(lyricsSpan);
        songContainer.appendChild(document.createElement('br'));
    }

    // Show the toggle button and set it up
    toggleChordsBtn.style.display = "inline-block";
    toggleChordsBtn.textContent = "Show Chords";
    toggleChordsBtn.onclick = function () {
        toggleChords();
    };
}

function toggleChords() {
    const chordSpans = document.querySelectorAll('.chords');
    const toggleChordsBtn = document.getElementById('toggleChords');

    chordSpans.forEach(span => {
        if (span.style.display === "none") {
            span.style.display = "inline";
            toggleChordsBtn.textContent = "Hide Chords";
        } else {
            span.style.display = "none";
            toggleChordsBtn.textContent = "Show Chords";
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
