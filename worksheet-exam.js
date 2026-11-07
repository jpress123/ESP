(() => {
  const names = ['Fläche verstehen', 'Dreieck, Trapez und Drachenviereck', 'Rechteck und Parallelogramm', 'Volumen von Prismen'];
  const sheet = $('blatt'), number = $('aufgabe'), body = $('blatt-inhalt');
  const key = () => 'blatt-' + sheet.value + '-' + number.value;
  const get = () => envelope.assignments[key()]?.value || {};
  const fields = () => worksheetChecks[sheet.value][number.value - 1].split(';').filter(Boolean).map(pair => pair.split('='));
  const pending = () => Object.entries(envelope.assignments).filter(([id,entry]) => id.startsWith('blatt-') && entry.value.status === 'üben');
  let generation = 0, timer;
  function save(patch) {
    envelope.assignments[key()] = {at:Date.now(), value:{...get(), ...patch}};
    envelope.examSession = {kind:'blatt',sheet:sheet.value,task:number.value,finished:false,at:Date.now()};
    changed();
    summary();
  }
  function summary() {
    const done = Object.entries(envelope.assignments).filter(([id,e]) => id.startsWith('blatt-') && e.value.status === 'verstanden').length;
    $('blatt-stand').textContent = done + '/65 Aufgaben als verstanden markiert · ' + pending().length + ' zum Wiederholen';
    $('blatt-review').hidden = !pending().length;
    const badge = $('blatt-dashboard');
    if (badge) badge.textContent = done + '/65 verstanden';
  }
  function choices(n) {
    number.replaceChildren();
    worksheetChecks[sheet.value].forEach((_,i) => number.add(new Option('Aufgabe '+(i+1),i+1)));
    number.value = String(n);
  }
  function element(tag,text) {
    const node = document.createElement(tag);
    node.textContent = text;
    return node;
  }
  function picture(src,alt) {
    const link=document.createElement('button');
    link.type='button'; link.className='blatt-zoom'; link.title='Bild vergrössern';
    const img=new Image(); img.src=src; img.alt=alt; link.append(img);
    link.onclick=()=>{const zoom=$('blatt-dialog'); const large=img.cloneNode();zoom.querySelector('div').replaceChildren(large);zoom.showModal()};
    return link;
  }
  function select(s,n) {sheet.value=String(s);choices(n);render()}
  async function render() {
    const id=++generation;
    body.replaceChildren(element('p','Aufgabe wird geladen …'));
    summary();
    try {
      const response=await fetch('arbeitsblaetter/'+sheet.value+'-'+number.value+'.json');
      if(!response.ok) throw Error();
      const data=await response.json();
      if(id!==generation)return;
      const title=names[sheet.value]+' · Aufgabe '+number.value;
      body.replaceChildren();
      data.frage.forEach((src,i)=>body.append(picture(src,i===0?data.text:title+' · Fortsetzung '+(i+1))));
      const inputs=[],feedback=element('p','');
      feedback.setAttribute('role','status');
      const grid=element('div','');grid.className='blatt-felder';
      for(const [label] of fields()) {
        const idx=inputs.length,wrap=element('label',label),input=document.createElement('input');
        input.inputMode='decimal';input.autocomplete='off';input.value=get().answers?.[idx]||'';
        input.oninput=()=>{save({answers:inputs.map(x=>x.value),status:'offen'});feedback.textContent='';input.removeAttribute('aria-invalid')};
        wrap.append(input);grid.append(wrap);inputs.push(input);
      }
      body.append(grid);
      const notes=element('label','Dein Rechenweg oder deine Begründung');
      const area=element('textarea','');area.rows=2;area.maxLength=1600;area.value=get().note||'';
      area.oninput=()=>save({note:area.value,status:'offen'});notes.append(area);body.append(notes);
      const solutions=element('details','');solutions.append(element('summary','Lösungsweg ansehen und vergleichen'),picture(data.loesung,data.weg||title+' · Musterlösung'));
      (data.bilder||[]).forEach((src,i)=>solutions.append(picture(src,'Vorher und nachher · Teil '+ 'abcd'[i])));
      function check() {
        const bad=[];
        fields().forEach(([label,answer],i)=>{
          const raw=inputs[i].value.trim().replace(/[’'\s]/g,'').replace(',','.');
          const ok=raw!=='' && Number.isFinite(Number(raw)) && Math.abs(Number(raw)-Number(answer))<0.000001;
          inputs[i].setAttribute('aria-invalid',String(!ok));if(!ok)bad.push(label);
        });
        feedback.textContent=bad.length?'Prüfe nochmals: '+bad.join(', ')+'. Vergleiche diese Teilaufgaben mit dem Lösungsweg.':'Alle Zahlen stimmen. Vergleiche auch deine Begründung oder Skizze.';
        save({status:bad.length?'üben':'verglichen'});return !bad.length;
      }
      if(inputs.length){const btn=element('button','Zahlen prüfen');btn.onclick=check;body.append(btn)}
      body.append(feedback,solutions);
      const repeat=element('button','Nochmals üben');repeat.onclick=()=>{save({status:'üben'});feedback.textContent='Für deine Wiederholung gespeichert.'};
      const done=element('button','Rechenweg verstanden ✓');done.onclick=()=>{
        if(inputs.length&&!check())return;
        save({status:'verstanden'});feedback.textContent='Als verstanden gespeichert.';
      };
      const next=element('button','Weiter →');next.onclick=()=>{
        const s=Number(sheet.value),n=Number(number.value);
        const dest=n<worksheetChecks[s].length?[s,n+1]:[(s+1)%4,1];
        select(...dest);save({});$('exam').scrollIntoView();
      };
      const row=element('div','');row.className='row';row.append(repeat,done,next);body.append(row);
      if(get().status)feedback.textContent='Dein Stand: '+get().status+'.';
    } catch {if(id===generation){body.replaceChildren(element('p','Die Aufgabe konnte nicht geladen werden.'));const retry=element('button','Erneut laden');retry.onclick=render;body.append(retry)}}
  }
  names.forEach((name,i)=>sheet.add(new Option(name,i)));
  sheet.onchange=()=>{choices(1);save({});render()};
  number.onchange=()=>{save({});render()};
  $('blatt-review').onclick=()=>{const id=pending()[0]?.[0];if(id){const [,s,n]=id.split('-');select(s,n);save({})}};
  $('blatt-dialog').querySelector('button').onclick=()=>$('blatt-dialog').close();
  window.resumeWorksheet=()=>{const saved=envelope.examSession;if(saved?.kind==='blatt'){select(saved.sheet,saved.task);$('exam').scrollIntoView()}};
  const previous=envelope.examSession;
  select(previous?.kind==='blatt'?previous.sheet:0,previous?.kind==='blatt'?previous.task:1);
  function time() {
    const until=envelope.assignments['pruefungsuhr']?.value||0;
    const sec=Math.max(0,Math.ceil((until-Date.now())/1000));
    $('blatt-uhr').textContent=sec?'Restzeit '+Math.floor(sec/60)+':'+String(sec%60).padStart(2,'0'):until?'40 Minuten sind vorbei. Vergleiche jetzt deine Lösungen.':'';
    $('blatt-zeit').textContent=sec?'Uhr beenden':'40-Minuten-Uhr starten';
  }
  $('blatt-zeit').onclick=()=>{const now=Date.now();envelope.assignments.pruefungsuhr={at:now,value:envelope.assignments.pruefungsuhr?.value>now?0:now+2400000};changed();time()};
  time();timer=setInterval(time,1000);
  window.addEventListener('worksheet-sync',()=>{summary();time()});
})();
