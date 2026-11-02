const ADMIN_PASSWORD="admin123"; 
const STATUS=["Menunggu pembayaran","Dibayar","Diproses","Dikirim","Selesai","Dibatalkan"];
const $=s=>document.querySelector(s);
const rp=n=>"Rp "+Number(n).toLocaleString("id-ID");
const esc=s=>String(s==null?"":s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const fmt=d=>new Date(d).toLocaleString("id-ID",{dateStyle:"medium",timeStyle:"short"});
const waNum=p=>{p=String(p).replace(/\D/g,"");return p.startsWith("0")?"62"+p.slice(1):p};
let orders=[];

function toast(m){const t=$("#toast");t.textContent=m;t.classList.add("show");clearTimeout(toast.t);toast.t=setTimeout(()=>t.classList.remove("show"),2000)}
function load(){try{orders=JSON.parse(localStorage.getItem("ts-orders")||"[]")}catch(e){orders=[]}}
function save(){try{localStorage.setItem("ts-orders",JSON.stringify(orders))}catch(e){toast("Gagal menyimpan data")}}
const opts=sel=>STATUS.map(s=>`<option${s===sel?" selected":""}>${s}</option>`).join("");

function render(){
  const q=$("#q").value.trim().toLowerCase(),f=$("#fs").value;
  const list=orders.filter(o=>(!f||o.status===f)&&(o.no+o.name+o.phone).toLowerCase().includes(q)).sort((a,b)=>b.date-a.date);
  const by=a=>orders.filter(o=>a.includes(o.status));
  const omzet=by(STATUS.slice(1,5)).reduce((s,o)=>s+o.total,0);
  $("#stats").innerHTML=[["Total pesanan",orders.length],["Menunggu pembayaran",by([STATUS[0]]).length],["Perlu dikirim",by([STATUS[1],STATUS[2]]).length],["Omzet",rp(omzet)]].map(([l,v])=>`<div><strong>${v}</strong>${l}</div>`).join("");
  $("#rows").innerHTML=list.length?list.map(o=>`<tr>
    <td><strong>${esc(o.no)}</strong><br><span class="meta">${fmt(o.date)}</span></td>
    <td>${esc(o.name)}<br><span class="meta">${esc(o.phone)}</span></td>
    <td>${rp(o.total)}<br><span class="meta">${esc(o.method)}</span></td>
    <td><select data-st="${esc(o.no)}" aria-label="Status ${esc(o.no)}">${opts(o.status)}</select></td>
    <td><button class="ghost" data-d="${esc(o.no)}">Detail</button></td></tr>`).join("")
    :`<tr><td colspan="5" class="empty">Belum ada pesanan. Tempel kode dari WhatsApp pembeli, atau klik "Isi data contoh" untuk mencoba.</td></tr>`;
}

function setStatus(o,s){
  if(s===STATUS[3]&&!o.resi){toast("Isi no. resi dulu di menu Detail");return false}
  o.status=s;save();return true;
}
function openModal(h){$("#mBody").innerHTML=h;$("#modal").hidden=false}
function closeModal(){$("#modal").hidden=true}

function detail(no){
  const o=orders.find(x=>x.no===no);if(!o)return;
  openModal(`<h2 id="mTitle">Pesanan ${esc(o.no)}</h2>
    <p class="meta">${fmt(o.date)} · ${esc(o.method)}</p>
    <div class="sum">${o.items.map(i=>`<div><span>${i.q}× ${esc(i.name)}</span><span>${rp(i.price*i.q)}</span></div>`).join("")}<div class="t"><span>Total</span><span>${rp(o.total)}</span></div></div>
    <p><strong>${esc(o.name)}</strong><br>${esc(o.phone)}<br>${esc(o.addr)}</p>
    <label for="ds">Status</label><select id="ds">${opts(o.status)}</select>
    <label for="dr">No. resi pengiriman</label><input id="dr" value="${esc(o.resi)}">
    <label for="dn">Catatan internal</label><textarea id="dn" rows="2">${esc(o.note)}</textarea>
    <div class="acts"><button class="ghost" id="dDel">Hapus</button><button class="ghost" id="dWa">Chat pembeli</button><button class="cta" id="dSave">Simpan</button></div>
    <button class="ghost" id="dClose" style="width:100%;margin-top:10px">Tutup</button>`);
  $("#dClose").onclick=closeModal;
  $("#dSave").onclick=()=>{
    o.resi=$("#dr").value.trim();o.note=$("#dn").value.trim();
    if(!setStatus(o,$("#ds").value))return;
    closeModal();render();toast("Pesanan diperbarui");
  };
  $("#dDel").onclick=()=>{
    if(!confirm("Hapus pesanan "+o.no+"? Tindakan ini tidak bisa dibatalkan."))return;
    orders=orders.filter(x=>x!==o);save();closeModal();render();toast("Pesanan dihapus");
  };
  $("#dWa").onclick=()=>{
    const s=$("#ds").value,r=$("#dr").value.trim();
    const t={
      "Menunggu pembayaran":`kami menunggu pembayaran pesanan ${o.no} sebesar ${rp(o.total)}.`,
      "Dibayar":`pembayaran pesanan ${o.no} sudah kami terima. Terima kasih!`,
      "Diproses":`pesanan ${o.no} sedang kami proses.`,
      "Dikirim":`pesanan ${o.no} sudah dikirim.${r?" No. resi: "+r+".":""}`,
      "Selesai":`pesanan ${o.no} sudah selesai. Terima kasih sudah belanja di TamaaStore.id!`,
      "Dibatalkan":`pesanan ${o.no} dibatalkan. Hubungi kami jika ada pertanyaan.`}[s];
    window.open("https://wa.me/"+waNum(o.phone)+"?text="+encodeURIComponent("Halo "+o.name+", "+t),"_blank","noopener");
  };
}

function decode(code){
  const j=JSON.parse(decodeURIComponent(escape(atob(code))));
  return {no:j.no,date:j.d,name:j.n,phone:j.p,addr:j.a,method:j.m,total:j.t,
    items:j.i.map(x=>({name:x[0],price:x[1],q:x[2]})),status:STATUS[0],resi:"",note:""};
}
function importText(text){
  let add=0,dup=0,bad=0;
  for(const m of text.matchAll(/TS1\.([A-Za-z0-9+/=]+)/g)){
    try{const o=decode(m[1]);if(orders.some(x=>x.no===o.no))dup++;else{orders.push(o);add++}}catch(e){bad++}
  }
  save();render();
  toast(add+" ditambahkan"+(dup?", "+dup+" sudah ada":"")+(bad?", "+bad+" tidak terbaca":""));
}
function demo(){
  const now=Date.now(),mk=(i,n,p,m,items,st)=>({no:"TS-90000"+i,date:now-i*3600e3*7,name:n,phone:p,addr:"Jl. Contoh No. "+i+", Kota Anda",method:m,total:items.reduce((a,x)=>a+x.price*x.q,0),items,status:st,resi:st==="Dikirim"?"JNE123456"+i:"",note:""});
  [mk(1,"Budi Santoso","081234560001","Transfer bank",[{name:"Mouse Wireless Pro X",price:899000,q:1}],"Menunggu pembayaran"),
   mk(2,"Siti Aminah","081234560002","QRIS",[{name:"Keyboard Mekanikal TKL",price:749000,q:1},{name:"Mousepad XL RGB",price:189000,q:2}],"Dibayar"),
   mk(3,"Rudi Hartono","081234560003","Transfer bank",[{name:"Monitor 27″ 165Hz",price:2799000,q:1}],"Dikirim")]
  .forEach(o=>{if(!orders.some(x=>x.no===o.no))orders.push(o)});
  save();render();
}
function csv(){
  const c=v=>'"'+String(v==null?"":v).replace(/"/g,'""')+'"';
  const rows=[["No","Tanggal","Nama","WhatsApp","Alamat","Metode","Barang","Total","Status","Resi","Catatan"]].concat(
    orders.map(o=>[o.no,fmt(o.date),o.name,o.phone,o.addr,o.method,o.items.map(i=>i.q+"x "+i.name).join("; "),o.total,o.status,o.resi,o.note]));
  const b=new Blob(["\ufeff"+rows.map(r=>r.map(c).join(",")).join("\n")],{type:"text/csv;charset=utf-8"});
  const a=document.createElement("a");a.href=URL.createObjectURL(b);a.download="pesanan-tamaastore.id";a.click();
}

function start(){
  $("#login").hidden=true;$("#app").hidden=false;load();
  $("#fs").innerHTML='<option value="">Semua status</option>'+STATUS.map(s=>`<option>${s}</option>`).join("");
  render();
}
$("#lgo").onclick=()=>{
  if($("#pw").value===ADMIN_PASSWORD){try{sessionStorage.setItem("ts-admin","1")}catch(e){}start()}
  else $("#lerr").textContent="Password salah.";
};
$("#pw").addEventListener("keydown",e=>{if(e.key==="Enter")$("#lgo").onclick()});
$("#out").onclick=()=>{try{sessionStorage.removeItem("ts-admin")}catch(e){}location.reload()};
$("#q").addEventListener("input",render);
$("#fs").addEventListener("change",render);
$("#rows").addEventListener("change",e=>{
  const s=e.target.closest("[data-st]");if(!s)return;
  const o=orders.find(x=>x.no===s.dataset.st);
  if(o&&setStatus(o,s.value))toast("Status diperbarui");
  render();
});
$("#rows").addEventListener("click",e=>{const b=e.target.closest("[data-d]");if(b)detail(b.dataset.d)});
$("#bImp").onclick=()=>{$("#imp").hidden=!$("#imp").hidden};
$("#impGo").onclick=()=>{importText($("#impText").value);$("#impText").value=""};
$("#bCsv").onclick=csv;
$("#bDemo").onclick=demo;
document.addEventListener("keydown",e=>{if(e.key==="Escape")closeModal()});
try{if(sessionStorage.getItem("ts-admin")==="1")start()}catch(e){}
