'use strict';

let pxSeed=0;
const px=(text,correct,distractors,evidence,group=1)=>{
  const source=[correct,...distractors],shift=(pxSeed++*3+text.length)%4,options=source.slice(shift).concat(source.slice(0,shift));
  return {text,options,answer:options.indexOf(correct),evidence,why:options.map((_,i)=>i===options.indexOf(correct)?'':'Esta alternativa cambia una condición, exagera el alcance o no responde exactamente a la pregunta.'),group};
};
const pp=(text,letter,evidence)=>{const options=['A','B','C','D','E — Not stated'];return {text,options,answer:'ABCDE'.indexOf(letter),evidence,why:options.map(()=>''),group:1};};

const PACK_4=[
 {id:'pack-4-part-1',part:1,title:'Pack 4 · Part 1',minutes:11,source:'pack',passage:`From: Westhaven Property Office
To: Residents of Towers 1 and 2
Subject: Balcony inspection and coating work

The exterior balconies will be inspected and recoated from August 12 to 14. Residents must remove furniture, planters and floor coverings by 7 p.m. August 11. Items left outside may be moved into the service corridor, but the contractor will not be responsible for damage to fragile plants or for identifying which unit an unlabelled item belongs to.

Work is scheduled between 8 a.m. and 4 p.m. The crew will normally enter balconies from the exterior lift, so residents do not need to remain home. Interior access is required only when a resident has already reported damage around a balcony door or window. Those residents will receive a separate appointment window by email. A general inspection notice is not an appointment and does not authorize entry into the unit.

Keep balcony doors and windows closed while the crew is working on your side of the building. Pets should be kept away from the balcony area because equipment may pass close to the glass. The coating may have a mild odour for several hours, but residents are not required to leave their units.

Rain could move unfinished work to Friday, August 15. If that becomes necessary, the office will send an update by 3 p.m. Thursday. The indoor parking garage and main entrances will remain open throughout the project. Requests for rent reductions will not be considered because access to the apartments is maintained.

From: Martin Cole
To: Westhaven Property Office
Subject: Re: Balcony inspection

I am in Tower 2 and have two large planters. I also reported water damage beside my balcony door last month. I will be at work during the day. Please confirm whether I must arrange to be home and when I will know if Friday work is required.`,reply:`Hello Martin,

Please remove the planters by [7]. Because you previously reported damage beside the door, [8]. The general notice alone [9]. You will not need to leave the apartment because of the coating, although [10]. If rain extends the project, we will notify residents [11].

Property Office`,questions:[
  px('What may happen to an unlabelled item left on a balcony?','It may be moved without the contractor knowing its owner.',['It will be discarded automatically.','It will remain protected in the apartment.','It guarantees an individual appointment.'],'Items may be moved to the corridor, and unlabelled ownership is not guaranteed.'),
  px('When is interior access normally required?','When previously reported door or window damage must be inspected.',['For every balcony in both towers.','Whenever a resident is absent during work.','Only when rain delays exterior work.'],'The crew normally works from outside; reported damage creates the exception.'),
  px('What does the general inspection notice authorize?','Exterior work, but not entry into an apartment.',['Unscheduled interior entry.','Removal of pets from the unit.','A rent reduction for three days.'],'The notice is explicitly not an appointment or authorization for entry.'),
  px('What should residents do while work is on their side?','Keep balcony doors and windows closed.',['Leave the building for several hours.','Move vehicles out of the garage.','Open windows to remove the coating odour.'],'The notice directs residents to close doors and windows.'),
  px('What remains available during the project?','The parking garage and main entrances.',['Every balcony at all times.','The service corridor for personal storage.','A guaranteed Friday work crew.'],'The garage and entrances remain open.'),
  px('What determines whether work continues Friday?','Whether rain leaves work unfinished.',['The number of residents requesting appointments.','Whether the garage must close.','The strength of the coating odour.'],'Friday is a weather contingency for unfinished work.'),
  px('Complete blank [7].','7 p.m. August 11',['8 a.m. August 12','3 p.m. August 14','4 p.m. August 15'],'That is the deadline for clearing balconies.',2),
  px('Complete blank [8].','you should receive a separate appointment window',['the crew will never need interior access','you qualify automatically for reduced rent','the exterior notice gives entry permission'],'Reported damage triggers a separate emailed appointment.',2),
  px('Complete blank [9].','does not authorize entry into your unit',['confirms that you must remain home','protects fragile plants from damage','means Friday work is certain'],'The general notice is not interior-entry authorization.',2),
  px('Complete blank [10].','you should keep pets away from the balcony area',['you must move your car from the garage','you should open the balcony door','you must collect equipment from the corridor'],'Pets must remain away from the working area.',2),
  px('Complete blank [11].','by 3 p.m. Thursday',['after work begins Friday','at 7 p.m. August 11','only through individual appointments'],'The weather update deadline is Thursday at 3 p.m.',2)
 ]},
 {id:'pack-4-part-2',part:2,title:'Pack 4 · Part 2',minutes:9,source:'pack',passage:`The Greenfield Recreation Centre offers weekday evening classes in September. Registration closes at noon two business days before a class begins. “Drop-in” spaces are released one hour before class only when the registration list is not full. Being on a wait-list does not guarantee entry.

Participants in equipment-required classes may reserve centre equipment during registration. A reservation covers equipment, not clothing or footwear. Anyone transferring classes must receive confirmation before giving up the original place.`,table:{headers:['Class','Day','Time','Level','Equipment','Spaces'],rows:[['Indoor cycling','Monday','18:00','Beginner','Bike included','0 · wait-list'],['Indoor cycling','Wednesday','20:00','Intermediate','Bike included','3'],['Pickleball','Tuesday','19:00','Beginner','Paddle reservable','2'],['Pickleball','Thursday','18:00','Intermediate','Bring paddle','0 · wait-list'],['Yoga','Wednesday','18:00','All levels','Bring mat','4'],['Yoga','Thursday','20:00','Beginner','Mat reservable','1']]},reply:`Hi Noor,

The available beginner pickleball class is [6]. If you need a paddle, [7]. Your Monday cycling wait-list place is not confirmed, so do not cancel another booking unless [8].

Greenfield Recreation`,questions:[
  px('Which available class suits a beginner who can attend only after 7:30 p.m.?','Thursday beginner yoga at 20:00',['Tuesday beginner pickleball at 19:00','Wednesday all-level yoga at 18:00','Wednesday intermediate cycling at 20:00'],'Only Thursday yoga is beginner, available and later than 7:30.'),
  px('What may happen one hour before an unfilled class?','Unreserved places may be offered as drop-ins.',['Every wait-listed person becomes registered.','Registration reopens for two business days.','Equipment reservations are cancelled.'],'Drop-ins are released only if the list is not full.'),
  px('Which available class includes its main equipment automatically?','Wednesday indoor cycling',['Tuesday pickleball','Wednesday yoga','Thursday yoga'],'The cycling listing says the bike is included.'),
  px('What does reserving centre equipment not provide?','Required clothing or footwear.',['The class place itself.','Use of the listed equipment.','Confirmation of the reservation.'],'The policy expressly excludes clothing and footwear.'),
  px('What should someone do before abandoning a class to transfer?','Wait for confirmation of the new place.',['Join any wait-list without registering.','Arrive one hour early as a drop-in.','Return all personal footwear.'],'A transfer requires confirmation first.'),
  px('Complete blank [6].','Tuesday at 19:00',['Thursday at 18:00','Monday at 18:00','Wednesday at 20:00'],'The Tuesday beginner session has two spaces.',2),
  px('Complete blank [7].','reserve one during registration',['assume it is included automatically','join the Thursday wait-list','bring a yoga mat instead'],'Paddles are reservable for Tuesday pickleball.',2),
  px('Complete blank [8].','the centre confirms the other place',['the wait-list appears online','registration closes at noon','a drop-in arrives early'],'The original place should be kept until a transfer is confirmed.',2)
 ]},
 {id:'pack-4-part-3',part:3,title:'Pack 4 · Part 3',minutes:10,source:'pack',passage:`A
The city’s home water program offers rebates for replacing high-flow toilets and for installing approved rain barrels. Applicants must own the property or provide the owner’s signed consent. Tenants may submit the form, but reimbursement is issued to the person named on the purchase receipt. Approval is not automatic simply because a product is advertised as water-efficient.

B
Applicants should check the approved-product list before purchasing. The list is updated during the year, and a model removed after purchase remains eligible if it appeared on the list on the receipt date. A screenshot or printed copy of the dated listing may be requested. Installation labour is not included in the rebate calculation.

C
Applications must be received within sixty days of purchase. A missing receipt can be replaced by a duplicate from the retailer, but a bank statement alone does not identify the model purchased. If information is missing, the city sends one request for clarification. The original sixty-day deadline still applies, so submitting an incomplete form on the last day may leave no time to correct it.

D
The city will evaluate the program using both the number of approved applications and estimated water savings. A large number of inexpensive installations does not necessarily produce the greatest reduction in use. Officials will also compare participation among neighbourhoods. No neighbourhood quota has been established, and unspent funds are not reserved automatically for the following year.`,questions:[
  pp('Which paragraph explains that the recipient of the payment depends on purchase documentation?','A','Paragraph A says reimbursement goes to the person on the receipt.'),
  pp('Which paragraph protects eligibility when an approved model is later removed from a list?','B','Paragraph B uses the product’s status on the receipt date.'),
  pp('Which paragraph gives the percentage of labour costs covered by the rebate?','E','No labour percentage is given; labour is excluded.'),
  pp('Which paragraph warns that an on-time but incomplete submission may still fail?','C','The deadline does not extend for clarification.'),
  pp('Which paragraph says product marketing alone does not establish eligibility?','A','Advertising as efficient does not guarantee approval.'),
  pp('Which paragraph distinguishes the number of installations from their likely effect?','D','Paragraph D separates application count from water savings.'),
  pp('Which paragraph identifies evidence that may show a model was approved on an earlier date?','B','A dated screenshot or printout may be requested.'),
  pp('Which paragraph explains why one financial record is insufficient to replace a receipt?','C','A bank statement does not identify the model.'),
  pp('Which paragraph guarantees that unused money will carry into next year?','E','Paragraph D says the opposite; no guarantee appears.')
 ]},
 {id:'pack-4-part-4',part:4,title:'Pack 4 · Part 4',minutes:13,source:'pack',passage:`A regional agency is considering allowing eligible employees to work from home up to three days a week instead of the current maximum of two. Eligibility would continue to depend on job duties and satisfactory performance. Teams would designate two common office days. The proposal is a six-month pilot, not a permanent entitlement.

Manager Sofia Grant supports testing a third remote day because her analysts already collaborate across several locations. She argues that attendance should be tied to tasks requiring physical presence rather than to a fixed preference for the office. However, she wants teams to publish response-time standards so that remote work does not make colleagues guess when help is available. She would judge the pilot through project delivery, service response and employee retention, not through office occupancy alone.

Union representative Malik Reed welcomes the proposal but questions the phrase “satisfactory performance.” If managers apply it differently, access could depend more on a supervisor than on the job. He wants written eligibility criteria and an appeal route. Reed accepts common office days when teams need them, provided those days are announced far enough ahead for employees with caregiving or transportation arrangements.

Operations director Claire Wu is concerned about space planning. The agency has already reduced leased space on the assumption that attendance is spread across the week. Two common days for every team could create crowding even while desks sit empty on other days. She recommends that departments coordinate their common days and record occasions when employees cannot find appropriate space. Wu does not oppose the pilot, but says a popular policy is unsustainable if facilities cannot support it.

The executive committee has asked staff to draft eligibility, scheduling and evaluation rules. It has not approved the pilot.`,reply:`Dear Committee,

All three viewpoints leave room for a pilot, but each identifies a condition. Sofia wants remote access connected to work outcomes while ensuring [6]. Malik’s concern is that [7]. Claire shows why [8]. Before approval, the agency should [9]. The evaluation should [10].

An employee`,questions:[
  px('What does the proposal offer eligible employees?','A possible third remote day during a six-month pilot.',['A permanent right to work entirely from home.','Two remote days only for managers.','Removal of common office days.'],'The proposal adds up to a third day during a pilot.'),
  px('What do Sofia and Claire both reject as sufficient by itself?','A single simple measure of whether the policy works.',['Any coordination between teams.','Remote work for analysts.','The use of common office days.'],'Sofia rejects occupancy alone; Claire rejects popularity without capacity.'),
  px('What would most directly address Malik’s concern?','Consistent written criteria and an appeal process.',['A report of office occupancy.','Three mandatory common days.','Fewer response-time standards.'],'He explicitly requests criteria and an appeal route.'),
  px('Why does Claire want departments to coordinate office days?','To prevent concentrated attendance from exceeding available space.',['To ensure all desks are occupied every day.','To eliminate the need to record space problems.','To make remote work permanent.'],'Shared days can crowd reduced office space.'),
  px('What has the executive committee approved?','Only further rule drafting, not the pilot itself.',['The permanent three-day policy.','An immediate employee appeal system.','Two common days for every department.'],'It asked for drafts and has not approved the pilot.'),
  px('Complete blank [6].','colleagues know when assistance is available',['office occupancy remains the only measure','all analysts attend three fixed days','response standards are removed'],'Sofia wants published response-time standards.',2),
  px('Complete blank [7].','a vague performance condition could be applied unevenly',['common days are never useful','leased space should be increased immediately','project delivery cannot be measured'],'Malik worries about inconsistent managerial judgment.',2),
  px('Complete blank [8].','common days can create crowding despite low weekly occupancy',['remote work always requires more office space','popular policies automatically become permanent','empty desks prove that facilities are sufficient'],'Claire distinguishes weekly averages from peak demand.',2),
  px('Complete blank [9].','define eligibility and coordinate scheduling rules',['guarantee every applicant three remote days','judge the pilot only by retention','end the current two-day policy immediately'],'Those are the unresolved conditions across viewpoints.',2),
  px('Complete blank [10].','combine service, work and workplace-capacity evidence',['rely solely on employee popularity','exclude occasions when space is unavailable','treat office occupancy as project performance'],'The viewpoints identify several distinct outcomes.',2)
 ]}
];

