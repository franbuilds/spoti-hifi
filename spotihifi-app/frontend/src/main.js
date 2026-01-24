// SpotiHiFi Frontend - Main JavaScript

// State
let searchResults = [];
let selectedTrack = null;
let downloadPath = '';

// DOM Elements
const searchInput = document.getElementById('searchInput');
const btnSearch = document.getElementById('btnSearch');
const btnDownload = document.getElementById('btnDownload');
const btnSelectFolder = document.getElementById('btnSelectFolder');
const globalLoader = document.getElementById('globalLoader');
const resultsContainer = document.getElementById('resultsContainer');
const selectedTrackCard = document.getElementById('selectedTrackCard');
const downloadActionArea = document.getElementById('downloadActionArea');
const progressArea = document.getElementById('progressArea');
const receiptOverlay = document.getElementById('receiptOverlay');
const downloadPathInput = document.getElementById('downloadPath');

// Initialize
async function init() {
    try {
        // Load settings
        const settings = await window.go.main.App.LoadSettings();
        downloadPath = settings.download_path || await window.go.main.App.GetDefaultDownloadPath();
        downloadPathInput.value = downloadPath;
    } catch (error) {
        console.error('Error loading settings:', error);
        downloadPath = '';
    }
}

// Search functionality
async function search() {
    const query = searchInput.value.trim();

    if (!query) {
        searchInput.focus();
        return;
    }

    // Show loading state
    btnSearch.disabled = true;
    btnSearch.innerHTML = '<span class="loader"></span>';
    globalLoader.classList.remove('hidden');
    resultsContainer.classList.add('hidden');
    selectedTrackCard.classList.add('hidden');
    downloadActionArea.classList.add('hidden');

    try {
        // Call Go backend
        const results = await window.go.main.App.SearchSpotify(query, 20);
        searchResults = results || [];

        // Render results
        renderResults();
    } catch (error) {
        console.error('Search error:', error);
        alert('Error al buscar: ' + error);
    } finally {
        btnSearch.disabled = false;
        btnSearch.innerHTML = 'BUSCAR';
        globalLoader.classList.add('hidden');
    }
}

// Render search results
function renderResults() {
    if (searchResults.length === 0) {
        resultsContainer.innerHTML = '<p style="padding: 20px; text-align: center;">No se encontraron resultados</p>';
        resultsContainer.classList.remove('hidden');
        return;
    }

    resultsContainer.innerHTML = searchResults.map((track, index) => `
        <div class="result-item" data-index="${index}" onclick="selectTrack(${index})">
            <img class="result-cover" src="${track.cover || 'https://via.placeholder.com/150?text=No+Cover'}" alt="cover" onerror="this.src='https://via.placeholder.com/150?text=No+Cover'">
            <div class="result-title">${escapeHtml(track.name)}</div>
            <div class="result-artist">${escapeHtml(track.artist)}</div>
        </div>
    `).join('');

    resultsContainer.classList.remove('hidden');
}

// Select a track
function selectTrack(index) {
    selectedTrack = searchResults[index];

    // Update UI
    document.querySelectorAll('.result-item').forEach((el, i) => {
        el.classList.toggle('selected', i === index);
    });

    // Update selected track card
    document.getElementById('selectedCover').src = selectedTrack.cover || 'https://via.placeholder.com/150?text=No+Cover';
    document.getElementById('selectedTitle').textContent = selectedTrack.name;
    document.getElementById('selectedArtist').textContent = selectedTrack.artist;
    document.getElementById('selectedAlbum').textContent = selectedTrack.album;

    selectedTrackCard.classList.remove('hidden');
    downloadActionArea.classList.remove('hidden');
}

// Download functionality
async function download() {
    if (!selectedTrack) {
        alert('Selecciona una canción primero');
        return;
    }

    // Show progress
    btnDownload.disabled = true;
    btnDownload.innerHTML = '<span class="loader"></span> DESCARGANDO...';
    progressArea.classList.remove('hidden');

    const progressFill = document.getElementById('progressFill');
    const progressText = document.getElementById('progressText');
    const progressPercent = document.getElementById('progressPercent');

    // Simulate progress while downloading
    let progress = 0;
    const progressInterval = setInterval(() => {
        progress = Math.min(progress + Math.random() * 15, 90);
        progressFill.style.width = progress + '%';
        progressPercent.textContent = Math.round(progress) + '%';
    }, 500);

    try {
        const result = await window.go.main.App.DownloadTrack({
            spotify_id: selectedTrack.id,
            track_name: selectedTrack.name,
            artist_name: selectedTrack.artist,
            album_name: selectedTrack.album,
            cover_url: selectedTrack.cover,
            isrc: selectedTrack.isrc,
            output_dir: downloadPath
        });

        clearInterval(progressInterval);
        progressFill.style.width = '100%';
        progressPercent.textContent = '100%';
        progressText.textContent = 'Completado!';

        if (result.success) {
            // Show receipt
            setTimeout(() => {
                showReceipt(result.file);
            }, 500);
        } else {
            alert('Error: ' + result.error);
        }
    } catch (error) {
        clearInterval(progressInterval);
        console.error('Download error:', error);
        alert('Error al descargar: ' + error);
    } finally {
        btnDownload.disabled = false;
        btnDownload.innerHTML = 'DESCARGAR FLAC';
        progressArea.classList.add('hidden');
        progressFill.style.width = '0%';
    }
}

// Show receipt modal
function showReceipt(filePath) {
    const now = new Date();

    document.getElementById('rcptDate').textContent = now.toLocaleDateString();
    document.getElementById('rcptTime').textContent = now.toLocaleTimeString();
    document.getElementById('rcptItem').textContent = selectedTrack.name.toUpperCase();
    document.getElementById('rcptArtist').textContent = selectedTrack.artist.toUpperCase();
    document.getElementById('rcptFile').textContent = filePath ? filePath.split('/').pop().split('\\').pop() : '-';

    receiptOverlay.classList.remove('hidden');
}

// Close receipt modal
window.closeReceipt = function (event) {
    if (event && event.target !== receiptOverlay) return;
    receiptOverlay.classList.add('hidden');
    resetUI();
}

// Reset UI
function resetUI() {
    searchInput.value = '';
    searchResults = [];
    selectedTrack = null;
    resultsContainer.classList.add('hidden');
    resultsContainer.innerHTML = '';
    selectedTrackCard.classList.add('hidden');
    downloadActionArea.classList.add('hidden');
}

// Select folder
async function selectFolder() {
    try {
        const folder = await window.go.main.App.SelectFolder();
        if (folder) {
            downloadPath = folder;
            downloadPathInput.value = folder;

            // Save settings
            await window.go.main.App.SaveSettings({ download_path: folder });
        }
    } catch (error) {
        console.error('Error selecting folder:', error);
    }
}

// Utility: Escape HTML
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Event Listeners
btnSearch.addEventListener('click', search);
searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') search();
});
btnDownload.addEventListener('click', download);
btnSelectFolder.addEventListener('click', selectFolder);

// Make selectTrack global
window.selectTrack = selectTrack;

// Initialize on load
document.addEventListener('DOMContentLoaded', init);
