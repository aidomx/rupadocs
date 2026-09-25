# Memory

## Apa yang bisa ditulis?

```rupa
p: number      = new Contract()    # satu elemen number
buf: number    = new Contract(4)   # empat elemen
list: number[] = new Contract(8)   # blok delapan elemen
raw = new Contract(3, sizeof(number))  # calloc custom — ukuran elemen eksplisit
```

## Kapan digunakan?

`new Contract()` adalah padanan malloc di rupa: mengalokasikan memori dengan
ukuran otomatis dari tipe di anotasi — tipe disebut sekali, alokasi zeroed,
tanpa `sizeof` di site pemakaian. Isi handle diakses lewat subscript dan
member yang sama dengan tipe lain; `del(x)` melepasnya. Bentuk
`new Contract(count, elemsize)` mengunci ukuran elemen sendiri; realloc
lewat `new Recontract(src, n)`.

## Apa hasilnya?

```rupa
list[0] = 42
print(list[0])              # 42

data: People = new Contract()
data.name = dupl("rudi")
print(data.name)            # rudi

m = new Recontract(list, 16)  # grow — isi terkopi, handle lama dangling
print(m[0])                  # 42
```

Referensi lengkap bentuk alokasi (scalar, blok, struct, blok ops,
`dupl`/`compare`): [`builtins.md`](../builtins.md). Gramatika parser:
[`grammar/memory.md`](../../grammar/memory.md).
