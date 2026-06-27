# Product Requirements Document (PRD)
# "Kenangan Kita" — Scrapbook Digital untuk Menyimpan Momen Berdua

**Versi:** 1.0
**Tipe Produk:** Web App (Personal/Private)
**Target User:** 2 orang (private, bukan multi-tenant publik)
**Status:** Ready for Implementation

> Catatan: "Kenangan Kita" adalah working title, bebas diganti sesuai selera (misal pakai nama panggilan kalian berdua).

---

## 1. Latar Belakang & Tujuan

Aplikasi ini dibuat sebagai tempat menyimpan kenangan foto bersama pasangan dalam bentuk digital scrapbook — bukan galeri foto biasa, tapi pengalaman yang terasa personal dan hangat seperti membuka album fisik. Setiap foto ditampilkan seperti kertas polaroid lengkap dengan caption tulisan tangan, bukan sekadar grid kotak-kotak generik.

**Tujuan utama:**
- Punya satu tempat khusus untuk menyimpan & merayakan momen berdua
- UI/UX terasa personal, hangat, dan nostalgic — bukan terasa seperti aplikasi galeri standar
- Privasi terjaga — hanya bisa diakses oleh 2 orang yang berhak

**Bukan tujuan (out of scope v1):**
- Tidak ditujukan untuk publik/multi-user umum
- Tidak ada fitur sosial (like dari orang lain, share publik, komentar pihak ketiga)

---

## 2. Tech Stack

| Layer | Teknologi |
|---|---|
| Frontend | Next.js (App Router) |
| Backend / DB | Supabase (Postgres) |
| Storage Foto | Supabase Storage (private bucket) |
| Auth | Supabase Auth (email/password, hanya 2 akun terdaftar) |
| Styling | Tailwind CSS |
| Font Caption | `next/font/google` — Caveat / Kalam (handwriting style) |
| Hosting | Vercel |

---

## 3. Functional Requirements

### 3.1 Autentikasi
- Login dengan email & password (Supabase Auth)
- Tidak ada self-signup publik — akun dibuat manual hanya untuk 2 user (kamu & pasangan)
- Setelah login, redirect ke halaman utama `/`
- Belum login → redirect ke `/login`

### 3.2 Upload Foto (Halaman Khusus `/upload`)
- Form upload dengan drag & drop + preview foto sebelum submit
- Field input:
  - **Foto** (required, validasi tipe file: jpg/png/webp, max size misal 10MB)
  - **Caption** (required, textarea, bebas panjang)
  - **Tanggal momen** (required, date picker — ini tanggal kejadian, BUKAN tanggal upload)
  - **Lokasi** (optional, text bebas)
  - **Mood/Tag** (optional, pilihan: 🥰 Romantic, 😂 Lucu, 🎉 Milestone, ✈️ Liburan, 🍽️ Makan, Lainnya)
- Submit menggunakan **Server Action** (progressive enhancement — tetap berfungsi walau JS lambat load)
- Tombol submit otomatis disable & menampilkan loading state via `useFormStatus` saat proses upload berjalan
- Setelah berhasil upload: foto disimpan ke Supabase Storage bucket privat, metadata disimpan ke tabel `memories`, lalu redirect ke `/` dengan toast sukses

### 3.3 Halaman Utama — Scrapbook Gallery (`/`)
- Layout **masonry/scattered**, bukan grid rapi kotak-kotak
- Setiap foto ditampilkan sebagai **kartu polaroid**:
  - Border putih tebal seperti polaroid asli
  - Rotasi random kecil per kartu (antara -4° s/d 4°) supaya terkesan "ditempel manual"
  - Caption ditulis dengan font handwriting di bawah foto
  - Tanggal momen ditampilkan kecil di bawah caption
  - Subtle shadow agar foto terlihat "mengangkat" dari background
- Background bertekstur kertas/scrapbook (subtle paper texture)
- Dekorasi opsional: washi tape di pojok polaroid, stiker hati untuk foto favorit
- Urutan default: berdasarkan `moment_date` terbaru ke terlama
- Filter/sort tersedia: by tag/mood, by rentang tanggal
- Search sederhana berdasarkan isi caption

### 3.4 Halaman Detail (`/memory/[id]`)
- Polaroid ditampilkan lebih besar, caption full ditampilkan
- Tombol aksi: tandai/batalkan favorite, edit caption/tanggal, hapus kenangan (dengan konfirmasi)

### 3.5 Favorite / Pin Kenangan
- Tombol tandai foto sebagai favorit (icon bintang/hati)
- Filter khusus "Favorit" di halaman utama untuk lihat kenangan yang ditandai spesial

### 3.6 "On This Day" (Nice-to-have, v1.1)
- Saat halaman utama dibuka, tampilkan banner kecil jika ada kenangan dari tanggal yang sama di tahun-tahun sebelumnya

---

## 4. Non-Functional Requirements

- **Privasi & Keamanan:** Semua foto disimpan di bucket Supabase Storage privat (bukan public bucket), diakses lewat signed URL atau RLS-based authenticated request — tidak boleh ada foto yang bisa diakses tanpa login
- **Responsive:** Mobile-first — prioritas tampilan di HP karena kemungkinan besar akses harian dari smartphone, tapi tetap nyaman dilihat di desktop
- **Performa:** Gambar dioptimasi via `next/image` dengan custom loader untuk Supabase Storage (resize/compress otomatis)
- **Reliabilitas:** Upload tetap berjalan walau koneksi lambat (progressive enhancement via Server Action)

