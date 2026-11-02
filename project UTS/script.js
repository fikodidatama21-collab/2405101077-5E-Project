const PRODUCTS=[
 {id:1,name:"Mouse Wireless Pro X",img:"images/mouse-wireless-pro-x.png",cat:"Mouse",price:899000,old:1099000,rate:4.8,sold:1240,spec:"25K DPI, 60 gram"},
 {id:2,name:"Mouse Ringan Viper",img:"images/mouse-ringan-viper.jpg",cat:"Mouse",price:459000,rate:4.6,sold:2100,spec:"16K DPI, kabel fleksibel"},
 {id:3,name:"Keyboard Mekanikal TKL",img:"images/keyboard-mekanikal-tkl.jpg",cat:"Keyboard",price:749000,old:899000,rate:4.7,sold:1830,spec:"Hot-swap, switch merah"},
 {id:4,name:"Keyboard 75% Wireless",img:"images/keyboard-75-wireless.jpg",cat:"Keyboard",price:1250000,rate:4.9,sold:640,spec:"Tri-mode, gasket mount"},
 {id:5,name:"Headset 7.1 Surround",img:"images/headset-7-1-surround.jpg",cat:"Audio",price:649000,old:799000,rate:4.5,sold:1520,spec:"Mic noise cancelling"},
 {id:6,name:"Headset Wireless Elite",img:"images/headset-wireless-elite.jpg",cat:"Audio",price:1799000,rate:4.8,sold:430,spec:"Baterai 70 jam"},
 {id:7,name:"Monitor 27″ 165Hz",img:"images/monitor-27-165hz.jpg",cat:"Monitor",price:2799000,old:3199000,rate:4.7,sold:920,spec:"IPS, 1 ms, QHD"},
 {id:8,name:"Monitor 24″ 144Hz",img:"images/monitor-24-144hz.jpg",cat:"Monitor",price:1749000,rate:4.5,sold:1370,spec:"IPS, FHD, FreeSync"},
 {id:9,name:"Kartu Grafis RTX 4060",img:"images/kartu-grafis-rtx-4060.jpg",cat:"Komponen",price:5199000,rate:4.9,sold:310,spec:"8 GB GDDR6, DLSS 3"},
 {id:10,name:"SSD NVMe 1TB",img:"images/ssd-nvme-1tb.jpg",cat:"Komponen",price:1099000,old:1299000,rate:4.8,sold:2480,spec:"Baca hingga 7.000 MB/s"},
 {id:11,name:"Kursi Gaming Ergonomis",img:"images/kursi-gaming-ergonomis.jpg",cat:"Furnitur",price:2499000,old:2999000,rate:4.4,sold:560,spec:"Sandaran 180°, bantal lumbar"},
 {id:12,name:"Mousepad XL RGB",img:"images/mousepad-xl-rgb.jpg",cat:"Aksesoris",price:189000,rate:4.6,sold:3200,spec:"90×40 cm, anti-slip"},
 {id:13,name:"Webcam Streaming 1080p",img:"images/webcam-streaming-1080p.jpg",cat:"Aksesoris",price:529000,rate:4.3,sold:780,spec:"60 fps, autofocus"},
 {id:14,name:"Controller Wireless",img:"images/controller-wireless.jpg",cat:"Aksesoris",price:699000,rate:4.7,sold:1110,spec:"PC & Android, hall effect"}
];
// ===== PENGATURAN PEMBAYARAN (ganti dengan data tokomu) =====
const PAY={
  wa:"62881026564981",
  banks:[
    {bank:"BCA",no:"1234567890",an:"PT TamaaStore.id"},
    {bank:"BRI",no:"098765432101",an:"PT TamaaStore.id"},
    {bank:"Mandiri",no:"1230009876543",an:"PT TamaaStore.id"},
    {bank:"BNI",no:"0123456789",an:"PT TamaaStore.id"}
  ],
  qris:"images/qris.png"
};
function pic(p){return `<img src="${p.img}" alt="${p.name}" loading="lazy">`}
// Jika file foto belum ada, tampilkan kotak abu-abu bertuliskan "Foto"
document.addEventListener("error",ev=>{
  const i=ev.target;
  if(i.tagName==="IMG"){const s=document.createElement("span");s.className="ph";s.textContent=i.dataset.ph||"Foto produk";i.replaceWith(s)}
},true);
const rp=n=>"Rp "+n.toLocaleString("id-ID");
const $=s=>document.querySelector(s);
let cat="Semua",cart={};
try{cart=JSON.parse(localStorage.getItem("gz-cart")||"{}")}catch(e){cart={}}
try{const t=localStorage.getItem("gz-theme");if(t)document.documentElement.dataset.theme=t}catch(e){}

