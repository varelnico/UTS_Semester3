# Project Ujian Tengah Semester
# Mata kuliah : Pemrograman Web

### Nama    : Varel Nico Ramadhan
### NIM     : 312510156
### Kelas   : I251B
## Link video YouTube : https://youtu.be/uJHs0ATSnxc?si=c74CsGbmiyr6Hoou 

BukuRuang adalah website sederhana yang dibuat untuk mengelola data buku dan melakukan pemesanan buku secara online. Website ini memiliki beberapa halaman yang saling terhubung, mulai dari login, dashboard, katalog buku, pemesanan, hingga pelacakan paket.

Project ini dibuat menggunakan HTML, CSS, dan JavaScript. Penyimpanan data menggunakan Local Storage yang tersedia pada browser.

## Fitur Website

### 1. Login
Halaman untuk pengguna masuk ke website menggunakan email dan password. Terdapat juga fitur daftar akun dan lupa password.

### 2. Dashboard
Halaman utama yang menampilkan sapaan kepada pengguna dan beberapa menu untuk mengakses fitur website.

### 3. Katalog Buku
Menampilkan daftar buku beserta informasi seperti nama buku, jenis, edisi, harga, dan jumlah stok. Pengguna juga dapat menambahkan dan menghapus data buku.

### 4. Pemesanan
Halaman untuk melakukan pemesanan buku dengan mengisi data diri, memilih buku, menentukan jumlah, memilih metode pembayaran, dan memasukkan alamat pengiriman. Total harga akan dihitung secara otomatis.

### 5. Riwayat Transaksi
Menampilkan data pemesanan yang sudah dilakukan, seperti nomor DO, nama pemesan, buku yang dibeli, total harga, dan metode pembayaran.

### 6. Tracking Paket
Digunakan untuk melihat informasi pengiriman berdasarkan nomor DO. Pengguna dapat melihat status dan riwayat perjalanan paket.

### 7. Validasi Form
Terdapat validasi pada beberapa form untuk memastikan data yang dimasukkan sudah sesuai. Jika terjadi kesalahan, website akan menampilkan pesan berupa alert atau pesan error.

## Teknologi

- HTML: digunakan untuk membuat struktur halaman website.
- CSS: digunakan untuk mengatur tampilan website.
- JavaScript: digunakan untuk mengatur fungsi dan interaksi website.
- Local Storage: digunakan untuk menyimpan data pada browser.

## Struktur Folder

```text
BukuRuang/
│
├── login.html
├── dashboard.html
├── stok.html
├── checkout.html
├── tracking.html
│
├── css/
│   └── style.css
│
├── js/
│   ├── data.js
│   └── script.js
│
└── img/
```
