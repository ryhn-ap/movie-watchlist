const BACKEND_URL = 'http://localhost:5000/api/watchlist';

document.addEventListener('DOMContentLoaded', loadWatchlist);

//  ==================== Pencarian film dengan TMDB API ====================
async function searchMovie() {
    const query = document.getElementById('searchInput').value.trim();
    if (!query) return alert('Ketik judul film terlebih dahulu!');
    const searchResults = document.getElementById('searchResults');
    searchResults.innerHTML = '<p class="col-span-full text-gray-400">Mencari film...</p>';

    try {
        const response = await fetch(
            `https://api.themoviedb.org/3/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}`
        );

        const data = await response.json();
        displaySearchResults(data.results);
    } catch (error) {
        console.error('Gagal mengambil data dari TMDB : ', error);
        searchResults.innerHTML = '<p class="col-span-full text-red-400">Gagal mengambil data film.</p>';
    }
}

// ==================== Menampilkan kartu film dari TMDB ke layar ====================
function displaySearchResults(movies) {
    const searchResults = document.getElementById('searchResults');
    searchResults.innerHTML = '';

    if (!movies || movies.length === 0) {
        searchResults.innerHTML = '<p class="col-span-full text-gray-400">Film tidak ditemukan.</p>';
        return;
    }

    movies.forEach(movie => {
        const posterUrl = movie.poster_path
            ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
            : 'https://via.placeholder.com/500x750?text=No+Poster';
            
        const card = document.createElement('div');
        card.className = 'bg-gray-800 rounded-lg overflow-hidden shadow-lg border border-gray-700 flex flex-col justify-between';
        card.innerHTML = `
            <img src="${posterUrl}" alt="${movie.title}" class="w-full h-64 object-cover">
            <div class="p-3 flex-1 flex flex-col justify-between">
                <div>
                    <h3 class="font-bold text-md mb-1 line-clamp-1">${movie.title}</h3>
                    <p class="text-xs text-gray-400 mb-3">${movie.release_date || 'Tanggal tidak diketahui'}</p>
                </div>
                <button
                    onClick="addToWatchlist(${movie.id}, '${movie.title.replace(/'/g, "\\'")}', '${movie.poster_path || ''}', '${movie.release_date || ''}')"
                    class="w-full bg-emerald-600 hover:bg-emerald-700 text-xs py-2 rounded font-medium transition mt-2"
                >+ Watchlist</button>
            </div>
        `;
        searchResults.appendChild(card);
    });
}

// ============================= REST API BACKEND =============================
// ==================== Menyimpan film ke Backend Database ====================
async function addToWatchlist(tmdb_id, title, poster_path, release_date) {
    try {
        const response = await fetch(BACKEND_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                tmdb_id,
                title,
                poster_path,
                release_date,
                status: 'Plan to Watch',
                rating: 0
            })
        });

        if (response.ok) {
            alert(`"${title}" berhasil ditambahkan ke Watchlist!`);
            loadWatchlist();
        } else {
            alert('Gagal menambahkan film ke Watchlist :(');
        }
    } catch (error) {
        console.error('Error saat menghubungi backend : ', error);
        alert('Gagal terhubung ke server Backend. Pastikan server backend sudah berjalan!');
    }
}

