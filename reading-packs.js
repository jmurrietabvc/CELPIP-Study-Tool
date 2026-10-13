'use strict';

const clone = value => JSON.parse(JSON.stringify(value));
const rotateQuestion = (question, index, group) => {
  const correct = question[1][0];
  const options = question[1].slice();
  const shift = (index * 3 + group) % options.length;
  const rotated = options.slice(shift).concat(options.slice(0, shift));
  return {
    text: question[0],
    options: rotated,
    answer: rotated.indexOf(correct),
    evidence: question[2],
    why: rotated.map(option => option === correct ? '' : 'Esta alternativa cambia o añade una condición que el texto no respalda.'),
    group
  };
};

function buildUltimatePart(source, questions, reply) {
  const data = clone(source);
  data.id = `pack-2-part-${data.part}`;
  data.title = `Pack 2 · Part ${data.part}`;
  if (reply) data.reply = reply;
  data.source = 'pack';
  data.questions = questions.map((question, index) => {
    if (data.part === 3) {
      const options = ['A', 'B', 'C', 'D', 'E — Not stated'];
      return {text: question[0], options, answer: 'ABCDE'.indexOf(question[1]), evidence: `La respuesta correcta es ${question[1]}. Revisa el alcance exacto de cada párrafo.`, why: options.map(() => ''), group: 1};
    }
    const boundary = data.part === 1 ? 6 : 5;
    return rotateQuestion(question, index, index < boundary ? 1 : 2);
  });
  return data;
}

const pack2Part1Questions = [
  ...ULTIMATE_V2[0].questions.slice(0, 5),
  ['When will Priya learn whether she received the requested spaces?', ['By 5 p.m. Friday in the allocation email','As soon as she submits the Thursday request','At noon on the following Monday','Only when she arrives at the garage'], 'The office emails allocations by 5 p.m. Friday.'],
  ULTIMATE_V2[0].questions[5],
  ULTIMATE_V2[0].questions[6],
  ['Complete blank [9].', ['cancel by 2 p.m. Tuesday if she will not use it','wait until 9 p.m. Tuesday before cancelling','give the space directly to another resident','pay a cancellation fine during the trial'], 'Unused allocated nights should be cancelled by 2 p.m. that day; no trial fine is charged.'],
  ['Complete blank [10].', ['sending the request earlier that morning will not increase priority','the first request received always wins a tied allocation','requesting two nights gives both requests priority','a permit reserves one of the two visitor spaces'], 'The notice explicitly says earlier Thursday submission does not improve priority.'],
  ULTIMATE_V2[0].questions[7]
];

const pack2Part4Questions = [
  ...ULTIMATE_V2[3].questions,
  ['Complete blank [9].', ['the route comparison is finished before families judge the proposal','punctuality is treated as proof that every walking route is safe','the covered waiting area replaces the need for crossing data','the board avoids consulting the city until after the trial'], 'The board has promised to compare the routes and consult the city before deciding.'],
  ['Complete blank [10].', ['the board can identify a time benefit and a safety problem independently','one combined total can hide whether the bus was late','families no longer need to report crossing incidents','a permanent move follows automatically from better punctuality'], 'Recording the measures separately prevents one positive result from obscuring a different risk.']
];

const PACK_2 = [
  buildUltimatePart(ULTIMATE_V2[0], pack2Part1Questions, `Hello Priya,

Please send your request before [7]. You can request both nights, although [8]. If you do not need Tuesday’s allocated space, [9]. Remember that [10]. After the trial, the board will consider [11] before making a decision.

Building Office`),
  buildUltimatePart(ULTIMATE_V2[1], ULTIMATE_V2[1].questions, ULTIMATE_V2[1].reply),
  buildUltimatePart(ULTIMATE_V2[2], ULTIMATE_V2[2].questions),
  buildUltimatePart(ULTIMATE_V2[3], pack2Part4Questions, `Dear Board,

I share the hope that the bus will arrive more reliably. Still, the evidence about the new walking route is incomplete. Rosa’s concern is [6], while Daniel’s support depends on [7]. It matters that [8]. Before approving a trial, please ensure [9]. If the trial proceeds, report the two measures separately so that [10].

A parent`)
];

const p3item = (text, options, answer, evidence, group=1) => ({text, options, answer, evidence, why: options.map((_,i)=>i===answer?'':'Esta alternativa contradice, exagera o no responde exactamente a la información del texto.'), group});