const PACK_5=[
 {id:'pack-5-part-1',part:1,title:'Pack 5 · Part 1',minutes:11,source:'pack',passage:`From: Cedar Park Garden Committee
To: Plot holders
Subject: Spring plot renewal and shared beds

Current plot holders may renew for the coming season until February 20. Payment alone does not complete renewal: the online form and fee must both arrive by the deadline. After February 20, unrenewed plots are offered to people on the wait-list. A former holder may join that list but will not retain priority over new applicants.

Gardeners may keep one standard plot per household. A household currently using two half-plots may request to combine them, but approval depends on the layout after renewals. Do not plant across the border between half-plots until written approval is received. The committee cannot guarantee that neighbouring plots will remain together.

This year, two raised shared beds are reserved for gardeners who cannot work at ground level. These are cooperative spaces, not private plots. Participants will agree on planting and watering at an orientation on March 16. Someone who already holds a standard plot may participate only if space remains after applicants without another accessible option are placed.

All renewed plots must show initial preparation by May 10. Mulching, soil preparation or planted crops each count. A plot that still appears unused will receive a seven-day notice before it is reassigned. Temporary illness or travel should be reported before the deadline; notification does not guarantee an unlimited extension, but the committee will consider a practical plan.

From: Avery Chen
To: Garden Committee
Subject: Renewal and raised bed

My household currently uses two adjacent half-plots. I paid the renewal fee yesterday but have not submitted the form. My mother, who cannot garden at ground level, would like to join a raised bed with me. We will be away until May 8.`,reply:`Hello Avery,

To renew, submit the form by [7]; payment alone is insufficient. Combining your half-plots [8], so wait before planting across the border. Your mother may apply for a shared raised bed, where participants [9]. Because you already hold plots, your participation [10]. Your return date is before the preparation deadline, which is [11].

Garden Committee`,questions:[
  px('What happens to a plot not fully renewed by the deadline?','It may be offered to someone on the wait-list.',['It remains reserved after payment alone.','It is automatically converted to two half-plots.','It gives the former holder permanent priority.'],'Both form and fee are required by February 20.'),
  px('When may a household plant across two half-plots?','After written approval to combine them.',['As soon as the renewal fee is paid.','Only after the May preparation notice.','Whenever both plots were adjacent last year.'],'The text says to wait for written approval.'),
  px('What distinguishes the raised beds from standard plots?','Participants share decisions and work in cooperative spaces.',['They are assigned permanently to one household.','They do not require any watering plan.','They are available only to existing plot holders.'],'The beds are cooperative and planned at orientation.'),
  px('Who receives priority for the accessible shared beds?','Applicants without another accessible gardening option.',['Households already holding two plots.','Former holders returning from the wait-list.','Anyone who pays before February 20.'],'Existing standard-plot holders participate only after those applicants.'),
  px('What occurs before an apparently unused plot is reassigned?','The holder receives seven days’ notice.',['The plot is reassigned on May 10 immediately.','The fee is returned automatically.','A neighbouring gardener takes it without notice.'],'A seven-day notice precedes reassignment.'),
  px('How does advance notice of illness or travel help?','It allows the committee to consider a practical plan.',['It guarantees an unlimited extension.','It removes the preparation requirement.','It preserves two plots for the next season.'],'Notification invites consideration but is not an unlimited guarantee.'),
  px('Complete blank [7].','February 20',['March 16','May 8','May 10'],'The form and payment deadline is February 20.',2),
  px('Complete blank [8].','depends on written approval after the layout is known',['is guaranteed because they are adjacent','requires joining the wait-list again','happens automatically after payment'],'Combination depends on the post-renewal layout and approval.',2),
  px('Complete blank [9].','agree together on planting and watering',['receive separate private sections','avoid attending the orientation','have priority over applicants without plots'],'Shared-bed decisions are cooperative.',2),
  px('Complete blank [10].','depends on space remaining after priority applicants',['is guaranteed by the existing renewal','requires surrendering both half-plots immediately','begins before the March orientation'],'Existing plot holders have lower priority.',2),
  px('Complete blank [11].','May 10',['February 20','March 16','May 8'],'Initial preparation must appear by May 10.',2)
 ]},
 {id:'pack-5-part-2',part:2,title:'Pack 5 · Part 2',minutes:9,source:'pack',passage:`Harbour Link operates passenger boats and connecting shuttles on summer weekends. Boat tickets do not reserve shuttle seats. Shuttle reservations close at 6 p.m. the day before travel; unclaimed reserved seats are released five minutes before departure. Bicycles require a boat bicycle add-on and are not accepted on the small North Point shuttle.

“Weather check” sailings are confirmed or cancelled on the website ninety minutes before departure. A cancelled boat ticket may be transferred or refunded, but a passenger who chooses not to travel after a sailing is confirmed receives the normal fare conditions.`,table:{headers:['Route','Departure','Arrival','Status','Connection'],rows:[['Central–Island','08:00','08:45','Confirmed','Island shuttle 09:00'],['Central–Island','11:30','12:15','Weather check','Island shuttle 12:30'],['Island–Central','16:00','16:45','Confirmed','Central station shuttle 17:00'],['Central–North Point','09:15','10:05','Confirmed','Small shuttle 10:15'],['North Point–Central','14:30','15:20','Weather check','No shuttle'],['Island–Central','19:00','19:45','Confirmed','No shuttle']]},reply:`Hi Sam,

For the 11:30 Island trip, check the website [6]. A boat ticket does not reserve the 12:30 shuttle, so reserve it [7]. If you bring a bicycle to North Point, remember that [8].

Harbour Link`,questions:[
  px('Which trip reaches Central in time for the 17:00 station shuttle?','The 16:00 Island–Central sailing.',['The 14:30 North Point sailing.','The 19:00 Island sailing.','The 11:30 Central sailing.'],'It arrives 16:45 and lists that connection.'),
  px('What happens to a reserved shuttle seat not claimed on time?','It may be released five minutes before departure.',['It remains empty for the whole trip.','It transfers to the next boat automatically.','It becomes a bicycle space.'],'The reservation release rule is explicit.'),
  px('Which confirmed outward trip cannot carry a bicycle onto its connecting shuttle?','Central–North Point at 09:15.',['Central–Island at 08:00.','Island–Central at 16:00.','Island–Central at 19:00.'],'The small North Point shuttle does not accept bicycles.'),
  px('When is a weather-check sailing decided?','Ninety minutes before departure.',['At 6 p.m. the previous day.','Five minutes before departure.','After passengers board the shuttle.'],'The website posts the decision ninety minutes before.'),
  px('When does cancellation create a transfer or refund option?','When Harbour Link cancels the sailing.',['Whenever a passenger changes plans.','When a shuttle reservation is missed.','Whenever a confirmed sailing has poor weather.'],'The special option applies to a cancelled boat.'),
  px('Complete blank [6].','ninety minutes before departure',['at 6 p.m. the previous day','after the 12:30 shuttle leaves','five minutes before boarding'],'That is the published confirmation time.',2),
  px('Complete blank [7].','by 6 p.m. the day before',['with the boat ticket automatically','five minutes after departure','only if the sailing is cancelled'],'Shuttle reservations close at 6 p.m. the prior day.',2),
  px('Complete blank [8].','the small connecting shuttle cannot take it',['no boat bicycle add-on is needed','all shuttles guarantee bicycle space','weather-check sailings prohibit bicycles'],'The North Point shuttle excludes bicycles.',2)
 ]},
 {id:'pack-5-part-3',part:3,title:'Pack 5 · Part 3',minutes:10,source:'pack',passage:`A
Meadow Clinic opens routine appointments online at 7 a.m. fourteen days in advance. Telephone staff see the same inventory; calling does not provide access to a separate supply. A small number of urgent same-day appointments are released after nurse assessment and cannot be booked directly through the portal.

B
Patients may join one cancellation list for each type of service. The list records acceptable times, but it is not a queue with a guaranteed order. Staff offer a cancellation to a patient whose stated availability and clinical needs match the opening. If the patient does not answer, staff may contact another person immediately rather than hold the place.

C
Virtual appointments are available only where an examination or in-person test is not expected. A patient may request virtual service, but the clinician can change it to in-person after reviewing the reason for the visit. Conversely, an appointment originally booked in person may sometimes move online. The appointment time can remain the same even when the format changes.

D
The clinic tracks how long patients wait for several services, but a monthly average does not show every experience. A few very long waits may coexist with many short ones, and patients who abandon a request are not currently included. The clinic plans to publish both median waits and the number of unfilled requests. It has not promised a maximum waiting time.`,questions:[
  pp('Which paragraph explains why phoning does not reveal additional routine appointments?','A','Phone and portal use the same inventory.'),
  pp('Which paragraph says position on a list does not alone determine who receives an opening?','B','Matching availability and needs matter; it is not a guaranteed queue.'),
  pp('Which paragraph guarantees that all requested virtual visits remain virtual?','E','Paragraph C says the clinician may change the format.'),
  pp('Which paragraph explains that changing format need not change the scheduled time?','C','The same time can remain after a format change.'),
  pp('Which paragraph identifies people missing from current waiting-time data?','D','Abandoned requests are not currently counted.'),
  pp('Which paragraph distinguishes bookable routine inventory from assessed urgent access?','A','Urgent slots follow nurse assessment and cannot be booked directly.'),
  pp('Which paragraph explains why staff may not hold a cancellation while awaiting a reply?','B','They may contact someone else immediately if there is no answer.'),
  pp('Which paragraph questions whether an average represents the range of experiences?','D','Long and short waits can be hidden by a monthly average.'),
  pp('Which paragraph states a promised maximum wait for each service?','E','No maximum is promised.')
 ]},
 {id:'pack-5-part-4',part:4,title:'Pack 5 · Part 4',minutes:13,source:'pack',passage:`The town proposes closing one block of King Street to private vehicles from Friday evening through Sunday during a four-month summer pilot. Buses and emergency vehicles would continue through a controlled lane. Restaurants could place tables in part of the roadway, while a marked corridor would remain open for walking and mobility devices.

Restaurant owner Anika Patel supports the pilot because the current sidewalk is too narrow for both tables and comfortable passage. She accepts that businesses should pay a modest permit fee for roadway seating, provided the fee covers practical services such as barriers and weekend cleaning. She opposes assigning space solely by storefront width: a narrow café may depend more heavily on outdoor seating than a large shop. Patel wants published allocation criteria before applications open.

Resident George Lam worries about deliveries and noise. His building’s loading entrance is inside the proposed closure. The draft allows deliveries before 9 a.m., but his home-care equipment sometimes arrives later after regional trips. He asks for a documented exception process rather than informal decisions by staff at the barrier. He also wants noise observations taken late in the evening, not only complaints counted after the pilot.

Transportation engineer Mira Evans says the pilot can test whether the street attracts more visitors without delaying buses. She recommends measuring bus travel time, pedestrian clearance and emergency access separately. A high visitor count would be encouraging but would not show that the accessible corridor remained usable. She also notes that comparing summer weekends with ordinary winter traffic would be misleading.

Council has requested a revised access plan and allocation rules. It will vote next month.`,reply:`Dear Council,

The pilot could improve the street, but the conditions matter. Anika wants the use of public space governed by [6]. George’s delivery example shows why [7]. Mira cautions that [8]. Before voting, council should [9]. If the pilot proceeds, success should [10].

A resident`,questions:[
  px('Which vehicles would retain access through the closed block?','Buses and emergency vehicles.',['All delivery and private vehicles.','Only restaurant vehicles.','No motor vehicles at all.'],'A controlled lane remains for buses and emergency service.'),
  px('What do Anika and George both request?','Clear rules decided before individual situations arise.',['Removal of all permit fees.','A ban on weekend deliveries.','Evaluation based only on complaints.'],'Anika wants allocation criteria; George wants an exception process.'),
  px('What is Anika’s condition for accepting a fee?','It should fund useful pilot services.',['It must be based only on storefront width.','It must exclude barriers and cleaning.','It should apply only to residents.'],'She links a modest fee to barriers and cleaning.'),
  px('Why is the proposed delivery window insufficient for George?','Some necessary regional deliveries may arrive later.',['His entrance is outside the closure.','Home-care equipment arrives only on weekdays.','The barrier staff have already denied every exception.'],'His home-care deliveries may arrive after 9 a.m.'),
  px('Why does Mira recommend separate measures?','Visitor numbers cannot establish accessibility or transport performance.',['Summer and winter traffic are identical.','Bus times reveal every emergency-access issue.','A single complaint count measures corridor width.'],'She distinguishes visitors, buses, clearance and emergency access.'),
  px('Complete blank [6].','published allocation criteria',['storefront width alone','informal barrier decisions','late-evening complaint totals'],'Anika requests criteria before applications.',2),
  px('Complete blank [7].','a formal exception process is needed',['all deliveries should be prohibited','the pilot should run in winter','restaurants should control the barrier'],'George wants documented treatment of necessary later deliveries.',2),
  px('Complete blank [8].','popularity does not prove that access remained workable',['bus travel time is the only useful outcome','winter traffic should be the comparison period','pedestrian clearance cannot be measured'],'Mira rejects using visitor count alone.',2),
  px('Complete blank [9].','finish the revised access and allocation rules',['approve permanent closure immediately','remove the emergency lane','base seating only on business size'],'Those drafts are still pending before the vote.',2),
  px('Complete blank [10].','include access and service performance as well as visitors',['equal the number of restaurant permits','depend only on summer foot traffic','exclude late-evening conditions'],'The viewpoints identify multiple outcomes.',2)
 ]}
];