// ==================== Mengambil daftar semua film dari Backend Database dan Menampilkan di layar ====================
async function loadWatchlist() {
    const watchlistResults = document.getElementById('watchlistResults');
    if (!watchlistResults) return;

    try {
        const response = await fetch(BACKEND_URL);
        const movies = await response.json();

        watchlistResults.innerHTML = '';

        if (!movies || movies.length === 0) {
            watchlistResults.innerHTML = '<p class="col-span-full text-gray-400">Belum ada film di Watchlist kamu.</p>';
            return;
        }

        movies.forEach(movie => {
            const posterUrl = movie.poster_path
                ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                : 'https://via.placeholder.com/500x750?text=No+Poster';

            const card = document.createElement('div');
            card.className = 'bg-gray-800 rounded-lg overflow-hidden shadow-lg border border-emerald-600 flex flex-col justify-between';
            card.innerHTML = `
                <img src="${posterUrl}" alt="${movie.title}" class="w-full h-64 object-cover">
                <div class="p-3 flex-1 flex flex-col justify-between">
                    <div>
                        <h3 class="font-bold text-md mb-1 line-clamp-1">${movie.title}</h3>

                        <!-- Form edit status film -->
                        <label class="block text-xs text-gray-400 mb-1">Status : </label>
                        
                        <select
                            id="status-${movie.id}"
                            onchange="updateWatchlist(${movie.id})"
                            class="w-full bg-gray-700 text-xs text-white p-1 rounded border border-gray-600 mb-2 focus:outline-none"
                        >
                            <option value="Plan to Watch" ${movie.status === 'Plan to Watch' ? 'selected' : ''}>Plan to Watch</option>
                            <option value="Watching" ${movie.status === 'Watching' ? 'selected' : ''}>Watching</option>
                            <option value="Completed" ${movie.status === 'Completed' ? 'selected' : ''}>Completed</option>
                        </select>

                        <!-- Form edit Rating -->
                        <label class="block text-xs text-gray-400 mb-1">Rating (1-5) : </label>
                        <select
                            id="rating-${movie.id}"
                            onchange="updateWatchlist(${movie.id})"
                            class="w-full bg-gray-700 text-xs text-yellow-400 p-1 rounded border border-gray-600 mb-3 focus:outline-none"
                        >
                            <option value="0" ${movie.rating === 0 ? 'selected' : ''}>Belum ada rating</option>
                            <option value="1" ${movie.rating === 1 ? 'selected' : ''}>⭐ 1</option>
                            <option value="2" ${movie.rating === 2 ? 'selected' : ''}>⭐⭐ 2</option>
                            <option value="3" ${movie.rating === 3 ? 'selected' : ''}>⭐⭐⭐ 3</option>
                            <option value="4" ${movie.rating === 4 ? 'selected' : ''}>⭐⭐⭐⭐ 4</option>
                            <option value="5" ${movie.rating === 5 ? 'selected' : ''}>⭐⭐⭐⭐⭐ 5</option>
                        </select>
                    </div>

                    <!-- Tombol hapus -->
                    <button
                        onclick="deleteWatchlist(${movie.id}, '${movie.title.replace(/'/g, "\\'")}')"
                        class="w-full bg-red-600 hover:bg-red-700 text-xs py-1.5 rounded font-medium transition text-white"
                    >Hapus Film</button>
                </div>
            `;
            watchlistResults.appendChild(card);
        });
    } catch (error) {
        console.error('Gagal mengambil watchlist : ', error);
        watchlistResults.innerHTML = '<p class="col-span-full text-red-400">Gagal memuat Watchlist dari Backend.</p>';
    }
}

// ==================== Update status atau rating film di Backend (PUT) ====================
async function updateWatchlist(id) {
    const status = document.getElementById(`status-${id}`).value;
    const rating = parseInt(document.getElementById(`rating-${id}`).value);

    try {
        const response = await fetch(`${BACKEND_URL}/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status, rating })
        });

        if (response.ok) {
            console.log(`Watchlist ID ${id} berhasil diperbarui.`);
        } else {
            alert('Gagal memperbarui status atau rating film.');
        }
    } catch (error) {
        console.error('Gagal memperbarui watchlist : ', error);
    }
}

// ==================== Menghapus film dari Backend Database (DELETE) ====================
async function deleteWatchlist(id, title) {
    if (!confirm(`Apakah kamu yakin ingin menghapus "${title}" dari watchlist ?`)) {
        return;
    }

    try {
        const response = await fetch(`${BACKEND_URL}/${id}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            alert(`"${title}" berhasil dihapus.`);
            loadWatchlist();
        } else {
            alert('Gagal menghapus film dari watchlist.');
        }
    } catch (error) {
        console.error('Gagal menghapus film : ', error);
    }
}

// ==================== Membersihkan hasil pencarian dan kolom input ====================
function clearSearchResults() {
    document.getElementById('searchInput').value = '';
    document.getElementById('searchResults').innerHTML = '';
}
