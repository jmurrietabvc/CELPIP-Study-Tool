'use strict';

const CURRENT_KEY = 'celpip-reading-packs-current-v1';
const HISTORY_KEY = 'celpip-reading-packs-history-v1';
const APP_VERSION = 'full-packs-2';
const $ = id => document.getElementById(id);
const esc = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const read = (key, fallback) => { try { const value=JSON.parse(localStorage.getItem(key)); return value===null?fallback:value; } catch { return fallback; } };
const write = (key, value) => { try { localStorage.setItem(key,JSON.stringify(value)); } catch { $('storage-warning').hidden=false; } };
const clock = ms => { const seconds=Math.max(0,Math.ceil(ms/1000)); return `${String(Math.floor(seconds/60)).padStart(2,'0')}:${String(seconds%60).padStart(2,'0')}`; };
const dated = at => new Date(at).toLocaleString('es',{dateStyle:'short',timeStyle:'short'});
const count = answers => answers.filter(answer => answer !== null).length;
const sum = values => values.reduce((a,b)=>a+b,0);

let history = read(HISTORY_KEY, []);
if (!Array.isArray(history)) history=[];
let current = read(CURRENT_KEY, null);
if (current && (current.version!==APP_VERSION || !Array.isArray(current.parts))) current=null;
let selectedPack=null;
let timerInterval=null;

const packById = id => READING_PACKS.find(pack => pack.id===id);
const partFor = statePart => statePart.material;
const scorePart = statePart => partFor(statePart).questions.reduce((total,q,index)=>total+(statePart.answers[index]===q.answer?1:0),0);
const packAttempts = id => history.filter(item=>item.kind==='mock' && item.packId===id).length;

function persist(){ write(CURRENT_KEY,current); }
function archive(){
  const copy=JSON.parse(JSON.stringify(current));
  const index=history.findIndex(item=>item.id===copy.id);
  if(index<0) history.unshift(copy); else history[index]=copy;
  write(HISTORY_KEY,history);
}
function show(name){
  ['home','setup','exam','results'].forEach(id=>$(id).hidden=id!==name);
  document.body.classList.toggle('in-exam',name==='exam');
}

function renderPacks(){
  $('pack-list').innerHTML=READING_PACKS.map(pack=>{
    const attempts=packAttempts(pack.id);
    const inProgress=current && !current.finishedAt && current.packId===pack.id;
    const status=inProgress?'EN CURSO':attempts?`USADO ${attempts} VEZ${attempts===1?'':'ES'}`:'NUEVO';
    const extra=(pack.totalQuestions||pack.questions)-pack.questions;
    return `<article class="module-card ${attempts?'used-pack':''}"><p class="eyebrow">Pack ${pack.number} · ${status}</p><h3>${esc(pack.title)}</h3><p>${attempts?'Ya viste estos textos. Úsalo sólo para revisión, no para medir progreso.':extra?'Incluye contenido no puntuado que sólo se identifica al terminar.':'Los temas permanecen ocultos hasta comenzar.'}</p><div class="meta"><span>${pack.parts.length} bloques</span><span>${pack.questions} puntuadas${extra?` + ${extra} no puntuadas`:''}</span><span>${pack.minutes} min</span></div><button data-pack="${pack.id}">${inProgress?'Continuar intento →':attempts?'Revisar pack usado →':'Comenzar pack nuevo →'}</button></article>`;
  }).join('');
  $('pack-list').querySelectorAll('[data-pack]').forEach(button=>button.addEventListener('click',()=>openSetup(button.dataset.pack)));
}

