# Color

## Apa yang bisa ditulis?

### Hex color literal

```rupa
#rgb        // 3-digit, di-expand ke #rrggbb
#rrggbb     // ala CSS
c = #ff8800;  // NUMBER 24-bit (16746496)
```

### Binding warna bawaan

```rupa
print(U_RED, "teks merah");
print(U_GREEN, "%s\n", "hijau");
// U_BLACK U_RED U_GREEN U_YELLOW U_BLUE U_MAGENTA U_CYAN U_WHITE
```

### Member enum bertipe `color`

```rupa
enum Color {
  RED: color = #ff0000
  GREEN: color = #00ff00
}

print(Color.RED, "merah");
```

## Kapan digunakan?

Memberi warna pada output terminal: status, label, highlight — tanpa
menulis escape sequence ANSI manual.

## Apa hasilnya?

- Hex color literal dievaluasi jadi **NUMBER** 24-bit: `#abc` di-expand
  menjadi `#aabbcc` (11189196). `0x...` tetap hex integer biasa.
- Literal/binding/member `color` yang dipakai sebagai **argumen pertama
  `print`** (pola 4 stream target) merender ANSI truecolor:
  `\033[38;2;R;G;Bm teks \033[0m` — bekerja di file mode (IR) dan REPL.
- `U_*` adalah binding global (tanpa import); `print(U_RED, "x")`
  langsung berwarna.
- Untuk ANSI manual, string mendukung escape `\xNN` (1–2 digit hex →
  raw byte).

## Catatan lexer

Sejak v0.2.2 `#` dilepas dari peran komentar (komentar = `//` dan
`/* */`). `#` non-hex (bukan diikuti 3/6 digit hex) = **LexerError**.
