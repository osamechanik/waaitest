import { h } from 'https://esm.sh/preact@10.20.2'; import { useState, useEffect } from 'https://esm.sh/preact@10.20.2/hooks'; import htm from 'https://esm.sh/htm@3.1.1'; const html = htm.bind(h);
const fmt = (v) => new Intl.NumberFormat('pl-PL', { maximumFractionDigits: 2 }).format(v||0);
export default function OrdersView({ agent, push }){
  const [orders,setOrders]=useState(()=>{ try{ const s=localStorage.getItem('wainex_orders_v1'); return s? JSON.parse(s) : []; }catch{return [];} });
  useEffect(()=> localStorage.setItem('wainex_orders_v1', JSON.stringify(orders)), [orders]);
  const addNew=()=>{ const id='ORD-'+new Date().getFullYear()+'-'+String(Math.floor(Math.random()*999)+1).padStart(3,'0'); const o={ id, client:{name:'Nowy Klient',phone:'+48 ...'}, car:{brand:'',model:'',year:'',vin:''}, status:'pending', total:0, parts:[], createdAt:Date.now(), aiRecommendations:[] }; setOrders([o,...orders]); push && push('Dodano '+id,'success'); };
  const optimize=(o)=>{ agent.optimizeOrder(o.parts).then(res=>{ if (res.type==='ORDER_PLAN'){ const parts=res.result.parts; const total=parts.reduce((s,p)=>s+p.price*(p.qty||1),0); setOrders(os=>os.map(x=>x.id===o.id?{...x, parts, total}:x)); push && push(`Zoptymalizowano ${o.id} (oszczędność ${res.result.savings} zł)`,'success'); } }); };
  const submit=(o)=>{ if(!o.parts || o.parts.length===0){ push && push('Koszyk pusty','error'); return; } setOrders(os=>os.map(x=>x.id===o.id?{...x,status:'processing',submittedAt:Date.now()}:x)); push && push('Wysłano '+o.id,'success'); };
  const done=(o)=>{ setOrders(os=>os.map(x=>x.id===o.id?{...x,status:'done',doneAt:Date.now()}:x)); push && push('Gotowe '+o.id,'success'); };
  const dupe=(o)=>{ const id='ORD-'+new Date().getFullYear()+'-'+String(Math.floor(Math.random()*999)+1).padStart(3,'0'); const copy=JSON.parse(JSON.stringify(o)); copy.id=id; copy.status='pending'; copy.createdAt=Date.now(); setOrders([copy, ...orders]); push && push(`Zduplikowano ${o.id} → ${id}`,'success'); };
  const del=(o)=>{ if(!confirm('Usunąć '+o.id+'?')) return; setOrders(orders.filter(x=>x.id!==o.id)); push && push('Usunięto '+o.id,'success'); };
  return html`<div class="space-y-6">
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-4"><div class="p-2 bg-gradient-to-br from-rose-500 to-pink-500 rounded-lg"><i data-lucide="shopping-cart" class="w-6 h-6 text-white"></i></div><div><h2 class="text-2xl font-bold text-white">Zarządzanie Zamówieniami</h2><p class="text-gray-400">Pełna kontrola z AI</p></div></div>
      <button onClick=${addNew} class="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-6 py-3 rounded-xl transition-all duration-300 shadow-lg"><i data-lucide="plus" class="w-5 h-5"></i> Nowe zamówienie</button>
    </div>
    <div class="space-y-4">
      ${orders.map(o => html`<div class="bg-gray-800/60 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center gap-4"><div class="p-2 bg-blue-500/20 rounded-lg"><i data-lucide="car" class="w-6 h-6 text-blue-400"></i></div><div><h3 class="text-lg font-bold text-white">#${o.id}</h3><p class="text-gray-400 text-sm">${o.client.name}</p></div></div>
          <div class="flex items-center gap-4"><div class="text-right"><p class="text-xl font-bold text-white">${fmt(o.total)} zł</p><p class="text-gray-400 text-sm">${o.parts.length} części</p></div><div class=${"px-3 py-1 rounded-full text-xs border " + (o.status==='pending'?'bg-orange-500/20 text-orange-400 border-orange-500/30': o.status==='processing'?'bg-blue-500/20 text-blue-400 border-blue-500/30':'bg-green-500/20 text-green-400 border-green-500/30')}>${o.status==='pending'?'Oczekuje':o.status==='processing'?'Realizacja':'Gotowe'}</div></div>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 p-4 bg-gray-700/20 rounded-lg">
          <div><h4 class="text-sm font-semibold text-white mb-2">Pojazd</h4><p class="text-gray-300 text-sm">${o.car.brand} ${o.car.model} ${o.car.year? '('+o.car.year+')' : ''}</p><p class="text-gray-400 text-xs">VIN: ${o.car.vin||'-'}</p></div>
          <div><h4 class="text-sm font-semibold text-white mb-2">Kontakt</h4><p class="text-gray-300 text-sm">${o.client.phone}</p><p class="text-gray-400 text-xs">Utworzono: ${new Date(o.createdAt).toLocaleDateString('pl-PL')}</p></div>
        </div>
        <div class="flex flex-wrap gap-2 mb-3">
          <button onClick=${()=>optimize(o)} class="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-500/20 text-blue-200 border border-blue-500/30 hover:bg-blue-500/30 transition"><i data-lucide="sparkles" class="w-4 h-4"></i> Optymalizuj</button>
          <button onClick=${()=>submit(o)} class="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-purple-500/20 text-purple-200 border border-purple-500/30 hover:bg-purple-500/30 transition"><i data-lucide="send" class="w-4 h-4"></i> Wyślij</button>
          <button onClick=${()=>done(o)} class="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-green-500/20 text-green-200 border border-green-500/30 hover:bg-green-500/30 transition"><i data-lucide="check-circle" class="w-4 h-4"></i> Gotowe</button>
          <button onClick=${()=>dupe(o)} class="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-600/20 text-gray-200 border border-gray-600/30 hover:bg-gray-600/30 transition"><i data-lucide="copy" class="w-4 h-4"></i> Duplikuj</button>
          <button onClick=${()=>del(o)} class="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-red-500/20 text-red-200 border border-red-500/30 hover:bg-red-500/30 transition"><i data-lucide="trash-2" class="w-4 h-4"></i> Usuń</button>
        </div>
        <div class="space-y-2"><h4 class="text-sm font-semibold text-white">Części:</h4>${(o.parts.length?o.parts:[{name:'— Brak pozycji —', code:'', supplier:'', price:0, qty:0}]).map((p,idx)=> html`
          <div class="flex justify-between items-center p-2 bg-gray-700/30 rounded-lg"><div><p class="text-white text-sm font-medium">${p.name}</p><p class="text-gray-400 text-xs">${[p.code,p.supplier].filter(Boolean).join(' • ') || '\u00A0'}</p></div><div class="text-right"><p class="text-white font-semibold">${(p.qty||1)}x ${p.price} zł</p></div></div>
        `)}</div>
      </div>` )}
    </div>
  </div>`;
}