const PACK_6=[
 {id:'pack-6-part-1',part:1,title:'Pack 6 · Part 1',minutes:11,source:'pack',passage:`From: Northline Insurance Claims
To: Policyholder Rina Bose
Subject: Documentation for water-damage claim

We have opened claim NL-4821 for damage reported after the supply hose under your kitchen sink failed. Opening a claim does not confirm coverage. Please upload photographs of the affected area, the plumber’s report identifying the source, and receipts for emergency work by June 6. Keep damaged removable items until an adjuster confirms in writing that they may be discarded.

You may arrange work needed to stop further damage without waiting for approval. Permanent replacement of cabinets or flooring should not begin before the adjuster’s inspection unless Northline gives written permission. If delay would create a health or safety risk, contact the claims line so the reason and proposed work can be recorded.

Your policy includes a deductible. We do not collect it directly: if the claim is covered, the deductible is subtracted from the amount payable. The emergency plumber’s invoice may be considered with the rest of the claim, but submission does not guarantee full reimbursement.

An adjuster has proposed June 4 between noon and 3 p.m. An adult must provide access, but the policyholder does not personally need to attend. If that window is unsuitable, request another before noon June 2. Changing the inspection does not extend the June 6 document deadline.

From: Rina Bose
To: Northline Insurance
Subject: Re: claim NL-4821

The plumber removed the broken hose and stopped the leak. I have the invoice and photos, but the report will arrive next week. My brother can meet the adjuster June 4. The wet cabinet doors are taking up space, and I would like to dispose of them now.`,reply:`Hello Rina,

Your brother may provide access because [7]. Please keep the cabinet doors until [8]. The emergency repair could be considered, although [9]. Upload the required documents by [10]; moving the inspection would [11].

Northline Claims`,questions:[
  px('What does opening the claim establish?','That Northline has begun reviewing the reported loss.',['That all damage is covered.','That the deductible has been collected.','That permanent replacement is authorized.'],'The notice says opening is not coverage confirmation.'),
  px('Which work may proceed without prior approval?','Work required to stop additional damage.',['All permanent cabinet replacement.','Any upgrade the policyholder prefers.','Disposal of all damaged items.'],'Emergency mitigation may proceed.'),
  px('When may permanent work begin before inspection?','After written permission or when recorded safety circumstances justify it.',['Whenever photographs have been uploaded.','Immediately after the claim opens.','Only after the deductible is paid directly.'],'Permanent work normally waits, with written/safety exceptions.'),
  px('How is the deductible handled on a covered claim?','It is subtracted from the payable amount.',['It is collected before inspection.','It is added to the plumber’s invoice.','It disappears when emergency work occurs.'],'Northline does not collect it directly.'),
  px('What is required for the proposed inspection?', 'An adult who can provide access.',['The policyholder personally.','The emergency plumber.','Payment of every replacement receipt.'],'Any adult may provide access.'),
  px('What remains unchanged if the inspection is rescheduled?','The document deadline.',['The inspection window.','The adjuster assigned in every case.','The amount ultimately covered.'],'The June 6 deadline does not move.'),
  px('Complete blank [7].','the policyholder need not attend personally',['only a contractor can open the unit','coverage has already been confirmed','the deductible was paid'],'An adult may represent her for access.',2),
  px('Complete blank [8].','written disposal permission is received',['the photographs are uploaded','the plumber sends an invoice','the June 4 window begins'],'Items must be retained until written confirmation.',2),
  px('Complete blank [9].','submitting the invoice does not guarantee full reimbursement',['emergency work is never considered','the deductible must be paid to the plumber','coverage was confirmed when the hose failed'],'Consideration is not a reimbursement guarantee.',2),
  px('Complete blank [10].','June 6',['June 2','June 4','after the replacement work'],'The stated upload deadline is June 6.',2),
  px('Complete blank [11].','not extend that deadline',['automatically confirm coverage','permit immediate disposal','remove the deductible'],'Rescheduling leaves the document deadline intact.',2)
 ]},
 {id:'pack-6-part-2',part:2,title:'Pack 6 · Part 2',minutes:9,source:'pack',passage:`The Eastgate Library offers technology clinics. Registration permits one clinic per person each week. At 10 a.m. Friday, remaining spaces may be booked as a second clinic. “Device optional” means a demonstration device is shared; it does not guarantee individual practice time. For “bring device,” staff cannot repair hardware or recover lost passwords.

Interpretation is available only where listed and must be requested during registration. A wait-list is specific to the clinic, date and interpretation option selected.`,table:{headers:['Clinic','Day','Time','Requirement','Interpretation','Spaces'],rows:[['Online banking safety','Tue','18:00','Device optional','Mandarin','0 · wait-list'],['Online banking safety','Thu','14:00','Bring device','None','2'],['Video calls','Wed','10:00','Device optional','Arabic','3'],['Video calls','Sat','13:00','Bring device','None','1'],['Photo organization','Thu','18:30','Bring device','Spanish','2'],['Photo organization','Sat','10:00','Device optional','None','0 · wait-list']]},reply:`Hi Luis,

The available photo clinic with Spanish interpretation is [6]. Request interpretation [7]. If you also want Saturday video calls, you may add it Friday at 10 a.m. only if [8].

Eastgate Library`,questions:[
  px('Which available clinic suits someone needing Arabic interpretation?','Wednesday video calls at 10:00.',['Tuesday banking safety.','Thursday photo organization.','Saturday video calls.'],'The Wednesday listing has Arabic and three spaces.'),
  px('What is true of a device-optional clinic?','A shared demonstration device may limit individual practice.',['Every participant receives a device.','Participants must bring their own hardware.','Staff recover forgotten passwords.'],'The description warns that individual practice is not guaranteed.'),
  px('Which available evening clinic requires a personal device?','Thursday photo organization at 18:30.',['Tuesday banking safety at 18:00.','Wednesday video calls at 10:00.','Saturday photo organization at 10:00.'],'That listing is evening, available and bring-device.'),
  px('What help is outside the bring-device clinics?', 'Hardware repair and password recovery.',['Safety demonstrations.','Listed interpretation.','Guidance during the clinic.'],'Both are explicitly excluded.'),
  px('What does a wait-list entry apply to?','The exact clinic, date and interpretation choice.',['Any technology clinic that opens.','Every clinic in the same week.','A guaranteed second booking Friday.'],'The list is specific to all three factors.'),
  px('Complete blank [6].','Thursday at 18:30',['Saturday at 10:00','Tuesday at 18:00','Thursday at 14:00'],'The Thursday evening photo clinic lists Spanish.',2),
  px('Complete blank [7].','when you register',['after the clinic begins','only after joining a wait-list','at 10 a.m. Friday'],'Interpretation must be selected during registration.',2),
  px('Complete blank [8].','a space remains after second bookings open',['you cancel the photo clinic first','you bring two devices','Spanish interpretation is added'],'A second weekly clinic opens Friday only where space remains.',2)
 ]},
 {id:'pack-6-part-3',part:3,title:'Pack 6 · Part 3',minutes:10,source:'pack',passage:`A
Brookdale is testing weekly food-scrap collection in two neighbourhoods. Participating homes receive a locking curbside bin and a smaller kitchen container. The trial includes houses and buildings with six or fewer units. Larger buildings remain on the existing commercial collection system during the test.

B
Food may be wrapped in newspaper or placed in certified compostable liners displaying the city-approved mark. Bags labelled merely “biodegradable” are not accepted because some do not break down in the processing facility. Ordinary plastic bags are treated as contamination even when their contents are compostable.

C
Bins should be placed out by 7 a.m. with the handle facing the residence. A missed collection reported by noon the following day can be investigated. Reporting does not guarantee a separate return trip; crews may instead collect the material on the next scheduled date. Residents should keep the service number shown after submitting a report.

D
The city will compare contamination, participation and collection cost during the twelve-week trial. The number of bins emptied will not reveal how full they were, so crews will estimate volume at selected stops. A recommendation to expand the program will also consider processing capacity. Council has not set a minimum participation rate or promised expansion.`,questions:[
  pp('Which paragraph identifies residential buildings excluded because of their size?','A','Buildings larger than six units remain on another system.'),
  pp('Which paragraph distinguishes an approved liner from a loosely labelled alternative?','B','Only certified liners with the approved mark qualify.'),
  pp('Which paragraph guarantees a special return trip after a missed pickup?','E','Paragraph C says a return trip is not guaranteed.'),
  pp('Which paragraph says a count may fail to show the amount collected?','D','Bin counts do not reveal how full bins were.'),
  pp('Which paragraph explains how a bin should be oriented?','C','The handle faces the residence.'),
  pp('Which paragraph describes the containers supplied to participants?','A','Homes receive curbside and kitchen containers.'),
  pp('Which paragraph treats packaging as contamination despite acceptable contents?','B','Ordinary plastic remains contamination.'),
  pp('Which paragraph says future expansion depends partly on capacity beyond household participation?','D','Processing capacity is another factor.'),
  pp('Which paragraph gives a minimum percentage needed for expansion?','E','No minimum is set.')
 ]},
 {id:'pack-6-part-4',part:4,title:'Pack 6 · Part 4',minutes:13,source:'pack',passage:`A school district proposes that secondary-school cafeterias stop accepting cash for a one-term pilot. Students would pay through reloadable cards or online accounts. Families could add funds online, by telephone, or with cash at the district office. Cafeterias would retain an emergency meal procedure for students whose accounts unexpectedly lack funds.

Principal Dana Fox supports the pilot because cash counting delays lunch service and creates reconciliation work. She insists, however, that the emergency procedure be private and consistent. Students should not have to explain financial circumstances in front of peers. Fox wants reports on line speed and incorrect charges, since faster service would not compensate for frequent account errors.

Parent advocate Jerome Bell opposes launching until cash loading is available at more locations. Requiring a trip to the district office may burden families who lack online payment or flexible work hours. Telephone loading still requires an electronic payment method. Bell could accept a cashless cafeteria if schools or community centres accepted cash deposits and if no extra fee applied to offline loading.

Student representative Nia Ahmed says cards may be convenient but can be forgotten or shared. The emergency procedure must cover a forgotten card without publicly identifying a student as unable to pay. She also asks the district to distinguish forgotten-card meals from insufficient-fund meals in its internal data, while protecting names. Otherwise, a large emergency-meal total would not reveal which problem needs fixing.

Trustees requested a revised access plan and privacy procedure. No pilot date has been approved.`,reply:`Dear Trustees,

The proposal may shorten lines, but access and implementation need work. Dana says speed should be assessed alongside [6]. Jerome shows that [7]. Nia explains why [8]. Before setting a date, trustees should [9]. A fair evaluation would [10].

A parent`,questions:[
  px('How could a family currently add cash to an account?', 'At the district office.',['At every school cafeteria.','Through the telephone system.','At any community centre.'],'Only the district office is listed for cash.'),
  px('What concern do Dana and Nia share?', 'Emergency meals should not expose students publicly.',['Every student should share a payment card.','Cash counting should continue.','Online payment should carry an extra fee.'],'Both emphasize privacy during emergency access.'),
  px('What would most directly address Jerome’s objection?', 'More convenient places accepting cash without an added fee.',['A faster online account page.','A public emergency-meal line.','A report showing fewer cash transactions.'],'He identifies location and fee barriers.'),
  px('Why does Nia want emergency meals classified by reason?', 'The total alone cannot show whether cards or balances caused the problem.',['Student names should be published.','Cards can never be replaced.','Insufficient balances are always accidental.'],'Separate categories identify different operational failures.'),
  px('What have trustees decided?', 'They requested revisions without approving a start date.',['They made the cashless system permanent.','They approved a one-term start date.','They removed emergency meals.'],'The date remains unapproved.'),
  px('Complete blank [6].','incorrect account charges',['the amount of cash counted','public student explanations','the number of district offices'],'Dana asks to measure errors as well as speed.',2),
  px('Complete blank [7].','telephone access does not solve the cash-payment barrier',['every family can pay electronically','district-office deposits are the most convenient method','offline loading should cost more'],'Phone loading still needs electronic payment.',2),
  px('Complete blank [8].','one emergency total can conceal different causes',['forgotten cards should end meal access','account data must include student names','shared cards prevent all errors'],'Nia wants the causes separated.',2),
  px('Complete blank [9].','improve cash access and define a private emergency process',['eliminate every offline method','publish names of emergency users','measure only cafeteria line speed'],'Those are the unresolved access and privacy conditions.',2),
  px('Complete blank [10].','track speed, errors and emergency-meal causes separately',['treat every emergency meal as a financial problem','exclude offline families from the pilot','consider a shorter line sufficient proof'],'The viewpoints call for multiple measures.',2)
 ]}
];