function save(){try{localStorage.setItem("gz-cart",JSON.stringify(cart))}catch(e){}}
function toast(m){const t=$("#toast");t.textContent=m;t.classList.add("show");clearTimeout(toast.t);toast.t=setTimeout(()=>t.classList.remove("show"),1800)}

function renderChips(){
  const cats=["Semua",...new Set(PRODUCTS.map(p=>p.cat))];
  $("#chips").innerHTML=cats.map(c=>`<button class="chip" aria-pressed="${c===cat}" data-c="${c}">${c}</button>`).join("");
}
function renderGrid(){
  const q=$("#q").value.trim().toLowerCase(),s=$("#sort").value;
  let list=PRODUCTS.filter(p=>(cat==="Semua"||p.cat===cat)&&(p.name+p.spec).toLowerCase().includes(q));
  const sorters={pop:(a,b)=>b.sold-a.sold,low:(a,b)=>a.price-b.price,high:(a,b)=>b.price-a.price,name:(a,b)=>a.name.localeCompare(b.name)};
  list.sort(sorters[s]);
  $("#grid").innerHTML=list.length?list.map(p=>`
    <article class="card"><div class="thumb">${pic(p)}</div>
    <div class="info"><h3>${p.name}</h3><div class="meta">${p.spec}</div>
    <div class="meta">★ ${p.rate} · ${p.sold.toLocaleString("id-ID")} terjual</div>
    <div class="price">${rp(p.price)}${p.old?`<span class="old">${rp(p.old)}</span>`:""}</div>
    <button class="add" data-add="${p.id}">Tambah ke keranjang</button></div></article>`).join("")
    :`<p class="empty">Produk tidak ditemukan. Coba kata kunci atau kategori lain.</p>`;
}
function renderCart(){
  const ids=Object.keys(cart).filter(id=>PRODUCTS.some(p=>p.id==id));
  let total=0,n=0;
  $("#items").innerHTML=ids.length?ids.map(id=>{
    const p=PRODUCTS.find(x=>x.id==id),q=cart[id];total+=p.price*q;n+=q;
    return `<div class="row"><span class="e">${pic(p)}</span><div><strong>${p.name}</strong>
    <div class="meta">${rp(p.price)}</div>
    <div class="qty"><button data-dec="${id}" aria-label="Kurangi">−</button><span>${q}</span><button data-inc="${id}" aria-label="Tambah">+</button></div></div>
    <button class="ib" data-del="${id}" aria-label="Hapus ${p.name}">🗑</button></div>`}).join("")
    :`<p class="empty">Keranjang masih kosong. Pilih produk untuk memulai.</p>`;
  $("#total").textContent=rp(total);$("#count").textContent=n;
}
function setCart(open){$("#drawer").classList.toggle("open",open);$("#scrim").classList.toggle("open",open)}

