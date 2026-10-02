/* =========================================================
   Portofolio Khadafi — script.js

   Semua FOTO dan TEKS diatur langsung di index.html.
   Foto cukup diganti lewat tag <img src="img/....jpg">.
   File ini hanya mengatur bagian yang bisa diklik.
   ========================================================= */

/* ---------------------------------------------------------
   1) Fungsi bantu
   --------------------------------------------------------- */

// Membuat ikon dari kumpulan ikon di index.html
function ikon(nama, kelas = '') {
  return `<svg class="i ${kelas}" aria-hidden="true"><use href="#i-${nama}"></use></svg>`;
}

// Mengambil teks dari elemen di dalam sebuah kartu
function ambilTeks(induk, selector) {
  const el = induk.querySelector(selector);
  return el ? el.textContent.trim() : '';
}

// Menyalin foto dari kartu ke jendela besar (kalau fotonya ada)
function salinFoto(dari, ke, kotakContoh) {
  ke.innerHTML = `<span class="placeholder" aria-hidden="true">${kotakContoh}</span>`;
  const img = dari.querySelector('img');
  if (img) {
    const salinan = img.cloneNode();
    salinan.removeAttribute('loading');
    ke.append(salinan);
  }
}

/* ---------------------------------------------------------
   2) Foto yang filenya belum ada → tampilkan kotak contoh
   --------------------------------------------------------- */
function siapkanFoto(img) {
  const hapus = () => img.remove();
  if (img.complete && img.naturalWidth === 0) {
    hapus();
  } else {
    img.addEventListener('error', hapus);
  }
}

document.querySelectorAll('img').forEach(siapkanFoto);

// Teks alternatif foto otomatis diambil dari judul kartunya
document.querySelectorAll('.kartu-prestasi').forEach((kartu) => {
  const img = kartu.querySelector('img');
  if (img && !img.alt) img.alt = 'Foto prestasi: ' + ambilTeks(kartu, '.kartu-prestasi-judul');
});
document.querySelectorAll('.foto-item').forEach((item) => {
  const img = item.querySelector('img');
  if (img && !img.alt) img.alt = ambilTeks(item, '.foto-judul');
});

/* ---------------------------------------------------------
   3) Prestasi: filter akademik / non-akademik
   --------------------------------------------------------- */
const prestasiGrid = document.getElementById('prestasi-grid');
const semuaKartu = document.querySelectorAll('.kartu-prestasi');
const tombolFilter = document.querySelectorAll('.filter-btn');
const pesanKosong = document.getElementById('prestasi-kosong');

function hitungJumlah() {
  document.querySelectorAll('[data-jumlah]').forEach((el) => {
    const kelompok = el.dataset.jumlah;
    const jumlah = [...semuaKartu].filter(
      (kartu) => kelompok === 'semua' || kartu.dataset.kategori === kelompok
    ).length;
    el.textContent = jumlah;
  });
}

function saringPrestasi(kelompok) {
  let tampil = 0;
  semuaKartu.forEach((kartu) => {
    const cocok = kelompok === 'semua' || kartu.dataset.kategori === kelompok;
    kartu.hidden = !cocok;
    if (cocok) tampil++;
  });
  pesanKosong.hidden = tampil > 0;
}

tombolFilter.forEach((tombol) => {
  tombol.addEventListener('click', () => {
    tombolFilter.forEach((t) => {
      const aktif = t === tombol;
      t.classList.toggle('aktif', aktif);
      t.setAttribute('aria-pressed', aktif ? 'true' : 'false');
    });
    saringPrestasi(tombol.dataset.filter);
  });
});

/* ---------------------------------------------------------
   4) Prestasi: jendela rincian
   --------------------------------------------------------- */
const rincian = document.getElementById('rincian');

function bukaRincian(kartu) {
  salinFoto(
    kartu.querySelector('.kartu-prestasi-gambar'),
    document.getElementById('rincian-gambar'),
    `${ikon('piala', 'i-xl')}Foto piala / sertifikat`
  );
  document.getElementById('rincian-kategori').textContent = ambilTeks(kartu, '.kategori');
  document.getElementById('rincian-judul').textContent = ambilTeks(kartu, '.kartu-prestasi-judul');
  document.getElementById('rincian-tahun').textContent = ambilTeks(kartu, '.p-tahun');
  document.getElementById('rincian-tingkat').textContent = ambilTeks(kartu, '.p-tingkat');
  document.getElementById('rincian-penyelenggara').textContent = ambilTeks(kartu, '.p-penyelenggara');
  document.getElementById('rincian-cerita').textContent = ambilTeks(kartu, '.p-cerita');
  rincian.showModal();
}

prestasiGrid.addEventListener('click', (e) => {
  const kartu = e.target.closest('.kartu-prestasi');
  if (kartu) bukaRincian(kartu);
});

rincian.querySelectorAll('[data-tutup-rincian]').forEach((tombol) => {
  tombol.addEventListener('click', () => rincian.close());
});

// Klik area gelap di luar kotak untuk menutup
rincian.addEventListener('click', (e) => {
  if (e.target === rincian) rincian.close();
});

