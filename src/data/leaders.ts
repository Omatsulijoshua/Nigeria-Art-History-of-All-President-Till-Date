import type { Leader, Era } from '../types';

export const ERAS: Record<string, Era> = {
  colonial: {
    id: 'colonial',
    name: 'Colonial Era',
    startYear: 1914,
    endYear: 1960,
    description: 'British administration of Nigeria following the amalgamation of the Northern and Southern protectorates.',
    color: '#b45309', // Amber-700
    ambientColor: '#120a03',
    spotlightColor: '#ffebd3', // Warm lantern glow
    materials: {
      wallRoughness: 0.9,
      floorRoughness: 0.35,
      floorMetalness: 0.1
    }
  },
  independence: {
    id: 'independence',
    name: 'First Republic & Independence',
    startYear: 1960,
    endYear: 1966,
    description: 'The dawn of self-governance and the First Republic, characterized by regional governance and federal consolidation.',
    color: '#047857', // Emerald-700
    ambientColor: '#03140b',
    spotlightColor: '#e6fffa', // Pale crisp green/white
    materials: {
      wallRoughness: 0.7,
      floorRoughness: 0.15,
      floorMetalness: 0.3
    }
  },
  military: {
    id: 'military',
    name: 'Military Rule',
    startYear: 1966,
    endYear: 1999,
    description: 'Epoch of military intervention, coups d\'état, and civil war, interspersed with brief democratic interludes.',
    color: '#4b5563', // Gray-600
    ambientColor: '#07090d',
    spotlightColor: '#e2f1ff', // Hard searchlight blue-white
    materials: {
      wallRoughness: 0.95,
      floorRoughness: 0.5,
      floorMetalness: 0.7
    }
  },
  democratic: {
    id: 'democratic',
    name: 'Fourth Democratic Republic',
    startYear: 1999,
    endYear: 2026,
    description: 'The longest stretch of continuous civilian-led constitutional democracy in Nigerian history.',
    color: '#0284c7', // Sky-700
    ambientColor: '#020b18',
    spotlightColor: '#fff9e6', // Royal gold-white
    materials: {
      wallRoughness: 0.5,
      floorRoughness: 0.08,
      floorMetalness: 0.5
    }
  }
};

