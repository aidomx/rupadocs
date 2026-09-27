# View

Modul `view` adalah view engine bawaan Rupa: template HTML murni dengan
marker `id="@name"`, dipindai otomatis, dan dirender tanpa file template
pernah ditulis ulang.

```rupa
import resources as r, render from rupa.view
```

## Apa yang bisa ditulis?

Template disimpan sebagai file `.rpx` di folder `res/` project:

```html
<!-- res/template.rpx -->
<div id="@card">
  <h1 id="@title">Judul</h1>
</div>
```

Di kode, semua marker sudah tersedia sebagai `r.id.<name>` — tanpa load
manual:

```rupa
import resources as r, render from rupa.view

card  = r.id.card
title = r.id.title

print(card.tag)   // div
print(card.body)  // isi elemen (semua yang di antara open/close tag)

print(render(card, "Hello"))  // <div id="@card">Hello</div>
```

## Kapan digunakan?

Saat project `rupa go` (target web) butuh view: HTML template dipisah dari
logika (`app/`), dan engine mengurus sisanya. Ini bagian dari struktur
project standar:

```text
.spec          konfigurasi project
app/           logika (entry main.rp)
res/           view (.rpx) — dipindai otomatis
serve.rp       dev server (opsional, untuk rupa go dev)
```

## Apa hasilnya?

### r.id — auto-scan

Saat modul `resources` dimuat di bawah `rupa go`, SEMUA file `.rpx` di
`res/` (rekursif ke subfolder) dipindai. Setiap marker `id="@name"`
menjadi anggota `r.id.<name>`:

```rupa
r.id.card.name    // "card"
r.id.card.tag     // "div"
r.id.card.open    // open tag lengkap: <div id="@card">
r.id.card.body    // isi elemen
r.id.card.html    // elemen utuh (open + body + close)
r.id.card.pos     // offset elemen dalam file
r.id.card.source  // path relatif file sumber ("res/template.rpx")
```

### id bersifat tunggal

Satu nama marker hanya boleh ada **satu** di seluruh `res/` — dua marker
dengan nama sama menghentikan scan dengan error:

```text
resources: duplikat id="@card" di res/template.rpx
resources: scan dihentikan (duplikat id)
```

Ini konsekuensi dari desain: `r.id.<name>` adalah handle tunggal, bukan
koleksi.

### render — suntik konten

`render(el, content)` mengganti isi elemen dengan konten baru dan
mengembalikan HTML utuh. Hasil hanya hidup di memori / respons server —
file `.rpx` tidak pernah ditulis:

```rupa
render(r.id.card, "Halo")
// <div id="@card">Halo</div>
```

### Dev server (rupa go dev)

Dengan `serve.rp` di root project, `rupa go dev` menjalankan dev server
dengan hot reload. `handle(method, path)` menyuplai respons tiap request:

```rupa
// serve.rp
import resources as r, render from rupa.view

card  = r.id.card
title = r.id.title

handle(method, path) {
  if path.startsWith("/card/") {
    return render(card, path.slice(6, path.length))
  }
  return render(card, "Hello dari " + method + " " + path) +
         render(title, "rpxweb")
}
```

```sh
$ rupa go dev
serve: http://127.0.0.1:8000 (dev server — serve.rp)
serve: hot reload aktif — Ctrl+C untuk berhenti
```

Di luar `rupa go` (mis. eksekusi file langsung), `spec.root` tidak ada —
auto-scan tidak jalan dan `r.id` tetap object kosong. Guard yang tepat:

```rupa
if type(r.id.card) != "object" {
  print("marker @card tidak ditemukan")
}
```