$("#chips").addEventListener("click",e=>{const b=e.target.closest("[data-c]");if(!b)return;cat=b.dataset.c;renderChips();renderGrid()});
$("#q").addEventListener("input",renderGrid);
$("#sort").addEventListener("change",renderGrid);
$("#grid").addEventListener("click",e=>{const b=e.target.closest("[data-add]");if(!b)return;const id=b.dataset.add;cart[id]=(cart[id]||0)+1;save();renderCart();toast("Ditambahkan ke keranjang")});
$("#items").addEventListener("click",e=>{
  const t=e.target.closest("button");if(!t)return;
  const d=t.dataset;
  if(d.inc)cart[d.inc]++;
  if(d.dec&&--cart[d.dec]<=0)delete cart[d.dec];
  if(d.del)delete cart[d.del];
  save();renderCart();
});
$("#openCart").onclick=()=>setCart(true);
$("#closeCart").onclick=$("#scrim").onclick=()=>setCart(false);
document.addEventListener("keydown",e=>{if(e.key==="Escape")setCart(false)});
function cartLines(){
  return Object.keys(cart).map(id=>{const p=PRODUCTS.find(x=>x.id==id);return p?{p,q:cart[id]}:null}).filter(Boolean);
}
function sumHTML(lines){
  const total=lines.reduce((a,l)=>a+l.p.price*l.q,0);
  return `<div class="sum">${lines.map(l=>`<div><span>${l.q}× ${l.p.name}</span><span>${rp(l.p.price*l.q)}</span></div>`).join("")}<div class="t"><span>Total</span><span>${rp(total)}</span></div></div>`;
}
function openModal(html){$("#mBody").innerHTML=html;$("#modal").hidden=false}
function closeModal(){$("#modal").hidden=true}
const esc=s=>String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
let ship={n:"",p:"",a:""},method="bank";
const totalNow=()=>cartLines().reduce((a,l)=>a+l.p.price*l.q,0);

function stepShip(err){
  openModal(`<h2 id="mTitle">Data pengiriman</h2>${sumHTML(cartLines())}
    <label for="fn">Nama lengkap</label><input id="fn" autocomplete="name" value="${esc(ship.n)}">
    <label for="fp">No. WhatsApp</label><input id="fp" type="tel" autocomplete="tel" value="${esc(ship.p)}">
    <label for="fa">Alamat pengiriman</label><textarea id="fa" rows="3">${esc(ship.a)}</textarea>
    <p class="meta" style="color:var(--hot)" role="alert">${err||""}</p>
    <div class="acts"><button class="ghost" id="mCancel">Batal</button><button class="cta" id="mNext">Lanjut ke pembayaran</button></div>`);
  $("#mCancel").onclick=closeModal;
  $("#mNext").onclick=()=>{
    ship={n:$("#fn").value.trim(),p:$("#fp").value.trim(),a:$("#fa").value.trim()};
    if(!ship.n||!ship.p||!ship.a){stepShip("Lengkapi nama, nomor WhatsApp, dan alamat.");return}
    stepPay();
  };
}

function stepPay(){
  const detail=method==="bank"
    ?PAY.banks.map(b=>`<div class="bank"><div><strong>${b.bank}</strong><br><span class="no">${b.no}</span><br><span class="meta">a.n. ${b.an}</span></div><button class="ghost" data-copy="${b.no}">Salin</button></div>`).join("")
    :`<div class="qris"><img src="${PAY.qris}" alt="Kode QRIS TamaaStore.id" data-ph="Taruh gambar QRIS di images/qris.png"><p class="meta">Scan dengan aplikasi bank atau e-wallet apa pun yang mendukung QRIS.</p></div>`;
  openModal(`<h2 id="mTitle">Pembayaran</h2>
    <div class="due"><span>Total bayar</span><strong>${rp(totalNow())}</strong></div>
    <div class="chips"><button class="chip" aria-pressed="${method==="bank"}" data-m="bank">Transfer bank</button><button class="chip" aria-pressed="${method==="qris"}" data-m="qris">QRIS</button></div>
    ${detail}
    <p class="meta">Bayar sesuai nominal total dalam 24 jam, lalu klik "Saya sudah bayar".</p>
    <div class="acts"><button class="ghost" id="mBack">Kembali</button><button class="cta" id="mPaid">Saya sudah bayar</button></div>`);
  $("#mBody").querySelectorAll("[data-m]").forEach(b=>b.onclick=()=>{method=b.dataset.m;stepPay()});
  $("#mBody").querySelectorAll("[data-copy]").forEach(b=>b.onclick=()=>{
    try{navigator.clipboard.writeText(b.dataset.copy).then(()=>toast("Nomor rekening disalin"),()=>toast("Salin manual: "+b.dataset.copy))}catch(e){toast("Salin manual: "+b.dataset.copy)}
  });
  $("#mBack").onclick=()=>stepShip();
  $("#mPaid").onclick=stepDone;
}

