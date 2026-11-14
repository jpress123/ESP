'use strict';
const leseauftrag=[
 'Fasse das Ereignis in eigenen Worten zusammen und markiere ein Detail, das deine Zusammenfassung stützt.',
 'Trenne eine beobachtbare Handlung von deiner Vermutung über das Gefühl oder die Absicht dahinter.',
 'Markiere, was du zuerst erfährst und welche Frage beim Lesen noch offenbleibt.',
 'Lies die Stelle einmal. Schliesse das Buch und notiere Ereignisfolge und ein aussagekräftiges Detail.'
];
const aufgaben=[
 ['Welche Einzelheit würdest du in einer Nacherzählung unbedingt behalten? Begründe deine Wahl.','Was müsste jemand über diesen Abschnitt wissen, um den nächsten zu verstehen?','Formuliere die Kernaussage in einem Satz und belege sie mit einer Beobachtung.'],
 ['Was erfahren wir über die Haltung einer Figur? Trenne das Textsignal von deiner Deutung.','Welche zwei Deutungen einer Reaktion wären denkbar? Welche stützt die Stelle besser?','Welche Wahrnehmung ist an die erzählende Stimme gebunden? Zeige, was sie über andere nur vermuten kann.'],
 ['Wie verändert sich dein Wissen beim Lesen dieser Stelle? Erkläre die Wirkung der Reihenfolge.','Wähle ein Detail, das eine Erwartung weckt. Welche Information fehlt in diesem Augenblick?','Wie wirkt das Erzähltempo? Beschreibe eine Stelle, die einen Augenblick dehnt oder einen Vorgang zusammenfasst.'],
 ['Was geschieht im markierten Abschnitt der Hörfolge? Ordne zwei Stichwörter und erkläre ihren Zusammenhang.','Welche Einzelheit aus dem markierten Teil würdest du für eine mündliche Zusammenfassung behalten? Begründe.','Welche Information im markierten Teil ist zentral, welche ergänzt sie? Zeige den Unterschied anhand deiner Hörnotizen.']
];
function lernbedarf(){
 const letzte=new Map();
 for(const r of history)if(item(r.n)&&goals[r.g]&&typeof r.ok==='boolean'){const key=r.g+'/'+r.n;letzte.delete(key);letzte.set(key,r)}
 return goals.map((_,g)=>{
  const versuche=[...letzte.values()].filter(r=>r.g===g).slice(-12);
  const offen=versuche.filter(r=>!r.ok).reverse();
  return {g,offen,anzahl:versuche.length,quote:offen.length/(versuche.length||1)};
 }).filter(x=>x.offen.length).sort((a,b)=>b.quote-a.quote||b.offen.length-a.offen.length).slice(0,2);
}
function leseplan(){
 const ziele=lernbedarf();
 $('montagsplan').innerHTML=ziele.length?'<p>Diese Stellen machen dir nach deinen jüngsten Antworten noch Mühe. Freitexte zählen mit deiner eigenen Einschätzung.</p>'+ziele.map(z=>'<h3>'+goals[z.g]+'</h3><p>'+z.offen.length+' von '+z.anzahl+' zuletzt geübten Abschnitten noch offen. '+leseauftrag[z.g]+'</p>'+z.offen.slice(0,3).map(r=>'<button type="button" data-lesen="'+r.n+'">'+ref(r.n)+' nachlesen</button>').join('')).join(''):'<p>'+(history.length?'Die zuletzt geübten Stellen zeigen aktuell keine offene Schwierigkeit.':'Auf diesem Gerät fehlen noch Antworten für einen persönlichen Leseplan.')+' Beginne mit vier Einstiegsfragen. Danach siehst du hier, was du vor Montag nochmals lesen kannst.</p>';
 $('montag').textContent=ziele.length?'Meine nächste Lernrunde starten':'Vier Einstiegsfragen starten';
 for(const btn of $('montagsplan').querySelectorAll('[data-lesen]'))btn.onclick=()=>nachlesen(Number(btn.dataset.lesen));
}
function montagsrunde(){
 const gruppen=lernbedarf();
 if(!gruppen.length){begin([0,1,2,4].map(s=>({...pick(s,1)[0],detail:true})),'Standortbestimmung');return}
 let gesehen=[];try{gesehen=JSON.parse(localStorage.getItem('elia-montagsfragen')||'[]')}catch{}
 const gewichte=gruppen.map(z=>shuffle(z.offen.flatMap(({n})=>aufgaben[z.g].map((frage,v)=>({
  ...make([0,1,2,4][z.g],n),id:'montag-'+z.g+'-'+n+'-'+v,vertiefung:frage
 })))).sort((a,b)=>gesehen.lastIndexOf(a.id)-gesehen.lastIndexOf(b.id)));
 const runde=[];
 while(runde.length<8&&gewichte.some(pool=>pool.length))for(const pool of gewichte)if(pool.length&&runde.length<8)runde.push(pool.shift());
 const ids=runde.map(q=>q.id);
 try{localStorage.setItem('elia-montagsfragen',JSON.stringify([...gesehen.filter(id=>!ids.includes(id)),...ids]))}catch{}
 begin(runde,'Meine Lernrunde');
}
$('montag').onclick=montagsrunde;
leseplan();
