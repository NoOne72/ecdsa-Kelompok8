from flask import Flask, render_template, request, jsonify
from ecdsa import SigningKey, VerifyingKey, NIST256p, BadSignatureError
import hashlib

app = Flask(__name__)

# 1. Route untuk Menampilkan Halaman Web
@app.route('/')
def home():
    return render_template('index.html')

# 2. API: Generate Key Pair (Real ECDSA)
@app.route('/generate-keys', methods=['GET'])
def generate_keys():
    # Membuat Private Key menggunakan kurva NIST256p
    sk = SigningKey.generate(curve=NIST256p)
    # Menurunkan Public Key dari Private Key
    vk = sk.verifying_key
    
    return jsonify({
        # Kita kirim dalam bentuk Hexadecimal string agar mudah dibaca/dicopy
        'private_key': sk.to_string().hex(),
        'public_key': vk.to_string().hex()
    })

# 3. API: Sign Document
@app.route('/sign', methods=['POST'])
def sign():
    try:
        # Ambil data dari Frontend
        file = request.files['file']
        priv_key_hex = request.form['private_key']
        
        # Baca isi file (binary)
        file_content = file.read()
        
        # Load Private Key dari string Hex
        sk = SigningKey.from_string(bytes.fromhex(priv_key_hex), curve=NIST256p)
        
        # Lakukan Signing (File di-hash otomatis oleh library biasanya, tapi kita sign raw content)
        # Output signature dalam bentuk Hex
        signature = sk.sign(file_content)
        
        return jsonify({
            'status': 'success',
            'signature': signature.hex()
        })
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 400

# 4. API: Verify Document
@app.route('/verify', methods=['POST'])
def verify():
    try:
        # Ambil data
        file = request.files['file']
        pub_key_hex = request.form['public_key']
        signature_hex = request.form['signature']
        is_tampered = request.form.get('tamper') == 'true'
        
        file_content = file.read()
        
        # LOGIKA DEMO TAMPERING (Simulasi Perusakan Data)
        # Jika user mencentang 'Simulasi Tampering', kita rusak isi filenya di server
        if is_tampered:
            file_content = file_content + b'RUSAK' # Menambah sampah data
            
        # Load Public Key & Signature
        vk = VerifyingKey.from_string(bytes.fromhex(pub_key_hex), curve=NIST256p)
        signature = bytes.fromhex(signature_hex)
        
        # Proses Verifikasi Matematika
        # Jika valid, fungsi ini diam. Jika invalid, dia error (throw exception).
        if vk.verify(signature, file_content):
            return jsonify({'valid': True})
            
    except BadSignatureError:
        return jsonify({'valid': False}) # Signature tidak cocok
    except Exception as e:
        print(e)
        return jsonify({'valid': False}) # Error lain (format key salah dll)

if __name__ == '__main__':
    app.run(debug=True)