function openSetup(packId){
  const pack=packById(packId);
  if(!pack) return;
  if(current && !current.finishedAt){
    if(current.packId===packId){ synchronize(); if(current.finishedAt) renderResults(); else { renderExam(); startClock(); } return; }
    if(!confirm('Hay otro pack en curso. ¿Descartarlo y abrir este pack?')) return;
    current=null; write(CURRENT_KEY,null);
  }
  selectedPack=pack;
  $('setup-title').textContent=pack.title;
  const extra=(pack.totalQuestions||pack.questions)-pack.questions;
  $('setup-facts').innerHTML=`<span>${pack.parts.length} bloques</span><span>${pack.questions} puntuadas${extra?` + ${extra} no puntuadas`:''}</span><span>${pack.minutes} minutos</span>`;
  const attempts=packAttempts(pack.id);
  $('repeat-warning').hidden=!attempts;
  $('repeat-warning').textContent='Este pack ya fue usado. Conocer los textos o las opciones invalida el resultado como medición de material nuevo.';
  $('resume-note').textContent='El intento se guarda en este navegador. Si recargas, el reloj sigue corriendo.';
  show('setup'); window.scrollTo(0,0);
}

function begin(){
  if(!selectedPack) return;
  const now=Date.now();
  current={
    id:crypto.randomUUID?crypto.randomUUID():String(now), version:APP_VERSION, kind:'mock', packId:selectedPack.id,
    packTitle:selectedPack.title, startedAt:now, finishedAt:null, partIndex:0, reflection:'', feedbackSeen:false,
    repeated:packAttempts(selectedPack.id)>0,
    parts:selectedPack.parts.map(part=>({id:part.id,material:JSON.parse(JSON.stringify(part)),answers:Array(part.questions.length).fill(null),firstAnswers:Array(part.questions.length).fill(null),changes:Array(part.questions.length).fill(0),events:[],startedAt:null,deadline:null,finishedAt:null,expired:false}))
  };
  startPart(0,now); persist(); renderExam(); startClock();
}
function startPart(index, at){
  current.partIndex=index;
  const part=current.parts[index];
  part.startedAt=at;
  part.deadline=at+partFor(part).minutes*60000;
}
function finishPart(at, expired){
  const part=current.parts[current.partIndex];
  part.finishedAt=at; part.expired=expired;
  if(current.partIndex+1<current.parts.length){ startPart(current.partIndex+1,at); persist(); }
  else finishAll(at);
}
function finishAll(at){
  current.finishedAt=at; persist(); archive(); clearInterval(timerInterval); renderResults();
}
function synchronize(now=Date.now()){
  if(!current || current.finishedAt) return;
  const old=current.partIndex;
  while(!current.finishedAt){
    const part=current.parts[current.partIndex];
    if(now<part.deadline) break;
    finishPart(part.deadline,true);
  }
  if(!current.finishedAt && old!==current.partIndex) renderExam();
}
function startClock(){
  clearInterval(timerInterval);
  timerInterval=setInterval(()=>{ synchronize(); if(current&&!current.finishedAt) updateClock(); },250);
}
function updateClock(){
  const part=current.parts[current.partIndex];
  $('timer').textContent=clock(part.deadline-Date.now());
  $('timer').classList.toggle('urgent',part.deadline-Date.now()<60000);
  $('answered').textContent=`${count(part.answers)}/${part.answers.length} respondidas`;
}

