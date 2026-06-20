# Qonflo Mini Task Manager

Aplikasi manajemen tugas sederhana yang dibuat sebagai take-home assessment untuk posisi Full Stack Developer di Qonflo.

## Teknologi yang Digunakan

### Frontend

* React
* TypeScript
* Axios
* Vite

### Backend

* Node.js
* Express
* TypeScript

### Penyimpanan Data

* JSON File (`tasks.json` dan `audit-logs.json`)

---

# Fitur

## Manajemen Task

* Membuat task
* Melihat daftar task
* Menghapus task
* Mengubah status task

## Validasi Status

Perubahan status hanya dapat mengikuti alur berikut:

to_do → pending → in_progress → done

Apabila user mencoba melakukan perubahan status yang tidak sesuai alur, sistem akan menolak permintaan tersebut.

## Audit Log

Setiap perubahan status akan menghasilkan audit log baru yang berisi:

* Task yang diubah
* Actor yang melakukan perubahan
* Status sebelumnya
* Status setelah perubahan
* Waktu perubahan

Audit log ditampilkan secara kronologis.

## Idempotent Update

Apabila status yang dikirim sama dengan status saat ini, sistem tidak akan membuat audit log baru.

---

# Arsitektur Aplikasi

## Backend

Backend menggunakan pendekatan layer sederhana:

### Route Layer

Bertugas mendefinisikan endpoint API.

### Controller Layer

Bertugas menerima request dan mengirim response.

### Service Layer

Berisi business logic aplikasi seperti:

* Membuat task
* Mengubah status task
* Validasi alur status
* Membuat audit log

### Persistence Layer

Menyimpan data ke file JSON.

---

## Frontend

Frontend menggunakan React dan TypeScript.

Komponen utama:

### UI Layer

Menampilkan data task dan audit log.

### API Layer

Mengelola komunikasi ke backend menggunakan Axios.

### State Management

Menggunakan React Hooks (`useState` dan `useEffect`).

---

# Cara Menjalankan Aplikasi

## Backend

```bash
cd backend

npm install

npm run dev
```

Backend berjalan pada:

```text
http://localhost:3001
```

## Frontend

```bash
cd frontend

npm install

npm run dev
```

Frontend berjalan pada:

```text
http://localhost:5173
```

---

# Endpoint API

## Mendapatkan Semua Task

```http
GET /tasks
```

## Membuat Task

```http
POST /tasks
```

Body:

```json
{
  "title": "Prepare Invoice"
}
```

## Mengubah Status Task

```http
PATCH /tasks/:id/status
```

Body:

```json
{
  "status": "pending",
  "actor": "john.doe"
}
```

## Menghapus Task

```http
DELETE /tasks/:id
```

## Mendapatkan Audit Log

```http
GET /tasks/:id/audit-logs
```

---

# Asumsi yang Diambil

* Sistem tidak memerlukan autentikasi.
* Actor menggunakan daftar user yang sudah ditentukan (hardcoded).
* Penyimpanan menggunakan file JSON karena diperbolehkan dalam soal.
* Audit log bersifat append-only.
* Hanya perubahan status yang dicatat ke audit log.

---

# Trade-off yang Dibuat

Saya memilih menggunakan file JSON dibanding database karena:

* Requirement memperbolehkan penggunaan file JSON.
* Implementasi menjadi lebih sederhana.
* Fokus pengerjaan dapat diarahkan ke business logic dan audit trail.
* Waktu pengerjaan lebih sesuai dengan estimasi 3–5 jam.

Kekurangannya adalah file JSON tidak cocok digunakan untuk banyak pengguna secara bersamaan.

---

# Bagaimana Saya Memastikan Audit Log Tidak Dimodifikasi?

Audit log disimpan secara terpisah dari data task.

Sistem hanya menambahkan (append) audit log baru ketika terjadi perubahan status.

Tidak tersedia endpoint untuk mengubah ataupun menghapus audit log.

Ketika task dihapus, audit log tetap disimpan sehingga histori perubahan tetap tersedia.

Dengan pendekatan tersebut audit log bersifat immutable (tidak dapat diubah).

---

# Bagian Mana yang Paling Berisiko Jika Digunakan Banyak Pengguna?

Risiko terbesar berada pada mekanisme penyimpanan file JSON.

Apabila banyak pengguna melakukan update secara bersamaan, dapat terjadi race condition yang menyebabkan data tidak konsisten.

Pada sistem produksi, database seperti PostgreSQL atau MongoDB akan lebih tepat digunakan.

---

# Jika Sistem Ini Berkembang Menjadi Lebih Besar, Bagian Mana yang Akan Direfactor Terlebih Dahulu?

Bagian pertama yang akan saya refactor adalah persistence layer (penyimpanan data).

File JSON akan diganti dengan database agar mendapatkan:

* Dukungan transaksi
* Concurrency handling
* Query yang lebih cepat
* Indexing
* Skalabilitas yang lebih baik

Karena business logic sudah dipisahkan ke service layer, proses migrasi ke database akan lebih mudah dilakukan.

---

# Jika Memiliki Waktu Lebih

Beberapa peningkatan yang akan saya lakukan:

* Menambahkan unit test dan integration test
* Menggunakan database
* Menambahkan Docker
* Menambahkan validasi menggunakan Zod
* Menambahkan pencarian dan filter task
* Meningkatkan tampilan UI/UX
* Menambahkan logging yang lebih terstruktur

---

# Penggunaan AI

AI digunakan untuk membantu:

* Pembuatan boilerplate code
* Validasi pendekatan arsitektur
* Referensi implementasi React dan TypeScript

Seluruh kode yang dihasilkan tetap ditinjau kembali, dipahami, dan divalidasi melalui pengujian endpoint serta pengujian fitur aplikasi secara manual.