// We space leaders chronologically along the X axis.
// Let spacing be 25 units per leader.
export const LEADERS: Leader[] = [
  // --- COLONIAL GOVERNORS ---
  {
    id: 'lugard',
    name: 'Lord Frederick Lugard',
    wikipediaTitle: 'Frederick_Lugard,_1st_Baron_Lugard',
    era: 'colonial',
    role: 'Governor-General of Nigeria',
    startYear: 1914,
    endYear: 1919,
    birthYear: 1858,
    deathYear: 1945,
    achievements: [
      { year: 1914, title: 'Amalgamation of Nigeria', description: 'Merged the Southern and Northern Nigeria Protectorates into a single colony.' },
      { year: 1916, title: 'Education Ordinance', description: 'Introduced centralized control over education and funding standards.' },
      { year: 1918, title: 'Indirect Rule System', description: 'Codified administrative systems leveraging traditional rulers (Emirs and Chiefs).' }
    ],
    x: 0
  },
  {
    id: 'clifford',
    name: 'Sir Hugh Clifford',
    wikipediaTitle: 'Hugh_Clifford',
    era: 'colonial',
    role: 'Governor of Nigeria',
    startYear: 1919,
    endYear: 1925,
    birthYear: 1866,
    deathYear: 1941,
    achievements: [
      { year: 1922, title: 'Clifford Constitution', description: 'Introduced the elective principle in Nigeria for the first time, allowing elected representation.' },
      { year: 1923, title: 'First Legislative Council', description: 'Established a new council with representation for Southern Nigeria.' },
      { year: 1924, title: 'Agricultural Expansion', description: 'Promoted local cocoa and palm oil production structures.' }
    ],
    x: 25
  },
  {
    id: 'cameron',
    name: 'Sir Donald Cameron',
    wikipediaTitle: 'Donald_Cameron_(colonial_governor)',
    era: 'colonial',
    role: 'Governor of Nigeria',
    startYear: 1931,
    endYear: 1935,
    birthYear: 1872,
    deathYear: 1948,
    achievements: [
      { year: 1933, title: 'Judicial Reforms', description: 'Abolished provincial courts and established High Courts to ensure legal representation.' },
      { year: 1934, title: 'Native Administration Ordinance', description: 'Reformed indirect rule to make local governance systems more accountable.' },
      { year: 1935, title: 'Infrastructure Expansion', description: 'Supervised extensions of the national railway and electricity grids.' }
    ],
    x: 50
  },
  {
    id: 'bourdillon',
    name: 'Sir Bernard Bourdillon',
    wikipediaTitle: 'Bernard_Bourdillon',
    era: 'colonial',
    role: 'Governor of Nigeria',
    startYear: 1935,
    endYear: 1943,
    birthYear: 1883,
    deathYear: 1948,
    achievements: [
      { year: 1939, title: 'Regionalization of Nigeria', description: 'Divided the Southern Province into Western and Eastern Provinces, sowing seeds of regionalism.' },
      { year: 1941, title: 'War Effort Mobilization', description: 'Coordinated raw materials and military recruitment for the British during WWII.' },
      { year: 1942, title: 'Constitutional Proposals', description: 'Drafted proposals that later became the basis for the Richards Constitution.' }
    ],
    x: 75
  },
  {
    id: 'richards',
    name: 'Sir Arthur Richards',
    wikipediaTitle: 'Arthur_Richards,_1st_Baron_Milverton',
    era: 'colonial',
    role: 'Governor of Nigeria',
    startYear: 1943,
    endYear: 1948,
    birthYear: 1885,
    deathYear: 1978,
    achievements: [
      { year: 1946, title: 'Richards Constitution', description: 'Formally divided the country into Northern, Western, and Eastern regions with regional assemblies.' },
      { year: 1947, title: 'Central Legislative Council', description: 'Created a legislative council encompassing the entire country, including the North.' }
    ],
    x: 100
  },
  {
    id: 'macpherson',
    name: 'Sir John Macpherson',
    wikipediaTitle: 'John_Stuart_Macpherson',
    era: 'colonial',
    role: 'Governor-General of Nigeria',
    startYear: 1948,
    endYear: 1955,
    birthYear: 1898,
    deathYear: 1971,
    achievements: [
      { year: 1948, title: 'University College Ibadan', description: 'Backed the rapid development of Nigeria\'s first university institute.' },
      { year: 1951, title: 'Macpherson Constitution', description: 'Established a central House of Representatives and regional executive councils.' },
      { year: 1954, title: 'Introduction of Federalism', description: 'Transitioned the administration toward the Lyttelton Constitution, officially establishing a federation.' }
    ],
    x: 125
  },
  {
    id: 'robertson',
    name: 'Sir James Robertson',
    wikipediaTitle: 'James_Wilson_Robertson',
    era: 'colonial',
    role: 'Governor-General of Nigeria',
    startYear: 1955,
    endYear: 1960,
    birthYear: 1899,
    deathYear: 1983,
    achievements: [
      { year: 1957, title: 'Self-Governance Declarations', description: 'Approved self-governance charters for the Western and Eastern regions.' },
      { year: 1958, title: 'Willink Commission', description: 'Initiated the commission to investigate minor ethnic groups\' fears ahead of independence.' },
      { year: 1960, title: 'Handover of Sovereignty', description: 'Presided over the formal independence celebrations on October 1, 1960.' }
    ],
    x: 150
  },

  // --- INDEPENDENCE ERA LEADERS ---
  {
    id: 'balewa',
    name: 'Sir Abubakar Tafawa Balewa',
    wikipediaTitle: 'Abubakar_Tafawa_Balewa',
    era: 'independence',
    role: 'Prime Minister of Nigeria',
    startYear: 1960,
    endYear: 1966,
    birthYear: 1912,
    deathYear: 1966,
    achievements: [
      { year: 1960, title: 'First Federal Cabinet', description: 'Led the post-independence coalition government with regional parties.' },
      { year: 1961, title: 'Foreign Policy Doctrine', description: 'Established Nigeria as a leader in the Non-Aligned Movement and voice against apartheid.' },
      { year: 1963, title: 'Creation of Mid-Western Region', description: 'Successfully carved out the Midwestern region through a constitutional plebiscite.' }
    ],
    x: 175
  },
  {
    id: 'azikiwe',
    name: 'Dr. Nnamdi Azikiwe',
    wikipediaTitle: 'Nnamdi_Azikiwe',
    era: 'independence',
    role: 'First President of Nigeria',
    startYear: 1963,
    endYear: 1966,
    birthYear: 1904,
    deathYear: 1996,
    achievements: [
      { year: 1960, title: 'Governor-General Appointment', description: 'Became the first indigenous representative of the Crown upon independence.' },
      { year: 1963, title: 'Republican Constitution', description: 'Sworn in as President when Nigeria declared itself a Federal Republic.' },
      { year: 1965, title: 'Pan-African Leadership', description: 'Co-founded news outlets and universities to spark nationalist education across West Africa.' }
    ],
    x: 200
  },
  {
    id: 'awolowo',
    name: 'Chief Obafemi Awolowo',
    wikipediaTitle: 'Obafemi_Awolowo',
    era: 'independence',
    role: 'Opposition Leader / Premier',
    startYear: 1954,
    endYear: 1960,
    birthYear: 1909,
    deathYear: 1987,
    achievements: [
      { year: 1955, title: 'Free Universal Education', description: 'Launched the first free primary education scheme in the Western Region.' },
      { year: 1959, title: 'WNTV - First TV Station', description: 'Established the Western Nigeria Television service, the first in Sub-Saharan Africa.' },
      { year: 1962, title: 'Democratic Opposition', description: 'Served as Leader of the Opposition in the Federal Parliament, shaping debates.' }
    ],
    x: 225
  },

  // --- MILITARY ERA LEADERS ---
  {
    id: 'ironsi',
    name: 'General Johnson Aguiyi-Ironsi',
    wikipediaTitle: 'Johnson_Aguiyi-Ironsi',
    era: 'military',
    role: 'Military Head of State',
    startYear: 1966,
    endYear: 1966,
    birthYear: 1924,
    deathYear: 1966,
    achievements: [
      { year: 1966, title: 'Unification Decree No. 34', description: 'Abolished the federal structure in favor of a unitary system of government.' },
      { year: 1966, title: 'Restoration of Public Order', description: 'Suppressed early regional violence and established military administrative zones.' }
    ],
    x: 250
  },
  {
    id: 'gowon',
    name: 'General Yakubu Gowon',
    wikipediaTitle: 'Yakubu_Gowon',
    era: 'military',
    role: 'Military Head of State',
    startYear: 1966,
    endYear: 1975,
    birthYear: 1934,
    achievements: [
      { year: 1967, title: 'Creation of 12 States', description: 'Dissolved the four regions to establish 12 states to prevent secessionist drives.' },
      { year: 1970, title: 'Reconciliation Policy', description: 'Ended the Civil War with the declaration of "No Victor, No Vanquished" and 3Rs (Reconstruction, Rehabilitation, Reconciliation).' },
      { year: 1973, title: 'National Youth Service Corps', description: 'Established the NYSC scheme to foster national unity and integration.' }
    ],
    x: 275
  },
  {
    id: 'murtala',
    name: 'General Murtala Mohammed',
    wikipediaTitle: 'Murtala_Mohammed',
    era: 'military',
    role: 'Military Head of State',
    startYear: 1975,
    endYear: 1976,
    birthYear: 1938,
    deathYear: 1976,
    achievements: [
      { year: 1975, title: 'Federal Capital Relocation Plan', description: 'Initiated the panel that chose Abuja as the site for Nigeria\'s new capital.' },
      { year: 1976, title: 'Local Government Reforms', description: 'Recognized local government as a third tier of governance structures.' },
      { year: 1976, title: 'Anti-Corruption Crusade', description: 'Launched a massive probe and dismissed corrupt officials to clean the public service.' }
    ],
    x: 300
  },
  {
    id: 'obasanjo_mil',
    name: 'General Olusegun Obasanjo (Military)',
    wikipediaTitle: 'Olusegun_Obasanjo',
    era: 'military',
    role: 'Military Head of State',
    startYear: 1976,
    endYear: 1979,
    birthYear: 1937,
    achievements: [
      { year: 1976, title: 'Operation Feed the Nation', description: 'Launched an agricultural program to increase local food production.' },
      { year: 1978, title: 'Land Use Act', description: 'Vested all urban land in State Governors to ease public land acquisition.' },
      { year: 1979, title: 'Transition to Civil Rule', description: 'Successfully handed over power to a democratically elected civilian government.' }
    ],
    x: 325
  },
  {
    id: 'buhari_mil',
    name: 'Major General Muhammadu Buhari (Military)',
    wikipediaTitle: 'Muhammadu_Buhari',
    era: 'military',
    role: 'Military Head of State',
    startYear: 1983,
    endYear: 1985,
    birthYear: 1942,
    achievements: [
      { year: 1984, title: 'War Against Indiscipline', description: 'Launched a nationwide campaign to enforce civic order, punctuality, and cleanliness.' },
      { year: 1984, title: 'Currency Redesign', description: 'Changed the colors of the Naira notes to combat currency smuggling and hoarding.' }
    ],
    x: 350
  },
  {
    id: 'babangida',
    name: 'General Ibrahim Babangida',
    wikipediaTitle: 'Ibrahim_Babangida',
    era: 'military',
    role: 'Military President',
    startYear: 1985,
    endYear: 1993,
    birthYear: 1941,
    achievements: [
      { year: 1986, title: 'Structural Adjustment Program', description: 'Devalued the Naira and liberalized trades under IMF/World Bank directives.' },
      { year: 1990, title: 'Third Mainland Bridge Completion', description: 'Completed and commissioned Africa\'s longest bridge at the time, connecting Lagos.' },
      { year: 1991, title: 'Abuja Capital Commissioning', description: 'Officially moved the federal capital from Lagos to Abuja.' }
    ],
    x: 375
  },
  {
    id: 'abacha',
    name: 'General Sani Abacha',
    wikipediaTitle: 'Sani_Abacha',
    era: 'military',
    role: 'Military Head of State',
    startYear: 1993,
    endYear: 1998,
    birthYear: 1943,
    deathYear: 1998,
    achievements: [
      { year: 1994, title: 'Petroleum Trust Fund (PTF)', description: 'Created an agency to channel oil revenues into rebuilding roads, hospitals, and schools.' },
      { year: 1996, title: 'Creation of 6 States', description: 'Expanded the federation to 36 states (adding Bayelsa, Ebonyi, Gombe, Ekiti, Nassarawa, and Zamfara).' },
      { year: 1997, title: 'Economic Stabilization', description: 'Maintained low inflation and pegged the Naira exchange rate to promote predictability.' }
    ],
    x: 400
  },
  {
    id: 'abubakar',
    name: 'General Abdulsalami Abubakar',
    wikipediaTitle: 'Abdulsalami_Abubakar',
    era: 'military',
    role: 'Military Head of State',
    startYear: 1998,
    endYear: 1999,
    birthYear: 1942,
    achievements: [
      { year: 1998, title: 'INEC Setup', description: 'Established the Independent National Electoral Commission to organize multiparty polls.' },
      { year: 1999, title: '1999 Constitution Promulgation', description: 'Enacted the current constitution of the Federal Republic of Nigeria.' },
      { year: 1999, title: 'Fourth Republic Transition', description: 'Handed over power to Olusegun Obasanjo, marking the birth of modern democracy.' }
    ],
    x: 425
  },

  // --- DEMOCRATIC ERA LEADERS ---
  {
    id: 'shagari',
    name: 'Alhaji Shehu Shagari',
    wikipediaTitle: 'Shehu_Shagari',
    era: 'democratic', // Rules in 2nd Republic (1979-1983)
    role: 'President of Nigeria (Second Republic)',
    startYear: 1979,
    endYear: 1983,
    birthYear: 1925,
    deathYear: 2018,
    achievements: [
      { year: 1980, title: 'Green Revolution Program', description: 'Launched a food self-sufficiency policy through mechanization.' },
      { year: 1981, title: 'Ajaokuta Steel Development', description: 'Prioritized heavy industry and built massive housing complexes across Nigeria.' },
      { year: 1982, title: 'Primary Education Funding', description: 'Expanded municipal school access to rural areas.' }
    ],
    x: 450
  },
  {
    id: 'obasanjo_dem',
    name: 'Chief Olusegun Obasanjo (Democratic)',
    wikipediaTitle: 'Olusegun_Obasanjo',
    era: 'democratic',
    role: 'President of Nigeria',
    startYear: 1999,
    endYear: 2007,
    birthYear: 1937,
    achievements: [
      { year: 2000, title: 'Anti-Graft Agencies (EFCC & ICPC)', description: 'Established special units to combat public and private sector corruption.' },
      { year: 2001, title: 'GSM Telecommunication Revolution', description: 'Deregulated telecommunications, enabling rapid mobile cellular connectivity.' },
      { year: 2005, title: 'Paris Club Debt Relief', description: 'Secured an $18 billion debt write-off from the Paris Club of creditors.' }
    ],
    x: 475
  },
  {
    id: 'yaradua',
    name: 'Alhaji Umaru Musa Yar\'Adua',
    wikipediaTitle: 'Umaru_Musa_Yar\'Adua',
    era: 'democratic',
    role: 'President of Nigeria',
    startYear: 2007,
    endYear: 2010,
    birthYear: 1951,
    deathYear: 2010,
    achievements: [
      { year: 2008, title: '7-Point Agenda', description: 'Unveiled development plans targeting power, food security, and wealth creation.' },
      { year: 2009, title: 'Niger Delta Amnesty Program', description: 'Ended militant hostilities by offering vocational training and monthly stipends in exchange for weapons.' },
      { year: 2009, title: 'Adherence to Rule of Law', description: 'Respected court decisions, strengthening institutional independence.' }
    ],
    x: 500
  },
  {
    id: 'jonathan',
    name: 'Dr. Goodluck Jonathan',
    wikipediaTitle: 'Goodluck_Jonathan',
    era: 'democratic',
    role: 'President of Nigeria',
    startYear: 2010,
    endYear: 2015,
    birthYear: 1957,
    achievements: [
      { year: 2011, title: 'Freedom of Information Act', description: 'Signed the law granting citizens legal access to government records.' },
      { year: 2013, title: 'Power Sector Privatization', description: 'Unbundled PHCN and sold generation/distribution assets to private operators.' },
      { year: 2015, title: 'Concession of Election', description: 'Conceded defeat peacefully to Muhammadu Buhari, preventing post-election violence.' }
    ],
    x: 525
  },
  {
    id: 'buhari_dem',
    name: 'Muhammadu Buhari (Democratic)',
    wikipediaTitle: 'Muhammadu_Buhari',
    era: 'democratic',
    role: 'President of Nigeria',
    startYear: 2015,
    endYear: 2023,
    birthYear: 1942,
    achievements: [
      { year: 2018, title: 'Social Investment Programme', description: 'Launched N-Power and TraderMoni to provide safety nets for vulnerable citizens.' },
      { year: 2020, title: 'Second Niger Bridge Construction', description: 'Completed and commissioned the historic transport link between Southeastern and Western regions.' },
      { year: 2021, title: 'Petroleum Industry Act (PIA)', description: 'Passed sweeping legislation reforming the commercial structure of the oil and gas sector.' }
    ],
    x: 550
  },
  {
    id: 'tinubu',
    name: 'Asiwaju Bola Ahmed Tinubu',
    wikipediaTitle: 'Bola_Tinubu',
    era: 'democratic',
    role: 'President of Nigeria',
    startYear: 2023,
    endYear: 2026, // Serving till present
    birthYear: 1952,
    achievements: [
      { year: 2023, title: 'Fuel Subsidy Reform', description: 'Abolished petrol subsidies to reallocate federal capital to infrastructure.' },
      { year: 2023, title: 'Exchange Rate Unification', description: 'Merged parallel and official foreign exchange windows to float the Naira.' },
      { year: 2024, title: 'Student Loan Act', description: 'Launched the Nigerian Education Loan Fund (NELFUND) to finance tertiary education for underprivileged students.' }
    ],
    x: 575
  }
];
