# TODO — Rupa Language

> Status fitur: siap, dalam pengembangan, belum ada.
> Terakhir diperbarui: 28 September 2026 (sinkron v0.2.2)

---

## Ringkasan

| Kategori          | Siap | Dalam Pengembangan | Belum |
| ----------------- | ---- | ------------------ | ----- |
| Syntax & Grammar  | 31   | 1                  | 4     |
| Standard Library  | 17   | 0                  | 0     |
| Module System     | 11   | 0                  | 3     |
| REPL & Editor     | 14   | 1                  | 0     |
| Compiler (`-c`)   | 0    | 1                  | 1     |
| Testing           | 188  | -                  | 0     |
| Documentation     | 35   | 0                  | 3     |

Testing: syntax **61/61** (`rupa test`), AST **8/8** (`rupa test ast`),
IR rewrite **61/61** (`rupa test ir`), IR exec **61/61** (`rupa test
irexec`), execution **18/18** (`rupa test exec`), REPL **37/37**
(`rupa test repl`), formatter **2/2** (`rupa test fmt`).
1 FAIL by-design: `tests/stress/index.rp` memang memicu LexerError
(file berisi `.` untuk menguji tampilan error).

Tooling baru v0.2.2: opcode disassembler `rupa ir` (IR readable per
opcode untuk debugging pipeline), build library `lib/librupa.a` +
`lib/librupa.so` (rbot `libraryName`/`libraryShared`) untuk embedding
rbot/rupad via `#include <rupa.h>`.

Batch runner baru: `rupa test [kategori] [--list] [--select n]` dengan
kategori `syntax` (default), `ast`, `ir`, `irexec`, `exec`, `semantics`,
`repl`, `fmt` — plus shortcut `-t`, `-l`, `-p`, `-s`
(mis. `rupa -ts ast 1`, `rupa -lp exec`). Rincian: `rupa help test`.

---

## 1. Syntax & Grammar

### ✅ Siap

Literal, Print, Assignment, Expression, String, Array, Object, If/Else,
Block, Function, Return, Loop (while), Case, Call, Struct, Enum, Annotation,
Update/Increment (compound `+=` dst.), Import, Export, Control Flow,
Fallback, Then, Member Access, Comment — docs masing-masing di
`docs/syntax/*.md` + `docs/grammar/*.md`.

| Fitur baru        | Catatan                                                                 |
| ----------------- | ----------------------------------------------------------------------- |
| Number 64-bit     | `as.number` = long long; `sizeof(number)` = 8; print `%lld`             |
| Return-type + void | `foo(): void {}` — enforcement di interpreter & IR; non-void kini
  juga dicek: `getName(): string { return 1 }` = TypeError (scalar,
  struct terdaftar, `T[]`, handle Contract)                        |
| Class             | `Name: Type {}` → `NODE_CLASS_DECL`; AST `Class:`, formatter round-trip |
| Enum              | `enum Nama { MEMBER = 1 }` → AST member eksplisit; auto-increment       |
| Ternary           | `cond ? a : b` — pipe `c \| v \| else`, cascade `c -> v \| else`        |
| Loop for-init     | `for i = 0; i < 10 {` / `rev i = 10; i > 0 {` — init + condition        |
| View builtin      | `r.id.<name>` auto-scan `res/**/*.rpx`, id tunggal, render tanpa tulis file |
| Print pola 3      | printf-style: `print("%s\n", "hi")` — `%s %d %f %x %c` + flags/width/precision |
| Print pola 4      | stream target: `print(stderr, format, ...)`; binding `stdout`/`stderr`  |
| Color             | hex literal `#rgb`/`#rrggbb` (NUMBER 24-bit), `U_RED`..., enum member
  `color` → ANSI truecolor via print; `#` non-hex = LexerError (komentar
  kini hanya `//` dan `/* */`)                                      |

### 🔨 Dalam Pengembangan

| Fitur       | Catatan                                    |
| ----------- | ------------------------------------------ |
| Async/Await | `await` syntax & handler blok belum stabil |
| Class (lanjutan) | `this`/closure, `super`, `@created`, `@input` |

### ❌ Belum Tersedia

For loop penuh (segmen increment), Destructuring, Try/Catch,
Generator/Iterator, Decorator.

Catatan: pemilihan nilai ber-condition kini punya bentuk ternary khusus
(`docs/syntax/ternary.md`); fallback chain `x = primary | fallback` tetap
untuk coalescing (lihat `docs/syntax/fallback.md`).

---

## 2. Standard Library (C)

### ✅ Siap — 11 modul native

os, io, json, thread, math, string (`stdstring`), http, datetime, regex,
crypto, net — docs di `docs/modules/syntax/*.md` + `docs/modules/grammar/*.md`.

### ✅ Siap — 5 Rupa packages

sys, fs, database, collections, view — view engine (`r.id.<name>` auto-scan
marker `id="@name"` di `res/**/*.rpx` via `spec.root`, render konten tanpa
menulis file; `docs/modules/syntax/view.md`).

Di luar hitungan: rupamemory (sizeof, blok ops contract ccpy/cmove/cset,
dup family) built-in global tanpa import. pin/elpin/repin/repins/unpin
**dihapus** — alokasi satu pintu lewat `new/del` + `new Contract()`;
blok ops lama `setpin/movepin/copypin` di-rename `cset/cmove/ccpy`.

### ❌ Belum Tersedia

(kosong — view sudah masuk sebagai package)

---

## 3. Module System

### ✅ Siap

