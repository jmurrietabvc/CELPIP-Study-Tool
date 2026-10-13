'use strict';
// The original exercises remain available. Only entries with editorial revisions
// receive rewritten alternatives and a specific evidence note.
const ORIGINAL_TOPIC_LABELS={
 'original-1':'Universal Basic Income','original-2':'Urban heat islands','original-3':'Return to office policy','original-4':'City Hall permit dispute','original-5':'School registration pathways','original-7':'Parking fines','original-8':'Auto repair invoice','original-9':'Security deposit deductions','original-11':'Park tree planting','original-12':'Corporate relocation incentives','original-13':'Waste diversion policy','original-15':'AI company arrival','original-16':'Toll corridor complaint','original-17':'Heritage building reuse','original-19':'Remote work hardware','original-20':'Transit disruptions','original-21':'Corporate relocation terms','original-23':'Bike lane debate','original-24':'Mayor memorial','original-25':'Museum exhibit operations','original-27':'Auto repair rights','original-28':'Millennium Line disruption','original-29':'Hybrid work schedule','original-31':'University admissions portal','original-32':'Parking ticket dispute','original-33':'Bear encounters','original-35':'Rezoning debate','original-36':'Scholarship portal','original-37':'Laptop hardware policy','original-39':'Scholarship allocation','original-40':'Bike lane safety','original-41':'Expressway fare tiers','original-43':'Toll bridge debate','original-44':'Noise bylaw proposal','original-45':'Parking citation appeal','original-47':'Auto repair costs','original-48':'Hybrid work framework','original-51':'Rental security deposits','original-52':'Bears in the neighbourhood','original-53':'School registration and curriculum','original-55':'Museum narratives','original-56':'Corporate relocation plan','original-57':'Noise bylaw compliance','original-59':'Grade reassessments','original-60':'Heritage demolition','original-63':'Organics and recycling mandate','original-64':'Hybrid operations','original-65':'Laptop policy','original-67':'Admissions portal debate'
};
const ORIGINAL_BANK = ORIGINAL_READING_SOURCE.map((source, sourceIndex) => {
  const fresh = ULTIMATE_V2.find(p=>p.id===source.id)||REPAIRED_ORIGINAL_V2.find(p=>p.id===source.id);
  if(fresh){
    const questions=fresh.questions.map((row,qi)=>{
      const [text,raw,evidence]=row;
      if(fresh.part===3){const answer='ABCDE'.indexOf(raw);return {text,options:['A','B','C','D','E — Not stated'],answer,group:1,evidence:answer===4?'Ningún párrafo indica ese dato.':`El párrafo ${raw} respalda esta idea.`,why:Array(5).fill('Busca la afirmación completa, no solo una palabra compartida.'),reviewed:true};}
      const order=[0,1,2,3];let seed=(sourceIndex+1)*131+(qi+1)*53;
      for(let i=3;i>0;i--){seed=(seed*1664525+1013904223)>>>0;const j=seed%(i+1);[order[i],order[j]]=[order[j],order[i]];}
      const answer=order.indexOf(0),options=order.map(i=>raw[i]);
      return {text,options,answer,group:qi>=5?2:1,evidence,why:options.map((_,i)=>i===answer?'':'Esta opción cambia un detalle de la evidencia o afirma algo no indicado.'),reviewed:true};
    });
    return {...fresh,questions,source:fresh.id.startsWith('ultimate-')?'ultimate-v2':'repaired-v2',ultimate:fresh.id.startsWith('ultimate-'),reviewed:true};
  }
  const part = Number(source.title.match(/Part\s*([1-4])/i)?.[1] || 3);
  const ultimate = source.id.startsWith('ultimate-');
  const topic = ORIGINAL_TOPIC_LABELS[source.id] || source.title.replace(/^CLB\s*\d+(?:\s*[-–]\s*\d+)?\s*/i,'').replace(/^C2 BOSS MOCK\s*[-–]\s*/i,'').replace(/^Reading\s*:?[\s-]*/i,'').replace(/^Part\s*[1-4]\s*[:.–-]?\s*/i,'').trim();
  const title = ultimate ? `Ultimate · bloque ${Number(source.id.split('-')[1]) + 1} · Part ${part}` : `Ejercicio ${sourceIndex + 1} · Part ${part}${topic ? ' · ' + topic : ''}`;
  const revisedRows = READING_REVISIONS[source.id];
  const questions = source.questions.map((question, qi) => {
    let text = question.text;
    if (source.id === 'original-23' && qi === 4) text = 'Which proposal does Marcus support for protecting cyclists during street construction?';
    const row = revisedRows?.[qi];
    if (row) {
      const order = [0,1,2,3];
      let seed = (sourceIndex + 1) * 131 + (qi + 1) * 53;
      for (let i = order.length - 1; i > 0; i--) { seed = (seed * 1664525 + 1013904223) >>> 0; const j = seed % (i + 1); [order[i],order[j]]=[order[j],order[i]]; }
      const answer = order.indexOf(0);
      const options = order.map(i => row[i]);
      return {text,options,answer,group:1,evidence:row[4],why:options.map((_,i)=>i===answer?'':`La evidencia favorece la alternativa ${String.fromCharCode(65+answer)}; esta opción cambia o añade un detalle.`),reviewed:true};
    }
    const answer = question.correctAnswerIndex;
    const options = part === 3 ? ['A','B','C','D','E — Not stated'] : question.options.slice();
    const evidence = part === 3 && answer < 4 ? `Consulta el párrafo ${String.fromCharCode(65+answer)} y comprueba el detalle exacto que pide la pregunta.` : 'Esta clave procede del banco original y aún no tiene una nota de evidencia revisada.';
    return {text,options,answer,group:1,evidence,why:options.map((_,i)=>i===answer?'':'Opción del banco original; compara cada palabra con el pasaje.'),reviewed:false};
  });
  if(part===3){
    const markers=[...source.passage.matchAll(/^([A-D]):\s*/gm)];
    if(markers.length===4){for(const q of questions){if(q.answer<4){const at=markers[q.answer].index,until=markers[q.answer+1]?.index??source.passage.length;q.evidence=`Párrafo ${String.fromCharCode(65+q.answer)}: ${source.passage.slice(at,until).trim()}`;}}}
    // The inherited bank often ordered answers A, B, C, D, E. Mix question
    // order so that that accidental sequence cannot be used as a shortcut.
    let seed=(sourceIndex+1)*9973;
    for(let i=questions.length-1;i>0;i--){seed=(seed*1664525+1013904223)>>>0;const j=seed%(i+1);[questions[i],questions[j]]=[questions[j],questions[i]];}
  }
  const minutes = ultimate ? (part===1?9:part===2?9:part===3?10:11) : (part===1?Math.ceil(questions.length):part===2?Math.ceil(questions.length*9/8):part===3?10:Math.ceil(questions.length*13/10));
  let passage = source.passage.replace(/<br\s*\/?\s*>/gi,'\n');
  if (source.id === 'original-32') passage = passage.replace(/fire-hydrant parking violation/gi,'temporary parking restriction violation');
  return {id:source.id,title,part,minutes,passage,questions,source:'original',ultimate,reviewed:questions.every(q=>q.reviewed)};
});
