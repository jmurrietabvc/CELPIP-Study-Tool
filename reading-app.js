'use strict';
const CURRENT_KEY = 'celpip-reading-studio-current-v1';
const HISTORY_KEY = 'celpip-reading-studio-history-v1';
const $ = id => document.getElementById(id);
const esc = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const read = (key, fallback) => {try {const value=JSON.parse(localStorage.getItem(key));return value===null?fallback:value;} catch {return fallback;}};
const write = (key, value) => {try {localStorage.setItem(key,JSON.stringify(value));} catch {$('storage-warning').hidden=false;}};
let history = read(HISTORY_KEY, []);
if(!Array.isArray(history)) history=[];
let current = read(CURRENT_KEY, null);
if(current && (!Array.isArray(current.parts) || current.version!==READING_VERSION)) current=null;
let setupConfig=null;
let interval=null;
const getPart=id => id===TIME_DIAGNOSTIC.id?TIME_DIAGNOSTIC:READING_BANK.find(p=>p.id===id);
const sum = values => values.reduce((a,b)=>a+b,0);
const count = answers => answers.filter(a=>a!==null).length;
const score = (id, answers) => getPart(id).questions.reduce((n,q,i)=>n+(answers[i]===q.answer?1:0),0);
const clock = ms => {const seconds=Math.max(0,Math.ceil(ms/1000));return `${String(Math.floor(seconds/60)).padStart(2,'0')}:${String(seconds%60).padStart(2,'0')}`;};
const duration = ms => clock(ms);
const dated = at => new Date(at).toLocaleString('es',{dateStyle:'short',timeStyle:'short'});
const persist = () => write(CURRENT_KEY,current);
function archive(){const i=history.findIndex(a=>a.id===current.id);const copy=JSON.parse(JSON.stringify(current));if(i<0)history.unshift(copy);else history[i]=copy;write(HISTORY_KEY,history);}
function show(name){for(const id of ['home','setup','exam','results'])$(id).hidden=id!==name;document.body.classList.toggle('in-exam',name==='exam');}
function previousCount(id){return history.filter(a=>a.kind==='practice' && a.parts.some(p=>p.id===id)).length;}
function openSetup(mode, idx=0){
 if(current && !current.finishedAt){if(!confirm('Hay un intento en curso. ¿Descartarlo para comenzar otro?'))return;current=null;write(CURRENT_KEY,null);}
 const ids=mode==='diagnostic'?[TIME_DIAGNOSTIC.id]:mode==='mock'?READING_BANK.map(p=>p.id):[READING_BANK[idx].id];
 setupConfig={mode,ids};
 $('setup-title').textContent=mode==='diagnostic'?'Tiempo y precisión':mode==='mock'?'Reading completo':getPart(ids[0]).title;
 $('setup-description').textContent=mode==='diagnostic'?'Un texto nuevo de Reading for Information. Comparamos la precisión a los diez minutos con la precisión después de cinco minutos adicionales.':mode==='mock'?'Las cuatro partes avanzan con su propio reloj. No puedes volver a una parte cerrada y la clave se muestra al terminar todo.':mode==='untimed'?'Lee y responde a tu ritmo. Al terminar, revisa la evidencia y el motivo por el que cada alternativa es incorrecta.':'Una parte con reloj, sin corrección hasta terminar.';
 const total=sum(ids.map(id=>getPart(id).questions.length));
 const minutes=mode==='diagnostic'?'10 + 5 minutos':mode==='untimed'?'Sin límite':sum(ids.map(id=>getPart(id).minutes))+' minutos';
 $('setup-facts').innerHTML=`<span>${total} preguntas</span><span>${minutes}</span><span>Sin equivalencia CLB</span>`;
 const repeat=ids.some(id=>previousCount(id));$('repeat-warning').hidden=!repeat;$('repeat-warning').textContent='Ya has usado al menos uno de estos textos. El resultado se guardará como repetición; no mide comprensión de material nuevo.';
 $('diagnostic-instruction').hidden=mode!=='diagnostic';$('resume-note').textContent='Las respuestas y los intentos quedan en este navegador. Descarga el detalle si necesitas conservarlos en otro dispositivo.';
 show('setup');window.scrollTo(0,0);
}
function begin(){
 if(!setupConfig)return;
 const now=Date.now();
 current={id:crypto.randomUUID?crypto.randomUUID():String(now),kind:'practice',version:READING_VERSION,mode:setupConfig.mode,startedAt:now,finishedAt:null,partIndex:0,phase:'base',reflection:'',feedbackSeen:false,parts:setupConfig.ids.map(id=>({id,repeated:previousCount(id)>0,answers:Array(getPart(id).questions.length).fill(null),changes:Array(getPart(id).questions.length).fill(0),firstAnswers:Array(getPart(id).questions.length).fill(null),events:[],startedAt:null,deadline:null,base:null,final:null,expired:false}))};
 startPart(0,now);persist();renderExam();startClock();
}
function startPart(index,at){current.partIndex=index;current.phase='base';const p=current.parts[index];p.startedAt=at;p.deadline=current.mode==='untimed'?null:at+getPart(p.id).minutes*60000;}
function snapshot(p,at){return {at,elapsedMs:at-p.startedAt,answers:p.answers.slice(),changes:p.changes.slice(),firstAnswers:p.firstAnswers.slice()};}
function finishAll(at){current.finishedAt=at;current.finishedReason='completed';persist();archive();clearInterval(interval);renderResults();}
function advanceBase(at,expired){
 const p=current.parts[current.partIndex];p.base=snapshot(p,at);p.expired=expired;
 if(current.mode==='diagnostic'){current.phase='extra';p.extraStartedAt=at;p.deadline=at+300000;persist();return;}
 p.final=snapshot(p,at);
 if(current.partIndex+1<current.parts.length){startPart(current.partIndex+1,at);persist();}else finishAll(at);
}
function synchronize(now=Date.now()){
 if(!current || current.finishedAt)return;
 const oldIndex=current.partIndex,oldPhase=current.phase;
 while(!current.finishedAt){const p=current.parts[current.partIndex];if(p.deadline===null || now<p.deadline)break;const at=p.deadline;
  if(current.phase==='extra'){p.final=snapshot(p,at);p.extraExpired=true;finishAll(at);}else advanceBase(at,true);
 }
 if(!current.finishedAt && (oldIndex!==current.partIndex || oldPhase!==current.phase))renderExam();
}
function startClock(){clearInterval(interval);interval=setInterval(()=>{synchronize();if(current&&!current.finishedAt)updateClock();},250);}
function updateClock(){const p=current.parts[current.partIndex];$('timer').textContent=p.deadline===null?'Sin reloj':clock(p.deadline-Date.now());$('timer').classList.toggle('urgent',p.deadline!==null&&p.deadline-Date.now()<60000);$('answered').textContent=`${count(p.answers)}/${p.answers.length} respuestas`;}
function passageHtml(part){
 const passage=`<div class="passage">${esc(part.passage)}</div>`;
 const table=part.table?`<div class="table-wrap"><table><thead><tr>${part.table.headers.map(h=>`<th scope="col">${esc(h)}</th>`).join('')}</tr></thead><tbody>${part.table.rows.map(row=>`<tr>${row.map(c=>`<td>${esc(c)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`:'';
 const reply=part.reply?`<h3>Read the following message and complete its blanks.</h3><div class="reply">${esc(part.reply).replace(/\[(\d+)\]/g,'<span class="blank">[$1]</span>')}</div>`:'';
 return passage+table+reply;
}
function renderExam(){
 if(!current || current.finishedAt)return;
 const p=current.parts[current.partIndex],part=getPart(p.id);
 show('exam');$('exam-title').textContent=part.title;
 $('mode-label').textContent=current.mode==='diagnostic'?(current.phase==='base'?'Evaluación · etapa 1 de 2':'Evaluación · etapa 2 de 2'):current.mode==='mock'?`Simulacro · parte ${current.partIndex+1} de 4`:current.mode==='untimed'?'Entrenamiento sin reloj':'Práctica con reloj';
 $('phase-notice').hidden=current.phase!=='extra';$('phase-notice').textContent='Las respuestas de la primera etapa están guardadas. Ahora tienes cinco minutos adicionales para completar y revisar. La corrección sigue oculta.';
 $('passage-panel').innerHTML=passageHtml(part);
 let group=0;
 $('question-panel').innerHTML=part.questions.map((q,i)=>{let label='';if(group!==q.group){group=q.group;label=`<p class="group-label">${group===2?'Complete the message blanks':'Choose the best answer'}</p>`;}return label+`<fieldset class="question"><legend>${i+1}. ${esc(q.text)}</legend><div class="options">${q.options.map((o,j)=>`<label class="choice"><input type="radio" name="q${i}" value="${j}" ${p.answers[i]===j?'checked':''}><span>${part.part===3?'':String.fromCharCode(65+j)+'. '}${esc(o)}</span></label>`).join('')}</div></fieldset>`;}).join('');
 $('finish').textContent=current.mode==='diagnostic'?(current.phase==='base'?'Guardar y pasar a cinco minutos extra':'Terminar evaluación'):current.mode==='mock'&&current.partIndex<3?'Guardar y pasar a la siguiente parte':'Terminar parte';
 $('passage-panel').scrollTop=0;$('question-panel').scrollTop=0;window.scrollTo(0,0);updateClock();
}
$('question-panel').addEventListener('change',e=>{
 if(e.target.type!=='radio')return;
 const expected=current?.parts[current.partIndex]?.id,phase=current?.phase;
 synchronize();
 if(!current || current.finishedAt || current.parts[current.partIndex].id!==expected || current.phase!==phase)return;
 const p=current.parts[current.partIndex],i=Number(e.target.name.slice(1)),answer=Number(e.target.value);
 if(!Number.isInteger(i) || i<0 || i>=p.answers.length || !Number.isInteger(answer) || answer<0 || answer>=getPart(p.id).questions[i].options.length)return;
 if(p.answers[i]!==null && p.answers[i]!==answer)p.changes[i]++;
 if(p.firstAnswers[i]===null)p.firstAnswers[i]=answer;
 if(p.answers[i]!==answer)p.events.push({question:i+1,answer,at:Date.now(),phase:current.phase});
 p.answers[i]=answer;persist();updateClock();
});
function finishManually(){
 synchronize();if(!current||current.finishedAt)return;
 const expectedPart=current.partIndex,expectedPhase=current.phase;
 const p=current.parts[current.partIndex],blank=p.answers.length-count(p.answers);
 const diagnosticBase=current.mode==='diagnostic'&&current.phase==='base';
 let message=blank?`Quedan ${blank} preguntas sin responder. Se contarán como incorrectas. `:'';
 message+=diagnosticBase?'Se guardarán las respuestas de esta etapa antes de los diez minutos y empezarán los cinco adicionales. ¿Continuar?':'Las respuestas de esta parte se cerrarán. ¿Continuar?';
 if(!confirm(message))return;
 synchronize();if(!current||current.finishedAt||current.partIndex!==expectedPart||current.phase!==expectedPhase)return;
 const now=Date.now();
 if(current.phase==='extra'){const p=current.parts[current.partIndex];p.final=snapshot(p,now);p.extraExpired=false;finishAll(now);}else{advanceBase(now,false);if(!current.finishedAt)renderExam();}
}
function recordTotals(record,stage='final'){return {correct:sum(record.parts.map(p=>score(p.id,(p[stage]||p.final).answers))),answered:sum(record.parts.map(p=>count((p[stage]||p.final).answers))),total:sum(record.parts.map(p=>getPart(p.id).questions.length))};}
function diagnosticChanges(record){const p=record.parts[0],qs=getPart(p.id).questions;return qs.reduce((r,q,i)=>{const before=p.base.answers[i],after=p.final.answers[i];if(before===null&&after!==null)r.newAnswers++;if(before!==q.answer&&after===q.answer)r.recovered++;if(before===q.answer&&after!==q.answer)r.lost++;return r;},{newAnswers:0,recovered:0,lost:0});}
function titleFor(record){return record.mode==='diagnostic'?'Tiempo y precisión':record.mode==='mock'?'Reading completo':getPart(record.parts[0].id).title;}
function interpretationFor(record){
 if(record.mode!=='diagnostic')return 'Este puntaje describe esta práctica. Revisa también pendientes, evidencia y repeticiones. Para medir progreso hacia CLB 10+, utiliza material oficial nuevo con sus tiempos.';
 const first=recordTotals(record,'base'),final=recordTotals(record),gained=final.correct-first.correct;
 if(gained>0)return `Con tiempo adicional recuperaste ${gained} acierto${gained===1?'':'s'}. Esto muestra un efecto del tiempo en este bloque. Revisa si la demora estuvo en encontrar información o en decidir entre opciones; no identifica por sí solo una causa.`;
 if(final.correct<final.total)return 'El tiempo adicional no aumentó el total de aciertos. Revisa las decisiones con evidencia: el resultado por sí solo no permite distinguir comprensión, dudas o respuestas apresuradas.';
 return 'Completaste este bloque con precisión. Un texto de práctica no establece un nivel CLB ni representa todos los tipos de Reading.';
}
function renderResults(){
 show('results');$('result-title').textContent=titleFor(current);
 const final=recordTotals(current),first=recordTotals(current,'base');
 let html='';
 if(current.mode==='diagnostic')html=`<div class="metrics"><div class="metric"><strong>${first.correct}/${first.total}</strong><p class="small">Aciertos · primera etapa<br>${count(current.parts[0].base.answers)} respondidas · ${duration(current.parts[0].base.elapsedMs)}</p></div><div class="metric"><strong>${final.correct}/${final.total}</strong><p class="small">Aciertos · resultado final<br>${final.answered} respondidas · ${duration(current.finishedAt-current.startedAt)}</p></div><div class="metric"><strong>${final.correct-first.correct>0?'+':''}${final.correct-first.correct}</strong><p class="small">Cambio neto en aciertos</p></div></div>`;
 else html=`<div class="metrics"><div class="metric"><strong>${final.correct}/${final.total}</strong><p class="small">Aciertos</p></div><div class="metric"><strong>${final.total-final.answered}</strong><p class="small">Sin responder</p></div><div class="metric"><strong>${duration(current.finishedAt-current.startedAt)}</strong><p class="small">Tiempo usado</p></div></div>`;
 if(current.mode==='diagnostic'){const changes=diagnosticChanges(current);html+=`<p class="small">En la etapa adicional: ${changes.newAnswers} pendientes contestadas · ${changes.recovered} respuestas pasaron a correctas · ${changes.lost} respuestas correctas pasaron a incorrectas.</p>`;}
 html+=current.parts.map(p=>{const part=getPart(p.id);return `<p class="small">${esc(part.title)}: ${score(p.id,p.final.answers)}/${p.final.answers.length} · ${duration(p.final.elapsedMs)}${p.repeated?' · Texto repetido':''}${p.expired?(current.mode==='diagnostic'?' · Se agotó el tiempo de la primera etapa':' · Se agotó el tiempo de la parte'):''}</p>`;}).join('');
 $('result-metrics').innerHTML=html;$('interpretation').textContent=interpretationFor(current);$('reflection').value=current.reflection||'';$('share-status').textContent='';
 $('result-passages').innerHTML=current.parts.map(p=>`<section class="result-passage"><h3>${esc(getPart(p.id).title)}</h3>${passageHtml(getPart(p.id))}</section>`).join('');
 $('review').hidden=!current.feedbackSeen;$('review').innerHTML=current.feedbackSeen?reviewHtml():'';
 $('show-review').textContent=current.feedbackSeen?'Corrección consultada':'Ver corrección y evidencia';window.scrollTo(0,0);
}
function letter(answer){return answer===null?'Sin responder':String.fromCharCode(65+answer);}
function reviewHtml(){return current.parts.map(p=>{const part=getPart(p.id);return `<h2>${esc(part.title)}</h2>`+part.questions.map((q,i)=>{const answer=p.final.answers[i],correct=answer===q.answer;return `<section class="review-item" lang="en"><h3>${i+1}. ${esc(q.text)}</h3><p class="${correct?'right':'wrong'}">${correct?'Correcta':'Incorrecta o pendiente'} · Tu respuesta: ${letter(answer)} · Clave: ${letter(q.answer)}</p>${current.mode==='diagnostic'?`<p class="small">Primera etapa: ${letter(p.base.answers[i])} → final: ${letter(answer)}</p>`:''}<p lang="es"><strong>Evidencia:</strong> ${esc(q.evidence)}</p><ul>${q.options.map((o,j)=>`<li><strong>${String.fromCharCode(65+j)}. ${esc(o)}</strong><br><span lang="es">${j===q.answer?'Sustentada por el texto.':esc(q.why[j])}</span></li>`).join('')}</ul></section>`;}).join('');}
function saveReflection(){if(!current?.finishedAt)return;current.reflection=$('reflection').value;persist();archive();}
function summary(){
 const final=recordTotals(current),first=recordTotals(current,'base');
 const lines=['READING STUDIO · '+titleFor(current),`Fecha: ${dated(current.startedAt)}`,`Modo: ${current.mode==='diagnostic'?'10 + 5 minutos':current.mode==='mock'?'Simulacro completo':current.mode==='untimed'?'Sin reloj':'Con reloj'}`,`Resultado final: ${final.correct}/${final.total} · Respondidas: ${final.answered}/${final.total}`,`Tiempo total: ${duration(current.finishedAt-current.startedAt)}`,'Sin equivalencia CLB · Material original, no oficial.'];
 if(current.mode==='diagnostic'){const changes=diagnosticChanges(current);lines.push(`Primera etapa: ${first.correct}/${first.total} · ${first.answered} respondidas · ${duration(current.parts[0].base.elapsedMs)}`,`Etapa adicional: ${duration(current.finishedAt-current.parts[0].extraStartedAt)}`,`Cambio neto de aciertos: ${final.correct-first.correct}`,`Pendientes contestadas: ${changes.newAnswers} · Respuestas recuperadas: ${changes.recovered} · Aciertos perdidos: ${changes.lost}`);}
 for(const p of current.parts){lines.push('',getPart(p.id).title+(p.repeated?' · REPETICIÓN':''));p.final.answers.forEach((answer,i)=>lines.push(`${i+1}: ${current.mode==='diagnostic'?letter(p.base.answers[i])+' → ':''}${letter(answer)}${p.changes[i]?` · ${p.changes[i]} cambios`:''}`));}
 lines.push('','EXPLICACIÓN DEL PROCESO',current.reflection||'Sin explicación añadida.',current.feedbackSeen?'Se consultó la corrección antes de compartir.':'Corrección no consultada.',`Prueba: ${location.origin}${location.pathname}?mode=${current.mode}${current.parts.length===1&&current.mode!=='diagnostic'?'&part='+getPart(current.parts[0].id).part:''}`);return lines.join('\n');
}
function download(value,name){const blob=new Blob([JSON.stringify(value,null,2)],{type:'application/json'}),url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
async function copySummary(){saveReflection();const text=summary();try{await navigator.clipboard.writeText(text);$('share-status').textContent='Resumen copiado. Pégalo en WhatsApp.';}catch{let area=document.getElementById('copy-fallback');if(!area){area=document.createElement('textarea');area.id='copy-fallback';$('share-status').after(area);}area.value=text;area.focus();area.select();$('share-status').textContent='Selecciona y copia este resumen.';}}
function renderHome(){
 show('home');
 $('modules').innerHTML=READING_BANK.map((p,i)=>`<article class="module"><div class="number">0${p.part}</div><h3>${esc(p.title.split(' · ')[0])}</h3><p class="small">${p.questions.length} preguntas · ${p.minutes} minutos</p><p class="small">${p.part===1?'Email y respuesta con cinco huecos.':p.part===2?'Tabla y mensaje con tres huecos.':p.part===3?'Cuatro párrafos y opción «no se indica».':'Opiniones y comentario con cinco huecos.'}</p><div class="buttons"><button data-part="${i}" data-mode="timed">Practicar con reloj</button><button class="ghost" data-part="${i}" data-mode="untimed">Entrenar sin reloj</button></div></article>`).join('');
 const records=history.slice(0,30);
 $('history').innerHTML=records.length?records.map((a,i)=>{if(a.kind==='official')return `<div class="history-row"><div><strong>${esc(a.source)}</strong> <span class="tag">Registrado por ti · Oficial</span><p class="small">${dated(a.startedAt)}${a.repeated?' · Repetición':''}</p>${a.notes?`<p class="small">${esc(a.notes)}</p>`:''}</div><strong>${a.correct}/${a.total} · ${a.minutes} min</strong></div>`;const totals=recordTotals(a);return `<div class="history-row"><div><strong>${esc(titleFor(a))}</strong> <span class="tag">${a.mode==='untimed'?'Sin reloj':a.mode==='diagnostic'?'10 + 5 min':'Con reloj'}${a.parts.some(p=>p.repeated)?' · Repetición':''}</span><p class="small">${dated(a.startedAt)} · ${totals.answered}/${totals.total} respondidas</p></div><div><strong>${totals.correct}/${totals.total}</strong> <button class="ghost" data-record="${i}">Ver detalle</button></div></div>`;}).join(''):'<p class="small">Tus intentos aparecerán aquí. También puedes registrar resultados de packs oficiales.</p>';
 if(current&&!current.finishedAt){const resume=document.createElement('div');resume.className='notice';resume.innerHTML='Hay un intento guardado. Su reloj continúa. <button id="resume">Continuar intento</button>';$('history').prepend(resume);$('resume').onclick=()=>{synchronize();if(!current.finishedAt){renderExam();startClock();}};}
}
$('modules').addEventListener('click',e=>{const b=e.target.closest('[data-part]');if(b)openSetup(b.dataset.mode,Number(b.dataset.part));});
$('history').addEventListener('click',e=>{const b=e.target.closest('[data-record]');if(!b)return;if(current&&!current.finishedAt){alert('Termina el intento en curso antes de abrir otro resultado.');return;}current=JSON.parse(JSON.stringify(history[Number(b.dataset.record)]));persist();renderResults();});
$('diagnostic').onclick=()=>openSetup('diagnostic');$('mock').onclick=()=>openSetup('mock');$('begin').onclick=begin;$('finish').onclick=finishManually;
$('reflection').oninput=saveReflection;$('copy').onclick=copySummary;
$('whatsapp').onclick=()=>{saveReflection();window.open('https://wa.me/?text='+encodeURIComponent(summary()),'_blank','noopener');};
$('download').onclick=()=>{saveReflection();download(current,'reading-intento-'+current.id+'.json');};
$('export-history').onclick=()=>download({version:READING_VERSION,exportedAt:new Date().toISOString(),attempts:history},'reading-historial.json');
$('show-review').onclick=()=>{saveReflection();current.feedbackSeen=true;persist();archive();$('review').innerHTML=reviewHtml();$('review').hidden=false;$('show-review').textContent='Corrección consultada';$('review').scrollIntoView({behavior:'smooth'});};
$('new-attempt').onclick=()=>{const mode=current.mode,idx=READING_BANK.findIndex(p=>p.id===current.parts[0].id);openSetup(mode,Math.max(0,idx));};
$('official-form').onsubmit=e=>{e.preventDefault();const data=new FormData(e.target),correct=Number(data.get('correct')),total=Number(data.get('total')),minutes=Number(data.get('minutes'));if(correct>total||!Number.isInteger(correct)||!Number.isInteger(total)){ $('official-status').textContent='Los aciertos deben ser enteros entre cero y el total de preguntas.';return;}history.unshift({id:crypto.randomUUID?crypto.randomUUID():String(Date.now()),kind:'official',source:String(data.get('source')).trim(),startedAt:Date.now(),correct,total,minutes,notes:String(data.get('notes')),repeated:data.get('repeated')==='on'});write(HISTORY_KEY,history);renderHome();e.target.reset();$('official-status').textContent='Práctica guardada.';};
document.addEventListener('visibilitychange',()=>{if(!document.hidden){synchronize();if(current&&!current.finishedAt)updateClock();}});
window.addEventListener('beforeunload',persist);
renderHome();
if(current&&!current.finishedAt){synchronize();if(!current.finishedAt){renderExam();startClock();}}
else {const params=new URLSearchParams(location.search),mode=params.get('mode'),part=Number(params.get('part')||1)-1;if(['diagnostic','mock','timed','untimed'].includes(mode))openSetup(mode,Number.isInteger(part)&&part>=0&&part<READING_BANK.length?part:0);}