---

## 5. Data Model (Supabase Postgres)

```sql
-- Tabel anggota yang berhak akses (cuma 2 row: kamu & pasangan)
create table couple_members (
  user_id uuid primary key references auth.users(id),
  display_name text not null
);

-- Tabel utama kenangan
create table memories (
  id uuid primary key default gen_random_uuid(),
  image_path text not null,          -- path relatif di storage bucket
  caption text not null,
  moment_date date not null,         -- tanggal momen terjadi
  location text,
  mood text,                         -- 'romantic' | 'lucu' | 'milestone' | 'liburan' | 'makan' | 'lainnya'
  is_favorite boolean default false,
  created_by uuid references auth.users(id),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index idx_memories_moment_date on memories (moment_date desc);
```

---

## 6. Storage & Row Level Security (RLS)

Bucket Storage: `memories-photos` (**private**, bukan public).

```sql
-- Policy: hanya anggota couple yang bisa baca foto
create policy "couple can read photos"
on storage.objects for select
to authenticated
using (
  bucket_id = 'memories-photos'
  and auth.uid() in (select user_id from couple_members)
);

-- Policy: hanya anggota couple yang bisa upload foto
create policy "couple can upload photos"
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'memories-photos'
  and auth.uid() in (select user_id from couple_members)
);
```

```sql
-- RLS untuk tabel memories
alter table memories enable row level security;

create policy "couple can read memories"
on memories for select
to authenticated
using (auth.uid() in (select user_id from couple_members));

create policy "couple can insert memories"
on memories for insert
to authenticated
with check (auth.uid() in (select user_id from couple_members));

create policy "couple can update/delete memories"
on memories for update using (auth.uid() in (select user_id from couple_members));

create policy "couple can delete memories"
on memories for delete using (auth.uid() in (select user_id from couple_members));
```

**Catatan penting:** Karena bucket privat, jangan gunakan public URL untuk render foto. Gunakan salah satu:
1. `createSignedUrl()` saat render halaman (signed URL dengan expiry), atau
2. Custom Next.js Image loader yang memanggil endpoint render image Supabase dengan auth header

---

## 7. Struktur Halaman / Route

| Route | Akses | Fungsi |
|---|---|---|
| `/login` | Publik | Login email/password |
| `/` | Authenticated | Scrapbook gallery utama |
| `/upload` | Authenticated | Form upload foto baru |
| `/memory/[id]` | Authenticated | Detail kenangan, edit/hapus/favorite |

Semua route selain `/login` dilindungi middleware Next.js yang cek session Supabase Auth.

---

## 8. Struktur Folder (Next.js App Router — saran)

```
src/
  app/
    login/
      page.tsx
    (protected)/
      layout.tsx          -- cek auth di sini
      page.tsx             -- halaman utama scrapbook
      upload/
        page.tsx
        actions.ts          -- server action upload
      memory/
        [id]/
          page.tsx
          actions.ts        -- server action edit/delete/favorite
  components/
    PolaroidCard.tsx
    ScrapbookGrid.tsx
    UploadForm.tsx
    SubmitButton.tsx        -- pakai useFormStatus
    FilterBar.tsx
  lib/
    supabase/
      client.ts
      server.ts
    utils/
      signedUrl.ts
  middleware.ts
```

---

## 9. UI/UX Design Direction

- **Mood:** hangat, personal, nostalgic — bukan corporate/clean minimalis
- **Warna:** palet kertas hangat (cream, soft brown, accent warna pastel — bisa disesuaikan tema favorit kalian berdua)
- **Tipografi:**
  - Caption foto: font handwriting (Caveat/Kalam)
  - UI lain (tombol, label): font sans-serif standar biar tetap readable
- **Komponen polaroid:**
  - Frame putih tebal di sekeliling foto
  - Rotasi random per kartu, sedikit shadow
  - Caption + tanggal momen di area bawah frame
- **Background:** tekstur kertas/scrapbook subtle, bukan flat color polos
- **Mobile-first:** scattered layout tetap nyaman discroll satu kolom di HP, jadi multi-kolom masonry di desktop

---

## 10. Implementation Phases

**Phase 1 — MVP (wajib ada):**
1. Setup project Next.js + Supabase (Auth, DB, Storage)
2. Login page + middleware protected routes
3. Halaman upload (`/upload`) dengan Server Action
4. Halaman utama scrapbook gallery dengan polaroid card + rotasi random
5. Halaman detail kenangan (edit/hapus)

**Phase 2 — Enhancement:**
1. Fitur favorite/pin
2. Filter & search (by mood, by tanggal, by caption)
3. Styling lanjutan: washi tape, paper texture, animasi hover

**Phase 3 — Nice-to-have:**
1. "On This Day" banner
2. Background music opsional saat buka web
3. Export/backup semua kenangan jadi PDF/zip

---

## 11. Environment Variables (Referensi)

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=   # hanya untuk operasi server-side yang butuh privilege tinggi
```

---

## 12. Open Questions / Perlu Diputuskan Sebelum Eksekusi

- Nama final aplikasi & domain (kalau mau di-deploy custom domain)
- Apakah perlu fitur multi-foto per kenangan (1 momen = beberapa foto), atau 1 foto = 1 entry?
- Apakah caption boleh diedit kapan saja, atau ada history perubahan?