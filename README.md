# Tifa’s space 

**Nama : Khaula Lathifa Firdausyi**
**NIM: 2511531007**
**Tema:** portofolio pribadi, desain minimalis bernuansa earth tone
**Halaman:** `index.html`, `interests.html`, `contact.html`, `offline.html`

## Cara menjalankan
Jalankan lewat server lokal (service worker tidak bekerja di `file://`):
- VS Code: klik kanan `index.html` > Open with Live Server, atau
- Terminal: `python3 -m http.server 8000` lalu buka `http://localhost:8000`

## Fitur yang berhasil
- Tiga halaman, satu menu navigasi, elemen semantik, 1 tabel, 1 form berlabel, gambar ber-alt
- CSS eksternal bersama, Flexbox/Grid, media query (terbaca di lebar 360 px), tema warna konsisten
- Interaksi 1: tombol tema terang/gelap berbentuk saklar geser (bisa digeser atau diklik), menu buka-tutup di layar kecil, tab hobi
- Interaksi 2: validasi form (nama, email, pesan) dengan pesan error di dekat isian
- Interaksi 3: `data.json` (9 entri) diambil dengan `fetch` lalu ditampilkan lewat manipulasi DOM
- PWA: `manifest.json` + ikon, service worker dengan pre-cache, tampil saat offline, halaman fallback `offline.html`
- Font Rubik disimpan lokal di folder fonts, sehingga tampil normal saat offline.

## Yang belum / catatan
- Form hanya demo (tidak mengirim data ke server)
