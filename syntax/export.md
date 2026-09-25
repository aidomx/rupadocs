# Export

Export deklarasi dari file agar bisa di-import oleh file lain.

## Bentuk kanonik

Hanya ada **dua bentuk export** yang jadi standar bahasa:

### 1. Semua member — `export * from ./X`

Ekspor semua yang ada di X (flatten). Policy tetap bisa menyertai:

```rupa
export * from ./X
export * from ./X -> { secret: private }
```

Member yang di-mark `private` diterbitkan sebagai `null` dan dicatat di
`_private` — tidak bisa dipanggil dari luar.

### 2. Selective — `export x, y from ./X`

Ekspor hanya `x` dan `y` dari X:

```rupa
// file modules/math.rp
add(a, b) { return a + b }
sub(a, b) { return a - b }
mul(a, b) { return a - b }

// file index.rp — hanya export add dan sub
export add, sub from ./math
```

```rupa
import add, sub from ./index
print(add(2, 3))  // 5
print(sub(5, 2))  // 3
// mul tidak bisa di-import — tidak di-export
```

### Re-export dengan nama — `export name from ./path`

Satu nama polos mengikat **member bernama sama** bila ada di module sumber
(mis. fungsi `open` di `open.rp`), selain itu mengikat **seluruh module**
sebagai namespace — bentuk ini yang merangkai pohon package:

```rupa
// file index.rp
export math_utils from ./math    // math.rp → namespace math_utils
export view from ./view          // sub-package → member pohon
```

```rupa
import math_utils from ./index
print(math_utils.add(2, 3))  // 5
```

> Nama namespace (`math_utils`) tidak harus sama dengan nama file (`math.rp`).

## Policy — `-> { item: private }`

Mengontrol akses item pada re-export namespace:

```rupa
// file modules/auth.rp
login(user, pass) { ... }
register(user, pass) { ... }
hashPassword(pass) { ... }   // internal — tidak boleh diakses luar

// file index.rp
export auth from ./auth -> { hashPassword: private }
```

```rupa
import auth from ./index
auth.login("admin", "123")      // ✅ works
auth.register("user", "456")    // ✅ works
auth.hashPassword("secret")     // ❌ PrivateError: 'hashPassword' is private and cannot be called from outside
```

Policy boleh ditulis multi-line — blok `-> {` dibuka di akhir statement dan
isi diletakkan di baris berikutnya:

```rupa
// file index.rp
export auth from ./auth -> {
  hashPassword: private
}
```

Kedua bentuk (single-line dan multi-line) berperilaku identik.

## Namespace — `namespace name { ... }`

Namespace mengelompokkan export ke dalam satu object namespace:

```rupa
namespace db {
  export driver from ./driver
  export dsn from ./dsn
}
```

```rupa
import db from rupa
db.driver.has("sqlite")
```

> Nama directory/package tidak harus sama dengan nama namespace yang diekspor.

## Package & Tree Export

Package adalah directory dengan `index.rp`. File leaf (selain `index.rp`)
**tidak wajib export** — cukup berisi kode. Ia hanya bisa dijangkau melalui
rantai index-nya, tidak pernah langsung dari luar package.

```text
rpx_engine/
├── index.rp            export view from ./view
└── view/
    ├── index.rp        export resources from ./resources -> { load: private }
    └── resources.rp    leaf — tanpa export, cukup berisi kode
```

Index berperan sebagai node cabang pohon: `view/index.rp` mengekspos isi
leaf-nya, `index.rp` induk mengekspos sub-package-nya. Import dotted hanya
menavigasi pohon ini:

```rupa
// main.rp
import v from ./rpx_engine

print(v.view.resources.id)      // ✅ terjangkau lewat rantai index
print(v.view.resources.load)    // undefined — private di edge index
```

Dua jaminan runtime:

- **Eksekusi sekali** — module yang sama hanya dieksekusi satu kali per run
  program, berapa kali pun dan dari jalur mana pun di-export ulang.
- **Import tidak bocor** — binding hasil `import` di dalam sebuah file bukan
  milik module itu, jadi **tidak ikut terekspos** saat file di-publish sebagai
  module. Yang dilihat consumer hanya yang didefinisikan file tersebut.

```rupa
// view/resources.rp
import fs, os from rupa         // konsumsi internal

const id = "res"
load() { ... }
```

```rupa
import v from ./rpx_engine
print(v.view.resources.fs)      // undefined — fs bukan milik resources
print(v.view.resources.id)      // "res"
```

## Aturan

| Syntax | Keterangan |
|--------|------------|
| `export * from ./X` | **Kanonik** — semua member X di-flatten |
| `export x, y from ./X` | **Kanonik** — selective: hanya `x` dan `y` |
| `export name from ./path` | Member `name` bila ada, selain itu whole module |
| `export name from ./path -> { x: private }` | Namespace `name`, `x` tidak bisa diakses |
| `namespace c { export x from ./x }` | Membentuk namespace `c` dari export di dalam body |

## Error Cases

- **Module tanpa export**: Jika file tidak memiliki `export`, `import` menghasilkan `ImportError: Module '<path>' does not export anything — nothing to import`.
- **Member tidak di-export**: `import x from ./mod` saat `x` tidak di-export module menghasilkan `ImportError: Member 'x' not found in module './mod'`.
- **Module tidak ditemukan**: `import x from ./tidakada` menghasilkan `ImportError: Import failed for 'x' from './tidakada'`.
- **Dotted path melompati pohon**: `import z from ./pkg.z` saat tidak ada `pkg.z` di rantai index menghasilkan `ImportError` — import dotted hanya menavigasi cabang yang benar-benar ada di pohon package.
- **File leaf diakses langsung dari luar package**: import langsung ke file internal package ditolak — aksesnya harus melalui index package-nya.
- **Import private item**: Jika mencoba memanggil item yang di-mark `private`, muncul `PrivateError: '<name>' is private and cannot be called from outside`.
- **Bentuk warisan**: bare import (`import X`), bare export (`export x`), member chain (`import x.y`), wildcard member (`import x.*`), entry alias (`import x as y`), dan source alias (`from X as m`) bukan bagian dari grammar — baris seperti itu tidak memproduksi import/export dan diabaikan seperti statement tak dikenal.

## Path Resolution

| Path | Resolves to |
|------|-------------|
| `./modules.a` | `./modules/a.rp` |
| `./modules` | `./modules/*.rp` |
| `rupa` | stdlib module |
