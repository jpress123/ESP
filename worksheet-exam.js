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
  function triangleExperiment() {
    const panel=element('section','');
    panel.id='dreieck-labor';
    panel.setAttribute('aria-label','Dreieck-Labor zu Aufgabe 15a');
    panel.innerHTML=`
      <h3>15a · Verändere das Dreieck</h3>
      <p>Schiebe zuerst nur die Grundseite von 4 auf 8 cm. Was passiert mit der Fläche?</p>
      <div style="display:flex;flex-wrap:wrap;gap:12px">
        <figure style="flex:1 1 205px;margin:0"><figcaption><b>Vorher</b> · 4 × 3 : 2 = 6 cm²</figcaption><div data-original></div></figure>
        <figure style="flex:1 1 205px;margin:0"><figcaption><b>Dein Dreieck</b></figcaption><div data-current></div></figure>
      </div>
      <label for="labor-basis"><b>Grundseite (Breite) · <span data-base></span> cm</b></label>
      <input type="range" id="labor-basis" min="1" max="10" value="4" step="0.5" style="padding:0;min-height:44px;accent-color:#16675b">
      <label for="labor-hoehe"><b>Höhe · <span data-height></span> cm</b></label>
      <input type="range" id="labor-hoehe" min="1" max="6" value="3" step="0.5" style="padding:0;min-height:44px;accent-color:#a62657">
      <p><output for="labor-basis labor-hoehe" style="font-size:1.15em;font-weight:bold"></output></p>
      <button type="button">Zurück auf 4 × 3 cm</button>`;
    const find=selector=>panel.querySelector(selector);
    const format=n=>new Intl.NumberFormat('de-CH',{maximumFractionDigits:3}).format(n);
    function diagram(g,h) {
      const unit=20, x=30, y=145, foot=x+g*unit/2, top=y-h*unit;
      const grid=[];
      for(let i=0;i<=10;i++)grid.push('M'+(x+i*unit)+' 25v120');
      for(let i=0;i<=6;i++)grid.push('M30 '+(y-i*unit)+'h200');
      return `<svg viewBox="0 0 260 175" role="img" aria-label="Grundseite ${format(g)} cm, senkrechte Höhe ${format(h)} cm" style="display:block;width:100%;height:auto;background:#fffaf2">
        <path d="${grid.join(' ')}" style="fill:none;stroke:#c9d5cf;stroke-width:0.7"/>
        <polygon points="${x},${y} ${x+g*unit},${y} ${foot},${top}" style="fill:#99d6c4;fill-opacity:.75;stroke:#27594f;stroke-width:2"/>
        <line x1="${x}" x2="${x+g*unit}" y1="${y}" y2="${y}" style="stroke:#16675b;stroke-width:4"/>
        <path d="M${foot} ${top}V${y}" style="stroke:#a62657;stroke-width:2;stroke-dasharray:4 3;fill:none"/>
        <path d="M${foot} ${y-5}h5v5" style="stroke:#703144;stroke-width:1;fill:none"/>
        <text x="${foot}" y="166" text-anchor="middle" style="font: bold 12px system-ui;fill:#165249">${format(g)} cm</text>
        <text x="${foot+7}" y="${(top+y)/2}" style="font: bold 12px system-ui;fill:#81224a;paint-order:stroke;stroke:#fffaf2;stroke-width:3px">${format(h)} cm</text>
      </svg>`;
    }
    find('[data-original]').innerHTML=diagram(4,3);
    const base=find('#labor-basis'),height=find('#labor-hoehe');
    function update() {
      const g=Number(base.value),h=Number(height.value),area=g*h/2;
      find('[data-base]').textContent=format(g);
      find('[data-height]').textContent=format(h);
      base.setAttribute('aria-valuetext',format(g)+' Zentimeter');
      height.setAttribute('aria-valuetext',format(h)+' Zentimeter');
      find('[data-current]').innerHTML=diagram(g,h);
      const difference=area-6;
      const comparison=area===12?'Doppelt so gross wie vorher.':area===6?'Gleich gross wie vorher.':format(Math.abs(difference))+' cm² '+(difference>0?'mehr':'weniger')+' als vorher.';
      find('output').textContent=format(g)+' × '+format(h)+' : 2 = '+format(area)+' cm². '+comparison;
    }
    base.oninput=height.oninput=update;
    find('button').onclick=()=>{base.value='4';height.value='3';update()};
    update();
    return panel;
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
      if(sheet.value==="1" && number.value==="15") body.append(triangleExperiment());
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
  if(new URLSearchParams(location.search).get('aufgabe')==='15a') select(1,15);
  else select(previous?.kind==='blatt'?previous.sheet:0,previous?.kind==='blatt'?previous.task:1);
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