const PACK_3 = [
  {
    id:'pack-3-part-1', part:1, title:'Pack 3 · Part 1', minutes:11, source:'pack',
    passage:`From: Lakeshore Housing Office <housing@lakeshore.example>
To: Residents of Buildings C and D
Subject: Temporary bicycle-room access

The shared bicycle room will be closed from Monday, March 10, through Wednesday, March 12, while the floor coating is replaced. Bicycles must be removed by 8 p.m. Sunday. Any bicycle left inside will be moved by the contractor to the fenced courtyard, but the housing office cannot guarantee that accessories attached to it will remain dry. Residents should therefore remove baskets, helmets and electronic devices before the deadline.

During the closure, residents may use the north storage room. Space there is limited to one bicycle per apartment and is available only to residents of Buildings C and D. To receive the temporary door code, submit the online request form by 3 p.m. Friday. The office will email codes that evening. A submitted form is not confirmation: residents whose requests exceed the room’s capacity will instead receive directions to public racks beside the recreation centre.

The north storage room has two doors. Use the lane entrance when bringing a bicycle in or out; the lobby door is for pedestrians and does not have a ramp. Do not leave bicycles in the lane itself, even briefly, because waste trucks use it before 7 a.m. The temporary code will stop working Thursday morning. The regular bicycle room is expected to reopen at noon Thursday, after the coating has been inspected.

Residents who need daily access should plan around the closure. The contractor will not open the bicycle room to retrieve individual bicycles once work has begun. If inspection reveals that the coating needs more time to dry, the office will email residents on Wednesday and extend the temporary codes. No extension has yet been announced.

From: Elena Ruiz <elena@example.com>
To: Lakeshore Housing Office
Subject: Re: Temporary bicycle-room access

I live in Building D and use my bicycle for work. I submitted the form this morning for my bicycle and my partner’s. We can remove both on Sunday evening. Please let me know whether the temporary room can hold both and which entrance we should use.`,
    reply:`Hello Elena,

The temporary limit is [7]. Sending the form does not itself confirm space; [8]. If you receive a code, take the bicycle through [9]. Please remove both bicycles by [10], because the contractor cannot retrieve one after work begins. The regular room is expected to reopen [11], unless inspection requires more drying time.

Housing Office`,
    questions:[
      p3item('Why should residents remove accessories from bicycles left after the deadline?', ['The contractor may charge separately to move each accessory.','Items attached to moved bicycles may be exposed to weather.','The courtyard cannot hold bicycles fitted with baskets.','Electronic devices prevent the floor inspection.'],1,'The office cannot guarantee that attached accessories moved to the courtyard will remain dry.'),
      p3item('What happens when requests exceed the north room’s capacity?', ['All submitted requests remain pending until Thursday.','Residents may store two bicycles if one belongs to a partner.','Some residents receive directions to public racks instead of a code.','The office opens the regular bicycle room for overflow.'],2,'Residents beyond capacity receive directions to recreation-centre racks.'),
      p3item('Why must residents avoid leaving bicycles in the lane?', ['The lane is reserved for contractor parking all day.','The pedestrian door opens directly into the lane.','Waste vehicles need to use the lane early in the morning.','The lane coating will also be replaced.'],2,'Waste trucks use the lane before 7 a.m.'),
      p3item('Under what condition will temporary codes last beyond Thursday morning?', ['The regular room fills after reopening.','The new coating requires additional drying time.','Residents request an extension before Wednesday.','The public racks reach capacity.'],1,'Codes are extended only if inspection shows that more drying time is needed.'),
      p3item('What should a resident who needs a bicycle on Monday do?', ['Remove it before the Sunday deadline.','Ask the contractor to retrieve it during the work.','Wait for the regular room to reopen at noon Monday.','Leave it in the lane before 7 a.m.'],0,'There is no individual retrieval after work begins, so it must be removed Sunday.'),
      p3item('What is the status of the Thursday reopening time?', ['It is guaranteed even if the coating remains wet.','It has already been postponed by email.','It is expected but depends on the inspection.','It applies only to Building C residents.'],2,'No extension is announced, but the noon reopening depends on inspection.'),
      p3item('Complete blank [7].', ['two bicycles for every household','one bicycle per apartment','one bicycle per registered resident','any number that fits beside the lane entrance'],1,'The temporary room allows one bicycle per apartment.',2),
      p3item('Complete blank [8].', ['we will email either a code or alternative rack directions','every applicant can collect a code at the lobby','your early submission reserves two spaces','codes are issued only after the room reopens'],0,'The email confirms either access or the alternative racks.',2),
      p3item('Complete blank [9].', ['the lobby door because it has a ramp','the fenced courtyard entrance','the lane entrance','the recreation-centre lobby'],2,'Bicycles must use the lane entrance.',2),
      p3item('Complete blank [10].', ['3 p.m. Friday','8 p.m. Sunday','7 a.m. Monday','noon Thursday'],1,'Bicycles must be removed by 8 p.m. Sunday.',2),
      p3item('Complete blank [11].', ['at noon Thursday','on Wednesday evening','at 8 p.m. Sunday','after an automatic one-week extension'],0,'The expected reopening is noon Thursday.',2)
    ]
  },
  {
    id:'pack-3-part-2', part:2, title:'Pack 3 · Part 2', minutes:9, source:'pack',
    passage:`The Riverbend Service Centre is offering document-help appointments on April 18 and 19. Each person may reserve one appointment initially. Beginning at noon April 16, anyone may reserve a second appointment if spaces remain. A wait-list entry is not an appointment. Staff contact wait-listed clients only when a cancellation matches the service and language they selected.

“Review only” means staff check whether required fields and documents appear complete; they do not translate or complete forms for clients. For sessions marked “digital,” bring the file on a USB drive or have access to it by email. Printing of up to ten pages is included.`,
    table:{headers:['Date','Time','Service','Language','Format','Spaces'],rows:[['Apr 18','9:00','Housing benefit','English','Paper','0 · wait-list'],['Apr 18','10:30','Housing benefit','French','Paper','2'],['Apr 18','13:00','Tax credit','English','Digital','1'],['Apr 19','9:00','Tax credit','French','Digital','0 · wait-list'],['Apr 19','11:00','Transit discount','English','Paper','3'],['Apr 19','14:00','Transit discount','French','Digital','1']]},
    reply:`Hi Marc,

For a French housing-benefit review, the available listing is [6]. If you also want the French digital transit session, you may initially reserve [7]. Beginning at noon April 16, [8]. Remember that staff review completeness but do not translate the form.

Riverbend Service Centre`,
    questions:[
      p3item('Nadia needs an English digital tax-credit review. Which listed session fits?', ['April 18 at 9:00','April 18 at 13:00','April 19 at 9:00','April 19 at 11:00'],1,'The April 18 13:00 session matches English, tax credit and digital.'),
      p3item('What does joining the April 19 French tax-credit wait-list guarantee?', ['A digital appointment before April 19','Contact only if every English appointment fills','No appointment unless a matching place opens','Priority for any French service that day'],2,'A wait-list entry is not an appointment and requires a matching cancellation.'),
      p3item('Which available Saturday session uses paper?', ['English transit discount at 11:00','French transit discount at 14:00','French tax credit at 9:00','English tax credit at 13:00'],0,'April 19 is Saturday; the 11:00 English transit session is paper and has space.'),
      p3item('What may staff do during a review-only appointment?', ['Translate the client’s documents','Complete missing answers for the client','Check that required material appears present','Print an unlimited number of pages'],2,'Staff check apparent completeness and do not translate or complete forms.'),
      p3item('What must a client in a digital session be able to do?', ['Provide electronic access to the file','Bring exactly ten printed pages','Attend in English','Reserve two appointments immediately'],0,'The file must be on USB or accessible by email.'),
      p3item('Complete blank [6].', ['April 18 at 10:30','April 18 at 9:00','April 19 at 14:00','April 19 at 9:00'],0,'The French housing-benefit session with spaces is April 18 at 10:30.',2),
      p3item('Complete blank [7].', ['both sessions immediately','only one of the two sessions','only the wait-list session','neither session until April 16'],1,'Each person may initially reserve only one appointment.',2),
      p3item('Complete blank [8].', ['a second booking is possible if space remains','all wait-list entries become confirmed','the language choice can be ignored','printing stops being included'],0,'Second appointments open at noon April 16 if places remain.',2)
    ]
  },
  (() => { const part=clone(TIME_DIAGNOSTIC); part.id='pack-3-part-3'; part.title='Pack 3 · Part 3'; part.source='pack'; return part; })(),
  {
    id:'pack-3-part-4', part:4, title:'Pack 3 · Part 4', minutes:13, source:'pack',
    passage:`The city is considering replacing three curbside parking spaces outside the Hill Street market with a shared loading zone from 7 a.m. to 1 p.m. Delivery vehicles could stop for up to twenty minutes. After 1 p.m., the spaces would return to ordinary paid parking. The change would run as a twelve-week pilot. It follows complaints that delivery vans often double-park, blocking the bus lane.

Viewpoint A — Shop owner Lena Ortiz:
The market needs a legal place for deliveries, and a shared zone is more realistic than asking every shop to receive goods before dawn. Still, twenty minutes may be too short for businesses receiving several refrigerated containers. A driver who must leave and circle the block could create more traffic, not less. I support the pilot if loading duration is recorded rather than assuming every delivery should fit the same limit. The city should also enforce the zone against private cars; otherwise the legal space will exist only on paper.

Viewpoint B — Resident Paul Singh:
Double-parking is dangerous, but removing morning parking has costs. Some older residents use those spaces for short visits to the pharmacy beside the market. The nearest public lot is two blocks away and its accessible spaces are frequently occupied. Before the pilot begins, the city should create one short-stay accessible space on the side street. I could support the loading zone with that safeguard and with clear signs showing that paid parking returns after 1 p.m.

Viewpoint C — Transit planner Elise Morgan:
Keeping vans out of the bus lane could improve reliability, but a pilot must measure actual obstruction, not merely count vehicles using the new zone. If drivers continue to double-park when the zone is occupied, high use would not mean the problem is solved. Bus travel time, blocked-lane reports and loading-zone occupancy should be recorded separately. The twelve weeks should include both normal trading periods and the holiday rush, whose delivery pattern may not represent the rest of the year.

The transportation committee has asked staff to map an accessible short-stay space and to propose a method for recording loading duration. It has not approved either measure or the pilot. A decision is expected next month.`,
    reply:`Dear Committee,

The proposal addresses a real problem, but approval should depend on details. Lena supports a legal loading area while warning that [6]. Paul’s conditional support reflects concern for [7]. Elise explains why [8]. The requested staff work is useful, but [9]. A credible pilot would [10].

A market customer`,
    questions:[
      p3item('What change is proposed after 1 p.m.?', ['The zone becomes bus-only.','The spaces return to paid parking.','Delivery vehicles receive unlimited stopping time.','The pharmacy controls the spaces.'],1,'After 1 p.m. the three spaces return to ordinary paid parking.'),
      p3item('What concern do Lena and Elise share?', ['A busy loading zone may not by itself show that traffic conditions improved.','All deliveries should occur before the market opens.','The accessible side-street space should replace the loading zone.','The pilot must exclude the holiday period.'],0,'Lena warns of circling and enforcement; Elise says use alone does not prove obstruction is solved.'),
      p3item('What would most directly address Paul’s condition?', ['Increasing the delivery limit to forty minutes','Adding an accessible short-stay space nearby','Removing paid parking after 1 p.m.','Measuring bus travel times during holidays'],1,'Paul asks for an accessible short-stay space on the side street.'),
      p3item('Why does Elise want several measures recorded separately?', ['To distinguish use of the zone from improvement in the bus-lane problem','To prove that every delivery lasts under twenty minutes','To eliminate the need for a holiday trial period','To compare pharmacy sales with parking revenue'],0,'Occupancy can be high even while double-parking continues; separate measures reveal that.'),
      p3item('What has the committee decided so far?', ['It approved the pilot but delayed its start.','It rejected the accessible-space proposal.','It requested preparatory work without approving the pilot.','It made the loading zone permanent.'],2,'Staff work has been requested, but neither the measures nor pilot is approved.'),
      p3item('Complete blank [6].', ['one fixed time limit may not fit every delivery','private cars should use the bus lane instead','paid parking should end permanently','refrigerated deliveries can occur only after 1 p.m.'],0,'Lena questions whether twenty minutes fits larger refrigerated deliveries.',2),
      p3item('Complete blank [7].', ['drivers who want to circle the block','people who need nearby accessible parking','shops that receive goods before dawn','the number of vehicles in the loading zone'],1,'Paul focuses on older pharmacy visitors and scarce accessible parking.',2),
      p3item('Complete blank [8].', ['high zone use does not necessarily mean the obstruction is solved','holiday deliveries should determine the permanent policy','vehicle counts can replace bus travel-time data','twenty minutes is enough for every business'],0,'She separates zone use from the actual outcome in the bus lane.',2),
      p3item('Complete blank [9].', ['neither that work nor the pilot has been approved','the city has already installed the accessible space','the pilot will certainly start next month','staff have refused to record loading duration'],0,'The committee requested proposals but approved nothing yet.',2),
      p3item('Complete blank [10].', ['measure loading, obstruction and bus performance rather than one total','treat the holiday rush as typical of the whole year','remove accessible parking until the trial ends','judge success only by how many vans use the zone'],0,'The viewpoints support several measures that distinguish use, access and actual traffic outcomes.',2)
    ]
  }
];

const READING_PACKS = [
  {id:'pack-1', number:1, title:'Mock Pack 1', subtitle:'Access, schedules, information and viewpoints', parts:READING_BANK.map(part => ({...clone(part), source:'pack'}))},
  {id:'pack-2', number:2, title:'Mock Pack 2', subtitle:'Charging, workshops, public access and transport', parts:PACK_2},
  {id:'pack-3', number:3, title:'Mock Pack 3', subtitle:'Housing, appointments, community services and traffic', parts:PACK_3}
];

for (const pack of READING_PACKS) {
  pack.questions = pack.parts.reduce((sum, part) => sum + part.questions.length, 0);
  pack.minutes = pack.parts.reduce((sum, part) => sum + part.minutes, 0);
}