const PACK_7=[
 {id:'pack-7-part-1',part:1,title:'Pack 7 · Part 1',minutes:11,source:'pack',passage:`From: Junction Towers Concierge
To: Residents
Subject: Service-elevator reservations

The service elevator must be reserved for moves, furniture deliveries and any load that cannot safely fit in the passenger elevators. Reservations are available in two-hour windows from 8 a.m. to 6 p.m., Monday through Saturday. The elevator remains available for ordinary resident use between reservations, but a reservation gives the holder exclusive loading access during the booked window.

Submit requests at least three business days in advance. A request is confirmed only when the concierge emails a confirmation number. Requests for the same window are assessed in the order complete forms are received. A form without the moving company’s insurance certificate is incomplete and does not hold a place.

A refundable $200 damage deposit is required for household moves, but not for a single furniture delivery. The deposit must be paid before keys for the protective elevator pads are released. After the reservation, staff inspect the elevator and loading corridor. The deposit is normally returned within five business days; an inspection requiring repair estimates may take longer, and the resident will receive written notice.

The moving truck may use the loading bay for the reserved window. It cannot remain there while movers take a meal break or travel to another address. If a previous booking runs late, contact the concierge rather than using the passenger elevators. Staff will record the delay and adjust access where possible, but the next reservation is not automatically extended.

From: Camille Roy
To: Concierge
Subject: Sofa delivery and move

I have a sofa delivery on June 3 and a household move on June 8. I sent both forms today, but my mover will send its insurance certificate tomorrow. I would like the 10 a.m. window for each. Do I need two deposits, and are the times already held?`,reply:`Hello Camille,

The sofa delivery does not require [7], but the household move does. Neither requested time is held until [8]. For the move, the form becomes complete when [9]. The loading bay may be used during [10], and a late earlier booking would [11].

Concierge`,questions:[
  px('Which activity requires the service elevator?', 'A load too large for safe passenger-elevator use.',['A resident carrying one small bag.','Ordinary travel between reservations.','A visitor entering without furniture.'],'Large loads, moves and furniture deliveries require it.'),
  px('What makes a requested window confirmed?', 'An emailed confirmation number.',['Submitting any form.','Paying the deposit alone.','The moving company promising insurance.'],'Only the concierge confirmation completes booking.'),
  px('How are competing complete requests handled?', 'In the order the complete forms arrive.',['By apartment floor.','By size of the deposit.','By moving-company choice.'],'Order applies only once forms are complete.'),
  px('When might returning a deposit take more than five business days?', 'When possible damage requires repair estimates.',['Whenever one item is delivered.','When the loading bay is unused.','Whenever the move ends early.'],'Further inspection/estimates can delay return.'),
  px('What must a truck avoid?', 'Occupying the loading bay during an unrelated break or trip.',['Using the bay during its reservation.','Leaving after the reservation.','Arriving with a confirmed number.'],'The bay is only for the active reservation.'),
  px('What happens automatically if the previous booking runs late?', 'No extension; staff first assess how access can be adjusted.',['The next booking gains the same extra time.','Passenger elevators become freight elevators.','Every later booking is cancelled.'],'The notice explicitly rejects automatic extension.'),
  px('Complete blank [7].','a damage deposit',['an elevator reservation','a delivery company','a two-hour window'],'A single furniture delivery is exempt from the deposit.',2),
  px('Complete blank [8].','confirmation numbers are emailed',['the forms are first submitted','the sofa arrives','both deposits are paid'],'Requests do not hold time without confirmation.',2),
  px('Complete blank [9].','the insurance certificate arrives',['the deposit is returned','the loading bay opens','the June 3 delivery ends'],'The missing insurance document makes it incomplete.',2),
  px('Complete blank [10].','each confirmed reservation window',['any meal break','the entire day of the move','five business days after inspection'],'Bay use matches the booked window.',2),
  px('Complete blank [11].','not automatically extend the following reservation',['permit use of passenger elevators','guarantee a larger loading bay','cancel the damage inspection'],'Staff may adjust access, but extension is not automatic.',2)
 ]},
 {id:'pack-7-part-2',part:2,title:'Pack 7 · Part 2',minutes:9,source:'pack',passage:`The Newcomer Service Centre runs licensing-information clinics. Staff explain application steps and review whether documents appear complete; they do not decide eligibility or certify translations. Each person may book one clinic per licence type. A companion may attend but does not receive a separate review unless registered.

“Interpretation available” must be selected when booking. Walk-in spaces are announced at reception thirty minutes before a clinic and are never guaranteed.`,table:{headers:['Licence topic','Day','Time','Language support','Format','Spaces'],rows:[['Driver exchange','Mon','17:30','Spanish','Documents required','0 · wait-list'],['Driver exchange','Wed','12:00','None','Information only','3'],['Child-care worker','Tue','18:30','Arabic','Documents required','2'],['Child-care worker','Thu','10:00','None','Information only','4'],['Food handler','Wed','18:00','Mandarin','Documents required','1'],['Food handler','Sat','11:00','None','Information only','0 · wait-list']]},reply:`Hi Amal,

For an Arabic-supported document review about child-care licensing, choose [6]. Select interpretation [7]. Your companion may attend, but [8] unless separately registered.

Newcomer Service Centre`,questions:[
  px('Which available clinic explains driver exchange without reviewing documents?', 'Wednesday at 12:00.',['Monday at 17:30.','Tuesday at 18:30.','Saturday at 11:00.'],'The Wednesday driver clinic is information only and has space.'),
  px('What can clinic staff do?', 'Check apparent completeness and explain steps.',['Approve licence eligibility.','Certify translated documents.','Guarantee acceptance by the licensing body.'],'Their role is explanatory and preliminary.'),
  px('Which available evening session includes Mandarin support?', 'Wednesday food-handler at 18:00.',['Monday driver exchange.','Tuesday child-care worker.','Saturday food-handler.'],'The table lists Mandarin for Wednesday food handler.'),
  px('What is true of a companion?', 'Attendance does not create a second document review.',['They may never enter a clinic.','They automatically receive interpretation.','They can decide the applicant’s eligibility.'],'Separate review requires separate registration.'),
  px('When are possible walk-in spaces announced?', 'Thirty minutes before the clinic.',['When online registration opens.','At noon two days before.','After the clinic finishes.'],'Reception announces them thirty minutes ahead.'),
  px('Complete blank [6].','Tuesday at 18:30',['Thursday at 10:00','Monday at 17:30','Wednesday at 18:00'],'It matches topic, document review and Arabic.',2),
  px('Complete blank [7].','during booking',['after arriving as a walk-in','after staff approve eligibility','only for your companion'],'Interpretation must be chosen when booking.',2),
  px('Complete blank [8].','they will not receive their own review',['they must remain outside','they decide whether documents qualify','they occupy your registered place'],'Companions need separate registration for a review.',2)
 ]},
 {id:'pack-7-part-3',part:3,title:'Pack 7 · Part 3',minutes:10,source:'pack',passage:`A
The county’s new flood-alert service sends notices for monitored rivers and creeks. Residents select one or more zones rather than entering only a home address, since work, school or travel routes may lie elsewhere. Signing up for several zones can produce multiple messages about the same storm when different waterways reach alert levels.

B
An advisory means conditions are being watched and residents should review plans. A warning means flooding is occurring or expected soon and recipients should follow official safety directions. The service does not replace evacuation orders, which may be delivered through additional channels. Users should not wait for a text message if emergency personnel give direct instructions.

C
Text and email alerts usually arrive within minutes of a status change, but delivery depends on telecommunications networks. The county cannot confirm that every message reaches every device. A dashboard shows current zone status without registration, although loss of internet access can also affect it. Battery radio and local emergency broadcasts remain recommended backups.

D
After the first storm season, officials will compare subscription, delivery reports and resident feedback. A high subscription count does not show whether alerts were understood or acted upon. The review will also examine areas with low registration to determine whether promotion or access methods should change. No target subscription percentage has been declared.`,questions:[
  pp('Which paragraph explains why one storm can generate more than one message for a user?','A','Multiple selected waterway zones may each change status.'),
  pp('Which paragraph distinguishes monitoring information from a more urgent status?','B','It defines advisory versus warning.'),
  pp('Which paragraph guarantees delivery to every registered device?','E','Paragraph C explicitly does not guarantee it.'),
  pp('Which paragraph recommends information sources that do not depend on a mobile message?','C','Radio and emergency broadcasts are recommended backups.'),
  pp('Which paragraph says a large audience does not establish effective use?','D','Subscription counts do not show understanding or action.'),
  pp('Which paragraph explains why registration is organized by area rather than residence alone?','A','People may need alerts for work, school or routes.'),
  pp('Which paragraph says a message should not override direct emergency instructions?','B','Users should follow emergency personnel directly.'),
  pp('Which paragraph describes investigation of places where participation is low?','D','The review examines low-registration areas.'),
  pp('Which paragraph sets the minimum registration rate for success?','E','No target rate has been declared.')
 ]},
 {id:'pack-7-part-4',part:4,title:'Pack 7 · Part 4',minutes:13,source:'pack',passage:`The parks department proposes adding low-level lighting along the 1.2-kilometre path through Alder Park. The lights would operate from dusk until 11 p.m. during a one-year pilot. The sports field and two main entrances are already lit; the wooded middle section is not.

Runner Leah Brooks supports the pilot because many residents commute home after dark. She favours lights directed downward and a fixed shutoff time. She also wants the department to record whether people use the path later, rather than relying only on a general park-visitor counter at the entrance. That counter includes sports spectators who may never use the trail.

Naturalist Owen Price says darkness is part of the park’s habitat. He acknowledges that shielded, warmer-coloured lights are less disruptive than bright white fixtures, but questions whether the full path needs continuous lighting. He proposes testing lights only at intersections and the steepest section first. If monitoring shows wildlife disturbance, the design should be reduced rather than defended because equipment has already been purchased.

Accessibility adviser Farah Ali notes that lighting alone does not make the trail safe. Uneven edges and poor contrast at two crossings are problems in daylight as well. She supports the pilot if those surfaces are repaired and if the evaluation includes people with low vision. Counts of evening users cannot reveal whether someone avoided the path because it remained difficult to navigate.

The department will revise the design and monitoring plan before council votes. Funding has been identified for the pilot but not for permanent operation.`,reply:`Dear Council,

The viewpoints suggest a narrower question than whether lighting is popular. Leah explains why [6]. Owen would [7]. Farah emphasizes that [8]. Before the vote, the department should [9]. Evidence for a permanent system should [10].

A park user`,questions:[
  px('What would the pilot add?', 'Timed low-level lighting on the currently dark path.',['Permanent lighting throughout the entire park.','Twenty-four-hour lighting on the sports field.','A new 1.2-kilometre trail.'],'The path is lit dusk to 11 during a pilot.'),
  px('What concern do Leah and Farah share about visitor totals?', 'Totals may not describe actual trail use or barriers.',['They prove the path is accessible.','They identify wildlife disturbance directly.','They include only runners.'],'Both explain what counts fail to reveal.'),
  px('What alternative does Owen propose?', 'Begin with lighting at selected higher-need locations.',['Use brighter white lights everywhere.','Keep lights operating all night.','Cancel wildlife monitoring.'],'He suggests intersections and the steepest section.'),
  px('What condition does Farah add?', 'Repair navigation problems and include low-vision users in evaluation.',['Remove the fixed shutoff time.','Count only sports spectators.','Buy permanent fixtures before the pilot.'],'Her support depends on surface work and inclusive evaluation.'),
  px('What remains unfunded?', 'Permanent operation after the pilot.',['The one-year pilot itself.','The existing entrance lighting.','The design revision.'],'Only pilot funding is identified.'),
  px('Complete blank [6].','an entrance counter can include people who never use the path',['all park visitors travel through the wooded section','sports spectators should determine trail demand','lighting must continue after 11 p.m.'],'Leah wants path-specific evidence.',2),
  px('Complete blank [7].','test targeted lighting before illuminating the full route',['purchase equipment before monitoring','reject every form of lighting','measure only runner numbers'],'He proposes a limited first stage.',2),
  px('Complete blank [8].','surface and contrast problems remain even with lights',['wildlife is the only relevant user group','visitor counts prove that avoided trips do not exist','lighting repairs uneven edges automatically'],'Lighting does not fix physical navigation barriers.',2),
  px('Complete blank [9].','define the design, repairs and monitoring together',['guarantee permanent funding','remove the wildlife review','count every entrance visitor as a trail user'],'All three issues affect a credible pilot.',2),
  px('Complete blank [10].','address use, accessibility and ecological effects',['rely on one general visitor total','exclude people who avoid the path','assume purchased equipment must remain'],'The viewpoints require multiple kinds of evidence.',2)
 ]}
];

