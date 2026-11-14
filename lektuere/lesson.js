const el=id=>document.getElementById(id);
const labels=['Leseverstehen','Hören und Notieren','Spannung','Figuren deuten'];
let saved={};try{saved=JSON.parse(localStorage.getItem('lesespuren-v1'))||{}}catch{}
function save(){try{localStorage.setItem('lesespuren-v1',JSON.stringify(saved))}catch{}}
function score(){el('status').innerHTML=labels.map((l,i)=>{const n=cases.filter((_,s)=>saved[s+'-'+i]).length;return '<span>'+l+' <meter min="0" max="2" value="'+n+'"></meter> '+n+'/2</span>'}).join('')}
el('goals').innerHTML=goals.map(g=>'<li>'+g+'</li>').join('');
el('book').value=saved.book||'';el('book').oninput=e=>{saved.book=e.target.value;save()};score();
let scene,step,exam,answers,notes,order;
const work=el('work');
function start(test){exam=test;scene=saved.last===undefined?Math.floor(Math.random()*2):1-saved.last;saved.last=scene;save();step=0;answers=[];notes='';order=[0,1,2,3];if(!exam)order.sort((a,b)=>Number(!!saved[scene+'-'+a])-Number(!!saved[scene+'-'+b]));show()}
el('train').onclick=()=>start(false);el('exam').onclick=()=>start(true);
function show(){
 const i=order[step],c=cases[scene],q=c.q[i],choices=[1,2,3];
 for(let j=2;j>0;j--){const k=Math.floor(Math.random()*(j+1));[choices[j],choices[k]]=[choices[k],choices[j]]}
 work.innerHTML='<small>'+(exam?'Probeprüfung':'Training')+' · '+(step+1)+'/4 · '+labels[i]+'</small><h2 tabindex="-1">'+c.title+'</h2>'+
 (i===1?'<p>Höre die Fortsetzung. Notiere zuerst Personen, dann Ursache und Folge. Nutze deine Stichwörter für die Antwort.</p><audio controls src="hoertext-'+scene+'.m4a"></audio><label>Meine Hörnotizen<textarea id="notes"></textarea></label>':'<blockquote>'+c.read+'</blockquote>')+
 '<form><fieldset><legend>'+q[0]+'</legend>'+choices.map(k=>'<label><input required type="radio" name="answer" value="'+k+'"> '+q[k]+'</label>').join('')+'</fieldset><button>Antwort abgeben</button></form><div aria-live="polite" id="reply"></div>';
 work.insertAdjacentHTML('afterbegin','<progress aria-label="Fortschritt" max="4" value="'+(step+1)+'"></progress><div aria-hidden="true" class="szene '+(['raum','stimme','brief','klasse'][i])+'"></div>');
 work.querySelector('h2').focus();if(i===1)el('notes').oninput=e=>notes=e.target.value;
 work.querySelector('form').onsubmit=e=>{e.preventDefault();let k=Number(new FormData(e.target).get('answer'));answers[i]=k;if(k===1)saved[scene+'-'+i]=true;save();e.target.querySelector('fieldset').disabled=true;e.target.querySelector('button').disabled=true;
 el('reply').innerHTML=(exam?'':'<p class="feedback">'+(k===1?'Richtig. ':'Schau noch einmal hin. ')+q[4]+'</p>')+'<button id="next">'+(step===3?'Auswertung öffnen':'Weiter')+'</button>';el('next').onclick=()=>{if(++step===4)finish();else show()};if(!exam)score();el('next').focus()}
}
function finish(){score();const c=cases[scene];work.innerHTML='<h2 tabindex="-1">'+answers.filter(k=>k===1).length+' von 4 Spuren erkannt</h2>'+labels.map((l,i)=>'<p><strong>'+l+' · '+(answers[i]===1?'gelöst':'noch üben')+'</strong><br>'+c.q[i][4]+'</p>').join('')+'<details><summary>Hörnotizen vergleichen</summary><p id="review"></p><p>'+c.q[1][1]+'</p><p>'+c.audio+'</p></details><h3>In eigenen Worten</h3><p>Beschreibe eine Geste aus der Szene. Ergänze: «Ich vermute …, weil …». Erkläre danach, welche offene Frage Spannung erzeugt.</p><details><summary>Beispielantwort prüfen</summary><p>'+c.q[3][4]+' '+c.q[2][4]+'</p></details><button id="again">Andere Szene trainieren</button><button id="repeat">Neue Probeprüfung</button>';el('review').textContent=notes||'Keine Notizen eingetragen.';el('again').onclick=()=>start(false);el('repeat').onclick=()=>start(true);work.querySelector('h2').focus()}
