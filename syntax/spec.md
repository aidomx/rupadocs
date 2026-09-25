# Spec — konfigurasi proyek

Konfigurasi proyek `.spec` mengikuti `rupa go` — data proyek, target
compile, server dev, sampai kredensial database.

## Apa yang bisa ditulis?

```sh
rupa spec web        # generate .spec.example target web
rupa spec android    # target lain: android, software, ios
rupa spec -e         # enkripsi .spec.example -> .spec (default sha512)
rupa spec -e sha256  # dengan algo lain
rupa spec -d         # decrypt .spec kembali ke .spec.example
```

## Kapan digunakan?

Saat proyek class dibuat dan dijalankan lewat `rupa go`. `.spec.example`
adalah templat plaintext untuk diisi nilai asli; `.spec` adalah
konfigurasi yang dibaca `rupa go` saat eksekusi.

## Apa hasilnya?

`rupa spec web` menghasilkan `.spec.example`:

```text
name: your app name
author: -
version: "1.0"

target: web
arch: unknown
debug: true
release: false
domain: example.com
settings:
  - host: 127.0.0.1
  - port: 8000
  - protocol: http
  - dbhost: 127.0.0.1
  - dbport: 5432
  - dbname: app
  - dbuser: -
  - dbpass: -
  - vps:
    - settingan vps
```

Isi nilai asli di file itu, lalu `rupa spec -e` mengenkripsinya menjadi
`.spec` — password diminta dua kali (hidden, tidak muncul di layar):

```text
rupa-spec-enc: sha512
check: <16 hex digest plaintext>
<hex payload>
```

Format `.spec` sama dengan `.spec.example` (parser yang sama), jadi
mengenkripsi tidak mengubah arti konfigurasi — `rupa go` yang menemukan
header `rupa-spec-enc:` akan meminta password dulu, dan **berhenti bila
password salah** (tidak jalan dengan nilai default).

### settings: database dan server

Kredensial database (`dbhost/dbport/dbname/dbuser/dbpass`) dan server
(`host/port/protocol`, daftar `vps`) hidup di section `settings:`.
Inilah alasan utama enkripsi: `.spec` yang mengandung kredensial asli
tidak boleh terbaca sembarangan — kasus yang sama dengan `.env` yang
tidak sengaja ter-upload.

### Kebijakan upload

- `.spec.example` — plaintext, aman di-upload.
- `.spec` — boleh di-upload mau bentuk encrypted atau tidak, terserah
  Anda; mau aman ya encrypted sebelum upload.

### Mode dev / build (rupa go)

```sh
rupa go dev     # debug=true, release=false; cari serve.rp,
                # tanpa itu jalankan server default dari .spec.settings
rupa go build   # debug=false, release=true (emisi target menyusul)
```

Target tidak perlu ditulis — dibaca dari `target:` di `.spec`
(`rupa go web dev` juga masih diterima).

### Catatan

- Password tidak disimpan di mana pun; lupa password = `.spec` harus
  di-generate ulang dari `.spec.example`.
- `rupa spec -d` menulis `.spec.example`, kecuali file itu sudah ada —
  hasilnya ke `.spec.example.out` agar tidak menimpa diam-diam.
- Enkripsi berbasis hash (key = H(password)); cukup untuk menyembunyikan
  konfigurasi dari pembacaan kasual, bukan penyimpanan jangka panjang
  materi yang sangat sensitif.
