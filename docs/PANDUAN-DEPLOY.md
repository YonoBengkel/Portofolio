# Panduan Deploy Portofolio ke Vercel

Panduan ini untuk men-deploy situs dari **akun GitHub dan akun Vercel pribadimu**.

> **Penting:** jangan deploy lewat tim Vercel milik Ideola ("ideolatech's projects"). Saat memilih *scope* atau *team* di Vercel, pastikan yang terpilih adalah akun pribadimu (paket Hobby, gratis).

---

## 1. Cek di laptop dulu (sekitar 2 menit)

Buka terminal di folder `D:\CODE\portfolio-website`, lalu jalankan:

```bash
npm install
npm run dev
```

Buka http://localhost:3000 dan klik-klik semua halaman. Kalau sudah oke, hentikan dengan `Ctrl + C`, lalu pastikan build produksi berhasil:

```bash
npm run build
```

Kalau muncul `✓ Compiled successfully` dan daftar halaman, berarti aman.

## 2. (Opsional) Tambahkan CV yang bisa diunduh

Salin PDF CV-mu ke `public/cv.pdf`. Tombol **Download CV** di beranda muncul otomatis selama file itu ada.

Catatan: CV berisi nomor HP. Kalau dipasang, nomor itu bisa dilihat publik. Di situs sendiri sengaja hanya ada email, LinkedIn, dan GitHub.

## 3. Upload ke GitHub

1. Buka https://github.com/new dan buat repository baru, misalnya `portfolio`.
   - Pilih **Public**.
   - **Jangan** centang "Add a README" atau ".gitignore", karena keduanya sudah ada di proyek.
2. Di terminal, dari folder `D:\CODE\portfolio-website`, jalankan:

```bash
git init
git add .
git commit -m "Initial portfolio site"
git branch -M main
git remote add origin https://github.com/YonoBengkel/portfolio.git
git push -u origin main
```

Ganti `portfolio` di URL kalau kamu memakai nama repo lain.

## 4. Deploy di Vercel

1. Buka https://vercel.com, klik **Sign Up** atau **Log In**, lalu pilih **Continue with GitHub** (akun YonoBengkel).
2. Klik **Add New… → Project**.
3. Di bagian *Import Git Repository*, cari repo `portfolio`, lalu klik **Import**.
   - Kalau repo-nya tidak muncul, klik **Adjust GitHub App Permissions** dan izinkan Vercel mengakses repo tersebut.
4. Pastikan **scope/team yang aktif adalah akun pribadimu**, bukan tim Ideola.
5. Framework Preset otomatis terdeteksi sebagai **Next.js**. Pengaturan lain tidak perlu diubah.
6. Klik **Deploy** dan tunggu sekitar 1–2 menit. Kamu akan mendapat alamat seperti `https://portfolio-xxxx.vercel.app`.

Mulai sekarang, setiap kali kamu `git push` ke branch `main`, Vercel otomatis men-deploy versi terbaru. Push ke branch lain menghasilkan *preview URL* terpisah untuk dicek dulu.

## 5. Rapikan alamatnya (opsional)

- **Ganti subdomain gratis:** Vercel → Project → **Settings → Domains**. Kamu bisa memakai nama seperti `ilham-bintang.vercel.app` kalau belum dipakai orang lain.
- **Domain sendiri** (misalnya `ilhambintang.dev`):
  1. Beli domainnya.
  2. Tambahkan di **Settings → Domains** dan atur DNS sesuai petunjuk Vercel.
  3. Isi environment variable `NEXT_PUBLIC_SITE_URL=https://ilhambintang.dev` di **Settings → Environment Variables**.
  4. Klik **Redeploy**.

  Langkah ketiga memastikan sitemap dan tautan pratinjau memakai domain barumu. Tanpa domain sendiri, alamat `.vercel.app` sudah dipakai otomatis.

## 6. Setelah situsnya live

- Pasang URL-nya di LinkedIn (bagian **Contact info** dan **Featured**), di header CV, dan di profil GitHub.
- Tes pratinjau tautannya dengan menempelkan URL di chat WhatsApp atau LinkedIn. Gambar pratinjau (OG image) harus muncul.

## Cara mengubah isi situs

| Yang mau diubah | File |
|---|---|
| Nama, tagline, pengalaman, organisasi, pendidikan, tools | `src/content/site.ts` |
| Studi kasus (teks, peran, tools, link) | `src/content/projects.ts` |
| Gambar | `src/assets/images/` (lalu import di `projects.ts`) |

Untuk menambah studi kasus baru, salin satu objek di `projects.ts`, lalu ganti `slug` dan isinya. Halaman, kartu di beranda, dan entri sitemap-nya dibuat otomatis. Setelah mengedit, jalankan `npm run build` untuk cek, lalu `git push`.

## Alternatif: deploy lewat Vercel CLI

```bash
npm i -g vercel
vercel login
vercel
vercel --prod
```

Saat `vercel login` dan saat memilih *scope*, pastikan yang dipakai akun pribadimu.
