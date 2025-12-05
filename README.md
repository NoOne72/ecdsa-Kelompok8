# ecdsa-Kelompok8

Demo tanda tangan digital berbasis **ECDSA (Elliptic Curve Digital Signature Algorithm)** untuk penugasan Final Project Kelompok 8. Aplikasi web ini menampilkan alur lengkap pembuatan kunci, penandatanganan file, verifikasi, serta simulasi tampering untuk menunjukkan deteksi integritas.

## Apa yang sudah jadi
- Backend Flask yang menyajikan API generate key, sign, dan verify.
- Implementasi ECDSA pada kurva `NIST256p` dengan library `ecdsa`.
- Frontend HTML/JS untuk interaksi pengguna (generate, sign, verify, simulasi tampering).
- Instruksi instalasi dan menjalankan aplikasi secara lokal.

## Fitur Utama
- Generate Key Pair (Private & Public Key) dalam format hex.
- Sign dokumen/file menggunakan Private Key.
- Verify dokumen menggunakan Public Key dan Signature.
- Simulasi Tampering: server merusak konten file agar verifikasi gagal sebagai demonstrasi keamanan.

## Stack & Dependensi
- Backend: Flask (Python 3.7+).
- Kriptografi: `ecdsa` (kurva `NIST256p`).
- Frontend: HTML, CSS, JavaScript.
- Dependensi tercantum di `requirements.txt`.

## Struktur Proyek
```
ecdsa-Kelompok8/
├── ecdsa-demo/
│   ├── app.py              # Backend Flask
│   ├── templates/
│   │   └── index.html      # Frontend HTML
│   └── static/
│       ├── script.js       # JavaScript logic
│       └── style.css       # Styling
├── requirements.txt        # Python dependencies
└── README.md               # Dokumentasi
```

## Cara Instalasi & Menjalankan (Windows/PowerShell)
1. Masuk ke folder proyek:
   ```powershell
   cd C:\Users\gandh\OneDrive\Documents\5S\KWA\ecdsa-Kelompok8
   ```
2. (Opsional) buat virtualenv:
   ```powershell
   python -m venv venv
   ```
3. Aktifkan virtualenv:
   ```powershell
   .\venv\Scripts\Activate.ps1
   ```
   Jika diblokir execution policy:
   ```powershell
   Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
   ```
   lalu aktifkan ulang.
4. Instal dependensi:
   ```powershell
   python -m pip install -r requirements.txt
   ```
5. Jalankan aplikasi:
   ```powershell
   cd ecdsa-demo
   python app.py
   ```
6. Buka browser ke:
   ```
   http://localhost:5000
   ```

## Alur Penggunaan di Web
1. **Generate Keys** → salin Private Key & Public Key (hex).
2. **Sign Document** → upload file + tempel Private Key → dapatkan signature (hex).
3. **Verify Document** → upload file asli + tempel Public Key & Signature → cek hasil.
4. **Simulasi Tampering** → centang opsi ini; server merusak konten file, verifikasi akan gagal.

## Catatan Keamanan
- Private Key wajib disimpan rahasia; jangan dibagikan.
- Public Key & Signature aman dibagikan untuk proses verifikasi.
- Perubahan sekecil apa pun pada file akan membuat verifikasi gagal.