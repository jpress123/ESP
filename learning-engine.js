/* Pure progress and recommendation logic, also exercised by Node tests. */
(function(root){
'use strict';
const topics=['Einheiten','Rechteck','Parallelogramm','Dreieck','Drachenviereck','Trapez','Volumen','Gemischt'];
const blank=()=>({version:2,records:{},reviews:[],events:[],exam:null,missionSteps:[],recognition:[]});
function restore(raw){try{const s=JSON.parse(raw);if(s?.version!==2)return blank();const d=blank();d.records=s.records&&typeof s.records==='object'&&!Array.isArray(s.records)?s.records:{};d.reviews=Array.isArray(s.reviews)?s.reviews.filter(r=>topics.includes(r.topic)&&typeof r.focus==='string'&&typeof r.id==='string'):[];d.events=Array.isArray(s.events)?s.events.slice(-40):[];d.exam=s.exam&&Number.isFinite(s.exam.score)&&Number.isFinite(s.exam.total)?s.exam:null;d.missionSteps=Array.isArray(s.missionSteps)?s.missionSteps.filter(x=>typeof x==='string'):[];d.recognition=Array.isArray(s.recognition)?s.recognition.filter(x=>topics.includes(x)):[];return d}catch{return blank()}}
function record(s,{id,topic,focus,ok,independent,source,answer,solution}){
 if(!topics.includes(topic))return;
 const old=s.records[id]||{};
 s.records[id]={topic,focus,secure:!!(ok&&independent),attempts:(old.attempts||0)+1,at:Date.now()};
 if(!ok||!independent){const review=s.reviews.find(r=>r.id===id);if(review)review.at=s.records[id].at;else s.reviews.push({id,topic,focus,at:s.records[id].at});}
 else{s.reviews=s.reviews.filter(r=>!(r.topic===topic&&r.focus===focus&&r.id!==id));}
 s.events.unshift({id,topic,focus,ok:!!ok,independent:!!independent,source,answer:String(answer).slice(0,60),solution,at:Date.now()});s.events=s.events.slice(0,40);
}
function topicState(s,topic){const rows=Object.entries(s.records).filter(([id,r])=>id.startsWith('q:')&&r.topic===topic&&r.secure);const kinds=new Set(rows.map(([,r])=>r.focus));const pending=s.reviews.filter(r=>r.topic===topic).length;const count=rows.length,requiredKinds=['Einheiten','Gemischt'].includes(topic)?1:2;return {count,pending,kinds:kinds.size,requiredKinds,secure:count>=3&&kinds.size>=requiredKinds&&pending===0,percent:Math.min(100,Math.round(count/3*100)),started:Object.values(s.records).some(r=>r.topic===topic)}}
function recommend(s,bank,current,filter='Alle Themen'){
 let candidates=bank.map((q,i)=>({q,i,id:'q:'+i})).filter(x=>(filter==='Alle Themen'||x.q[0]===filter)&&x.i!==current);
 if(!candidates.length)return current;
 for(const review of s.reviews){const matched=candidates.filter(x=>x.q[0]===review.topic&&x.q[5]===review.focus&&x.id!==review.id);if(matched.length)return matched.sort((a,b)=>(s.records[a.id]?.at||0)-(s.records[b.id]?.at||0))[0].i;}
 return candidates.sort((a,b)=>{const ar=s.records[a.id],br=s.records[b.id];return (ar?.secure?1:0)-(br?.secure?1:0)||(ar?.at||0)-(br?.at||0)})[0].i;
}
function feedback(q,value){const target=q[2],topic=q[0],focus=q[5];let hint='Vergleiche deinen Rechenweg mit diesen Schritten.';
if(['area'].includes(focus)&&['Dreieck','Drachenviereck','Trapez'].includes(topic)&&Math.abs(value-2*target)<1e-8)hint='Dein Ergebnis ist genau doppelt so gross. Möglicherweise fehlt das Teilen durch 2.';
else if(topic==='Parallelogramm'&&q[1].startsWith('b = 9 cm')&&value===45)hint='45 ergibt sich aus 9 × 5. Für die Fläche brauchst du die senkrechte Höhe 4 cm, nicht die schräge Seite 5 cm.';
else if(topic==='Einheiten')hint='Prüfe Richtung und Faktor: Länge ×/÷ 10, Fläche ×/÷ 100, Volumen ×/÷ 1000 pro benachbarter Stufe. Liter: 1 l = 1 dm³.';
else if(focus==='perimeter')hint='Der Umfang ist die Summe aller äusseren Seiten. Höhen und innere Linien gehören nicht zum Rand.';
else if(focus==='inverse')hint='Hier ist eine Länge gesucht. Stelle zuerst die Formel um, bevor du Zahlen einsetzt.';
else if(topic==='Volumen')hint='Berechne zuerst die Grundfläche G. Danach gilt V = G × Körperhöhe H. Verwende überall dieselbe Längeneinheit.';
else if(topic==='Gemischt')hint='Bringe die Einheiten zuerst auf einen Nenner. Entscheide dann: Flächen addieren, Ausschnitte abziehen oder den Rand zählen.';
return hint+' Rechenweg: '+q[4];}
const api={topics,blank,restore,record,topicState,recommend,feedback};root.LearningEngine=api;if(typeof module!=='undefined')module.exports=api;
})(typeof globalThis!=='undefined'?globalThis:this);
