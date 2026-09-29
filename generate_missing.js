const fs = require('fs');

const missingReading = [
  {
    "title": "CLB 12 Reading: Part 2: Reading to Apply a Diagram",
    "passage": "SUBJECT: Diagram Analysis - Project 'Ouroboros'\n\n[DIAGRAM: INFRASTRUCTURE COST-BENEFIT MATRIX]\n| Vendor | Implementation Time | Upfront Capital ($) | 5-Year Maintenance | Encryption Standard |\n|--------|---------------------|---------------------|--------------------|---------------------|\n| Apex   | 14 Months           | 2.4 Million         | 15% / year         | AES-256             |\n| Zenith | 6 Months            | 4.1 Million         | 5% / year          | Quantum-Resistant   |\n| Nexus  | 24 Months           | 1.2 Million         | 25% / year         | AES-128             |\n\nTo the Board of Directors,\n\nAs requested, I have compiled the cost-benefit matrix for the overhaul of our cybersecurity infrastructure, codenamed Project Ouroboros. Given the recent string of state-sponsored cyber intrusions targeting our sector, the urgency of this upgrade cannot be overstated. \n\nWhile the Nexus bid is ostensibly the most appealing from a purely fiscal standpoint regarding upfront capital, their projected implementation timeline is glacially slow. By the time their system is operational, their encryption standards will already be deprecated by emerging industry regulations. \n\nApex presents a moderate compromise, but their exorbitant annual maintenance fees will ultimately eclipse the initial savings within a four-year window. Therefore, despite the substantial initial financial hemorrhage, I strongly advocate for the Zenith proposal. Their rapid deployment capability and forward-looking quantum-resistant architecture provide the only viable safeguard against the sophisticated cryptographic threats we anticipate in the next decade.\n\nRegards,\nMarcus Thorne\nChief Information Security Officer",
    "questions": [
      { "text": "According to the matrix, which vendor has the lowest upfront capital cost?", "options": ["Apex", "Zenith", "Nexus", "Ouroboros"], "correctAnswerIndex": 2 },
      { "text": "Why does Marcus Thorne reject the Nexus proposal?", "options": ["It lacks an encryption standard entirely.", "The maintenance costs are too low to be reliable.", "The implementation timeline is unacceptably long.", "It requires a 4.1 million dollar upfront investment."], "correctAnswerIndex": 2 },
      { "text": "What is the primary flaw of the Apex proposal according to the email?", "options": ["It uses deprecated AES-128 encryption.", "The long-term maintenance costs are prohibitively expensive.", "It will take two years to implement.", "It is vulnerable to state-sponsored cyber intrusions."], "correctAnswerIndex": 1 },
      { "text": "Why does Thorne recommend Zenith despite its high initial cost?", "options": ["It has the lowest annual maintenance fee.", "It is the only vendor that uses AES-256 encryption.", "It offers rapid deployment and future-proof encryption.", "It was specifically requested by the Board of Directors."], "correctAnswerIndex": 2 },
      { "text": "What is the underlying motivation for Project Ouroboros?", "options": ["To reduce the company's overall IT maintenance budget.", "To transition to a new email server provider.", "To protect the company against imminent, advanced cyber threats.", "To evaluate the financial stability of three different vendors."], "correctAnswerIndex": 2 }
    ]
  }
];

const missingListening = [
  {
    "title": "CLB 12 Listening: Part 4: Listening to a News Item",
    "transcript": "Good evening. In our top story tonight, a groundbreaking study published in the Journal of Theoretical Physics has sent shockwaves through the astronomical community. A coalition of astrophysicists from the European Space Agency claims to have detected definitive gravitational anomalies on the periphery of the Kuiper Belt. These microscopic orbital perturbations, measured by the recently deployed Argus Telescope, cannot be accounted for by the gravitational pull of Neptune or any known celestial body in our solar system.\n\nDr. Aris Thorne, the lead researcher on the project, posits that these anomalies are the gravitational footprint of a primordial black hole, roughly the mass of a grapefruit, captured by the sun's orbit billions of years ago. This radical hypothesis directly challenges the prevailing 'Planet Nine' theory, which suggests the anomalies are caused by an undiscovered, Neptune-sized ice giant.\n\nIf Dr. Thorne's hypothesis is corroborated, it would force a paradigm shift in our understanding of planetary formation and the distribution of dark matter within our local cosmic neighborhood. However, skeptics within the scientific community argue that the Argus Telescope's calibration algorithms are notoriously sensitive to solar radiation interference, suggesting the 'anomalies' may be nothing more than instrumental artifacts. The European Space Agency plans to conduct a secondary sweep of the sector using deep-infrared sensors next quarter to verify the findings.",
    "questions": [
      { "text": "What is the primary subject of the news report?", "options": ["The discovery of a new ice giant named Planet Nine.", "A malfunction in the Argus Telescope's calibration algorithms.", "The detection of unexplained gravitational anomalies in the solar system.", "The launch of a new European Space Agency telescope."], "correctAnswerIndex": 2 },
      { "text": "What does Dr. Thorne believe is causing the orbital perturbations?", "options": ["The gravitational pull of Neptune.", "An undiscovered, Neptune-sized ice giant.", "A primordial black hole roughly the mass of a grapefruit.", "Solar radiation interference."], "correctAnswerIndex": 2 },
      { "text": "How does Dr. Thorne's hypothesis conflict with the prevailing scientific theory?", "options": ["It suggests that Neptune does not exist.", "It attributes the anomalies to a black hole rather than an undiscovered planet.", "It claims that the Argus Telescope is malfunctioning.", "It argues that dark matter is not present in our solar system."], "correctAnswerIndex": 1 },
      { "text": "What do skeptics argue might be the actual cause of the detected anomalies?", "options": ["The gravitational pull of an ice giant.", "Instrumental errors caused by solar radiation.", "A flaw in the Journal of Theoretical Physics' peer-review process.", "The presence of a primordial black hole."], "correctAnswerIndex": 1 },
      { "text": "What is the European Space Agency's planned next step?", "options": ["To recalibrate the Argus Telescope using solar radiation.", "To publish a retraction in the Journal of Theoretical Physics.", "To launch a mission to the Kuiper Belt to retrieve the black hole.", "To use deep-infrared sensors to verify the data in the coming months."], "correctAnswerIndex": 3 }
    ]
  }
];

let rData = JSON.parse(fs.readFileSync('celpip_reading.json', 'utf8'));
let lData = JSON.parse(fs.readFileSync('celpip_listening.json', 'utf8'));

rData = [...rData, ...missingReading];
lData = [...lData, ...missingListening];

fs.writeFileSync('celpip_reading.json', JSON.stringify(rData, null, 2));
fs.writeFileSync('celpip_listening.json', JSON.stringify(lData, null, 2));
console.log('Added missing sections.');
