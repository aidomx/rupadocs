# Ternary

Pemilihan nilai berdasarkan condition — tiga bentuk yang setara hasilnya,
pilih sesuai keterbacaan.

## Apa yang bisa ditulis?

Standard — `cond ? then : else`:

```rupa
label = score >= 60 ? "lulus" : "remedial"
```

Pipe — pasangan `condition | value` berantai:

```rupa
nilai = score >= 90 | "A" | score >= 80 | "B" | "C"
```

Cascade — pasangan `condition -> value` berantai:

```rupa
nilai = score >= 90 -> "A" | score >= 80 -> "B" | "C"
```

Bentuk berantai dibaca dari kiri: condition pertama yang benar menentukan
hasil; bagian terakhir tanpa condition adalah else.

## Kapan digunakan?

Saat sebuah nilai punya dua kemungkinan atau lebih yang dipilih berdasarkan
condition — tanpa menulis `if` penuh. Standard form untuk pilihan biner;
pipe/cascade untuk pemilihan berjenjang.

## Apa hasilnya?

Ternary adalah expression — menghasilkan nilai, bisa langsung dipakai
di mana pun nilai dibutuhkan (assignment, argumen, return).

### Contoh execution

```rupa
score = 83

print(score >= 60 ? "lulus" : "remedial")
// lulus

nilai = score >= 90 | "A" | score >= 80 | "B" | "C"
print(nilai)
// B

label = score >= 90 -> "A" | score >= 80 -> "B" | "C"
print(label)
// B
```

Ternary juga sah sebagai argumen pemanggilan:

```rupa
show(score >= 60 ? "LULUS" : "REMEDIAL")
```
