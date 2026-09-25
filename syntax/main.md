# Main Entry Point

## Apa yang bisa ditulis?

```rupa
main() {
    print("Hello from Rupa!")
}
```

## Kapan digunakan?

`main` adalah entry point program. Fungsi global `main` **tanpa parameter**
dijalankan otomatis — tanpa perlu dipanggil. Call implisitnya di-emit di akhir
blok program, jadi seluruh isi program (free variable, helper, stdlib)
terjangkau seperti call biasa.

Aturan auto-run:

- Hanya `main` **zero-param** yang auto-run.
- Bila top-level sudah memanggil `main()` secara eksplisit, tidak ada call
  tambahan — main jalan tepat sekali.
- `main` berparameter bukan entry point; ia hanya fungsi biasa dan tidak
  dieksekusi kecuali dipanggil eksplisit.

## Apa hasilnya?

`main` dieksekusi sebagai bagian akhir eksekusi program. Karena di-emit
sebagai call biasa di blok program (bukan frame terpisah), definisi fungsi,
variable top-level, dan import semuanya sudah tersedia saat body `main` jalan.

### Contoh execution

```rupa
helper(n: number): number {
  return n * 2
}

main() {
  print(helper(21))
}
```

Output:

```
42
```
