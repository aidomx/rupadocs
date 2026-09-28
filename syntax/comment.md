# Comment

## Apa yang bisa ditulis?

```rupa
// comment
/* comment */
/**
 * multiline
 * comment
 */
```

## Kapan digunakan?

Gunakan comment untuk menandai program yang diabaikan untuk diproses oleh sistem.

## Apa hasilnya?

Semua jenis comment (`//`, `/* */`) diparse menjadi token oleh lexer,
lalu diabaikan oleh interpreter. Comment tetap tersimpan di AST sehingga
bisa digunakan oleh formatter atau tools lain.

## Tipe Comment

| Syntax | Tipe | Contoh |
|--------|------|--------|
| `//` | Inline (slash) | `// untuk debugging` |
| `/* */` | Block | `/* penjelasan */` |
| `/** */` | Block (dokumentasi) | `/** doc comment */` |

## Catatan: `#` bukan komentar

Sejak v0.2.2, `#` adalah awal **hex color literal** (`#rgb`, `#rrggbb` —
ala CSS) dan `#` di posisi lain = LexerError. Komentar satu baris kini
hanya `//` (lihat [Print — Color](color.md) untuk detail color literal).