/* ---------------------------------------------------------
   5) Galeri: tampilan besar foto
   --------------------------------------------------------- */
const galeriGrid = document.getElementById('galeri-grid');
const semuaFoto = [...document.querySelectorAll('.foto-item')];
const lightbox = document.getElementById('lightbox');
let fotoAktif = 0;

function perbaruiLightbox() {
  const item = semuaFoto[fotoAktif];
  salinFoto(
    item.querySelector('.foto-kotak'),
    document.getElementById('lb-foto'),
    `${ikon('gambar', 'i-xl')}Foto kegiatan ${fotoAktif + 1}`
  );
  document.getElementById('lb-judul').textContent = ambilTeks(item, '.foto-judul');
  document.getElementById('lb-tanggal').textContent = ambilTeks(item, '.f-tanggal');
  document.getElementById('lb-lokasi').textContent = ambilTeks(item, '.f-lokasi');
  document.getElementById('lb-nomor').textContent = `${fotoAktif + 1} / ${semuaFoto.length}`;
}

function geserFoto(arah) {
  fotoAktif = (fotoAktif + arah + semuaFoto.length) % semuaFoto.length;
  perbaruiLightbox();
}

galeriGrid.addEventListener('click', (e) => {
  const item = e.target.closest('.foto-item');
  if (!item) return;
  fotoAktif = semuaFoto.indexOf(item);
  perbaruiLightbox();
  lightbox.showModal();
});

document.getElementById('lb-sebelum').addEventListener('click', () => geserFoto(-1));
document.getElementById('lb-berikut').addEventListener('click', () => geserFoto(1));
document.getElementById('lb-tutup').addEventListener('click', () => lightbox.close());

lightbox.addEventListener('click', (e) => {
  if (e.target === lightbox) lightbox.close();
});

// Tombol panah keyboard untuk pindah foto (Esc untuk menutup sudah otomatis)
lightbox.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowLeft') geserFoto(-1);
  if (e.key === 'ArrowRight') geserFoto(1);
});

/* ---------------------------------------------------------
   6) Form pesan
   CATATAN: pesan BELUM dikirim ke mana pun. Untuk benar-benar
   menyimpan pesan, kirim data ini ke server (mis. API Next.js +
   tabel PESAN sesuai PRD) di bagian yang ditandai di bawah.
   --------------------------------------------------------- */
const formPesan = document.getElementById('form-pesan');
const pesanTerkirim = document.getElementById('pesan-terkirim');

formPesan.addEventListener('submit', (e) => {
  e.preventDefault();

  const data = {
    nama: formPesan.nama.value.trim(),
    pesan: formPesan.pesan.value.trim(),
  };

  // >>> Di sini nanti kirim "data" ke server, contoh:
  // fetch('/api/pesan', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
  console.log('Pesan baru:', data);

  formPesan.reset();
  formPesan.hidden = true;
  pesanTerkirim.hidden = false;
  pesanTerkirim.focus();
});

document.getElementById('btn-pesan-lain').addEventListener('click', () => {
  pesanTerkirim.hidden = true;
  formPesan.hidden = false;
  formPesan.nama.focus();
});

/* ---------------------------------------------------------
   7) Bagikan halaman
   --------------------------------------------------------- */
const urlHalaman = window.location.href;
const toast = document.getElementById('toast');
let timerToast;

function tampilkanToast(pesan) {
  toast.textContent = pesan;
  toast.classList.add('tampil');
  clearTimeout(timerToast);
  timerToast = setTimeout(() => toast.classList.remove('tampil'), 3200);
}

async function salinTautan(pesanBerhasil) {
  try {
    await navigator.clipboard.writeText(urlHalaman);
    tampilkanToast(pesanBerhasil);
  } catch (err) {
    tampilkanToast('Gagal menyalin. Salin alamat halaman dari address bar, ya.');
  }
}

// Tombol "Bagikan" di menu atas: pakai menu bagikan bawaan HP kalau ada
document.getElementById('btn-bagikan').addEventListener('click', () => {
  if (navigator.share) {
    navigator
      .share({
        title: 'Portofolio Khadafi',
        text: 'Lihat prestasi dan kegiatan Khadafi di sekolah Tamsis.',
        url: urlHalaman,
      })
      .catch(() => {});
  } else {
    salinTautan('Tautan halaman disalin. Tempel di mana saja!');
  }
});

document.getElementById('btn-salin').addEventListener('click', () => {
  salinTautan('Tautan halaman disalin. Tempel di mana saja!');
});

// Instagram tidak punya tautan "bagikan" untuk web, jadi tautannya disalin
document.getElementById('btn-instagram').addEventListener('click', () => {
  salinTautan('Tautan disalin. Tempel di story atau bio Instagram.');
});

document.getElementById('link-wa-bagikan').href =
  'https://wa.me/?text=' +
  encodeURIComponent('Lihat portofolio Khadafi dari sekolah Tamsis: ' + urlHalaman);

/* ---------------------------------------------------------
   8) Tahun di footer & mulai
   --------------------------------------------------------- */
document.getElementById('tahun').textContent = new Date().getFullYear();
hitungJumlah();
