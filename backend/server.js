const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');

const app = express();
const PORT = 5000;

// ==================== Middleware ====================
app.use(cors());
app.use(express.json());

// ==================== Inisialisasi DB SQLite ====================
const db = new sqlite3.Database('./watchlist.db', (err) => {
    if (err) {
        console.error('Gagal terhubung ke database SQLite : ', err.message);
    } else {
        console.log('Terhubung ke database SQLite (watchlist.db)');
    }
});

db.run(`
    CREATE TABLE IF NOT EXISTS movies (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        tmdb_id INTEGER NOT NULL,
        title TEXT NOT NULL,
        poster_path TEXT,
        release_date TEXT,
        status TEXT DEFAULT 'Plan to Watch',
        rating INTEGER DEFAULT 0
    )
`);

// ==================== (GET) /api/watchlist -- Mengambil semua daftar film ====================
app.get('/api/watchlist', (req, res) => {
    const sql = 'SELECT * FROM movies ORDER BY id DESC';

    db.all(sql, [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(rows);
    });
});

// ==================== (POST) /api/watchlist -- Menambah film baru ke watchlist ====================
app.post('/api/watchlist', (req, res) => {
    if (!req.body) {
        return res.status(400).json({ error: 'Request body tidak boleh kosong' });
    }

    const { tmdb_id, title, poster_path, release_date, status, rating } = req.body;

    if (!tmdb_id || !title) {
        return res.status(400).json({ error: 'tmdb_id dan title wajib diisi' });
    }

    const sql = `
        INSERT INTO movies (tmdb_id, title, poster_path, release_date, status, rating)
        VALUES (?, ?, ?, ?, ?, ?)
    `;

    const params = [
        tmdb_id,
        title,
        poster_path || '',
        release_date || '',
        status || 'Plan to Watch',
        rating || 0
    ];

    db.run(sql, params, function (err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        res.status(201).json({
            id: this.lastID,
            tmdb_id,
            title,
            poster_path,
            release_date,
            status: status || 'Plan to Watch',
            rating: rating || 0
        });
    });
});

// ==================== (PUT) /api/watchlist/:id -- Mengubah status menonton atau rating ====================
app.put('/api/watchlist/:id', (req, res) => {
    const { id } = req.params;
    const { status, rating } = req.body;

    const sql = `
        UPDATE movies
        SET status = COALESCE(?, status), rating = COALESCE(?, rating)
        WHERE id = ?
    `;

    db.run(sql, [status, rating, id], function (err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        if (this.changes === 0) {
            return res.status(404).json({ message: 'Film tidak ditemukan' });
        }

        res.json({ message: 'Watchlist berhasil diperbarui' });
    });
});

// ==================== DELETE /api/watchlist/:id -- Menghapus film dari watchlist ====================
app.delete('/api/watchlist/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'DELETE FROM movies WHERE id = ?';

    db.run(sql, id, function (err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        if (this.changes === 0) {
            return res.status(404).json({ message: 'Film tidak ditemukan' });
        }

        res.json({ message: 'Film berhasil dihapus dari watchlist' });
    });
});

// ==================== Server ====================
app.listen(PORT, () => {
    console.log(`Server backend berjalan di http://localhost:${PORT}`);
});