const PACK_8=[
 {id:'pack-8-part-1',part:1,title:'Pack 8 · Part 1',minutes:11,source:'pack',passage:`From: River Days Volunteer Team
To: Registered volunteers
Subject: Shift confirmation and training

Thank you for registering for River Days. A selected shift on the registration form is a preference, not a confirmed assignment. Confirmed volunteers receive an email showing a role, location and check-in time. Reply within forty-eight hours to accept. Unanswered assignments may be offered to another volunteer.

First-time volunteers in crowd-guidance or boat-launch roles must attend a forty-five-minute safety briefing. Two online sessions and one in-person session are available. Returning volunteers who performed either role last year may watch the recorded update instead, but must complete its short acknowledgement form before their shift. Training for food-service roles is provided at check-in and cannot substitute for the safety briefing required by another role.

Volunteers should arrive fifteen minutes before the shift time. The check-in tent stores small personal items but cannot secure laptops or large bags. Outdoor roles continue in light rain; severe-weather changes are sent by text and email. Volunteers should not assume cancellation merely because another festival activity has stopped.

Anyone unable to attend should use the cancellation link as soon as possible. Cancelling one shift does not remove a volunteer from a second confirmed shift. Volunteers wanting to exchange shifts must contact the coordinator; an informal swap is invalid until both people receive revised confirmations.

From: Jordan Lee
To: Volunteer Team
Subject: Saturday shifts

I selected boat launch in the morning and food service in the afternoon. This is my first year. I received both assignment emails yesterday but have not replied. My friend offered to take the morning shift if it rains.`,reply:`Hello Jordan,

Please accept each assignment within [7]. For the boat-launch role, you must [8]. Food-service training at check-in [9]. Light rain does not cancel the outdoor role. Your friend may take it only after [10]. If you cancel the morning shift, [11].

Volunteer Team`,questions:[
  px('What does selecting a shift on the form mean?', 'It states a preference that still needs confirmation.',['It creates a final assignment.','It replaces the acceptance email.','It guarantees the chosen location.'],'Selection is not confirmation.'),
  px('What may happen to an unanswered assignment?', 'It may be offered to another volunteer.',['It remains reserved indefinitely.','It becomes a food-service role.','It cancels every other assignment.'],'Assignments require a reply within forty-eight hours.'),
  px('Which first-time role requires the safety briefing?', 'Boat launch.',['Food service only.','Every indoor role.','Check-in storage.'],'Boat launch and crowd guidance require it.'),
  px('What can a returning eligible volunteer do instead of attending live?', 'Watch the update and complete its acknowledgement.',['Skip all updated information.','Use food-service training.','Exchange roles informally.'],'Both the recording and acknowledgement are required.'),
  px('What does a stopped festival activity establish about a volunteer shift?', 'Nothing by itself; volunteers await the direct weather message.',['Every outdoor shift is cancelled.','Only food service continues.','The assignment becomes optional.'],'Volunteers must not infer cancellation from another activity.'),
  px('When is a shift exchange valid?', 'After the coordinator sends revised confirmations to both people.',['When two volunteers agree privately.','When rain begins.','After one person uses the cancellation link.'],'Informal swaps are not valid.'),
  px('Complete blank [7].','forty-eight hours',['fifteen minutes','forty-five minutes','one week'],'That is the email response window.',2),
  px('Complete blank [8].','complete a safety briefing',['watch only food-service training','bring a laptop to check-in','wait for severe weather'],'First-time boat-launch volunteers require the briefing.',2),
  px('Complete blank [9].','does not replace the boat-role briefing',['confirms both assignments automatically','allows an informal shift swap','is completed forty-eight hours early'],'Role-specific food training is not a substitute.',2),
  px('Complete blank [10].','both of you receive revised confirmations',['you send a private message','another activity is cancelled','the shift has already started'],'Coordinator confirmation validates an exchange.',2),
  px('Complete blank [11].','the afternoon assignment remains confirmed',['both shifts disappear automatically','your friend receives both roles','no cancellation link is needed'],'Cancelling one does not remove another.',2)
 ]},
 {id:'pack-8-part-2',part:2,title:'Pack 8 · Part 2',minutes:9,source:'pack',passage:`Northview Adult Learning offers short evening courses. Students may register for one subsidized course per term. A second course may be added at full fee after September 5 if a seat remains. “Assessment required” means placement must be completed before registration is confirmed; booking an assessment does not reserve a course seat.

Loan laptops are limited and must be requested with registration. Courses marked “online option” still hold the first session in person for orientation.`,table:{headers:['Course','Days','Time','Level','Delivery','Spaces'],rows:[['Workplace writing','Mon/Wed','18:00','Intermediate','In person','2'],['Workplace writing','Tue/Thu','20:00','Advanced','Online option','0 · wait-list'],['Spreadsheet basics','Tue','18:30','Beginner','In person','4'],['Spreadsheet analysis','Thu','18:30','Intermediate','Online option','1'],['Conversation','Wed','19:00','Beginner','In person','0 · wait-list'],['Conversation','Fri','18:00','Intermediate','In person','3']]},reply:`Hi Elena,

The available intermediate course with an online option is [6]. Its first meeting [7]. If it is your subsidized course, you may add another after September 5 only [8].

Northview Learning`,questions:[
  px('Which available beginner course meets once a week?', 'Spreadsheet basics on Tuesday.',['Conversation on Wednesday.','Workplace writing Monday/Wednesday.','Spreadsheet analysis Thursday.'],'Spreadsheet basics is beginner, weekly and has spaces.'),
  px('What does an assessment booking provide?', 'A chance to complete placement, not a reserved course seat.',['Automatic registration.','A guaranteed subsidized place.','A loan laptop.'],'Assessment and seat confirmation are separate.'),
  px('Which available intermediate course meets on Friday?', 'Conversation at 18:00.',['Workplace writing at 18:00.','Spreadsheet analysis at 18:30.','Advanced writing at 20:00.'],'The Friday intermediate conversation class has three spaces.'),
  px('How must a student request a loan laptop?', 'During course registration.',['After the first online session.','By joining any wait-list.','Only after September 5.'],'The request accompanies registration.'),
  px('When may a second course be added?', 'After September 5 at full fee if space remains.',['Immediately at the subsidized rate.','Only when the first course ends.','Before completing any assessment.'],'All conditions appear in the policy.'),
  px('Complete blank [6].','Spreadsheet analysis on Thursday',['Advanced workplace writing','Friday conversation','Tuesday spreadsheet basics'],'It is intermediate, available and has an online option.',2),
  px('Complete blank [7].','is held in person for orientation',['can be skipped automatically','guarantees a loan laptop','occurs only online'],'Online-option courses start in person.',2),
  px('Complete blank [8].','if a seat remains and you pay the full fee',['at the subsidized rate immediately','without registering','if the first class is online'],'Those are the second-course conditions.',2)
 ]},
 {id:'pack-8-part-3',part:3,title:'Pack 8 · Part 3',minutes:10,source:'pack',passage:`A
The province’s rental-efficiency pilot helps owners of small apartment buildings pay for insulation and air-sealing work. Buildings must contain between two and twelve rental units and have been occupied before 2005. Eligibility belongs to the building project; individual tenants cannot apply for work only inside their unit.

B
An energy assessment must occur before contractors begin. The assessor recommends measures but does not select the contractor. Work started before the assessment is ineligible, including materials purchased for installation later. Emergency repairs needed to keep the building safe are handled under a separate process and should be reported before proceeding where possible.

C
Owners must give tenants written notice of assessment and construction visits using the notice period required by tenancy law. Program approval does not create permission to enter a unit. If access is unavailable, the owner and contractor must reschedule rather than ask the program to override tenancy requirements.

D
The pilot will estimate energy savings and collect tenant reports about comfort. Lower energy use can result from weather or occupancy changes as well as construction, so evaluators will compare several sources of evidence. Participation does not permit an automatic rent increase. Any rent change remains subject to existing tenancy rules, and the program does not decide landlord-tenant disputes.`,questions:[
  pp('Which paragraph explains that a tenant cannot seek funding for an isolated unit project?','A','Eligibility belongs to the whole building project.'),
  pp('Which paragraph distinguishes recommendations from contractor selection?','B','The assessor recommends but does not choose.'),
  pp('Which paragraph authorizes entry without the legally required notice?','E','Paragraph C explicitly says approval gives no entry permission.'),
  pp('Which paragraph warns that energy changes may have more than one cause?','D','Weather and occupancy can affect use.'),
  pp('Which paragraph makes materials ineligible based on when work began?','B','Pre-assessment work and purchases are ineligible.'),
  pp('Which paragraph identifies the size and age conditions for buildings?','A','Two to twelve units and pre-2005 occupancy are stated.'),
  pp('Which paragraph requires rescheduling when lawful access is unavailable?','C','The program cannot override tenancy access rules.'),
  pp('Which paragraph says program participation does not itself decide rent changes?','D','Existing tenancy rules continue to apply.'),
  pp('Which paragraph guarantees a specific percentage reduction in energy use?','E','No percentage guarantee appears.')
 ]},
 {id:'pack-8-part-4',part:4,title:'Pack 8 · Part 4',minutes:13,source:'pack',passage:`A neighbourhood pharmacy proposes keeping its pickup counter open until midnight using a secure automated locker. Pharmacists would remain on site only until the current 9 p.m. closing time. Eligible prescriptions could be placed in lockers after payment and identity verification. New prescriptions, medication counselling and products requiring refrigeration would remain available only during staffed hours.

Pharmacist Mei Tan supports the locker because shift workers often cannot arrive by nine. She stresses that staff must decide which prescriptions are suitable; customers should not be able to waive counselling simply to obtain later pickup. She wants the screen to state clearly when a pharmacist must be contacted and to offer an easy way to postpone locker placement until the patient has spoken with one.

Patient advocate Robert King welcomes longer pickup but worries about digital and physical access. Identity verification must work for people without smartphones, and the locker controls must be reachable from a seated position. He also asks the pharmacy to preserve ordinary counter pickup without an added fee. A convenient new option should not make the existing service worse for people who cannot use it.

Neighbour Sara Malik focuses on security and noise. She does not assume late access will be disruptive, but wants the pilot to record failed entry attempts, service calls and late-night complaints separately. A total number of pickups would not reveal whether a small number of repeated technical failures burdened residents or left patients unable to collect medicine.

The pharmacy has applied for a three-month pilot. The regulator is reviewing security and privacy details; approval has not yet been granted.`,reply:`To the regulator,

The locker could improve access, but it should remain an option with safeguards. Mei argues that [6]. Robert says access must include [7]. Sara explains why [8]. Before approval, the regulator should [9]. The pilot should [10].

A customer`,questions:[
  px('What would remain unavailable after 9 p.m.?', 'New prescriptions and pharmacist counselling.',['Every prepaid prescription.','Identity verification.','All non-refrigerated medicine pickup.'],'Only suitable prepared prescriptions use lockers.'),
  px('What do Mei and Robert both want to preserve?', 'A meaningful choice that does not remove needed human service.',['Mandatory smartphone use.','Automatic counselling waivers.','Refrigerated locker pickup.'],'Mei protects counselling; Robert protects counter service.'),
  px('Who determines whether a prescription is suitable for the locker?', 'Pharmacy staff.',['The customer by waiving counselling.','Neighbourhood residents.','The locker manufacturer.'],'Staff must make the suitability decision.'),
  px('Why does Sara want different incident measures?', 'Pickup totals could hide recurring failures and distinct effects.',['Every late pickup creates the same problem.','Complaints measure prescription eligibility.','Service calls guarantee regulator approval.'],'Separate data reveals technical and neighbourhood issues.'),
  px('What is the proposal’s current status?', 'A three-month pilot awaits regulatory approval.',['Permanent midnight service is approved.','The pilot has already ended.','Only privacy approval remains unnecessary.'],'The regulator is still reviewing it.'),
  px('Complete blank [6].','later pickup must not bypass required counselling',['every medication belongs in a locker','customers should decide eligibility alone','pharmacists must remain until midnight'],'She protects clinical judgment and contact.',2),
  px('Complete blank [7].','people without smartphones and users with physical access needs',['only customers who pay an extra fee','residents who prefer refrigerated lockers','people collecting new prescriptions after midnight'],'Robert names digital and physical access.',2),
  px('Complete blank [8].','a pickup total cannot describe technical failures or neighbourhood effects',['late service will certainly create noise','failed entries should be combined with successful pickups','resident complaints should determine medication safety'],'She asks for distinct operational measures.',2),
  px('Complete blank [9].','finish the security and privacy review',['allow counselling waivers','eliminate staffed counter pickup','approve permanent operation immediately'],'Those details remain under regulatory review.',2),
  px('Complete blank [10].','track successful access, failures and service effects separately',['judge success only by total pickups','exclude people unable to use the locker','treat all prescriptions as eligible'],'Several outcomes are required for credible evaluation.',2)
 ]}
];

