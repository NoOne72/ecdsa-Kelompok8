# ecdsa-Kelompok8

Demo tanda tangan digital berbasis **ECDSA (Elliptic Curve Digital Signature Algorithm)** untuk penugasan Final Project Kelompok 8. Fokusnya edukatif: menunjukkan cara membuat key pair, menandatangani file, memverifikasi signature, dan melihat efek tampering terhadap integritas data.

## Lingkup Pengerjaan
- Backend Flask dengan API generate key, sign, dan verify.
- Kriptografi ECDSA pada kurva `NIST256p` via library `ecdsa`.
- Frontend sederhana (HTML/JS/CSS) untuk interaksi end-to-end.
- Panduan instalasi & eksekusi lokal (Windows/PowerShell).

## Teknologi yang Dipakai (sudah diimplementasikan)
- **Python 3.7+ & Flask** untuk web backend/routing.
- **Library `ecdsa`** untuk operasi kriptografi kurva eliptik (`NIST256p`).
- **Frontend**: HTML, CSS, JavaScript.
- Dependensi: lihat `requirements.txt`.

## Penjelasan Algoritma & Alur Kode (ringkas)
- **Key Generation** (`/generate-keys`):
  - `sk = SigningKey.generate(curve=NIST256p)` membentuk private key.
  - `vk = sk.verifying_key` menurunkan public key.
  - Keduanya diekspor hex (`to_string().hex()`) supaya mudah disalin.
- **Signing** (`/sign`):
  - File dibaca sebagai bytes: `file_content = file.read()`.
  - Private key di-load: `SigningKey.from_string(bytes.fromhex(priv_key_hex), curve=NIST256p)`.
  - Tanda tangan: `signature = sk.sign(file_content)`, dikirim sebagai hex.
- **Verification** (`/verify`):
  - File dibaca, opsi tamper akan menambah `b'RUSAK'` ke konten untuk simulasi manipulasi.
  - Public key di-load: `VerifyingKey.from_string(bytes.fromhex(pub_key_hex), curve=NIST256p)`.
  - Signature di-load dari hex: `bytes.fromhex(signature_hex)`.
  - Verifikasi: `vk.verify(signature, file_content)`; `BadSignatureError` ditangkap → `valid: false`.
- **Mengapa hex?** Praktis untuk copy-paste di UI, format konsisten antar endpoint.

## Endpoint & Payload Singkat
- `GET /` → halaman web (UI).
- `GET /generate-keys` → `{ private_key, public_key }` (hex).
- `POST /sign` → form-data: `file`, `private_key`; hasil `{ signature }` (hex).
- `POST /verify` → form-data: `file`, `public_key`, `signature`, opsional `tamper=true`; hasil `{ valid: bool }`.

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
- Public Key & Signature aman dibagikan untuk verifikasi.
- Perubahan sekecil apa pun pada file akan membuat verifikasi gagal.