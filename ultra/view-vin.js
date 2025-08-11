import { h } from 'https://esm.sh/preact@10.20.2'; import { useState, useRef } from 'https://esm.sh/preact@10.20.2/hooks'; import htm from 'https://esm.sh/htm@3.1.1'; const html = htm.bind(h);
export default function VinView({ agent }){
  const [vin,setVin]=useState(''); const [result,setResult]=useState(null); const [err,setErr]=useState('');
  const [scanActive,setScanActive]=useState(false); const videoRef=useRef(null); const [scanResult,setScanResult]=useState('');
  const onVIN = async ()=>{ setErr(''); setResult(null); const r = await agent.analyzeVIN(vin); if (r.type==='ERROR') setErr(r.error); if (r.type==='VIN_RESULT') setResult(r.result); };
  const startScan = async ()=>{ try { if ('BarcodeDetector' in window){ const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } }); videoRef.current.srcObject = stream; await videoRef.current.play(); setScanActive(true); const detector = new BarcodeDetector({ formats: ['ean_13','code_128','qr_code','ean_8','upc_a'] }); const loop = async ()=>{ if(!scanActive) return; try{ const bm = await createImageBitmap(videoRef.current); const codes = await detector.detect(bm); if (codes && codes[0]){ setScanResult(codes[0].rawValue || ''); stop(); } } catch{} requestAnimationFrame(loop); }; const stop = ()=>{ stream.getTracks().forEach(t=>t.stop()); setScanActive(false); }; loop(); } else { setScanActive(true); window.zxingStart(videoRef.current, (text)=>{ setScanResult(text); setScanActive(false); }, (err)=>console.warn(err)); } } catch(e){ alert('Kamera niedostępna'); setScanActive(false); } };
  return html`<div class="space-y-8">
    <div class="bg-gradient-to-br from-green-600/20 to-emerald-600/20 backdrop-blur-sm border border-green-500/30 rounded-2xl p-8 shadow-2xl">
      <div class="flex items-center gap-4 mb-6"><div class="p-3 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl"><i data-lucide="search" class="w-8 h-8 text-white"></i></div><div><h2 class="text-2xl font-bold text-white">Analiza VIN z AI</h2><p class="text-green-300">Identyfikacja części z ML</p></div></div>
      <div class="space-y-6">
        <div class="relative max-w-2xl">
          <input type="text" placeholder="Wprowadź numer VIN lub zeskanuj kod..." class="w-full px-6 py-4 bg-gray-800/50 border-2 border-gray-600/50 focus:border-green-500 rounded-xl text-white placeholder-gray-400 text-lg tracking-widest transition-all duration-300" maxLength="17" value=${vin} onInput=${e=>setVin(e.target.value.toUpperCase())} />
          <div class="absolute right-4 top-1/2 -translate-y-1/2 flex gap-2">
            <button onClick=${onVIN} class="p-2 bg-green-500/20 hover:bg-green-500/30 rounded-lg transition-colors" title="Szukaj"><i data-lucide="search" class="w-6 h-6 text-green-400"></i></button>
            <button onClick=${startScan} class="p-2 bg-blue-500/20 hover:bg-blue-500/30 rounded-lg transition-colors" title="Skanuj"><i data-lucide="scan-line" class="w-6 h-6 text-blue-400"></i></button>
          </div>
          ${scanResult && html`<p class="text-gray-300 text-sm mt-2">Odczyt skanera: <span class="font-mono">${scanResult}</span></p>`}
          ${err && html`<p class="text-red-300 text-sm mt-2">${err}</p>`}
        </div>
      </div>
    </div>
  </div>`;
}
