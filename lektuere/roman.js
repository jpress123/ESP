'use strict';
const $=id=>document.getElementById(id);
const goals=['Lesen und verstehen','Körpersprache, Gefühle und Absichten','Spannung erklären','Hören und Notizen machen'];
const sections=['Handlung und Textverständnis','Figuren und Psychologie','Spannung und Erzähltechnik','Interpretation und kritisches Denken','Hörverstehen und Notizen'];
const goal=[0,1,2,0,3],levels=['Grundlagen','Verständnis','Analyse'];
const techniques=[
 ['Perspektivwechsel',[6,7,25,26,75,76,77,112,113,114,117,118,119,120],'Vergleiche die Wahrnehmung mit der unmittelbar benachbarten Erzählstimme. Was kann eine Stimme nur vermuten?','Der Wechsel verteilt Wissen auf mehrere Personen. Er macht den Abstand zwischen äusserer Handlung und innerer Wahrnehmung spürbar.'],
 ['Verzögerte Auflösung',[5,7,20,22,29,37,55,56,71,107,108,123,129,130],'Welche Frage bleibt beim Lesen zunächst offen? Zeige, an welcher Stelle du eine Antwort erwartest.','Ein Signal weckt eine Erwartung. Die fehlende Information hält mehrere mögliche Fortsetzungen offen.'],
 ['Erzähltempo',[9,41,62,84,98,109,113,128,132],'An welcher Stelle verlangsamt oder unterbricht sich die Handlung? Was nimmst du dadurch genauer wahr?','Ein kurzer Augenblick kann beim Lesen viel Raum einnehmen. Einzelne Wahrnehmungen oder ein Rückblick unterbrechen die Folge der Ereignisse.']
];
const bankC=techniques.flatMap((t,k)=>t[1].map(n=>({n,k})));
const dPool=[6,26,28,33,35,38,43,51,53,60,69,70,75,76,82,93,100,105,109,110,113,120,121,125,126,131,134];
const bPool=kapitel.filter(x=>!['Der Brief','Durchsage','Epilog','Prolog'].includes(x.name));
const item=n=>kapitel[n-1],ref=n=>'Abschnitt '+n+' · '+item(n).name;
let zufall=Math.random;
function shuffle(list){const a=[...list];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a}
let history=[];try{history=JSON.parse(localStorage.getItem('elia-roman-2'))||[]}catch{}
function stats(rows,g){const a=rows.filter(r=>r.g===g);return a.length?Math.round(100*a.filter(r=>r.ok).length/a.length):null}
function goalsView(rows){return goals.map((name,g)=>{const x=stats(rows,g);return '<p>'+name+' · '+(x===null?'noch offen':'<meter min="0" max="100" value="'+x+'"></meter> '+x+' % · '+(x<70?'weiter üben':'festigen'))+'</p>'}).join('')}
function save(){try{localStorage.setItem('elia-roman-2',JSON.stringify(history))}catch{}$('history').innerHTML=goalsView(history)}
let plan=[],rows=[],level,streak,miss,mode,current;
function make(s,n,k){return {s,n,k,id:s+'-'+n}}
function pick(s,count,avoid=[]){let pool=s===2?bankC.map(o=>make(s,o.n,o.k)):s===3?dPool.map(n=>make(s,n)):s===1?bPool.map(o=>make(s,o.n)):kapitel.filter(o=>s!==4||(o.n>1&&o.n<134)).map(o=>make(s,o.n));
 const used=new Set(avoid);let recent=new Set(history.slice(-30).map(r=>r.id));return shuffle(pool).filter(q=>!used.has(q.id)).sort((a,b)=>Number(recent.has(a.id))-Number(recent.has(b.id))).slice(0,count)}
