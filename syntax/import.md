# Import

Import kode dari file lain ke dalam scope saat ini. Import statements harus berada di bagian atas file.

## Bentuk kanonik

Hanya ada **dua bentuk import** yang jadi standar bahasa, ditambah navigasi
pohon package:

### 1. Semua member — `import * as x from ./X`

Ambil semua yang ada di X, simpan sebagai namespace `x`:

```rupa
import * as x from ./X

x.create()
x.update()
```

Tanpa alias, seluruh member di-flatten ke scope saat ini:

```rupa
import * from ./X

create()
update()
```

### 2. Selective — `import x, y from ./X`

Ambil hanya `x` dan `y` dari X:

```rupa
import create, update from ./modules.a

create()
update()
```

Nama binding mengikuti nama member — `import info from ./os` memanggil
`info()` langsung di top-level.

> Prinsip desain: import dan export memakai bentuk yang **setara** —
> `*` (semua) dan selective (sebagian). Member chain (`x.y`), wildcard
> member (`x.*`), entry alias (`x as y`), source alias (`from X as m`),
> dan bare import (`import X`) bukan bagian dari grammar.

## Stdlib

```rupa
import os from rupa               // module os → os.info()
import db, math from rupa         // beberapa module sekaligus
import info from rupa.os          // selective: fungsi info dari module os
```

## Navigasi pohon package

Import dengan dotted path **bukan akses langsung ke file** — resolusinya
berurutan dengan urutan tetap:

1. **Z-self menang** — bila `pkg/y/z.rp` ada **dan punya statement export**
   (`export *`, `export x`, atau `namespace`), path adalah referensi langsung
   ke file leaf itu. Leaf polos tanpa export tidak dihitung.
2. **Tree navigation** — bila tidak, `pkg/y/index.rp` wajib ada: masuk cabang
   `y`, ambil member `z` dari export index cabangnya ("apakah ada sub module
   yang di-export?").
3. **Tidak keduanya** → `ImportError` — tidak ada fallback diam-diam.

```text
rpx_engine/
├── index.rp            export view from ./view
└── view/
    ├── index.rp        export resources from ./resources -> { load: private }
    └── resources.rp    leaf — tanpa export → hanya via index cabang
```

Semua bentuk ini sah dan setara menavigasi pohon yang sama:

```rupa
import v from ./rpx_engine                      // root → v.view.resources
import view from ./rpx_engine.view              // masuk sub-package sebagai root
import resources from ./rpx_engine.view.resources  // redirect ke view/index.rp

print(v.view.resources.id)      // ✅
print(view.resources.id)        // ✅ sama pohonnya
print(resources.id)             // ✅ member dari index cabang
```

Dotted path yang melompati pohon ditolak:

```rupa
import z from ./rpx_engine.z    // ❌ ImportError — tidak ada cabang z
```

Leaf yang mengekspor dirinya terjangkau langsung:

```rupa
// view/tools.rp — punya `export *`
import tools from ./rpx_engine.view.tools   // ✅ Z-self: akses langsung
```

Catatan:

- **Module dieksekusi sekali** per run, berapa kali pun di-import atau
  di-export ulang antar index.
- **Binding import tidak bocor** — `import fs, os from rupa` di dalam leaf
  adalah konsumsi internal: `fs`/`os` tidak muncul di object yang dilihat
  consumer. Yang terekspos hanya yang didefinisikan file tersebut.

```rupa
// view/resources.rp
import fs, os from rupa         // konsumsi internal
const id = "res"
```

```rupa
import resources from ./rpx_engine.view.resources
print(resources.fs)             // undefined — fs bukan milik resources
print(resources.id)             // "res"
```

## Ringkasan

| Syntax | Hasil |
|--------|-------|
| `import * as x from ./X` | **Kanonik** — semua member X sebagai namespace `x` |
| `import * from ./X` | Semua member X di-flatten ke scope |
| `import x, y from ./X` | **Kanonik** — selective: hanya `x` dan `y` |
| `import X from rupa` | Module X dari stdlib |
| `import X, Y from rupa` | Beberapa module stdlib |
| `import X from rupa.Y` | Selective dari module Y |
| `import X from ./pkg.a.b` | Navigasi pohon package — member `b` dari index cabang `a` |
