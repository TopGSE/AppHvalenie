document.addEventListener("DOMContentLoaded", loadSongs);

function loadSongs() {
    const songList = document.getElementById('song-list');

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
    const toggleChordsBtn = document.getElementById('toggleChords');
    const songList = document.getElementById('song-list');

    songTitle.textContent = song.title;
    songContainer.innerHTML = '';  
    songList.style.display = "none";  
    songTitle.style.display = "block"; 
	songContainer.style.display = "block";

    const chordsContainer = document.createElement('div');
    const lyricsContainer = document.createElement('div');

    for (let i = 0; i < song.lyrics.length; i++) {
        const chordSpan = document.createElement('span');
        chordSpan.classList.add('chords');
        chordSpan.textContent = song.chords[i] || '';
        chordSpan.style.display = "none";  
        chordsContainer.appendChild(chordSpan);
        chordsContainer.appendChild(document.createElement('br'));

        const lyricsSpan = document.createElement('span');
        lyricsSpan.textContent = song.lyrics[i];
        lyricsContainer.appendChild(lyricsSpan);
        lyricsContainer.appendChild(document.createElement('br'));
    }

    songContainer.appendChild(chordsContainer);
    songContainer.appendChild(lyricsContainer);

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
            toggleChordsBtn.textContent = "Show Lyrics";
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
        songsLi[i].style.display = songTitle.includes(searchInput) ? '' : 'none';
    }
}