let rundenId="";
function begin(p,m){rundenId=crypto.randomUUID();window.speechSynthesis?.cancel();plan=p;rows=[];level=1;streak=miss=0;mode=m;show()}
$('chapter').innerHTML=kapitel.map(c=>'<option value="'+c.n+'">'+ref(c.n)+'</option>').join('');
let letzteFragen=[];
try{let daten=JSON.parse(localStorage.getItem('elia-fragenauswahl')||'[]');if(Array.isArray(daten))letzteFragen=daten}catch{}
function quizStart(name,verteilung){
 const zuletzt=n=>letzteFragen.lastIndexOf(n);
 const verfuegbar=shuffle(kapitel.map(c=>c.n)).sort((a,b)=>zuletzt(a)-zuletzt(b));
 const runde=[];
 for(const [s,anzahl] of verteilung.entries()){
  for(let i=0;i<anzahl;i++){
   const pos=verfuegbar.findIndex(n=>s===2?bankC.some(c=>c.n===n):s===1?bPool.some(c=>c.n===n):s===4?n>1&&n<134:true);
   const n=verfuegbar.splice(pos,1)[0];
   const q=make(s,n,s===2?shuffle(bankC.filter(c=>c.n===n))[0].k:undefined);
   q.detail=true;runde.push(q);
  }
 }
 const neu=runde.map(q=>q.n);
 letzteFragen=[...letzteFragen.filter(n=>!neu.includes(n)),...neu];
 try{localStorage.setItem('elia-fragenauswahl',JSON.stringify(letzteFragen))}catch{}
 begin(runde,name);
}
$('handlung').onclick=()=>quizStart('Handlung und Zusammenhänge',[15,3,2,6,4]);
$('figuren').onclick=()=>quizStart('Figuren und Erzählweise',[3,12,8,3,4]);
$('start').onclick=()=>quizStart('Probeprüfung',[8,8,6,4,4]);
$('practice').onclick=()=>{const n=+$('chapter').value;begin([{...make(0,n),detail:true},make(3,n)],'Kapiteltraining')};
function alternatives(n){return kapitel.filter(c=>Math.abs(c.n-n)>12)}
function sceneAudio(n){const first=Math.max(1,n-3),last=Math.min(134,n+3);return kapitel.slice(first-1,last).map(c=>c.n===n?'Achte jetzt auf das folgende Detail. '+c.note+' '+detailfragen[n-1][1]:c.note).join(' ')}
function options(q){const ns=shuffle(alternatives(q.n)).slice(0,2);return shuffle([item(q.n),...ns]).map(x=>'<label><input required type="radio" name="wahl" value="'+x.n+'"> '+(q.detail?detailfragen[x.n-1][1]:x.note)+'</label>').join('')}
function show(){window.speechSynthesis?.cancel();const q=plan[rows.length],s=q.s,n=q.n,c=item(n);const [detailfrage,detailantwort]=detailfragen[n-1];current={q,level};const choice=!q.vertiefung&&(s===0||s===4||s===1&&level===0);
 const tf=!q.vertiefung&&!q.detail&&s===0&&level===1&&rows.length%2===1;
 let prompt,answers='',model=c.note;
 if(q.vertiefung){prompt=q.vertiefung;model=c.note+' '+detailantwort+' Prüfe, ob dein Beleg zur Deutung passt. Auch eine andere begründete Antwort ist möglich.'}
 else if(tf){const truth=zufall()<.5;current.correct=truth?'ja':'nein';const other=shuffle(alternatives(n))[0];const claim=truth?c.note:other.note;if(!truth)model+=' Die vorgelegte Aussage fasst '+ref(other.n)+' zusammen.';prompt='Gehört diese Aussage zu genau diesem Abschnitt? '+claim;answers='<label><input required type="radio" name="wahl" value="ja"> Ja</label><label><input required type="radio" name="wahl" value="nein"> Nein</label>'}
 else if(choice){current.correct=String(n);prompt=s===4?'Welche Aussage gehört zum ausdrücklich angekündigten Detail der Hörfolge?':s===1?'Welche Beobachtung passt zur Figur in diesem Abschnitt?':'Welche Aussage gibt diesen Abschnitt wieder?';answers=options(q)}
 else if(s===1){prompt='Was nimmt '+c.name+' wahr? Erkläre anhand einer Handlung, einer Geste oder eines Gedankens, welches Gefühl oder welche Absicht du vermutest.'}
 else if(s===2){const t=techniques[q.k];prompt=t[2];model+=' '+t[3]}
 else{prompt=level===0?'Welche Frage wirft diese Szene für dich auf? Begründe deine Antwort mit einem Detail.':'Wie beurteilst du die Sichtweise oder das Handeln in diesem Abschnitt? Entwickle eine Deutung und belege sie.'}
 if(q.detail){
  prompt=detailfrage;
  model=detailantwort;
  if(s===1&&level>0)prompt+=' Welche Haltung oder Gefühlslage lässt sich daran erkennen? Begründe deine Deutung.';
  if(s===2){const t=techniques[q.k];prompt+=' '+t[2];model+=' '+t[3]}
  if(s===3)prompt+=' Was bedeutet dieses Detail für deine Deutung der Szene?';
  if(s===4)prompt+=' Antworte mithilfe deiner Hörnotizen.';
 }
 const written=!choice||tf||level===2||s===4;
 if(s===0 && level===2)prompt+=' Erkläre, was diese Handlung auslöst oder vorbereitet.';
 if(level===2&&written)prompt+=' Prüfe auch eine andere mögliche Lesart oder Erklärung.';
 current.written=written;current.model=model;
 $('task').innerHTML='<small>'+mode+' · Frage '+(rows.length+1)+' von '+plan.length+' · '+levels[level]+'</small><h2 tabindex="-1">'+sections[s]+'</h2><p>'+ref(n)+'</p>'+(s===4?'<button id="speak">Hörfolge abspielen</button><details><summary>Textsimulation bei fehlender Sprachausgabe</summary><p>Einmal lesen, zuklappen und aus den Notizen antworten. Dabei wird das Hören nur eingeschränkt geprüft.</p><p>'+sceneAudio(n)+'</p></details><label>Hörnotizen: Ereignisfolge, Signal, Folge<textarea id="notes" required form="form"></textarea></label>':'')+'<form id="form"><fieldset><legend>'+prompt+'</legend>'+answers+(written?'<label>'+ (s===4?'Was ist die Hauptaussage? Welche Einzelheit in deinen Notizen stützt sie?':'Deine Begründung mit einem konkreten Textdetail')+'<textarea required id="text"></textarea></label>':'')+'</fieldset><details><summary>Hinweis</summary><p>'+['Trenne das Ereignis von seiner Folge. Prüfe, wer was weiss.','Suche zuerst etwas Beobachtbares. Begründe dann eine mögliche Bedeutung.','Vergleiche dein Wissen am Anfang und am Ende der Stelle.','Prüfe, ob jemand dieselbe Beobachtung anders erklären könnte.','Notiere für jeden Teil ein Stichwort. Achte auf das angekündigte Detail.'][s]+'</p></details><button>Antwort prüfen</button></form><div id="reply"></div>';
 $('task').insertAdjacentHTML('afterbegin','<progress aria-label="Prüfungsfortschritt" max="'+plan.length+'" value="'+(rows.length+1)+'"></progress>');
 $('task').querySelector('h2').focus();if(s===4)$('speak').onclick=()=>{if(!window.speechSynthesis){$('speak').nextElementSibling.open=true;return}speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(sceneAudio(n));u.lang='de-DE';u.rate=.9;u.onerror=e=>{if(e.error!=='interrupted'&&e.error!=='canceled'&&$('speak'))$('speak').nextElementSibling.open=true};speechSynthesis.speak(u)};
 $('form').onsubmit=e=>{e.preventDefault();const f=e.target;if(written&&!$('text').value.trim()||s===4&&!$('notes').value.trim())return;current.fact=current.correct===undefined?null:new FormData(f).get('wahl')===current.correct;f.querySelector('fieldset').disabled=true;f.querySelector('button').disabled=true;
 $('reply').innerHTML='<p class="note">'+(current.fact===false?'Die Auswahl passt hier nicht. ':current.fact===true?'Die Auswahl stimmt. ':'Vergleiche deine Deutung. ')+ref(n)+': '+model+'</p>'+(written?'<p>Beurteile deinen Text selbst. Auch eine andere nachvollziehbare Deutung zählt. Kleine Schreibfehler spielen keine Rolle.</p>'+['Inhalt: Meine Aussage passt zum Geschehen.','Begründung: Ich erkläre den Zusammenhang.','Beleg: Ich nenne ein konkretes, passendes Detail.'].map((x,i)=>'<label><input type="checkbox" id="r'+i+'"> '+x+'</label>').join(''):'')+'<button id="go">'+(written?'Einschätzung speichern':'Weiter')+'</button>';$('reply').insertAdjacentHTML('afterbegin',szenenBild(n));$('go').insertAdjacentHTML('beforebegin',rueckblick(n));$('go').onclick=record;$('go').focus()}
}
function record(){const {q,written,fact}=current;const rubric=written?[0,1,2].map(i=>$('r'+i).checked):[];const ok=fact!==false&&rubric.every(Boolean);const row={uid:rundenId+"/"+rows.length,zeit:Date.now(),id:q.id,n:q.n,g:goal[q.s],s:q.s,ok,fact,rubric};rows.push(row);history.push(row);save();leseplan();streak=ok?streak+1:0;miss=ok?0:miss+1;if(streak===3){level=Math.min(2,level+1);streak=0}if(miss===2){level=Math.max(0,level-1);miss=0}if(rows.length===plan.length||rows.length%10===0)report();else show()}
function report(){const end=rows.length===plan.length,correct=rows.filter(r=>r.ok).length;const weak=rows.filter(r=>!r.ok),rank=[0,1,2,3].filter(g=>stats(rows,g)!==null).sort((a,b)=>stats(rows,a)-stats(rows,b));const revisit=[...new Set([...weak,...rows].map(r=>r.n))].slice(0,5);
 const issues=[['Sachfehler',rows.filter(r=>r.fact===false||r.rubric[0]===false)],['Begründung ausbauen',rows.filter(r=>r.rubric[1]===false)],['Textbeleg ergänzen',rows.filter(r=>r.rubric[2]===false)]];
 $('task').innerHTML='<h2 tabindex="-1">'+(end?'Dein Lernblatt':'Zwischenstand nach '+rows.length+' Fragen')+'</h2><p>'+correct+' von '+rows.length+' vollständig gelöst · '+Math.round(100*correct/rows.length)+' %. Freitexte enthalten deine Selbsteinschätzung.</p>'+goalsView(rows)+'<p>Am sichersten in dieser Runde: '+goals[rank.at(-1)]+'. '+(weak.length?'Als Nächstes üben: '+goals[rank[0]]+'.':'Festige das Ergebnis an neuen Stellen.')+'</p>'+issues.filter(x=>x[1].length).map(([t,r])=>'<p>'+t+' · '+[...new Set(r.map(v=>ref(v.n)))].join(', ')+'</p>').join('')+'<h3>Zum Nachlesen</h3><ul>'+revisit.map(n=>'<li>'+ref(n)+' — '+item(n).note+'</li>').join('')+'</ul>'+(end?'<h3>Drei Erzähltechniken zum Wiederholen</h3>'+techniques.map((t,k)=>{const q=plan.find(x=>x.k===k&&weak.some(r=>r.id===x.id));return '<p><b>'+t[0]+'</b> · '+ref(q?.n||t[1][0])+'. '+t[3]+'</p>'}).join('')+'<p>'+ (mode==='Probeprüfung'?(correct>=24?'Viele Ziele sitzen bereits.':'Plane eine weitere Übungsrunde zu den schwächeren Zielen.'):'Diese kurze Runde zeigt deinen Stand nur für die geübten Stellen.')+' Eine Schulnote lässt sich daraus nicht ableiten.</p><button id="more">Fünf gezielte Folgefragen</button><button onclick="window.print()">Lernblatt drucken</button>':'<button id="continue">Prüfung fortsetzen</button>');
 $('task').querySelector('h2').focus();if(!end)$('continue').onclick=show;else {$('more').textContent='Nächste persönliche Lernrunde';$('more').onclick=montagsrunde}}
save();$('task').innerHTML='<p>Wähle eine Probeprüfung oder einen Abschnitt aus deinem Buch.</p>';

function nachlesen(n){
 window.speechSynthesis?.cancel();
 $('chapter').value=n;
 $('task').innerHTML='<small>'+ref(n)+'</small><h2 tabindex="-1">'+bildFolge[bildIndex(n)][1]+'</h2><p>'+item(n).note+'</p><p>'+detailfragen[n-1][1]+'</p>'+(zusatz[n]?'<p>'+zusatz[n]+'</p>':'')+'<nav aria-label="Abschnitte">'+(n>1?'<button id="vorher">← Zurück</button>':'')+(n<134?'<button id="danach">Weiter zu Abschnitt '+(n+1)+' →</button>':'')+'</nav>';
 if(n>1)$('vorher').onclick=()=>nachlesen(n-1);
 if(n<134)$('danach').onclick=()=>nachlesen(n+1);
 $('task').querySelector('h2').focus();
}
$('lesen').onclick=()=>nachlesen(+$('chapter').value);
