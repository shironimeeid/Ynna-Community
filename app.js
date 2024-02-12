// app.js
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Set view engine dan lokasi views
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware untuk parsing body dari HTTP request
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Route untuk menampilkan halaman index.ejs
app.get('/', (req, res) => {
    // Baca data absensi terakhir dari file absensi.json
    fs.readFile('absensi.json', 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading absensi.json:', err);
            return res.status(500).send('Terjadi kesalahan saat membaca data absensi');
        }
        const absensi = JSON.parse(data);
        res.render('index', { absensi: absensi });
    });
});

// Route untuk menambahkan data absensi
app.post('/absen', (req, res) => {
    const { nama, cosplay, event } = req.body;
    if (!nama || !cosplay || !event) {
        return res.status(400).send('Semua kolom harus diisi!');
    }
    const newAttendance = {
        nama: nama,
        cosplay: cosplay,
        event: event,
        tanggal: new Date().toISOString()
    };
    // Baca data absensi dari file absensi.json
    fs.readFile('absensi.json', 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading absensi.json:', err);
            return res.status(500).send('Terjadi kesalahan saat membaca data absensi');
        }
        const absensi = JSON.parse(data);
        // Tambahkan data absensi baru
        absensi.push(newAttendance);
        // Tulis kembali data absensi ke file absensi.json
        fs.writeFile('absensi.json', JSON.stringify(absensi), 'utf8', (err) => {
            if (err) {
                console.error('Error writing to absensi.json:', err);
                return res.status(500).send('Terjadi kesalahan saat menyimpan data absensi');
            }
            console.log('Data absensi berhasil disimpan:', newAttendance);
            res.redirect('/');
        });
    });
});

// Jalankan server Express
app.listen(PORT, () => {
    console.log(`Server berjalan di http://localhost:${PORT}`);
});
