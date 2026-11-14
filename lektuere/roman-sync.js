'use strict';
(()=>{
const endpoint='https://elia-progress-sync.jpress1.chatgpt.site/v1/progress';
const pairKey='elia-pair-key-v1', cursorKey='elia-roman-stand-v1';
let secret=localStorage.getItem(pairKey)||'', keys, running=false, pending=false, timer, restoring=false, view='', activeId='';
const device=localStorage.getItem('elia-roman-geraet')||crypto.randomUUID();
localStorage.setItem('elia-roman-geraet',device);
const read=(key,fallback)=>JSON.parse(localStorage.getItem(key)||JSON.stringify(fallback));
let cursor=read(cursorKey,null);
const incoming=new URLSearchParams(location.hash.slice(1)).get('sync');
if(incoming){window.history.replaceState(null,'',location.pathname+location.search);if(/^[A-Za-z0-9_-]{43}$/.test(incoming)&&(!secret||secret===incoming)){secret=incoming;localStorage.setItem(pairKey,secret)}else $('abgleich').textContent='Dieser Link ist ungültig oder gehört zu einer anderen Verbindung.'}
function controls(){
 $('koppeln').hidden=!!secret;$('teilen').hidden=$('jetzt').hidden=!secret;$('fortsetzen').hidden=!cursor;
}
function legacyIds(){
 history.forEach((r,i)=>{if(!r.uid){r.uid=device+'/alt/'+i;r.zeit=i}});
}
legacyIds();save();
function requestSync(){if(!secret)return;clearTimeout(timer);timer=setTimeout(sync,650)}
function capture(){
 if(restoring||!view)return;
 const f=$('form');
 cursor={at:Math.max(Date.now(),(cursor?.at||0)+1),device,view,n:+$('chapter').value,plan,rows,level,streak,miss,mode,rundenId,
 answer:f?.querySelector('input:checked')?.value||'',text:$('text')?.value||'',notes:$('notes')?.value||'',submitted:!!$('go'),
 rubric:[0,1,2].map(i=>!!$('r'+i)?.checked)};
 activeId=cursor.at+device;localStorage.setItem(cursorKey,JSON.stringify(cursor));controls();requestSync();
}
const draw=show;show=function(){
 const seed=Array.from(rundenId+'/'+rows.length).reduce((h,c)=>Math.imul(h,31)+c.charCodeAt(0)|0,7);
 let x=seed;zufall=()=>((x=(Math.imul(x,1664525)+1013904223)>>>0)/4294967296);
 try{draw()}finally{zufall=Math.random}view='frage';capture();
};
const result=report;report=function(){result();view='bericht';capture()};
const reading=nachlesen;nachlesen=function(n){reading(n);view='lesen';capture()};
for(const type of ['input','submit'])$('task').addEventListener(type,capture);
function resume(){
 if(!cursor)return;
 const c=cursor;restoring=true;
 try{plan=c.plan;rows=c.rows;level=c.level;streak=c.streak;miss=c.miss;mode=c.mode;rundenId=c.rundenId;
 if(c.view==='lesen')nachlesen(c.n);else if(c.view==='bericht')report();else{
 show();if($('text'))$('text').value=c.text;if($('notes'))$('notes').value=c.notes;
 const radio=[...$('form').querySelectorAll('input')].find(r=>r.value===c.answer);if(radio)radio.checked=true;
 if(c.submitted){$('form').requestSubmit();c.rubric.forEach((v,i)=>{if($('r'+i))$('r'+i).checked=v})}}
 activeId=c.at+c.device;
 }finally{restoring=false}
}
function share(){
 const url=new URL(location.pathname,location.origin);url.hash='sync='+secret;
 $('paarlink').value=url.href;const qr=qrcode(0,'M');qr.addData(url.href,'Byte');qr.make();$('paarkode').innerHTML=qr.createSvgTag({scalable:true,cellSize:4,margin:16});$('paarung').hidden=false;
}
async function relay(method,body){
 const r=await fetch(endpoint,{method,headers:{Authorization:'Bearer '+keys.auth,...(body?{'Content-Type':'application/json'}:{})},body:body?JSON.stringify(body):undefined,cache:'no-store',signal:AbortSignal.timeout(15000)});
 if(!r.ok)throw Error(String(r.status));return r.json();
}
function snapshot(){return {v:1,history,cursor,selection:letzteFragen,focus:read('elia-montagsfragen',[])}}
async function sync(){
 if(!secret)return;if(running){pending=true;return}running=true;
 try{
 $('abgleich').textContent='Lernstand wird abgeglichen …';
 // Same pairing secret, separate encrypted relay namespace for the novel.
 if(!keys){const key=await crypto.subtle.importKey('raw',new TextEncoder().encode(secret),{name:'HMAC',hash:'SHA-256'},false,['sign']);
 const bytes=await crypto.subtle.sign('HMAC',key,new TextEncoder().encode('elia-roman-v1'));
 keys=await SyncCrypto.keys(btoa(String.fromCharCode(...new Uint8Array(bytes))).replaceAll('+','-').replaceAll('/','_').replaceAll('=',''))}
 const remote=await relay('GET');let rev=0,own;
 const states=[];
 for(const entry of remote.devices){const state=await SyncCrypto.decrypt(entry,keys.encryption);if(state.v!==1||!Array.isArray(state.history))throw Error('Format');states.push(state);if(entry.device===device){rev=entry.revision;own=state}}
 const local=snapshot();states.push(local);
 const attempts=new Map();for(const s of states)for(const a of s.history)attempts.set(a.uid,a);
 history=[...attempts.values()].sort((a,b)=>a.zeit-b.zeit||a.uid.localeCompare(b.uid));
 states.sort((a,b)=>(a.cursor?.at||0)-(b.cursor?.at||0)||(a.cursor?.device||'').localeCompare(b.cursor?.device||''));
 cursor=states.at(-1).cursor;
 const ordered=key=>[...new Set(states.flatMap(s=>s[key]||[]).reverse())].reverse();
 letzteFragen=ordered('selection');localStorage.setItem('elia-fragenauswahl',JSON.stringify(letzteFragen));localStorage.setItem('elia-montagsfragen',JSON.stringify(ordered('focus')));
 localStorage.setItem(cursorKey,JSON.stringify(cursor));save();leseplan();controls();
 const value=snapshot();if(JSON.stringify(value)!==JSON.stringify(own))await relay('PUT',await SyncCrypto.encrypt(value,keys.encryption,device,rev+1));
 $('abgleich').textContent=cursor&&activeId!==cursor.at+cursor.device?'Lernstand abgeglichen. Mit «Gespeicherten Stand öffnen» setzt du an der letzten Stelle fort.':'Lernstand abgeglichen · '+new Date().toLocaleTimeString('de-CH',{hour:'2-digit',minute:'2-digit'});
 }catch{$('abgleich').textContent='Lokal gespeichert. Der Online-Abgleich wird erneut versucht.'}
 finally{running=false;if(pending){pending=false;requestSync()}}
}
$('fortsetzen').onclick=resume;$('jetzt').onclick=sync;$('teilen').onclick=share;
$('kopieren').onclick=async()=>{try{await navigator.clipboard.writeText($('paarlink').value);$('kopieren').textContent='Link kopiert'}catch{$('paarlink').select()}};
$('koppeln').onclick=()=>{secret=localStorage.getItem(pairKey)||SyncCrypto.createSecret();localStorage.setItem(pairKey,secret);controls();share();sync()};
controls();if(!$('abgleich').textContent)$('abgleich').textContent=secret?'Verbindung wird geladen …':'Auf diesem Gerät gespeichert. Verbinde Handy und Laptop einmalig.';
if(secret)sync();window.addEventListener('online',sync);document.addEventListener('visibilitychange',()=>{if(!document.hidden)sync()});setInterval(()=>{if(!document.hidden)sync()},20000);
})();