const UNSCORED_6={id:'pack-6-extra',part:3,title:'Reading for Information · Pool access pilot',minutes:10,source:'pack',scored:false,passage:`A
The Lakeside pool is testing early-morning lane swimming on Tuesdays and Thursdays. The building will open at 6 a.m., but the customer-service desk will not open until its usual 8 a.m. time. Swimmers must therefore hold an active membership or buy a single-entry pass online before arriving. Cash payment and new membership registration will remain available only during staffed desk hours.

B
The accessible change room will be open during the pilot. A lift into the pool is also available, but anyone needing staff assistance with the lift must request it by 4 p.m. the previous day. The request is for assistance, not for reserving a lane. Pool staff may group requests at similar times so that the trained attendant can help several swimmers efficiently.

C
Four lanes will be available for continuous swimming, and two will be used for a coached program. A general admission pass does not include the coached session. If fewer than five people register for coaching by noon the previous day, that session may be cancelled and its lanes returned to general swimming. Registered participants will receive an email; silence should not be treated as cancellation.

D
The eight-week review will examine attendance, staffing costs and use across different times. Officials caution that a busy first week may reflect curiosity rather than sustained demand. They will also record occasions when online payment or advance assistance requirements prevented access. No attendance threshold has been set, and a successful pilot would still require funding approval before the hours become permanent.`,questions:[
 pp('Which paragraph explains why arriving with money does not guarantee entry during the extra hours?','A','The service desk is closed, so payment must already be completed online.'),
 pp('Which paragraph distinguishes help using equipment from reservation of swimming space?','B','The assistance request does not reserve a lane.'),
 pp('Which paragraph states the minimum attendance required to make early hours permanent?','E','No permanent-hours threshold is stated.'),
 pp('Which paragraph explains how low enrolment in one activity could increase space for another?','C','Cancelled coaching returns two lanes to general swimming.'),
 pp('Which paragraph warns against treating initial popularity as lasting demand?','D','First-week curiosity may not persist.'),
 pp('Which paragraph specifies when assistance must be requested?','B','The deadline is 4 p.m. on the previous day.'),
 pp('Which paragraph says the absence of a message should not be interpreted as a schedule change?','C','Participants are emailed if coaching is cancelled.'),
 pp('Which paragraph identifies access barriers as part of the evaluation rather than only attendance?','D','The review records payment and assistance barriers.'),
 pp('Which paragraph separates entry for existing users from creation of a new membership?','A','New registration stays within staffed hours.')
]};