Import single/local/specific/alias/wildcard, Export + alias, Namespace export
block, Dotted-path export, Duplicate-export detection, Archive
(`modules/rupa_modules.tar.gz`), Module cache (satu file = satu eksekusi
per run, kunci canonical path), ImportError spesifik untuk semua bentuk
import gagal (module tanpa export, member tidak ada, module tidak ditemukan
— exit code 1), Policy `-> { name: private }` multi-line, Package boundary
(leaf package hanya terjangkau via rantai index-nya).

**Penyederhanaan bentuk import/export**: hanya 4 bentuk kanonik yang tersisa
(`import * as x`, `import x, y`, `export *`, `export x, y` + re-export nama).
Bentuk warisan — bare import/export, member chain `x.y`, wildcard member
`x.*`, entry alias, source alias — bukan bagian dari grammar (tanpa
pesan migrasi; bahasa belum release).
Detail di `docs/syntax/import.md` dan `docs/syntax/export.md`.

Rancangan tree export (model pohon package, policy per-edge, jalur terbuka)
terkunci di dokumen internal `src/docs/tree_export.md`.

### ❌ Belum Tersedia

Package registry (npm-like), Version pinning, Lock file.

---

## 4. Formatter & REPL & Editor

### ✅ Formatter

Format file/stdin, spasi operator, comment, blank line, import round-trip,
self-heal import, conditional assign. Arsitektur modular di `src/formatter/`.

### ✅ REPL & Editor

Interactive REPL, line numbers, indentation, command, multiline input,
backspace rollback, history.

### 🔨 Dalam Pengembangan

Bracket pair matching (nested `{}` indent tidak akurat —
`tests/execution/repl_struct.rp`).

---

## 5. Compiler (`-c`)

### 🔨 Dalam Pengembangan

IR pipeline (`src/compiler/ir/`): AST → IR (`rewrite.c`) + executor
(`execute.c`). **`rupa <file.rp>` kini jalan via IR** (`runWithIR = true` di
`src/prompt/runner.c`); interpreter tetap ada sebagai fallback
(`--test-exec`/`--test`). IR → C source (transpiler) belum diimplementasi.

### ❌ Belum Tersedia

`rupa -c file.rp -o binary` (transpile to C → native binary).

---

## 6. Testing

| Suite         | Jumlah | Status |
| ------------- | ------ | ------ |
| syntax        | 61     | PASS   |
| ast           | 8      | PASS   |
| ir            | 61     | PASS   |
| irexec        | 61     | PASS   |
| exec          | 18     | PASS   |
| repl          | 37     | PASS   |
| fmt           | 2      | PASS   |

Suite baru: `number64.rp` (overflow 32-bit & presisi 2^53), `void_ret.rp`
(return-type + void + bare return), `class.rp` (class decl + construct),
`const.rp` (const + re-init loop/fungsi), `print_format_stream.rp`
(pola 3 printf-style + pola 4 stream target).

Dijalankan lewat batch runner: `rupa test`, `rupa test --list`,
`rupa test --select 1`, atau shortcut `rupa -t`, `rupa -l`, `rupa -lp ast`.

---

## 7. Documentation

### ✅ Siap

Index (syntax/grammar/modules), Main, Import, Export + docs module:
math, os, io, json, string, thread, http, datetime, regex, crypto, net,
sys, fs, database (syntax + grammar masing-masing), view
(modules/syntax/view.md + syntax/view.md). Update 26 September 2026:
hlama view (API lama `Render.view`) ditulis ulang, halaman ternary baru,
loop for-init terdokumentasi, `spec.root` masuk docs spec.
Update 28 September 2026 (sinkron v0.2.2): halaman [Color](syntax/color.md)
baru (hex literal + U_* binding + enum color), `comment.md` & `syntax.md`
diperbarui (`#` bukan komentar lagi — komentar `//` dan `/* */`),
`print.md` sudah memuat pola 3 (printf-style) & pola 4 (stream target).

### ❌ Belum Dibuat

`docs/modules/syntax/collections.md`,
`docs/syntax/namespace.md`, `docs/grammar/namespace.md`.

---

## 8. Pending Tasks

### High

- (kosong)

### Medium

- Class lanjutan: `this`/closure → `super` + `@created` → runner `rupa go` +
  `@input`
- Const binding ✅ (`const x = v` slot immutable, ConstError saat
  reassign); def/ifdef family — DITUNDA: scope-nya sub-sistem
  preprocessor C-style (const enum block, `def`, `ifdef`)
- Design tipe: number 64-bit ✅, void ✅, const binding ✅, char/int skip,
  bigint defer
- new Contract / new T() / del / string slot — ✅ Done; terbuka:
  `new string()`, interaksi const × del
- new Recontract(src, n) ✅ — realloc handle GC apa pun (raw/Contract);
  elemSize & tipe elemen diwarisi dari blok src
- new Contract(count, elemsize) ✅ — calloc custom ukuran elemen
  eksplisit; bebas anotasi
- pin family sunset ✅ — dihapus dari runtime; docs diarsipkan ke
  `docs/legacy/pin-family.md`, view check handle kini registry v3
  (`memoryHandleTypeCheck`)
- struct C-style ✅ — padding/alignment (sizeof sesuai ABI), nested
  struct by value + array of struct via view handle, `del` view
ditolak (test: `tests/execution/struct_layout.rp`)
- Formatter: rename block ops prefix `pin` — ✅ Done (`cset/cmove/ccpy`)

### Low

- For loop penuh (segmen increment)
- Try/Catch error handling
- `-c` compilation (IR → C)
