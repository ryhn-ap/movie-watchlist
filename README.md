# 🎬 Movie Watchlist & TMDB Search App

Aplikasi web sederhana untuk mencari film secara *real-time* menggunakan **TMDB Public API** serta mengelola daftar tontonan (*Watchlist*) pribadi menggunakan **REST API Backend** berbasis **SQLite**.

Proyek ini dibuat untuk memenuhi tugas praktikum pengembangan aplikasi *Full-Stack* (Frontend & Backend) dengan dua skenario integrasi:
1. **Skenario 1 (REST API Backend):** Komunikasi antara Frontend dan Backend untuk operasi CRUD (*Create, Read, Update, Delete*) pada daftar *watchlist*.
2. **Skenario 2 (Public API / Web Service):** Komunikasi antara Frontend dan TMDB Public API untuk fitur pencarian data film.

---

## 🚀 Fitur Utama

- **Pencarian Film (Public API):** Mencari data film dari TMDB berdasarkan kata kunci secara *real-time*.
- **Tambah ke Watchlist (Create - POST):** Menyimpan film pilihan dari hasil pencarian ke database SQLite lokal.
- **Lihat Watchlist (Read - GET):** Menampilkan seluruh daftar film yang tersimpan di dalam database.
- **Ubah Status & Rating (Update - PUT):** Memperbarui status tonton (*Plan to Watch*, *Watching*, *Completed*) serta memberi rating pribadi (1–5 bintang).
- **Hapus Film (Delete - DELETE):** Menghapus film dari *watchlist*.
- **Clear Search:** Mengosongkan kolom input dan hasil pencarian dalam satu klik.

---

## 🛠️ Tumpukan Teknologi (Tech Stack)

- **Frontend:** HTML5, Tailwind CSS (via CDN), JavaScript Vanilla (Fetch API)
- **Backend:** Node.js, Express.js
- **Database:** SQLite (`sqlite3` / `better-sqlite3`)
- **Public API:** [The Movie Database (TMDB) API](https://www.themoviedb.org/)

---

## 📂 Struktur Folder

```text
movie_watchlist_app/
├── backend/
│   ├── node_modules/
│   ├── watchlist.db         # Database SQLite lokal (di-ignore oleh git)
│   ├── package.json
│   ├── package-lock.json
│   └── server.js            # Server Express & endpoint REST API
├── frontend/
│   ├── config.js            # Penyimpanan API Key TMDB (di-ignore oleh git)
│   ├── config.example.js    # Template konfigurasi API Key
│   ├── index.html           # Tampilan antarmuka utama (UI)
│   └── app.js               # Logika Fetch API Frontend
├── .gitignore
└── README.md
```

---

## ⚙️ Panduan Menjalankan Proyek

### 1. Prasyarat
- [Node.js](https://nodejs.org/) sudah terinstal di komputer.
- Kunci API dari [TMDB API Developer](https://www.themoviedb.org/settings/api).

### 2. Setup Backend
1. Masuk ke folder `backend`:
   ```bash
   cd backend
   ```
2. Instal *dependencies*:
   ```bash
   npm install
   ```
3. Jalankan server backend:
   ```bash
   npm run dev
   ```
   *Server backend akan berjalan pada `http://localhost:5000`.*

### 3. Setup Frontend
1. Masuk ke folder `frontend`:
   ```bash
   cd ../frontend
   ```
2. Buat file `config.js` dengan menyalin `config.example.js`:
   ```bash
   cp config.example.js config.js
   ```
3. Buka file `config.js` dan masukkan **API Key TMDB** milik Anda:
   ```javascript
   const TMDB_API_KEY = 'MASUKKAN_API_KEY_TMDB_DI_SINI';
   ```
4. Buka file `index.html` langsung di browser atau gunakan ekstensi **Live Server** pada VS Code.

---

## 📡 Endpoint REST API (Backend)

| Method | Endpoint | Deskripsi |
| :--- | :--- | :--- |
| **GET** | `/api/watchlist` | Mengambil seluruh daftar film di *watchlist* |
| **POST** | `/api/watchlist` | Menambahkan film baru ke *watchlist* |
| **PUT** | `/api/watchlist/:id` | Memperbarui status tonton atau rating film |
| **DELETE** | `/api/watchlist/:id` | Menghapus film dari *watchlist* berdasarkan ID |