const UNSCORED_7={id:'pack-7-extra',part:2,title:'Reading to Apply a Diagram · Rail replacement buses',minutes:9,source:'pack',scored:false,passage:`Metro Rail will replace evening trains with buses between Central and Westhaven from November 3 to 7. Rail tickets and passes are accepted on replacement buses. Bicycle spaces are limited and cannot be reserved. A listed connection is planned, not guaranteed; passengers should allow another departure when travelling to a fixed appointment.

Accessible buses operate on every route shown. A passenger needing boarding assistance may travel without advance notice, but calling before 5 p.m. helps staff position support at crowded stops.`,table:{headers:['Depart','From','To','Arrive','Connection','Notes'],rows:[['18:10','Central','Westhaven','18:55','Local 19:05','Express'],['18:30','Central','Riverside','18:55','Westhaven 19:10','All stops'],['19:10','Riverside','Westhaven','19:35','None','All stops'],['20:00','Westhaven','Central','20:45','Airport 21:00','Express'],['20:20','Westhaven','Riverside','20:45','Central 20:55','All stops'],['21:05','Riverside','Central','21:30','None','All stops']]},reply:`Hi Dana,

For a direct trip from Central to Westhaven, the first listed bus leaves at [6]. Your rail pass [7]. If travelling with a bicycle, remember that [8].

Metro Rail`,questions:[
 px('Which bus allows a Riverside passenger to reach Central by 21:30?','The 21:05 all-stops departure.',['The 20:00 express.','The 20:20 Westhaven departure.','The 19:10 Riverside departure.'],'The 21:05 trip runs Riverside to Central and arrives 21:30.'),
 px('What does the 18:30 Central departure require for travel to Westhaven?','A change at Riverside to the 19:10 bus.',['A direct express ride.','A bicycle reservation.','A new bus-only ticket.'],'It terminates at Riverside and lists the Westhaven connection.'),
 px('Which listed trip connects with the airport service?','The 20:00 Westhaven express.',['The 18:10 Central express.','The 20:20 Westhaven all-stops bus.','The 21:05 Riverside bus.'],'It arrives Central at 20:45 for the 21:00 airport service.'),
 px('What is true of the listed connections?','Passengers should not rely on them for a fixed-time commitment.',['They are guaranteed whenever a rail pass is used.','They wait for every delayed replacement bus.','They require advance seat reservations.'],'The notice calls them planned but not guaranteed.'),
 px('What benefit can an advance accessibility call provide?','It helps position assistance at a crowded stop.',['It is required to board an accessible bus.','It reserves a bicycle space.','It guarantees a connection.'],'Advance notice is helpful but not mandatory.'),
 px('Complete blank [6].','18:10',['18:30','18:55','19:10'],'The first direct express departs at 18:10.',2),
 px('Complete blank [7].','is accepted on the replacement bus',['must be exchanged for a bus ticket','guarantees the 19:05 connection','reserves an accessible seat'],'Existing rail fares are accepted.',2),
 px('Complete blank [8].','space is limited and cannot be reserved',['bicycles are prohibited on every route','a rail pass reserves bicycle space','only all-stops buses carry bicycles'],'The notice describes limited, unreservable bicycle capacity.',2)
]};

