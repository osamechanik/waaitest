import { h } from 'https://esm.sh/preact@10.20.2'; import { useState, useEffect, useRef } from 'https://esm.sh/preact@10.20.2/hooks'; import htm from 'https://esm.sh/htm@3.1.1'; const html = htm.bind(h);
export default function ChatView({ agent }){
  const [chat,setChat]=useState([]); const [msg,setMsg]=useState(''); const endRef=useRef(null);
  useEffect(()=>{ endRef.current?.scrollIntoView({ behavior:'smooth' }); },[chat]);
  const send=async(text)=>{ const content=(text||msg).trim(); if(!content) return; setChat(c=>[...c,{type:'user',content,ts:Date.now()}]); const {text:reply}=await agent.chat(content); setChat(c=>[...c,{type:'ai',content:reply,ts:Date.now()}]); setMsg(''); };
  return html`<div class="space-y-3">
    <div class="bg-gray-800/50 rounded-xl p-4 border border-gray-700/50">
      <div class="h-64 overflow-y-auto space-y-2" id="box">
        ${chat.map((m,i)=> html`<div class=${"text-sm " + (m.type==='user'?'text-white':'text-gray-300')}>${m.content}</div>`)}
        <div ref=${endRef}></div>
      </div>
      <form onSubmit=${e=>{e.preventDefault(); send(msg);}} class="mt-3 flex gap-2">
        <input value=${msg} onInput=${e=>setMsg(e.target.value)} placeholder="Zapytaj AI..." class="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white"/>
        <button class="px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg">Wyślij</button>
      </form>
    </div>
  </div>`;
}
