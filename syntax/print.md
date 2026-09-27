# Print

## Apa yang bisa ditulis?

Mencetak teks, variabel, atau hasil ekspresi ke terminal.

```rupa
print('hello world');
```

## Dengan multiple arguments (dipisahkan koma):

```rupa
name = 'rupa';
x = 1;
y = 2;

print(name);
print(name + ' language');
print('x =', x);
print('result:', x + y, true);
```

## Function call dan array:

```rupa
add(x, y) {
    return x + y
}

print(add(1, 2), [3, 4])
```

## Interpolasi string

print() mendukung interpolasi di dalam string literal. Ada dua bentuk:

### `{variable}` — Variable interpolation

Single curly braces untuk menampilkan nilai variabel langsung:

```rupa
x = 10;
print('x = {x}'); // output: x = 10
print('{name}\n'); // output: nama + newline
```

### `{{expression}}` — Expression interpolation

Double curly braces untuk mengevaluasi ekspresi, termasuk function call dan member access:

```rupa
add(a, b) { return a + b }
print('{{add(1, 2)}}\n'); // output: 3 + newline

obj = { name: 'Rupa' };
print('{{obj.name}}'); // output: Rupa

print('{{x + y}}\n'); // output: hasil penjumlahan + newline
```

### Perbedaan `{ }` dan `{{ }}`

| Syntax     | Keterangan                                 | Contoh               |
| ---------- | ------------------------------------------ | -------------------- |
| `{x}`      | Variable lookup langsung                   | `"{x}"` → `10`       |
| `{{expr}}` | Ekspresi penuh (binary, call, member, dll) | `"{{x + y}}"` → `30` |

### AST Representation

String interpolation direpresentasikan sebagai node `StringInterp` di AST:

```text
Program:
  Print:
    StringInterp:
      String: "Hello "
      Call:
        Callee: Identifier: add
        Arg 1: Number: 1
        Arg 2: Number: 2
      String: "\n"
```

Node `StringInterp` berisi array parts yang berselang-seling antara `String` (literal) dan expression nodes.

---

## Format printf-style

Argumen pertama berupa string format, sisa argumen menjadi nilai konversinya:

```rupa
print('%s\n', 'hello');          // output: hello
print('%d + %d = %d\n', 1, 2, 3); // output: 1 + 2 = 3
print('hex=%x\n', 255);          // output: hex=ff
```

Konversi yang didukung:

| Spec                        | Keterangan                                            | Contoh                    |
| --------------------------- | ----------------------------------------------------- | ------------------------- |
| `%s`                        | Semua tipe, di-stringify sejajar multi-arg            | `print('%s', [1, 2])`     |
| `%d` `%i`                   | Bilangan bulat                                        | `print('%d', 42)` → `42`  |
| `%u`                        | Unsigned                                              |                           |
| `%x` `%X`                   | Heksadesimal (huruf kecil / besar)                    | `print('%x', 255)` → `ff` |
| `%o`                        | Oktal                                                 |                           |
| `%f` `%F` `%e` `%E` `%g` `%G` | Floating point                                      | `print('%f', 2.5)`        |
| `%c`                        | Karakter (number = kode, string = karakter pertama)   | `print('%c', 65)` → `A`   |
| `%%`                        | Literal `%`                                           | `print('50%%')` → `50%`   |

Flags `-` (rata kiri), `+` (tanda), `0` (padding nol), width, dan precision didukung:

```rupa
print('[%5d]\n', 42);       // [   42]
print('[%-5d]\n', 42);      // [42   ]
print('[%.2f]\n', 3.14159); // [3.14]
```

String tanpa konversi valid dicetak apa adanya — `print('50%')` aman tanpa format. Argumen yang lebih banyak dari konversi tetap dicetak, dipisahkan spasi.

---

## Stream target

Argumen pertama `stdout` atau `stderr` menentukan stream tujuan; sisa argumen mengikuti format (pola 1, 2, atau 3):

```rupa
print(stderr, 'gagal: %s\n', 'koneksi'); // ke stderr
print(stderr, 'err\n');                  // ke stderr
print(stdout, 'ok\n');                   // ke stdout (eksplisit)
```

`stdout` dan `stderr` adalah binding global berisi handle stream. Tanpa argumen stream, output selalu ditulis ke stdout.

---

## Kapan digunakan?

Gunakan print() untuk menampilkan output ke terminal.

· Multiple arguments dipisahkan koma.
· Interpolasi memudahkan penyisipan ekspresi di dalam teks.
· Gunakan `{x}` untuk variable sederhana, `{{x + y}}` untuk ekspresi kompleks.
· Gunakan format printf-style (`%s`, `%d`, ...) saat perlu alignment, padding, atau format angka.
· Gunakan `stderr` untuk pesan error dan `stdout` untuk output normal.

---

## Apa hasilnya?

· print() tidak menambahkan newline otomatis. Gunakan \n untuk menambahkan newline secara eksplisit.
· Multiple arguments dicetak berurutan dipisahkan satu spasi.
· Tipe data ditampilkan sesuai representasinya (string, angka, boolean, array, objek, dll.).
· Ekspresi dalam `{ }` atau `{{ }}` dievaluasi dan hasilnya dikonversi ke string.
· Konversi format tanpa argumen dicetak apa adanya; string tanpa konversi valid tidak diubah.
· Stream target (`stderr`) ditulis dan di-flush langsung; output program lain tetap ke stdout.

```rupa
print('hello'); // output: hello (tanpa newline)
print('hello\n'); // output: hello (dengan newline)
print('{x}'); // output: nilai x
print('{{x + y}}\n'); // output: hasil penjumlahan x+y + newline
print('%s = %d\n', 'x', 5); // output: x = 5
print(stderr, 'gagal\n'); // ke stderr
```

---

## Contoh lengkap

```rupa
name = 'rupa';
x = 1;
y = 2;
obj = { key: 'value' };

print('hello world\n');
print(name + '\n');
print('x =', x, '\n');
print('{x}\n');
print('{{x + y}}\n');
print('%s: %d\n', name, x);
print('hex=%x char=%c\n', 255, 65);
print(stderr, '%s=%d\n', 'exit', 1);
```

Output (stdout):

```
hello world
rupa
x = 1
1
3
rupa: 1
hex=ff char=A
```

Output (stderr):

```
exit=1
```

Arguments dicetak berurutan dipisahkan satu spasi. Tipe data ditampilkan sesuai representasinya. Stream target mengarahkan output ke stderr atau stdout.
