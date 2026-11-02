# Pengumpulan UTS Pemrograman Web Dasar

## Identitas Mahasiswa

- Nama: Fiko Didatama
- NIM: 2405101077
- Kelas: 5E
- Program Studi: Teknik Informatika
- Mata Kuliah: Pemrograman Web Dasar
- Tahun Akademik: 2026/2027

## Deskripsi

Repository ini berisi source code, dokumentasi hasil pengerjaan Ujian Tengah Semester (UTS)
mata kuliah Pemrograman Web Dasar.

## Deskripsi Pengerjaan UTS

Aplikasi yang dibuat adalah **TamaaStore.id**, website toko online yang menjual aksesoris dan
hardware perlengkapan gaming seperti mouse, keyboard, headset, monitor, kartu grafis, SSD,
kursi gaming, mousepad, webcam, dan controller.

Website dibangun hanya dengan **HTML** untuk struktur halaman, **CSS** untuk tampilan, dan
**JavaScript** untuk interaksi, tanpa framework dan tanpa server (backend). Aplikasi terdiri
dari dua bagian:

1. **Halaman pembeli** (`index.html`): pengunjung dapat melihat katalog produk, mencari dan
   memfilter produk, memasukkannya ke keranjang, lalu melakukan checkout dan pembayaran.
2. **Halaman admin** (`admin.html`): pemilik toko dapat melihat dan mengelola pesanan yang
   masuk, mulai dari mengubah status pesanan sampai mengisi nomor resi pengiriman.

Data produk disimpan dalam array JavaScript, sedangkan keranjang dan data pesanan disimpan
di `localStorage` browser.

## Fitur yang Diimplementasikan

**Halaman pembeli**

1. Katalog 14 produk dengan foto, nama, spesifikasi, rating, jumlah terjual, harga, dan harga coret untuk produk diskon.
2. Pencarian produk berdasarkan kata kunci.
3. Filter berdasarkan kategori (Mouse, Keyboard, Audio, Monitor, Komponen, Furnitur, Aksesoris).
4. 
5. Keranjang belanja: tambah barang, ubah jumlah, hapus barang, dan total harga otomatis. Isi keranjang tetap tersimpan saat    halaman dimuat ulang.
6. Checkout tiga langkah: data pengiriman, pembayaran, lalu struk pesanan dengan nomor pesanan.
7. Pembayaran melalui transfer bank (BCA, BRI, Mandiri, BNI, dengan tombol salin nomor rekening) dan QRIS.
8. Konfirmasi pembayaran melalui WhatsApp dengan isi pesan terisi otomatis.
9. Validasi form pada data pengiriman dan form kontak.
    
**Halaman admin**

1. Login admin dengan password.
2. Ringkasan: total pesanan, menunggu pembayaran, perlu dikirim, dan omzet.
3. Daftar pesanan dengan pencarian dan filter status.
4. Pengubahan status pesanan (Menunggu pembayaran, Dibayar, Diproses, Dikirim, Selesai, Dibatalkan), nomor resi, dan catatan    internal.
5. Tombol chat ke pembeli lewat WhatsApp sesuai status pesanan.
6. Impor pesanan dari kode di pesan WhatsApp pembeli dan ekspor data pesanan ke CSV.

## Struktur Folder

- `2405101077-5E-project/`: Source code dan file pendukung UTS.
  - `index.html`: halaman toko untuk pembeli.
  - `style.css`: seluruh tampilan halaman toko (juga dipakai halaman admin).
  - `script.js`: logika toko (produk, pencarian, keranjang, checkout, pembayaran).
  - `admin.html`: halaman admin.
  - `admin.js`: logika halaman admin.
  - `images/`: foto produk dan gambar QRIS (`qris.png`).
- `2405101077-5E-project/screenshots/`: Bukti visual hasil implementasi.

## Cara Menjalankan Aplikasi

Aplikasi berjalan langsung di browser dan tidak memerlukan instalasi apa pun.

1. Unduh atau clone repository ini.
2. Buka folder `2405101077-5E-project/`.
3. Klik dua kali `index.html` untuk membuka halaman toko, atau gunakan ekstensi **Live Server** di VS Code (klik kanan `index.html`, lalu pilih *Open with Live Server*).
4. Untuk membuka halaman admin, buka `admin.html` dengan cara yang sama. Password awal admin adalah `admin123`, dan dapat diubah pada baris pertama file `admin.js`.