const UNSCORED_8={id:'pack-8-extra',part:4,title:'Reading for Viewpoints · Weekend clinic hours',minutes:13,source:'pack',scored:false,passage:`A community health centre proposes opening on Saturday mornings for a six-month pilot. Existing weekday staff would rotate into Saturday shifts and receive a weekday off, so the total number of clinical hours would remain unchanged. Saturday appointments would initially be limited to routine follow-ups and vaccinations; urgent concerns would continue through the regional service.

Physician Karen Li supports the pilot because some patients repeatedly miss weekday follow-ups due to work. She wants the centre to compare completed appointments rather than bookings alone: moving an appointment to Saturday provides little benefit if patients still cannot attend. Li also warns that reducing weekday coverage could create longer waits, so access across the entire week must be measured.

Patient representative Omar Reid agrees that weekend access could help but questions an online-first booking plan. The proposal reserves a small number of telephone bookings, yet their release time is not specified. Reid wants online and telephone spaces released together and wants staff to record unsuccessful booking attempts, not merely filled appointments. Otherwise, demand from people who could not enter the system would remain invisible.

Nurse manager Beth Scott is concerned about continuity. Rotating days off may mean a patient’s usual nurse is unavailable on another weekday. She recommends assigning follow-ups to a care team rather than promising the same individual, and explaining that arrangement before patients select Saturday. She supports the pilot if staff workload, weekday delays and patient understanding are evaluated alongside Saturday attendance.

The centre’s board has asked for a revised booking and staffing plan. No opening date has been approved.`,reply:`Dear Board,

Saturday service may improve access, but the pilot should measure displacement as well as demand. Karen notes that [6]. Omar explains why [7]. Beth’s recommendation would [8]. Before setting an opening date, the centre should [9]. A credible review would [10].

A patient`,questions:[
 px('What stays constant under the proposal?','The total number of clinical hours.',['The weekday schedule for every employee.','Access to urgent Saturday care.','The availability of each patient’s usual nurse.'],'Saturday shifts replace some weekday work.'),
 px('What concern do Karen and Beth share?','Saturday service could affect access or continuity on weekdays.',['Vaccination should be removed from the pilot.','Every patient requires the same nurse.','Filled booking totals reveal all demand.'],'Both require evaluation beyond Saturday attendance.'),
 px('What would most directly address Omar’s objection?','Release telephone places clearly and measure failed attempts.',['Restrict all booking to the website.','Count only completed appointments.','Promise the same nurse on Saturday.'],'He identifies timing and invisible unsuccessful demand.'),
 px('Why does Beth prefer a team model?','Rotating days off may make one usual clinician unavailable.',['Saturday care includes urgent emergencies.','It increases total clinical hours.','Online booking prevents continuity.'],'The staffing rotation changes individual availability.'),
 px('What has the board approved so far?','Further planning without an opening date.',['Permanent Saturday operation.','The online-first plan unchanged.','Additional total clinical hours.'],'The board requested revisions only.'),
 px('Complete blank [6].','bookings alone do not show whether access actually improved',['weekday delays are unrelated to the pilot','every missed appointment should move to Saturday','Saturday attendance measures the whole week'],'She wants completed visits and weekly access assessed.',2),
 px('Complete blank [7].','filled appointments can hide people unable to book',['telephone booking should be eliminated','online users should receive all places first','vaccinations require urgent-care staffing'],'He wants unsuccessful attempts recorded.',2),
 px('Complete blank [8].','set realistic continuity expectations under rotating schedules',['guarantee the same nurse every day','remove weekday days off','turn routine visits into urgent care'],'A care team accounts for individual absences.',2),
 px('Complete blank [9].','clarify booking releases and staffing coverage',['begin before the plans are revised','measure only Saturday attendance','increase total hours automatically'],'Those operational plans remain unresolved.',2),
 px('Complete blank [10].','combine weekend use with weekday access, workload and unmet demand',['treat every booking as a completed visit','exclude failed booking attempts','assume no weekday service is displaced'],'All viewpoints require broader evidence.',2)
]};

PACK_6.splice(2,0,UNSCORED_6);
PACK_7.splice(1,0,UNSCORED_7);
PACK_8.splice(4,0,UNSCORED_8);

for(const pack of [
 {id:'pack-4',number:4,title:'Mock Pack 4',subtitle:'Housing, recreation, public programs and work',parts:PACK_4},
 {id:'pack-5',number:5,title:'Mock Pack 5',subtitle:'Community access, transport, health and streets',parts:PACK_5},
 {id:'pack-6',number:6,title:'Mock Pack 6',subtitle:'Claims, technology, municipal service and schools',parts:PACK_6},
 {id:'pack-7',number:7,title:'Mock Pack 7',subtitle:'Building access, licensing, alerts and parks',parts:PACK_7},
 {id:'pack-8',number:8,title:'Mock Pack 8',subtitle:'Volunteering, education, housing and health',parts:PACK_8}
]){
 pack.questions=pack.parts.filter(part=>part.scored!==false).reduce((total,part)=>total+part.questions.length,0);
 pack.totalQuestions=pack.parts.reduce((total,part)=>total+part.questions.length,0);
 pack.minutes=pack.parts.reduce((total,part)=>total+part.minutes,0);
 READING_PACKS.push(pack);
}