function stepDone(){
  const lines=cartLines(),total=totalNow(),no="TS-"+Date.now().toString().slice(-6);
  const via=method==="bank"?"Transfer bank":"QRIS";
  const items=lines.map(l=>({name:l.p.name,price:l.p.price,q:l.q}));
  const code="GZ1."+btoa(unescape(encodeURIComponent(JSON.stringify({no,d:Date.now(),n:ship.n,p:ship.p,a:ship.a,m:via,t:total,i:items.map(x=>[x.name,x.price,x.q])}))));
  try{const all=JSON.parse(localStorage.getItem("ts-orders")||"[]");all.push({no,date:Date.now(),name:ship.n,phone:ship.p,addr:ship.a,method:via,total,items,status:"Menunggu pembayaran",resi:"",note:""});localStorage.setItem("ts-orders",JSON.stringify(all))}catch(e){}
  const msg=`Halo TamaaStore, saya sudah bayar pesanan ${no}.\nNama: ${ship.n}\nMetode: ${via}\nTotal: ${rp(total)}\nPesanan:\n`+lines.map(l=>`- ${l.q}× ${l.p.name}`).join("\n")+"\n\nKode pesanan (jangan diubah): "+code;
  openModal(`<h2 id="mTitle">Pesanan berhasil dibuat</h2>
    <p class="ok">Nomor pesanan: ${no}</p>
    <p class="meta">Status: menunggu konfirmasi pembayaran<br>Metode: ${via}<br>Atas nama ${esc(ship.n)}<br>Dikirim ke: ${esc(ship.a)}</p>
    ${sumHTML(lines)}
    <p class="meta">Kirim bukti pembayaran lewat WhatsApp agar pesananmu segera kami proses.</p>
    <div class="acts"><a class="cta" target="_blank" rel="noopener" href="https://wa.me/${PAY.wa}?text=${encodeURIComponent(msg)}">Konfirmasi via WhatsApp</a><button class="ghost" id="mDone">Selesai</button></div>`);
  cart={};save();renderCart();
  $("#mDone").onclick=closeModal;
}

$("#checkout").onclick=()=>{
  if(!cartLines().length){toast("Keranjang masih kosong");return}
  setCart(false);stepShip();
};
document.addEventListener("keydown",e=>{if(e.key==="Escape")closeModal()});
$("#theme").onclick=()=>{
  const r=document.documentElement,dark=r.dataset.theme?r.dataset.theme==="dark":matchMedia("(prefers-color-scheme:dark)").matches;
  r.dataset.theme=dark?"light":"dark";
  try{localStorage.setItem("gz-theme",r.dataset.theme)}catch(e){}
};
renderChips();renderGrid();renderCart();

$("#csend").onclick=()=>{
  const n=$("#cn").value.trim(),e=$("#ce").value.trim(),m=$("#cm").value.trim(),out=$("#cmsg");
  if(!n||!e||!m){out.style.color="var(--hot)";out.textContent="Lengkapi nama, email, dan pesan.";return}
  if(!/^\S+@\S+\.\S+$/.test(e)){out.style.color="var(--hot)";out.textContent="Format email belum benar.";return}
  out.style.color="var(--ok)";out.textContent="Terima kasih, "+n+". Pesanmu sudah kami terima dan akan dibalas maksimal 1x24 jam.";
  $("#cn").value=$("#ce").value=$("#cm").value="";
};
try{
  const links=[...document.querySelectorAll(".nav a")];
  const io=new IntersectionObserver(es=>{
    es.forEach(en=>{if(en.isIntersecting){links.forEach(a=>a.classList.toggle("on",a.getAttribute("href")==="#"+en.target.id))}});
  },{rootMargin:"-40% 0px -55% 0px"});
  ["beranda","produk","tentang","kontak"].forEach(id=>{const s=document.getElementById(id);if(s)io.observe(s)});
}catch(e){}