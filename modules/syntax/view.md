# View

Modul `view` menyediakan view engine: pemindaian marker `id="@name"` pada
template `.rpx` di folder `res/`, dan render konten ke elemen. Modul ini
paket Rupa di `stdlib/view/` — diakses lewat `rupa.view`.

```rupa
import resources as r, render from rupa.view
```

## resources — marker auto-scan

Saat project dijalankan lewat `rupa go`, semua file `.rpx` di `res/`
(rekursif) dipindai sekali saat modul dimuat. Hasilnya object `id`:

```rupa
r.id.card.tag     // "div"
r.id.card.body    // isi elemen
r.id.card.html    // elemen utuh
r.id.card.source  // "res/template.rpx"
```

Setiap nama marker bersifat **tunggal**: dua `id="@card"` di mana pun di
`res/` menghentikan scan dengan pesan duplikat.

## render — suntik konten

```rupa
render(el, content)
```

Mengganti isi elemen dengan `content`, mengembalikan HTML utuh sebagai
string. File `.rpx` tidak pernah dimodifikasi — hasil hanya hidup di
memori atau respons server.

```rupa
// res/template.rpx: <div id="@card">placeholder</div>
html = render(r.id.card, "Hello")
print(html)
// <div id="@card">Hello</div>
```

## Contoh end-to-end

```text
project/
├── .spec
├── app/main.rp
├── res/template.rpx
└── serve.rp
```

```html
<!-- res/template.rpx -->
<div id="@card">
  <h1 id="@title">Judul</h1>
</div>
```

```rupa
// app/main.rp
import resources as r, render from rupa.view

print(r.id.card.tag)
// div
print(render(r.id.title, "Halo Rupa"))
// <h1 id="@title">Halo Rupa</h1>
```

```rupa
// serve.rp — dev server (rupa go dev)
import resources as r, render from rupa.view

card = r.id.card
title = r.id.title

handle(method, path) {
  return render(card, "Hello dari " + method + " " + path) +
         render(title, "rpxweb")
}
```

Penjelasan lengkap (struktur project, dev server, guard di luar
`rupa go`): [Syntax — View](../../syntax/view.md).
