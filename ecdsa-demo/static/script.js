// Variable global tidak lagi dibutuhkan untuk logika, 
// karena semua diproses ulang oleh server.

// 1. GENERATE KEYS (Panggil Python)
document.getElementById('btn-gen-keys').addEventListener('click', function() {
    const btn = this;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Generating...';

    fetch('/generate-keys')
        .then(response => response.json())
        .then(data => {
            document.getElementById('private-key').value = data.private_key;
            document.getElementById('public-key').value = data.public_key;
            
            // Auto fill ke bawah
            document.getElementById('sign-priv-key').value = data.private_key;
            
            btn.innerHTML = '<i class="fas fa-check"></i> Keys Generated';
            checkSignReady();
        })
        .catch(err => {
            console.error(err);
            alert("Gagal menghubungi server Python!");
        });
});

// Helper: Cek tombol sign
document.getElementById('file-upload-sign').addEventListener('change', checkSignReady);
function checkSignReady() {
    const file = document.getElementById('file-upload-sign').files[0];
    const key = document.getElementById('sign-priv-key').value;
    const btn = document.getElementById('btn-sign');
    if(file && key) {
        btn.disabled = false;
        btn.classList.add('btn-primary');
        btn.classList.remove('btn-action');
    }
}

// 2. SIGN DOCUMENT (Kirim file ke Python)
document.getElementById('btn-sign').addEventListener('click', function() {
    const fileInput = document.getElementById('file-upload-sign');
    const privKey = document.getElementById('sign-priv-key').value;
    const btn = this;

    if(fileInput.files.length === 0) return;

    // Siapkan data untuk dikirim
    const formData = new FormData();
    formData.append('file', fileInput.files[0]);
    formData.append('private_key', privKey);

    btn.innerHTML = '<i class="fas fa-cog fa-spin"></i> Signing...';

    fetch('/sign', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if(data.status === 'success') {
            document.getElementById('signature-output').value = data.signature;
            document.getElementById('btn-copy-sig').style.display = 'inline-block';
            btn.innerHTML = 'Sign Document';
            
            // --- UPDATE: TAMPILKAN MODAL SUKSES ---
            const modal = document.getElementById('success-modal');
            modal.classList.remove('hidden'); // Hapus class hidden dulu
            // Timeout kecil agar transisi CSS terbaca
            setTimeout(() => {
                modal.classList.add('show');
            }, 10);
            
        } else {
            alert("Error: " + data.message);
            btn.innerHTML = 'Sign Document';
        }
    })
    .catch(err => {
        alert("Server Error");
        btn.innerHTML = 'Sign Document';
    });
});

// Copy Button
document.getElementById('btn-copy-sig').addEventListener('click', function() {
    const sigText = document.getElementById('signature-output');
    sigText.select();
    document.execCommand("copy");
    this.innerText = "Copied!";
    setTimeout(() => this.innerText = "Copy", 2000);
});

// 3. VERIFY DOCUMENT (Kirim file + Sig + Key ke Python)
document.getElementById('btn-verify').addEventListener('click', function() {
    const fileInput = document.getElementById('file-upload-verify');
    const pubKey = document.getElementById('verify-pub-key').value;
    const signature = document.getElementById('verify-sig-input').value;
    const isTampered = document.getElementById('tamper-checkbox').checked;
    
    const statusBox = document.getElementById('verification-status');
    const statusText = document.getElementById('status-text');
    const icon = statusBox.querySelector('i');
    const btn = this;

    if(fileInput.files.length === 0 || !pubKey || !signature) {
        alert("Data tidak lengkap!");
        return;
    }

    const formData = new FormData();
    formData.append('file', fileInput.files[0]);
    formData.append('public_key', pubKey);
    formData.append('signature', signature);
    formData.append('tamper', isTampered);

    statusBox.className = 'status-box hidden';
    btn.innerHTML = '<i class="fas fa-search fa-spin"></i> Verifying...';

    fetch('/verify', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        btn.innerHTML = 'Verify Document';
        statusBox.classList.remove('hidden');

        if (data.valid) {
            // HASIL VALID
            statusBox.classList.add('valid');
            statusBox.classList.remove('invalid');
            statusText.innerText = "SIGNATURE VALID: Dokumen Asli & Terverifikasi.";
            icon.className = "fas fa-check-circle";
        } else {
            // HASIL INVALID
            statusBox.classList.add('invalid');
            statusBox.classList.remove('valid');
            let reason = "Tanda tangan tidak cocok atau dokumen telah diubah.";
            if(isTampered) reason = "INTEGRITY CHECK FAILED: Dokumen terdeteksi telah dimodifikasi (Tampered)!";
            statusText.innerText = "INVALID: " + reason;
            icon.className = "fas fa-times-circle";
        }
    })
    .catch(err => alert("Server Error"));
});

// --- NEW: LOGIKA TUTUP MODAL ---
document.getElementById('btn-close-modal').addEventListener('click', function() {
    const modal = document.getElementById('success-modal');
    modal.classList.remove('show');
    
    // Tunggu animasi CSS selesai (0.3s) baru di-hide displaynya
    setTimeout(() => {
        modal.classList.add('hidden');
    }, 300);
});