function passageHtml(part){
  const passage=`<div class="passage">${esc(part.passage)}</div>`;
  const table=part.table?`<div class="table-wrap"><table><thead><tr>${part.table.headers.map(value=>`<th scope="col">${esc(value)}</th>`).join('')}</tr></thead><tbody>${part.table.rows.map(row=>`<tr>${row.map(value=>`<td>${esc(value)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`:'';
  const reply=part.reply?`<h3>Read the following message and complete its blanks.</h3><div class="reply">${esc(part.reply).replace(/\[(\d+)\]/g,'<span class="blank">[$1]</span>')}</div>`:'';
  return passage+table+reply;
}
function renderExam(){
  if(!current || current.finishedAt) return;
  const state=current.parts[current.partIndex],part=partFor(state);
  show('exam');
  $('mode-label').textContent=`${current.packTitle} · Bloque ${current.partIndex+1} de ${current.parts.length}`;
  $('exam-title').textContent=part.title;
  $('passage-panel').innerHTML=passageHtml(part);
  let previousGroup=null;
  $('question-panel').innerHTML=part.questions.map((question,index)=>{
    const label=question.group!==previousGroup?`<p class="group-label">${question.group===2?'Complete the message blanks':'Choose the best answer'}</p>`:'';
    previousGroup=question.group;
    return `${label}<fieldset class="question"><legend>${index+1}. ${esc(question.text)}</legend><div class="options">${question.options.map((option,choice)=>`<label class="choice"><input type="radio" name="q${index}" value="${choice}" ${state.answers[index]===choice?'checked':''}><span>${part.part===3?'':String.fromCharCode(65+choice)+'. '}${esc(option)}</span></label>`).join('')}</div></fieldset>`;
  }).join('');
  $('finish').textContent=current.partIndex<current.parts.length-1?'Cerrar y pasar al siguiente bloque':'Terminar pack';
  $('passage-panel').scrollTop=0; $('question-panel').scrollTop=0; window.scrollTo(0,0); updateClock();
}

$('question-panel').addEventListener('change',event=>{
  if(event.target.type!=='radio') return;
  synchronize();
  if(!current || current.finishedAt) return;
  const state=current.parts[current.partIndex];
  const index=Number(event.target.name.slice(1)), value=Number(event.target.value), previous=state.answers[index];
  if(previous!==null && previous!==value) state.changes[index]++;
  if(state.firstAnswers[index]===null) state.firstAnswers[index]=value;
  state.answers[index]=value;
  state.events.push({at:Date.now(),question:index+1,from:previous,to:value});
  persist(); updateClock();
});

function closeCurrentPart(){
  synchronize();
  if(!current || current.finishedAt) return;
  const state=current.parts[current.partIndex], blanks=state.answers.length-count(state.answers);
  if(blanks && !confirm(`Quedan ${blanks} pregunta${blanks===1?'':'s'} sin responder. Al cerrar no podrás volver. ¿Cerrar esta parte?`)) return;
  finishPart(Date.now(),false);
  if(!current.finishedAt) renderExam();
}

function resultData(){
  const rows=current.parts.map((state,index)=>({block:index+1,part:partFor(state).part,scored:partFor(state).scored!==false,correct:scorePart(state),answered:count(state.answers),total:state.answers.length,expired:state.expired,minutes:(state.finishedAt-state.startedAt)/60000}));
  const scored=rows.filter(row=>row.scored),unscored=rows.filter(row=>!row.scored);
  return {rows,unscored,correct:sum(scored.map(row=>row.correct)),answered:sum(scored.map(row=>row.answered)),total:sum(scored.map(row=>row.total)),overallAnswered:sum(rows.map(row=>row.answered)),overallTotal:sum(rows.map(row=>row.total))};
}
function mistakeDetails(attempt=current){
  if(!attempt || !Array.isArray(attempt.parts)) return '';
  const sections=attempt.parts.map((state,partIndex)=>{
    const part=partFor(state);
    if(part.scored===false) return '';
    const wrong=part.questions.map((q,index)=>({q,index,chosen:state.answers[index]})).filter(item=>item.chosen!==item.q.answer);
    if(!wrong.length) return '';
    const minutes=state.startedAt&&state.finishedAt?((state.finishedAt-state.startedAt)/60000).toFixed(1):'—';
    return `\nBloque ${partIndex+1} · Part ${part.part} · ${wrong.length} error(es) · ${minutes} min\n`+wrong.map(({q,index,chosen})=>{
      const options=q.options.map((option,choice)=>`${String.fromCharCode(65+choice)}) ${option}`).join(' | ');
      const selected=chosen===null?'Sin responder':`${String.fromCharCode(65+chosen)}) ${q.options[chosen]}`;
      const correct=`${String.fromCharCode(65+q.answer)}) ${q.options[q.answer]}`;
      return `${index+1}. ${q.text}\nOpciones: ${options}\nMarcó: ${selected}\nCorrecta: ${correct}\nEvidencia: ${q.evidence}`;
    }).join('\n\n');
  }).filter(Boolean);
  return sections.length?`\n\nERRORES PARA REVISIÓN${sections.join('')}\n`:'\n\nERRORES PARA REVISIÓN\nNinguno en los bloques puntuados.\n';
}

function openHistoryAttempt(id){
  const attempt=history.find(item=>item.id===id && item.kind==='mock');
  if(!attempt) return;
  current=JSON.parse(JSON.stringify(attempt));
  write(CURRENT_KEY,current);
  renderResults();
}

function renderResults(){
  if(!current || !current.finishedAt) return;
  const data=resultData(), omitted=data.total-data.answered;
  show('results');
  $('result-title').textContent=current.packTitle;
  $('result-metrics').innerHTML=`<div class="metric-grid"><div><strong>${data.correct}/${data.total}</strong><span>Aciertos puntuados</span></div><div><strong>${data.answered}/${data.total}</strong><span>Respondidas puntuadas</span></div><div><strong>${omitted}</strong><span>Sin responder</span></div><div><strong>${data.unscored.length?data.unscored[0].total:0}</strong><span>Preguntas no puntuadas</span></div></div><div class="part-breakdown">${data.rows.map(row=>`<span>Bloque ${row.block} · Part ${row.part}: ${row.scored?`<strong>${row.correct}/${row.total}</strong>`:'<strong>No puntuado</strong>'} · ${row.answered}/${row.total} respondidas${row.expired?' · tiempo agotado':''}</span>`).join('')}</div>`;
  $('interpretation').textContent=omitted?`Quedaron ${omitted} preguntas puntuadas sin responder. Hay que decidir antes y proteger minutos para los bloques finales.`:data.unscored.length?`Terminaste toda la carga. El bloque ${data.unscored[0].block} no contó en el resultado, igual que el contenido de desarrollo que CELPIP puede incluir sin identificar durante la prueba.`:'Terminaste las 38 preguntas. Ahora revisa si los errores vienen de localizar evidencia, interpretar alcance o descartar una opción cercana.';
  $('reflection').value=current.reflection||'';
  $('review').hidden=!current.feedbackSeen;
  $('show-review').textContent=current.feedbackSeen?'Ocultar corrección':'Ver corrección y evidencia';
  if(current.feedbackSeen) renderReview();
  window.scrollTo(0,0);
}
function renderReview(){
  $('review').innerHTML=current.parts.map((state,partIndex)=>{
    const part=partFor(state);
    return `<section class="review-part"><p class="eyebrow">Bloque ${partIndex+1} · Part ${part.part}</p><h2>${esc(part.title)} · ${part.scored===false?'No puntuado':`${scorePart(state)}/${state.answers.length}`}</h2>${part.questions.map((q,index)=>{
      const chosen=state.answers[index], ok=chosen===q.answer;
      return `<article class="review-item ${ok?'correct':'wrong'}"><h3>${index+1}. ${esc(q.text)}</h3><p><strong>Tu respuesta:</strong> ${chosen===null?'Sin responder':esc(q.options[chosen])}</p><p><strong>Correcta:</strong> ${esc(q.options[q.answer])}</p><p><strong>Evidencia:</strong> ${esc(q.evidence)}</p></article>`;
    }).join('')}</section>`;
  }).join('');
}
function summaryText(){
  const data=resultData(), omitted=data.total-data.answered;
  return `CELPIP READING · FULL MOCK\n${current.packTitle}\nFecha: ${dated(current.finishedAt)}\nAciertos puntuados: ${data.correct}/${data.total}\nRespondidas puntuadas: ${data.answered}/${data.total}\nSin responder: ${omitted}\n${data.rows.map(row=>`Bloque ${row.block} · Part ${row.part}: ${row.scored?`${row.correct}/${row.total}`:'NO PUNTUADO'} · ${row.answered}/${row.total} respondidas${row.expired?' · tiempo agotado':''}`).join('\n')}\n\nNOTAS\n${current.reflection||'Sin notas'}${mistakeDetails(current)}\nMaterial propio · Sin equivalencia CLB\nhttps://jmurrietabvc.github.io/CELPIP-Study-Tool/`;
}
function download(name,content){
  const url=URL.createObjectURL(new Blob([content],{type:'text/plain;charset=utf-8'}));
  const link=document.createElement('a'); link.href=url; link.download=name; link.click(); URL.revokeObjectURL(url);
}

$('begin').addEventListener('click',begin);
$('finish').addEventListener('click',closeCurrentPart);
$('back-home').addEventListener('click',()=>{show('home');renderPacks();renderHistory();});
$('reflection').addEventListener('input',event=>{if(!current)return;current.reflection=event.target.value;persist();archive();});
$('show-review').addEventListener('click',()=>{current.feedbackSeen=!current.feedbackSeen;persist();archive();$('review').hidden=!current.feedbackSeen;$('show-review').textContent=current.feedbackSeen?'Ocultar corrección':'Ver corrección y evidencia';if(current.feedbackSeen)renderReview();});
$('copy').addEventListener('click',async()=>{try{await navigator.clipboard.writeText(summaryText());$('share-status').textContent='Resumen copiado.';}catch{$('share-status').textContent='No se pudo copiar. Usa Descargar detalle.';}});
$('whatsapp').addEventListener('click',()=>window.open(`https://wa.me/?text=${encodeURIComponent(summaryText())}`,'_blank','noopener'));
$('download').addEventListener('click',()=>download(`${current.packId}-${new Date(current.finishedAt).toISOString().slice(0,10)}.txt`,summaryText()));
$('export-history').addEventListener('click',()=>download('celpip-reading-history.json',JSON.stringify(history,null,2)));

function renderHistory(){
  if(!history.length){$('history').innerHTML='<p class="empty">Todavía no hay resultados de estos packs.</p>';return;}
  $('history').innerHTML=history.slice(0,12).map(item=>{
    if(item.kind==='official') return `<article><div><strong>${esc(item.source)}</strong><span>${dated(item.finishedAt)} · oficial registrado</span></div><div><strong>${item.correct}/${item.total}</strong><span>${item.minutes} min</span></div></article>`;
    const parts=(item.parts||[]).filter(p=>partFor(p).scored!==false), total=sum(parts.map(p=>p.answers.length)), answered=sum(parts.map(p=>count(p.answers))), correct=sum(parts.map(p=>scorePart(p)));
    return `<article><div><strong>${esc(item.packTitle)}</strong><span>${dated(item.finishedAt)}${item.repeated?' · repetición':''}</span></div><div><strong>${correct}/${total}</strong><span>${answered}/${total} respondidas</span></div><button type="button" data-history-open="${esc(item.id)}">Abrir detalle</button></article>`;
  }).join('');
  $('history').querySelectorAll('[data-history-open]').forEach(button=>button.addEventListener('click',()=>openHistoryAttempt(button.dataset.historyOpen)));
}

$('official-form').addEventListener('submit',event=>{
  event.preventDefault(); const form=new FormData(event.currentTarget), now=Date.now();
  const entry={id:`official-${now}`,kind:'official',source:String(form.get('source')).trim(),correct:Number(form.get('correct')),total:Number(form.get('total')),minutes:Number(form.get('minutes')),notes:String(form.get('notes')).trim(),finishedAt:now};
  if(entry.correct>entry.total){$('official-status').textContent='Los aciertos no pueden superar el total.';return;}
  history.unshift(entry);write(HISTORY_KEY,history);event.currentTarget.reset();event.currentTarget.elements.total.value=38;$('official-status').textContent='Resultado guardado.';renderHistory();
});

renderPacks(); renderHistory();
if(current && !current.finishedAt){
  synchronize();
  if(current.finishedAt) renderResults();
  else { renderExam(); startClock(); }
} else if(current && current.finishedAt && new URLSearchParams(location.search).get('result')==='last') renderResults();
else {
  const requested=new URLSearchParams(location.search).get('pack');
  if(requested && packById(requested)) openSetup(requested);
}

