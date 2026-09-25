import{_ as n,o as s,c as e,a0 as p}from"./chunks/framework.BpJS36ta.js";const u=JSON.parse('{"title":"Enum Grammar","description":"","frontmatter":{},"headers":[],"relativePath":"grammar/enum.md","filePath":"grammar/enum.md"}'),i={name:"grammar/enum.md"};function t(l,a,r,o,c,d){return s(),e("div",null,[...a[0]||(a[0]=[p(`<h1 id="enum-grammar" tabindex="-1">Enum Grammar <a class="header-anchor" href="#enum-grammar" aria-label="Permalink to &quot;Enum Grammar&quot;">​</a></h1><p>Grammar enum membentuk node <code>Enum Declaration</code> dari nama enum dan block member. Member dibangun eksplisit oleh grammar (bukan statement acak): setiap member adalah <code>Annotation</code> (Name, Type opsional, Value opsional) atau <code>Identifier</code> bare untuk member tanpa nilai.</p><h2 id="enum-dengan-member-auto-increment" tabindex="-1">Enum dengan member auto-increment <a class="header-anchor" href="#enum-dengan-member-auto-increment" aria-label="Permalink to &quot;Enum dengan member auto-increment&quot;">​</a></h2><p>Source:</p><div class="language-rupa vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">rupa</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>enum Color {</span></span>
<span class="line"><span>  RED</span></span>
<span class="line"><span>  GREEN</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>AST:</p><div class="language-text vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">text</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>Program:</span></span>
<span class="line"><span>  Enum Declaration:</span></span>
<span class="line"><span>    Identifier: Color</span></span>
<span class="line"><span>    Block:</span></span>
<span class="line"><span>      Identifier: RED</span></span>
<span class="line"><span>      Identifier: GREEN</span></span></code></pre></div><p>Member tanpa nilai disimpan sebagai <code>Identifier</code> bare; konstanta numeriknya (0, 1, 2, ...) ditentukan saat runtime, bukan saat parsing.</p><h2 id="member-dengan-nilai-eksplisit" tabindex="-1">Member dengan nilai eksplisit <a class="header-anchor" href="#member-dengan-nilai-eksplisit" aria-label="Permalink to &quot;Member dengan nilai eksplisit&quot;">​</a></h2><p>Source:</p><div class="language-rupa vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">rupa</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>enum Color {</span></span>
<span class="line"><span>  RED</span></span>
<span class="line"><span>  GREEN = 5</span></span>
<span class="line"><span>  BLUE</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>AST:</p><div class="language-text vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">text</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>Program:</span></span>
<span class="line"><span>  Enum Declaration:</span></span>
<span class="line"><span>    Identifier: Color</span></span>
<span class="line"><span>    Block:</span></span>
<span class="line"><span>      Identifier: RED</span></span>
<span class="line"><span>      Annotation:</span></span>
<span class="line"><span>        Name:</span></span>
<span class="line"><span>          Identifier: GREEN</span></span>
<span class="line"><span>        Value:</span></span>
<span class="line"><span>          Number: 5</span></span>
<span class="line"><span>      Identifier: BLUE</span></span></code></pre></div><h2 id="member-bertipe" tabindex="-1">Member bertipe <a class="header-anchor" href="#member-bertipe" aria-label="Permalink to &quot;Member bertipe&quot;">​</a></h2><p>Source:</p><div class="language-rupa vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">rupa</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>enum TokenType {</span></span>
<span class="line"><span>  IDENTIFIER: string = &quot;id&quot;</span></span>
<span class="line"><span>  ASSIGN = 0</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>AST:</p><div class="language-text vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">text</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>Program:</span></span>
<span class="line"><span>  Enum Declaration:</span></span>
<span class="line"><span>    Identifier: TokenType</span></span>
<span class="line"><span>    Block:</span></span>
<span class="line"><span>      Annotation:</span></span>
<span class="line"><span>        Name:</span></span>
<span class="line"><span>          Identifier: IDENTIFIER</span></span>
<span class="line"><span>        Type:</span></span>
<span class="line"><span>          Identifier: string</span></span>
<span class="line"><span>        Value:</span></span>
<span class="line"><span>          String: &quot;id&quot;</span></span>
<span class="line"><span>      Annotation:</span></span>
<span class="line"><span>        Name:</span></span>
<span class="line"><span>          Identifier: ASSIGN</span></span>
<span class="line"><span>        Value:</span></span>
<span class="line"><span>          Number: 0</span></span></code></pre></div><h2 id="bentuk-satu-baris" tabindex="-1">Bentuk satu baris <a class="header-anchor" href="#bentuk-satu-baris" aria-label="Permalink to &quot;Bentuk satu baris&quot;">​</a></h2><p>Body boleh ditulis dalam satu baris; pemisah antar member adalah whitespace (newline), koma, atau titik koma:</p><div class="language-rupa vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">rupa</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>enum Color { RED GREEN = 5 BLUE }</span></span></code></pre></div><p>Bentuk AST-nya sama dengan versi multiline.</p><h2 id="runtime-binding" tabindex="-1">Runtime binding <a class="header-anchor" href="#runtime-binding" aria-label="Permalink to &quot;Runtime binding&quot;">​</a></h2><p>Saat eksekusi (jalur interpreter dan IR trampoline sama):</p><ul><li>Konstanta member di-bind ke environment (<code>RED</code>, <code>GREEN</code>, ...).</li><li>Nama enum di-bind sebagai object berisi seluruh member sehingga <code>Color.RED</code> terbaca lewat member access.</li><li>Nilai eksplisit dievaluasi sebagai expression biasa; counter auto-increment berlanjut dari angka sebelumnya + 1 dan kembali ke 0 setelah member non-number.</li></ul>`,25)])])}const b=n(i,[["render",t]]);export{u as __pageData,b as default};
