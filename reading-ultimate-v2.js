'use strict';
// Five fresh blocks replace the old Ultimate prose, whose vocabulary and
// distractors were much less representative of practical reading tasks.
const ULTIMATE_V2 = [
 {id:'ultimate-0',part:1,title:'Ultimate · bloque 1 · Charging spaces',minutes:11,passage:`From: Building Office <office@maplequay.example>
To: Residents of Maple Quay
Subject: Trial arrangement for charging spaces

Beginning November 4, two of the visitor spaces in the underground garage will be available for overnight electric-vehicle charging. This six-week trial is open to residents who have registered a vehicle and requested a charging permit. A permit allows a resident to join the nightly booking list; it does not guarantee a space on a particular night. The two spaces remain available to visitors until 6 p.m. and must be vacated by residents by 8 a.m. the next day.

Residents may request up to three nights in a calendar week. Requests for the following week close at noon each Thursday. The office will email allocations by 5 p.m. Friday. If more than two people request the same night, priority goes first to residents who received fewer charging nights in the previous two weeks; a tie is decided by a draw. This rule means that submitting a request earlier on Thursday does not improve its priority.

Please cancel an allocated night by 2 p.m. on the day you will not use it. The office will offer the space to someone on the waiting list. We will record repeated failures to cancel, but no fine will be issued during the trial. A resident who arrives after 9 p.m. may still use an allocated space if it is empty; the allocation itself is not automatically cancelled. Do not park in the charging spaces without an allocation, even if neither charger appears to be in use.

At the end of the trial, the board will review usage records and residents’ comments before deciding whether to continue, change or stop the arrangement. The trial is not a promise that permanent chargers will be installed.

From: Priya Shah <priya@example.com>
To: Building Office
Subject: Re: Charging spaces

I already have a permit. I need to charge next Tuesday and Wednesday. I can send my request on Thursday morning. I may not know until Tuesday afternoon whether I need the Tuesday space. If the board decides against permanent chargers, I would still like to know what evidence led to that decision.`,reply:`Hello Priya,

Please send your request before [6]. You can request both nights, although [7]. If you do not need Tuesday’s allocated space, let us know by 2 p.m. that day so we can offer it to someone else. After the trial, the board will consider [8] before making a decision.

Building Office`,questions:[
 ['What does a charging permit allow a resident to do?',['Join the booking list without a guaranteed space','Use either charger whenever it is unoccupied','Hold one space for three consecutive nights','Park in visitor spaces after 8 a.m.'],'The permit allows a booking request, not a guaranteed allocation.'],
 ['What determines priority when too many residents request one night?',['Recent allocations, then a draw if necessary','The time each Thursday request was submitted','The date each vehicle was registered','Whether a resident needs two consecutive nights'],'Fewer charging nights in the prior two weeks take priority; ties use a draw.'],
 ['What happens if an allocated resident arrives at 9:15 p.m.?',['They may use the empty space because the allocation remains valid','Their allocation has been automatically cancelled','They may park only if the waiting list is empty','They must pay a late-arrival charge'],'Arriving after 9 p.m. does not automatically cancel an allocation.'],
 ['Why does the office request cancellations by 2 p.m.?',['To offer the space to a resident on the waiting list','To free the space for visitors until the following morning','To calculate a fine before the office closes','To allow an early Thursday request to take priority'],'A released allocation can be offered to someone on the waiting list.'],
 ['Which statement about the trial outcome is supported?',['The board may stop or change the arrangement after reviewing records and comments','Permanent chargers will be installed if both spaces are used each night','The board has already approved a six-month extension','The trial automatically becomes permanent if no one complains'],'The board will review usage and comments and then decide whether to continue, change or stop.'],
 ['Complete blank [6].',['noon on Thursday','5 p.m. on Friday','2 p.m. on Tuesday','6 p.m. on Monday'],'Requests for the following week close at noon each Thursday.'],
 ['Complete blank [7].',['neither is guaranteed until allocations are emailed','Tuesday takes priority because it comes first','Wednesday must be requested in a separate week','your permit already reserves both spaces'],'Two nights may be requested, but a permit does not guarantee either allocation.'],
 ['Complete blank [8].',['usage records and residents’ comments','only the total number of permits issued','a final invoice for every allocated resident','the dates residents first contacted the office'],'The board reviews usage records and resident comments.']
 ]},
 {id:'ultimate-1',part:2,title:'Ultimate · bloque 2 · Workshop schedule',minutes:9,passage:`Riverside Skills Hub offers Saturday repair workshops in November. Registration closes at 4 p.m. on the Wednesday before each workshop. Participants may attend one workshop per Saturday. A wait-list place is not a confirmed registration. People on the wait-list will be contacted by Thursday evening if a place opens. A participant may switch workshops only if the hub confirms a place in the second one; withdrawing from the first workshop does not create priority for the second.

For sessions marked “materials included,” bring only the item you intend to repair. For “bring kit,” use the hub’s checklist before registering; a limited number of loan kits can be reserved at registration. The hub can lend tools during any session, but it cannot supply a replacement part that a participant’s item needs.`,table:{headers:['Saturday','Workshop','Time','Spaces left','Materials'],rows:[['Nov 9','Bicycle brakes','9:00–11:00','0 · wait-list','Bring kit'],['Nov 9','Small appliances','12:00–14:00','3','Materials included'],['Nov 16','Bicycle brakes','12:00–14:00','2','Bring kit'],['Nov 16','Clothing repairs','9:00–11:00','4','Materials included'],['Nov 23','Small appliances','9:00–11:00','1','Materials included'],['Nov 23','Clothing repairs','12:00–14:00','0 · wait-list','Materials included']]},reply:`Hi Leo,

You can still register for the Nov 16 bicycle-brakes session if the listed spaces remain when we process your form. Please [6] when you register if you need one of our limited loan kits. The Nov 9 bicycle-brakes session currently has [7], so joining its wait-list would not confirm a place. If you prefer a different workshop after registering, keep your existing place until [8].

Riverside Skills Hub`,questions:[
 ['Leo can attend only after 11 a.m. on Nov 16. Which available workshop fits?',['Bicycle brakes on Nov 16','Clothing repairs on Nov 16','Small appliances on Nov 9','Bicycle brakes on Nov 9'],'The Nov 16 bicycle session runs 12–14 and has two spaces.'],
 ['What does a place on the Nov 9 bicycle wait-list mean?',['The hub may offer a place if one opens by Thursday evening','A place is reserved as soon as the form is sent','The participant can attend by bringing a personal kit','The participant can transfer automatically to Nov 16'],'A wait-list entry is not a confirmed registration.'],
 ['Which pair of workshops are on the same Saturday but at different times?',['Nov 16 clothing repairs and bicycle brakes','Nov 9 bicycle brakes and Nov 16 bicycle brakes','Nov 23 clothing repairs and Nov 16 clothing repairs','Nov 9 small appliances and Nov 23 small appliances'],'The two Nov 16 sessions are 9–11 and 12–14.'],
 ['A participant has no kit for bicycle brakes. What can they do?',['Reserve a limited loan kit during registration','Assume materials are included for that workshop','Borrow a replacement brake part from the hub','Wait until arrival to guarantee a loan kit'],'The bicycle workshop is bring-kit; limited loan kits must be reserved at registration.'],
 ['What is required before someone gives up a confirmed place to switch?',['Confirmation of a place in the second workshop','A wait-list number for the second workshop','Completion of the first workshop’s checklist','Payment for the replacement materials'],'A switch requires the hub to confirm a place in the second workshop.'],
 ['Complete blank [6].',['reserve a loan kit','bring a replacement brake part from our store','move to the Nov 9 wait-list','withdraw from another workshop first'],'Loan kits can be reserved during registration.'],
 ['Complete blank [7].',['no confirmed spaces left','three confirmed spaces left','one confirmed space left','a guaranteed loan kit for everyone'],'The Nov 9 bicycle session has zero spaces and a wait-list.'],
 ['Complete blank [8].',['we confirm your place in the new one','the Wednesday deadline has passed','a wait-list email arrives on Thursday','you return a borrowed tool'],'The hub requires confirmation of the new place before a switch.']
 ]},
 {id:'ultimate-2',part:3,title:'Ultimate · bloque 3 · Shoreline path',minutes:10,passage:`A
The city plans to reopen the east section of its shoreline path in stages. The first stage will restore a short section between the bus stop and the lookout. The steep western approach will remain closed while engineers assess the supporting slope. Signs at the bus stop will show the open section; a continuous route along the entire shore is not expected in the first stage.

B
Residents who use mobility aids asked why the initial plan showed a new bench but no firm surface leading to it. The project team changed the drawing so the bench can be reached from the paved path. The change does not make the western slope accessible, since that slope remains outside the first stage. The team says accessibility comments will be considered again when a design for the western approach is prepared.

C
Some shop owners worried that construction would remove the only loading space behind their buildings. The contractor will temporarily narrow that space during weekday mornings, but deliveries will still be possible through a marked entrance. The city rejected a suggestion to reroute delivery vehicles across the public lookout because it would create a conflict with people using the reopened path.

D
The city will count visitors at two entrances and ask a sample of users how they arrived. Staff want to know whether the reopened section attracts both nearby residents and people arriving by transit. A high total alone could conceal very uneven access. The evaluation will also record maintenance calls after heavy rain. Officials have not set a target number of visitors or announced when the western approach will reopen.`,questions:[
 ['Which paragraph describes a design change that improves access to a feature without resolving access to the entire route?', 'B'],
 ['Which paragraph specifies the target date for reopening the western approach?', 'E'],
 ['Which paragraph explains why a proposed delivery route was refused?', 'C'],
 ['Which paragraph states that the first opening will not create a continuous shoreline route?', 'A'],
 ['Which paragraph says overall visitor totals might hide unequal use?', 'D'],
 ['Which paragraph says a limited period of construction will affect loading but not eliminate deliveries?', 'C'],
 ['Which paragraph describes a second opportunity for accessibility feedback at a later design stage?', 'B'],
 ['Which paragraph identifies weather-related maintenance as part of the evaluation?', 'D'],
 ['Which paragraph says wayfinding information will be displayed where transit users arrive?', 'A']
 ]},
 {id:'ultimate-3',part:4,title:'Ultimate · bloque 4 · School bus stop',minutes:13,passage:`The school board is considering moving the Cedar Avenue bus stop from the library entrance to a location outside the recreation centre, about 350 metres away. The change would shorten the bus loop and could reduce late arrivals. A four-week trial would begin in January if the board approves it. The board has asked families to comment before making a decision.

Letter from parent Rosa Kim:
I understand the goal, but “shorter loop” does not necessarily mean an easier trip for every child. My daughter walks from the north side of Cedar Avenue. The library stop is beside a signalized crossing; reaching the proposed stop would require her to cross a side street without one. I would support a trial if the board first measures the new walking route and arranges a crossing supervisor during the busiest morning period. I do not oppose moving the stop in principle, but I would not call the proposal ready as written.

Letter from parent Daniel Ward:
The current stop causes the bus to circle the library block just as morning traffic peaks. Last winter, that detour made our bus late several times. The recreation centre has a covered waiting area, which would be welcome in January. I favour the proposed trial, provided the board publishes both punctuality and safety observations. If there is a crossing problem, the trial should be adjusted or ended rather than defended simply because it saves time.

Board note:
The board has not approved either a supervisor or the trial. It will compare the existing and proposed walking routes, consult the city about crossings, and publish a decision next month. During any trial, bus arrival times and reported crossing incidents would be recorded separately.`,reply:`Dear Board,

I share the hope that the bus will arrive more reliably. Still, the evidence about the new walking route is incomplete. Rosa’s concern is [6], while Daniel’s support depends on [7]. Before approving a trial, please complete the route comparison and city consultation already promised. If the trial proceeds, report the two measures separately so that [8].

A parent`,questions:[
 ['What is Rosa’s position on moving the stop?',['She could support a trial after route and crossing safeguards are addressed','She rejects any move regardless of route changes','She supports an immediate permanent relocation','She believes punctuality should be the only measure'],'Rosa does not oppose a move in principle but wants the route measured and a supervisor.'],
 ['What benefit does Daniel expect from the proposed location?',['A covered place to wait during a winter trial','A shorter walk for every student','A signalized crossing at the recreation centre','A guaranteed supervisor at the new stop'],'Daniel mentions the recreation centre’s covered waiting area.'],
 ['What do Rosa and Daniel both want the board to consider?',['Safety as well as bus performance','Only the distance between the two stops','Whether the library can extend its opening hours','A permanent stop before any trial'],'Both make safety a condition of evaluating the move.'],
 ['Which action has the board already committed to before its decision?',['Comparing walking routes and consulting the city about crossings','Assigning a crossing supervisor at the proposed stop','Starting the trial before January','Moving the stop permanently next month'],'The board note promises a route comparison and city consultation.'],
 ['Why would punctuality data alone be insufficient in Daniel’s view?',['A time saving should not excuse an unsafe crossing','The bus loop cannot be measured reliably','The covered waiting area is more important than safety','Winter weather makes all safety reports unusable'],'Daniel says a crossing problem should change or end the trial even if it saves time.'],
 ['Complete blank [6].',['the unsignalized side-street crossing on her daughter’s route','the lack of cover at the library entrance','the recreation centre’s opening hours','the bus’s inability to circle the library block'],'Rosa identifies the unsignalized side-street crossing.'],
 ['Complete blank [7].',['publishing punctuality and safety observations and acting on problems','making the new stop permanent before winter','removing the library crossing signal','reducing the comment period to one week'],'Daniel supports a trial if data include both punctuality and safety, with changes if needed.'],
 ['Complete blank [8].',['a shorter journey is not mistaken for a safer one','the trial can continue without comments from families','the proposed stop receives more buses than the library','the board can avoid recording crossing incidents'],'Separate measures keep punctuality and safety distinct.']
 ]},
 {id:'ultimate-4',part:3,title:'Ultimate · bloque 5 · Library evening access',minutes:10,passage:`A
The Northside Library will pilot two extra evening hours on Thursdays for eight weeks. The building will stay open until 9 p.m., but the staffed information desk will close at its usual 7 p.m. Self-service borrowing and returns will continue during the extra hours. Visitors may use the study tables, though the meeting rooms will not be available because those require staff supervision.

B
Before the pilot, library staff asked students and shift workers when the current hours were most inconvenient. Most respondents wanted at least one later weekday rather than longer Sunday hours. The library chose Thursday because a nearby transit route already runs frequently that evening. Staff cautioned that a survey of current users might miss people who stopped visiting because the hours never suited them.

C
The extra hours will require a security attendant, separate from the library staff. The attendant can direct visitors to exits and respond to building concerns, but cannot answer research questions, issue new library cards or override borrowing restrictions. A printed notice near the entrance and the library’s website will list which services are unavailable after 7 p.m.

D
During the pilot, the library will count visits after 7 p.m. and record self-service transactions. It will also invite comments from evening visitors and from people who still cannot attend. The manager says a busy first week would be encouraging but insufficient evidence of lasting demand. A decision about continuing the hours will consider costs, sustained use and whose needs the schedule meets. No threshold number of visits has been set.`,questions:[
 ['Which paragraph explains that the later closing time does not extend every library service?', 'A'],
 ['Which paragraph identifies a possible blind spot in feedback collected from existing users?', 'B'],
 ['Which paragraph states the minimum number of evening visits required to keep the pilot?', 'E'],
 ['Which paragraph distinguishes the attendant’s building role from librarians’ service role?', 'C'],
 ['Which paragraph says the choice of weekday was influenced by transit frequency?', 'B'],
 ['Which paragraph warns against treating the first week’s popularity as proof of lasting demand?', 'D'],
 ['Which paragraph says meeting rooms remain unavailable during the extra hours?', 'A'],
 ['Which paragraph says visitors will be told in advance about unavailable after-hours services?', 'C'],
 ['Which paragraph describes how feedback will include people unable to use even the new hours?', 'D']
 ]}
];
const REPAIRED_ORIGINAL_V2=[
 {id:'original-26',part:3,title:'Ejercicio 27 · Part 3 · Student aid application',minutes:10,passage:`A
At Lakeview College, students who intend to apply for public student aid are advised to check the province’s eligibility rules before choosing a course load. The college can explain its own full-time and part-time enrolment categories, but the province decides whether a student qualifies for aid. An estimate from the college is therefore useful for planning, not a promise of funding.

B
The online aid form asks applicants to enter tuition and other expected costs. The college’s fee estimate is updated after registration changes, so a student who switches programs should check it again before submitting the form. An aid assessment may include living costs as well as tuition. The assessed amount does not necessarily arrive all at once; the province’s payment schedule is shown in the student’s account after approval.

C
Applicants can upload supporting documents before the form deadline, but an unreadable upload will be rejected. The portal then displays a request for a clearer copy. Submitting a replacement does not move the original deadline. The aid office recommends checking the account regularly, since an email alert may be delayed or filtered. Staff can confirm whether a document is marked received but cannot approve it on the province’s behalf.

D
A student whose income changes substantially after applying may request a reassessment. The request requires an explanation and supporting information; it does not automatically change the award. Students who think the assessment contains an error may also ask for a review, but they should not assume that a review pauses any existing payment obligation. The aid office can explain where to submit these requests, while the province makes the final decision.`,questions:[
 ['Which paragraph distinguishes college enrolment guidance from the province’s funding decision?','A'],
 ['Which paragraph warns that submitting a clearer document does not extend a deadline?','C'],
 ['Which paragraph explains why changing programs may require updating an estimate?','B'],
 ['Which paragraph gives a guaranteed number of days for approval after all documents are received?','E'],
 ['Which paragraph says a changed income can lead to a request but not an automatic new award?','D'],
 ['Which paragraph notes that a total assessment may be paid in instalments?','B'],
 ['Which paragraph advises checking the account even if an email notice is expected?','C'],
 ['Which paragraph cautions against assuming that a review suspends payment duties?','D'],
 ['Which paragraph describes a planning estimate that should not be treated as a funding promise?','A']
 ]}
];
