/* =========================
   DATA JADWAL SHOLAT
========================= */

let jadwal = null
let sudahAdzan = {
  Subuh:false,
  Dzuhur:false,
  Asar:false,
  Maghrib:false,
  Isya:false
}

const lokasiId = 1108

fetch(`https://api.myquran.com/v2/sholat/jadwal/${lokasiId}/${new Date().toISOString().slice(0,10).replace(/-/g,'/')}`)
.then(r => r.json())
.then(j => {
  jadwal = j.data.jadwal

  jadwalTable.querySelector("tbody").innerHTML = `
  <tr>
    <td>${jadwal.imsak}</td>
    <td>${jadwal.subuh}</td>
    <td>${jadwal.dzuhur}</td>
    <td>${jadwal.ashar}</td>
    <td>${jadwal.maghrib}</td>
    <td>${jadwal.isya}</td>
  </tr>`
})

setInterval(() => {
  if (!jadwal) return;

  const now = new Date();

  const urutanSholat = [
    { nama: "Subuh",    key: "subuh" },
    { nama: "Dzuhur",    key: "dzuhur" },
    { nama: "Asar",     key: "ashar" },
    { nama: "Maghrib",  key: "maghrib" },
    { nama: "Isya",     key: "isya" }
  ];

  let next = null;

  // cari sholat berikutnya hari ini
  for (const s of urutanSholat) {
    const waktu = jadwal[s.key];
    if (!waktu) continue;

    const [h, m] = waktu.split(":");
    const t = new Date();
    t.setHours(h, m, 0, 0);

    if (t > now) {
      next = { nama: s.nama, t };
      break;
    }
  }

  // kalau sudah lewat semua → Subuh besok
  if (!next) {
    const [h, m] = jadwal.subuh.split(":");
    const t = new Date();
    t.setDate(t.getDate() + 1);
    t.setHours(h, m, 0, 0);
    next = { nama: "Subuh", t };
  }

  // =====================
  // HITUNG COUNTDOWN
  // =====================
  const diff = next.t - now;

  const h = String(Math.floor(diff / 3600000)).padStart(2, '0');
  const m = String(Math.floor((diff % 3600000) / 60000)).padStart(2, '0');
  const s = String(Math.floor((diff % 60000) / 1000)).padStart(2, '0');
  

  countdown.innerHTML = `
    <span style="color:red;font-weight:bold;">
      ${next.nama.toUpperCase()}
    </span>
    : <span style="color:white;">
      -${h}: ${m}: ${s}
    </span>
  `;

  const nowHM =
  `${String(now.getHours()).padStart(2,0)}:${String(now.getMinutes()).padStart(2,0)}`;

  if(nowHM === next.t && !sudahAdzan[next.n]){
    adzanAudio.play();
    sudahAdzan[next.n] = true;
  }

}, 1000)


