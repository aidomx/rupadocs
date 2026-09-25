import{_ as n,o as s,c as e,a0 as p}from"./chunks/framework.BpJS36ta.js";const u=JSON.parse('{"title":"Memory Grammar","description":"","frontmatter":{},"headers":[],"relativePath":"grammar/memory.md","filePath":"grammar/memory.md"}'),l={name:"grammar/memory.md"};function i(t,a,r,c,d,o){return s(),e("div",null,[...a[0]||(a[0]=[p(`<h1 id="memory-grammar" tabindex="-1">Memory Grammar <a class="header-anchor" href="#memory-grammar" aria-label="Permalink to &quot;Memory Grammar&quot;">​</a></h1><p>Grammar memory membentuk node call untuk alokasi dan pelepasan memori: <code>new T(...)</code> dan <code>del(...)</code>, plus bentuk Contract lewat annotation dengan call <code>new Contract()</code>.</p><p>Ciri khas grammar ini: <strong>argumen pertama <code>new</code> adalah nama tipe, bukan ekspresi</strong> — parser menyimpannya mentah (identifier) dan runtime yang membaca namanya. <code>new</code> dan <code>del</code> bukan keyword; keduanya callee biasa sehingga memakai grammar call yang sama dengan fungsi lain.</p><h2 id="new-t-—-alokasi-type-driven" tabindex="-1">new T() — alokasi type-driven <a class="header-anchor" href="#new-t-—-alokasi-type-driven" aria-label="Permalink to &quot;new T() — alokasi type-driven&quot;">​</a></h2><p>Source:</p><div class="language-rupa vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">rupa</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>x = new Number()</span></span>
<span class="line"><span>arr = new Number(4)</span></span>
<span class="line"><span>q = new Number(arr, 8)</span></span></code></pre></div><p>AST:</p><div class="language-text vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">text</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>Program:</span></span>
<span class="line"><span>  Assignment:</span></span>
<span class="line"><span>    Target:</span></span>
<span class="line"><span>      Identifier: x</span></span>
<span class="line"><span>    Value:</span></span>
<span class="line"><span>      Call:</span></span>
<span class="line"><span>        Callee:</span></span>
<span class="line"><span>          Identifier: new</span></span>
<span class="line"><span>        Arg 1:</span></span>
<span class="line"><span>          Identifier: Number</span></span>
<span class="line"><span>  Assignment:</span></span>
<span class="line"><span>    Target:</span></span>
<span class="line"><span>      Identifier: arr</span></span>
<span class="line"><span>    Value:</span></span>
<span class="line"><span>      Call:</span></span>
<span class="line"><span>        Callee:</span></span>
<span class="line"><span>          Identifier: new</span></span>
<span class="line"><span>        Arg 1:</span></span>
<span class="line"><span>          Identifier: Number</span></span>
<span class="line"><span>        Arg 2:</span></span>
<span class="line"><span>          Number: 4</span></span>
<span class="line"><span>  Assignment:</span></span>
<span class="line"><span>    Target:</span></span>
<span class="line"><span>      Identifier: q</span></span>
<span class="line"><span>    Value:</span></span>
<span class="line"><span>      Call:</span></span>
<span class="line"><span>        Callee:</span></span>
<span class="line"><span>          Identifier: new</span></span>
<span class="line"><span>        Arg 1:</span></span>
<span class="line"><span>          Identifier: Number</span></span>
<span class="line"><span>        Arg 2:</span></span>
<span class="line"><span>          Literal ID: arr</span></span>
<span class="line"><span>        Arg 3:</span></span>
<span class="line"><span>          Number: 8</span></span></code></pre></div><p>Arg 1 selalu nama tipe (<code>Identifier</code> / <code>Literal ID</code>): <code>Number</code>, <code>String</code>, <code>Boolean</code>, <code>Decimal</code>, <code>Ptr</code> untuk scalar (kapital), atau nama struct untuk bentuk <code>new People()</code>. Arg 2..N adalah angka: <code>[n]</code> untuk n elemen, <code>[src, n]</code> untuk realloc ke n elemen. Bentuk khusus: <code>new Contract(count, elemsize)</code> = calloc ukuran elemen eksplisit, <code>new Recontract(src, n)</code> = realloc handle GC apa pun.</p><h2 id="del-—-free" tabindex="-1">del — free <a class="header-anchor" href="#del-—-free" aria-label="Permalink to &quot;del — free&quot;">​</a></h2><p>Source:</p><div class="language-rupa vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">rupa</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>del(x)</span></span>
<span class="line"><span>del(a, b)</span></span>
<span class="line"><span>del([a, b])</span></span></code></pre></div><p>AST:</p><div class="language-text vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">text</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>Program:</span></span>
<span class="line"><span>  Call:</span></span>
<span class="line"><span>    Callee:</span></span>
<span class="line"><span>      Identifier: del</span></span>
<span class="line"><span>    Arg 1:</span></span>
<span class="line"><span>      Literal ID: x</span></span>
<span class="line"><span>  Call:</span></span>
<span class="line"><span>    Callee:</span></span>
<span class="line"><span>      Identifier: del</span></span>
<span class="line"><span>    Arg 1:</span></span>
<span class="line"><span>      Literal ID: a</span></span>
<span class="line"><span>    Arg 2:</span></span>
<span class="line"><span>      Literal ID: b</span></span>
<span class="line"><span>  Call:</span></span>
<span class="line"><span>    Callee:</span></span>
<span class="line"><span>      Identifier: del</span></span>
<span class="line"><span>    Arg 1:</span></span>
<span class="line"><span>      ArrayLiteral:</span></span>
<span class="line"><span>        Literal ID: a</span></span>
<span class="line"><span>        Literal ID: b</span></span></code></pre></div><p>Arity bebas — satu handle, variadic, atau array berisi handle (<code>ArrayLiteral</code>). Statement-style: dipanggil tanpa assignment.</p><h2 id="new-contract-—-anotasi-sebagai-spesifikasi-alokasi" tabindex="-1">new Contract() — anotasi sebagai spesifikasi alokasi <a class="header-anchor" href="#new-contract-—-anotasi-sebagai-spesifikasi-alokasi" aria-label="Permalink to &quot;new Contract() — anotasi sebagai spesifikasi alokasi&quot;">​</a></h2><p>Source:</p><div class="language-rupa vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">rupa</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>p: number = new Contract()</span></span>
<span class="line"><span>list: number[] = new Contract(8)</span></span></code></pre></div><p>AST:</p><div class="language-text vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">text</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>Program:</span></span>
<span class="line"><span>  Assignment:</span></span>
<span class="line"><span>    Target:</span></span>
<span class="line"><span>      Identifier: p</span></span>
<span class="line"><span>    Type:</span></span>
<span class="line"><span>      Identifier: number</span></span>
<span class="line"><span>    Value:</span></span>
<span class="line"><span>      Call:</span></span>
<span class="line"><span>        Callee:</span></span>
<span class="line"><span>          Identifier: new</span></span>
<span class="line"><span>        Arg 1:</span></span>
<span class="line"><span>          Identifier: Contract</span></span>
<span class="line"><span>  Assignment:</span></span>
<span class="line"><span>    Target:</span></span>
<span class="line"><span>      Identifier: list</span></span>
<span class="line"><span>    Type:</span></span>
<span class="line"><span>      ArrayType:</span></span>
<span class="line"><span>        Identifier: number</span></span>
<span class="line"><span>    Value:</span></span>
<span class="line"><span>      Call:</span></span>
<span class="line"><span>        Callee:</span></span>
<span class="line"><span>          Identifier: new</span></span>
<span class="line"><span>        Arg 1:</span></span>
<span class="line"><span>          Identifier: Contract</span></span>
<span class="line"><span>        Arg 2:</span></span>
<span class="line"><span>          Number: 8</span></span></code></pre></div><p>Grammar-nya sama dengan <code>new T()</code> — yang membedakan ada di binding: annotation membawa <code>Type</code>, dan runtime mengesankan alokasi ke tipe di anotasi itu (arg <code>Contract</code> tidak menyebut tipe apa pun). Tanpa anotasi → error. Bentuk <code>ArrayType</code> pada anotasi menghasilkan raw block yang diakses lewat subscript.</p><h2 id="akses-isi-handle" tabindex="-1">Akses isi handle <a class="header-anchor" href="#akses-isi-handle" aria-label="Permalink to &quot;Akses isi handle&quot;">​</a></h2><p>Isi handle diakses dengan grammar subscript dan member yang sama dengan tipe lain — tidak ada operator dereferensi khusus:</p><p>Source:</p><div class="language-rupa vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">rupa</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>p[0] = 42</span></span>
<span class="line"><span>v = p[0]</span></span>
<span class="line"><span>data.age = 30</span></span></code></pre></div><p>AST:</p><div class="language-text vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">text</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>Program:</span></span>
<span class="line"><span>  MemberAssign:</span></span>
<span class="line"><span>    Target:</span></span>
<span class="line"><span>      Subscript:</span></span>
<span class="line"><span>        Base:</span></span>
<span class="line"><span>          Identifier: p</span></span>
<span class="line"><span>        Index:</span></span>
<span class="line"><span>          Number: 0</span></span>
<span class="line"><span>    Value:</span></span>
<span class="line"><span>      Number: 42</span></span>
<span class="line"><span>  Assignment:</span></span>
<span class="line"><span>    Target:</span></span>
<span class="line"><span>      Identifier: v</span></span>
<span class="line"><span>    Value:</span></span>
<span class="line"><span>      Subscript:</span></span>
<span class="line"><span>        Base:</span></span>
<span class="line"><span>          Identifier: p</span></span>
<span class="line"><span>        Index:</span></span>
<span class="line"><span>          Number: 0</span></span>
<span class="line"><span>  MemberAssign:</span></span>
<span class="line"><span>    Target:</span></span>
<span class="line"><span>      Member:</span></span>
<span class="line"><span>        Object:</span></span>
<span class="line"><span>          Identifier: data</span></span>
<span class="line"><span>        Member:</span></span>
<span class="line"><span>          Identifier: age</span></span>
<span class="line"><span>    Value:</span></span>
<span class="line"><span>      Number: 30</span></span></code></pre></div><h2 id="ringkasan-grammar" tabindex="-1">Ringkasan grammar <a class="header-anchor" href="#ringkasan-grammar" aria-label="Permalink to &quot;Ringkasan grammar&quot;">​</a></h2><table tabindex="0"><thead><tr><th>Bentuk</th><th>Node</th><th>Keterangan</th></tr></thead><tbody><tr><td><code>new T(...)</code></td><td>Call (callee <code>new</code>)</td><td>Arg 1 = nama tipe, tidak dievaluasi</td></tr><tr><td><code>del(...)</code></td><td>Call (callee <code>del</code>)</td><td>Handle / variadic / <code>ArrayLiteral</code></td></tr><tr><td><code>p: T = new Contract()</code></td><td>Assignment + Type</td><td>Tipe dari anotasi</td></tr><tr><td><code>x[i]</code> pada handle</td><td>Subscript</td><td>Bounds check saat eksekusi</td></tr><tr><td><code>obj.field</code> pada handle</td><td>Member / MemberAssign</td><td>Offset layout struct</td></tr></tbody></table>`,29)])])}const g=n(l,[["render",i]]);export{u as __pageData,g as default};
