/* Sportyfy — Testimoni & Review.
   Pasang: taruh file ini sejajar index.html, lalu tambahkan SATU baris sebelum </body>:
   <script src="testimoni.js"></script>
   Script ini menyuntikkan CSS, bagian "Reviews" (sebelum CTA), dan link menu "Reviews". */
(()=>{
const KEY='spf_reviews_v1';
/* Opsional: isi dengan URL Formspree / Google Apps Script / Supabase function supaya review dari pengunjung
   juga dikirim ke kamu (POST JSON). Kosongkan = review hanya tersimpan di browser pengunjung itu. */
const ENDPOINT='';
/* CONTOH ISI. Ganti dengan testimoni asli dari anggota komunitasmu sebelum website dipublikasikan. */
const SEED=[
 {n:'Alya R.',r:'Mahasiswa · Surakarta',s:'Badminton',k:5,d:'2026-10-12',t:'Dulu cari lawan main susah banget. Lewat Sportyfy aku ketemu komunitas yang ramah pemula, sekarang main tiap Sabtu.'},
 {n:'Bagas P.',r:'Mahasiswa · Sukoharjo',s:'Futsal',k:5,d:'2026-10-08',t:'Jadwalnya jelas dan gampang gabung. Dapat teman baru dari kampus lain juga.'},
 {n:'Nadia S.',r:'Pekerja · Surakarta',s:'Running',k:4,d:'2026-10-03',t:'Suka sesi lari santainya, nggak ada tekanan soal pace. Semoga makin banyak pilihan jam pagi.'},
 {n:'Dimas A.',r:'Mahasiswa · Wonogiri',s:'Volleyball',k:5,d:'2026-09-29',t:'Akhirnya ada tempat buat cari tim voli. Prosesnya cepat dan tampilannya enak dipakai.'},
 {n:'Citra L.',r:'Mahasiswa · Surakarta',s:'Skateboard',k:4,d:'2026-09-21',t:'Awalnya takut gabung karena pemula, ternyata anggotanya suportif banget.'},
 {n:'Fajar N.',r:'Karyawan · Sukoharjo',s:'Basketball',k:5,d:'2026-09-15',t:'Pickup game tiap pekan jadi kebiasaan baru. Recommended buat yang butuh teman olahraga.'}
];
const SPORTS=typeof sp!=='undefined'?Object.keys(sp):['Badminton','Futsal','Basketball','Running','Skateboard','Volleyball'];
const COL=['#1E6BFF','#FF7A1A','#7B4DFF','#19D3F3','#B6F23A'];
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let mine=[];try{mine=JSON.parse(localStorage.getItem(KEY))||[]}catch(e){}
let shown=6,t0=Date.now();
const all=()=>[...mine,...SEED];
const stars=n=>`<span class="stars" role="img" aria-label="${n} dari 5 bintang">${'★'.repeat(n)}<i>${'★'.repeat(5-n)}</i></span>`;
const fmt=d=>new Date(d).toLocaleDateString('id-ID',{day:'numeric',month:'long',year:'numeric'});

const css=document.createElement('style');css.textContent=`
#reviews{background:var(--mist)}
.stars{color:#FFB400;letter-spacing:2px;white-space:nowrap}.stars i{font-style:normal;color:#cfd6ea}
.rvbox{background:#fff;border:1px solid rgba(10,26,68,.12);border-radius:24px;padding:1.4rem}
.rvsum .big{font:900 4.2rem/1 Outfit;letter-spacing:-.04em}
.rvsum .bar{display:flex;align-items:center;gap:.6rem;font-size:.85rem;margin-top:.35rem}
.rvsum .bar span:first-child{width:2.2rem}.rvsum .tr{flex:1;height:9px;background:#e8edf8;border-radius:9px;overflow:hidden}.rvsum .tr b{display:block;height:100%;background:#FFB400;border-radius:9px}
.rvc{height:100%;display:flex;flex-direction:column;gap:.8rem;background:#fff;border:1px solid rgba(10,26,68,.12);border-radius:22px;padding:1.3rem;transition:.3s}
.rvc:hover{transform:translateY(-5px);box-shadow:0 14px 30px rgba(10,26,68,.12)}
.rvc p{margin:0;color:#2a3560;flex:1}
.rvc .who{display:flex;align-items:center;gap:.7rem}
.rvc .av{width:44px;height:44px;border-radius:50%;display:grid;place-items:center;font:900 1.1rem Outfit;color:var(--navy);flex:none}
.rvc .who b{display:block;line-height:1.1}.rvc .who small{color:#6a7497}
.rvc .tg2{align-self:flex-start;background:var(--navy);color:#fff;font:800 .75rem Outfit;border-radius:8px;padding:.15rem .55rem}
.rvc .nw{background:var(--lime);color:var(--navy)}
.rvform label.l{display:block;font-weight:600;font-size:.88rem;margin:.8rem 0 .25rem}
.rvform input[type=text],.rvform select,.rvform textarea{width:100%;border:2px solid rgba(10,26,68,.15);border-radius:12px;padding:.6rem .8rem;font:inherit;background:#fff;color:var(--navy)}
.rvform textarea{min-height:104px;resize:vertical}
.rvform input:focus,.rvform select:focus,.rvform textarea:focus{border-color:var(--blue);outline:0}
.sr{display:inline-flex;flex-direction:row-reverse;gap:2px;border:0;padding:0;margin:0}
.sr input{position:absolute;opacity:0;width:1px;height:1px}
.sr label{font-size:2.1rem;line-height:1;cursor:pointer;color:#cfd6ea;transition:.15s}
.sr input:checked~label,.sr label:hover,.sr label:hover~label{color:#FFB400}
.sr input:focus-visible+label{outline:3px solid var(--orange);border-radius:6px}
.rvmsg{margin-top:.8rem;font-weight:600;min-height:1.4em}.rvmsg.ok{color:#0b7a3b}.rvmsg.er{color:#c0392b}
.hp{position:absolute!important;left:-9999px}`;
document.head.appendChild(css);

const sec=document.createElement('section');sec.id='reviews';
sec.innerHTML=`<div class="container"><div class="row g-4 align-items-end mb-4"><div class="col-lg-8"><h2 class="rv">Kata Mereka</h2><p class="m-0 mt-3" style="max-width:52ch">Cerita dan penilaian dari anak muda yang sudah menemukan komunitas olahraganya lewat Sportyfy.</p></div></div>
<div class="row g-4"><div class="col-lg-4"><div class="rvbox rvsum rv mb-4" id="rvSum" aria-live="polite"></div>
<form class="rvbox rvform rv" id="rvForm" novalidate><h3 style="font-size:1.4rem">Tulis review</h3>
<label class="l" for="rvN">Nama</label><input type="text" id="rvN" maxlength="40" autocomplete="name" placeholder="Nama kamu">
<label class="l" for="rvR">Asal / peran (opsional)</label><input type="text" id="rvR" maxlength="40" placeholder="Mis. Mahasiswa · Surakarta">
<label class="l" for="rvS">Olahraga</label><select id="rvS">${SPORTS.map(s=>`<option>${esc(s)}</option>`).join('')}</select>
<span class="l" style="display:block;font-weight:600;font-size:.88rem;margin:.8rem 0 .25rem" id="rvL">Penilaian</span>
<fieldset class="sr" aria-labelledby="rvL">${[5,4,3,2,1].map(i=>`<input type="radio" name="rvK" id="rk${i}" value="${i}"><label for="rk${i}" title="${i} bintang"><span class="visually-hidden">${i} bintang</span>★</label>`).join('')}</fieldset>
<label class="l" for="rvT">Ceritamu <small class="text-muted" id="rvC">0/280</small></label><textarea id="rvT" maxlength="280" placeholder="Bagaimana pengalamanmu?"></textarea>
<input class="hp" type="text" id="rvH" tabindex="-1" autocomplete="off" aria-hidden="true">
<button class="btn-x btn-blue mt-3 w-100" type="submit">Kirim review</button><div class="rvmsg" id="rvM" role="status"></div></form></div>
<div class="col-lg-8"><div class="row g-4" id="rvList"></div><div class="text-center mt-4"><button class="btn-x btn-out" id="rvMore">Lihat lebih banyak</button></div></div></div></div>`;
const cta=document.querySelector('#v-home .cta'),host=cta?cta.closest('section'):null;
host?host.parentNode.insertBefore(sec,host):document.getElementById('v-home').appendChild(sec);

const nav=document.querySelector('#nav .navbar-nav'),bl=nav&&nav.querySelector('a[href="#/blog"]');
if(nav){const li=document.createElement('li');li.className='nav-item';li.innerHTML='<a class="nav-link" href="#reviews">Reviews</a>';bl?nav.insertBefore(li,bl.parentNode):nav.appendChild(li);
  li.firstChild.addEventListener('click',()=>{const n=document.getElementById('nav');if(n.classList.contains('show')&&window.bootstrap)bootstrap.Collapse.getOrCreateInstance(n).hide()})}

function render(){
  const a=all(),n=a.length,avg=a.reduce((s,x)=>s+x.k,0)/n;
  document.getElementById('rvSum').innerHTML=`<div class="d-flex align-items-center gap-3"><div class="big">${avg.toFixed(1)}</div><div>${stars(Math.round(avg))}<div style="font-size:.9rem;color:#6a7497">${n} review</div></div></div>`+
   [5,4,3,2,1].map(i=>{const c=a.filter(x=>x.k===i).length;return `<div class="bar"><span>${i} ★</span><div class="tr"><b style="width:${Math.round(c/n*100)}%"></b></div><span style="width:2rem;text-align:right">${c}</span></div>`}).join('');
  document.getElementById('rvList').innerHTML=a.slice(0,shown).map((x,i)=>`<div class="col-md-6"><article class="rvc"><div class="d-flex justify-content-between align-items-center">${stars(x.k)}<span class="tg2${x.me?' nw':''}">${x.me?'Baru':esc(x.s)}</span></div><p>“${esc(x.t)}”</p><div class="who"><div class="av" style="background:${COL[(x.n.charCodeAt(0)||0)%COL.length]}">${esc(x.n.trim()[0]||'?').toUpperCase()}</div><div><b>${esc(x.n)}</b><small>${esc(x.r||x.s)} · ${fmt(x.d)}</small></div></div></article></div>`).join('');
  document.getElementById('rvMore').hidden=shown>=n;
  if(typeof reveal==='function')reveal();
}
document.getElementById('rvMore').addEventListener('click',()=>{shown+=6;render()});
const T=document.getElementById('rvT');T.addEventListener('input',()=>document.getElementById('rvC').textContent=T.value.length+'/280');
document.getElementById('rvForm').addEventListener('submit',e=>{
  e.preventDefault();const m=document.getElementById('rvM'),say=(t,c)=>{m.textContent=t;m.className='rvmsg '+c};
  const n=document.getElementById('rvN').value.trim(),k=+(document.querySelector('input[name=rvK]:checked')||{}).value,t=T.value.trim();
  if(document.getElementById('rvH').value||Date.now()-t0<3000)return say('Terima kasih!','ok');
  if(n.length<2)return say('Isi nama dulu ya.','er');
  if(!k)return say('Pilih jumlah bintang.','er');
  if(t.length<10)return say('Ceritamu minimal 10 karakter.','er');
  const r={n,r:document.getElementById('rvR').value.trim(),s:document.getElementById('rvS').value,k,t,d:new Date().toISOString().slice(0,10),me:1};
  mine=[r,...mine].slice(0,30);try{localStorage.setItem(KEY,JSON.stringify(mine))}catch(x){}
  if(ENDPOINT)fetch(ENDPOINT,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(r)}).catch(()=>{});
  e.target.reset();document.getElementById('rvC').textContent='0/280';shown=Math.max(shown,6);render();say('Terima kasih! Review kamu sudah tampil.','ok');
});
render();
})();
