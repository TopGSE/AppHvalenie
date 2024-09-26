document.addEventListener("DOMContentLoaded", loadSongs);

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
    const toggleChordsBtn = document.getElementById('toggleChords');
    const songList = document.getElementById('song-list');

    songTitle.textContent = song.title;
    songContainer.innerHTML = '';  
    songList.style.display = "none";  
    songContainer.style.fontFamily = "Arial, sans-serif";
    songTitle.style.display = "block"; 
    songContainer.style.display = "block";

    const chordsContainer = document.createElement('div');
	chordsContainer.classList.add('chords-container'); // Add class to chordsContainer

	const lyricsContainer = document.createElement('div');
	lyricsContainer.classList.add('lyrics-container'); // Add class to lyricsContainer

    for (let i = 0; i < song.lyrics.length; i++) {
        const chordSpan = document.createElement('span');
        chordSpan.classList.add('chords');
        chordSpan.textContent = song.chords[i] || '';
        chordSpan.style.display = "none";  // Start hidden
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

    // Add buttons for transposing
    const transposeContainer = document.createElement('div');
    const upButton = document.createElement('button');
    const downButton = document.createElement('button');

    upButton.textContent = "Transpose Up";
    downButton.textContent = "Transpose Down";

    upButton.onclick = function () {
        transposeChords(1);
    };
    downButton.onclick = function () {
        transposeChords(-1);
    };

    transposeContainer.appendChild(upButton);
    transposeContainer.appendChild(downButton);
    songContainer.appendChild(transposeContainer);
}

function toggleChords() {
    const chordSpans = document.querySelectorAll('.chords');
    const toggleChordsBtn = document.getElementById('toggleChords');

    const lyricsContainer = document.querySelector('#song-container div:nth-child(2)');
    const lyricsSpans = lyricsContainer.querySelectorAll('span');

    chordSpans.forEach(span => {
        if (span.style.display === "none") {
            span.style.display = "inline";
            lyricsSpans.forEach(lyricSpan => lyricSpan.style.display = "none");  // Hide lyrics
            toggleChordsBtn.textContent = "Show Lyrics";
        } else {
            span.style.display = "none";
            lyricsSpans.forEach(lyricSpan => lyricSpan.style.display = "inline");  // Show lyrics
            toggleChordsBtn.textContent = "Show Chords";
        }
    });
}

function transposeChords(direction) {
    const chordSpans = document.querySelectorAll('.chords');
    const transposeMap = {
        'C': direction === 1 ? 'D' : 'B',
        'D': direction === 1 ? 'E' : 'C#',
        'E': direction === 1 ? 'F#' : 'D#',
        'F': direction === 1 ? 'G' : 'E',
        'G': direction === 1 ? 'A' : 'F#',
        'A': direction === 1 ? 'B' : 'G#',
        'B': direction === 1 ? 'C#' : 'A#',
        'C#': direction === 1 ? 'D#' : 'C',
        'D#': direction === 1 ? 'E' : 'D',
        'F#': direction === 1 ? 'G#' : 'F',
        'G#': direction === 1 ? 'A#' : 'G',
    };

    chordSpans.forEach(span => {
        const originalChord = span.textContent;
        if (transposeMap[originalChord]) {
            span.textContent = transposeMap[originalChord];
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
