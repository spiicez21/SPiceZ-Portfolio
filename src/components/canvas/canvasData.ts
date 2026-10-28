// Copy and personal bits that only the canvas home uses. Portfolio content
// (projects, stack, certs, etc.) still lives in src/content/*.json.

const A = '/images/stickers';
const FOOD = '/images/food';

// Desk layout around the centred portrait frame (x/y are % of the stage).
// `desktopOnly` stickers are hidden on narrow screens to keep it breathable.
export const heroStickers = [
    { id: 'helmet', src: `${A}/hamilton-helmet.webp`, alt: 'Lewis Hamilton Ferrari helmet', x: 13, y: 21, size: 125, rotate: -8, idle: 'cv-idle-a', label: 'LH44' },
    { id: 'specs', src: `${A}/specs.webp`, alt: 'Clear-frame glasses', x: 30, y: 13, size: 100, rotate: 6, idle: 'cv-idle-c', label: 'my specs', desktopOnly: true },
    { id: 'f1', src: `${A}/f1-car.webp`, alt: 'Red open-wheel racing car', x: 12, y: 53, size: 118, rotate: -6, idle: 'cv-idle-b', label: 'race week' },
    { id: 'monster', src: `${A}/monster-ultra.webp`, alt: 'White Monster Ultra can', x: 29, y: 49, size: 44, rotate: 8, idle: 'cv-idle-a', label: 'fuel #2', desktopOnly: true },
    { id: 'game', src: `${A}/retro-console.webp`, alt: 'Purple handheld game console', x: 11, y: 84, size: 88, rotate: 9, idle: 'cv-idle-c', label: 'side quests' },
    { id: 'coffee', src: `${A}/filter-coffee.webp`, alt: 'South Indian filter coffee in a steel davara', x: 29, y: 83, size: 90, rotate: -4, idle: 'cv-idle-b', label: 'filter kaapi' },
    { id: 'miss-minutes', src: `${A}/miss-minutes.png`, alt: 'Miss Minutes from the TVA', x: 70, y: 16, size: 82, rotate: 6, idle: 'cv-idle-c', label: 'for all time' },
    { id: 'cassette', src: `${A}/cassette.webp`, alt: 'Headphones and a cassette player', x: 88, y: 22, size: 115, rotate: 7, idle: 'cv-idle-b', label: 'on loop' },
    { id: 'phone', src: `${A}/galaxy-s23fe.webp`, alt: 'Samsung Galaxy S23 FE', x: 71, y: 51, size: 48, rotate: -10, idle: 'cv-idle-a', label: 'daily driver', desktopOnly: true },
    { id: 'computer', src: `${A}/retro-computer.webp`, alt: 'Vintage computer with a glowing cursor', x: 89, y: 54, size: 105, rotate: -5, idle: 'cv-idle-a', label: '3 AM builds' },
    { id: 'xbox', src: `${A}/xbox-controller.webp`, alt: 'Xbox controller with RGB lighting', x: 72, y: 85, size: 120, rotate: 5, idle: 'cv-idle-c', label: 'one more game' },
    { id: 'biryani', src: `${FOOD}/biryani.webp`, alt: 'Chicken biryani', x: 90, y: 85, size: 100, rotate: -6, idle: 'cv-idle-b', label: 'sunday biryani', desktopOnly: true },
    { id: 'bat', src: `${A}/batbro.gif`, alt: 'Tiny pixel Batman', x: 50, y: 7, size: 44, rotate: -6, idle: 'cv-idle-c', label: 'batbro' },
] as const;

// spice: 1-5 chillies on the food menu card; note shows under "Now serving".
export const dishes = [
    { id: 'biryani', name: 'Biryani', spice: 3, note: 'the Sunday ritual' },
    { id: 'parotta', name: 'Parotta', spice: 1, note: 'best after midnight' },
    { id: 'pepper-chicken', name: 'Pepper Chicken', spice: 4, note: 'clears the sinuses' },
    { id: 'chicken-65', name: 'Chicken 65', spice: 4, note: 'always on demand' },
    { id: 'masala-dosa', name: 'Masala Dosa', spice: 1, note: 'breakfast of champions' },
    { id: 'mutton-curry', name: 'Mutton Curry', spice: 3, note: 'worth the wait' },
    { id: 'idiyappam', name: 'Idiyappam', spice: 1, note: 'with a side of curry' },
    { id: 'kothu-parotta', name: 'Kothu Parotta', spice: 3, note: 'the street-side symphony' },
].map((d) => ({ ...d, src: `${FOOD}/${d.id}.webp` }));

export const ghostCursors = [
    { name: 'Lewis #44', color: '#00a19c' },
    { name: 'Miss Minutes', color: '#f08a24' },
    { name: 'Batbro', color: '#4285f4' },
] as const;

export const partnerMarks = [
    'HackBuzz 2k25 · 1st',
    'SimpMusic OSS',
    'FedEx R&D',
    'Oracle APEX',
    'Google Developers',
    'MathWorks',
    'Crescita · KEC',
    'FiveM / Qbox',
];

export const featuredCapabilities = [
    { title: 'Predictive Recovery', body: 'XGBoost scores rank which agency case is most likely to recover, so humans start with the right queue.' },
    { title: 'SLA Automation', body: 'BullMQ workers chase deadlines, escalate breaches, and keep an audit trail without anyone babysitting it.' },
    { title: 'Governance UI', body: 'One dense, calm dashboard for compliance teams: every agency, every case, every rule in one place.' },
    { title: 'Ship-ready Infra', body: 'Dockerised FastAPI + Node services that come up with one command and scale out per worker.' },
];

export const profileDetails = [
    { label: 'Currently', value: 'CSE undergrad · freelance designer' },
    { label: 'Focus', value: 'Full-stack products & UI craft' },
    { label: 'Location', value: 'Erode, Tamil Nadu, India' },
    { label: 'Alias', value: 'SPiceZ' },
    { label: 'Email', value: 'yuga.bharathijai2106@gmail.com' },
];

export type InterestCard = {
    id: string;
    eyebrow: string;
    title: string;
    body: string;
    image?: string;
    accent: string;
    span?: 'wide' | 'tall' | 'full';
    link?: { label: string; href: string };
};

export const interests: InterestCard[] = [
    {
        id: 'f1',
        eyebrow: 'Formula 1',
        title: 'Race weekends are non-negotiable.',
        body: 'Team Lewis #44 since forever, grudging respect for Max. I watch onboards the way some people watch ASMR.',
        image: `${A}/hamilton-helmet.webp`,
        accent: '#e11d48',
        span: 'wide',
    },
    {
        id: 'music',
        eyebrow: 'Music',
        title: 'Nothing ships without a soundtrack.',
        body: 'Live from my Spotify, right now. I also contributed the mini floating player to SimpMusic, so music literally follows me.',
        accent: '#1db954',
        span: 'tall',
    },
    {
        id: 'games',
        eyebrow: 'Gaming & modding',
        title: 'I mod the games I play.',
        body: 'GTA RP on FiveM led to custom HUDs and an ox-inventory revamp. Playing turned into building, as it usually does.',
        image: `${A}/xbox-controller.webp`,
        accent: '#8b6fe8',
    },
    {
        id: 'chess',
        eyebrow: 'Chess',
        title: 'Losing to Stockfish, professionally.',
        body: 'Liked it enough to build SpiceZ-Chexx, a WebRTC chess platform with Stockfish analysis built in.',
        accent: '#222222',
    },
    {
        id: 'tva',
        eyebrow: 'Marvel / Loki',
        title: 'For all time. Always.',
        body: 'The TVA retro-futurism lives rent-free in my head: amber CRTs, beige terminals, Miss Minutes. It sneaks into my UI work.',
        image: `${A}/miss-minutes.png`,
        accent: '#c27803',
    },
    {
        id: 'design',
        eyebrow: 'Graphic design',
        title: 'Pixels for hire.',
        body: 'Posters, logos and YouTube thumbnails for clubs and freelance clients, tuned for that click.',
        link: { label: 'See the full design portfolio', href: 'https://spicez21.netlify.app/' },
        accent: '#4285f4',
        span: 'wide',
    },
    {
        id: 'coffee',
        eyebrow: 'Fuel',
        title: 'Coffee is clearly involved.',
        body: 'Good code is written with good coffee and great music. If something here helped you, the cup is on you.',
        image: `${A}/filter-coffee.webp`,
        accent: '#a16207',
        span: 'wide',
        link: { label: 'Buy me a coffee', href: 'https://buymeacoffee.com/yugabharathi21' },
    },
    {
        id: 'bat',
        eyebrow: 'Batman',
        title: 'Batbro energy.',
        body: 'Nocturnal, gadget-obsessed, slightly dramatic. The resemblance to my sleep schedule is uncanny.',
        image: `${A}/batbro.gif`,
        accent: '#4285f4',
    },
    {
        id: 'food',
        eyebrow: 'Food',
        title: 'Will debug for biryani.',
        body: 'Tamil Nadu taste buds, so the bar is high: parotta at midnight, chicken 65 on demand, and a Sunday biryani that is basically a ritual.',
        accent: '#ea580c',
        span: 'full',
    },
];

export const journey = [
    { year: '2026', title: 'Lead Developer, IDMP', org: 'FedEx · Enterprise R&D', tags: ['AI', 'Platform'], body: 'Designed and built an AI governance platform for external debt-collection agencies.' },
    { year: '2026', title: 'Open Source Contributor', org: 'SimpMusic', tags: ['Kotlin', 'OSS'], body: 'Shipped the cross-platform mini floating player in the v1.0.2 desktop release.' },
    { year: '2025', title: '1st Place, HackBuzz 2k25', org: 'Team ThinkForge', tags: ['Hackathon', 'LLM'], body: 'AI study planner backed by a local Ollama LLM. Built in one sleepless sprint.' },
    { year: '2024', title: 'Freelance Designer & Developer', org: 'Self-employed', tags: ['Remote', 'Design'], body: 'Logos, thumbnails and websites for clients, clubs and college events.' },
    { year: '2021', title: 'Started SPiceZ', org: 'Where it began', tags: ['Origin'], body: 'Curiosity about how pixels move on a screen turned into a full-blown obsession.' },
];

// macOS-style dock in the About section. `running` draws the little dot
// macOS shows under apps that are open, so: the ones that never get closed.
export const dockApps: { id: string; name: string; note: string; running?: boolean; href?: string }[] = [
    { id: 'figma', name: 'Figma', note: 'ideas get pixels', running: true },
    { id: 'photoshop', name: 'Photoshop', note: 'posters & thumbnails' },
    { id: 'blender', name: 'Blender', note: '3D side quests' },
    { id: 'spotify', name: 'Spotify', note: 'never paused', running: true },
    { id: 'discord', name: 'Discord', note: 'team HQ', running: true },
    { id: 'steam', name: 'Steam', note: '"research"' },
    { id: 'gmail', name: 'Gmail', note: 'say hi →', href: 'mailto:yuga.bharathijai2106@gmail.com' },
];

// Footer line-up: the chibi grid split into single drivers, with Lewis (Ferrari) closing it out.
export const footerDrivers = [
    { id: 'mercedes-purple', team: 'Mercedes' },
    { id: 'red-bull', team: 'Red Bull' },
    { id: 'ferrari-16', team: 'Ferrari #16' },
    { id: 'mclaren-81', team: 'McLaren #81' },
    { id: 'mercedes-teal', team: 'Mercedes' },
    { id: 'aston-martin', team: 'Aston Martin' },
    { id: 'cadillac', team: 'Cadillac' },
    { id: 'williams', team: 'Williams' },
].map((d) => ({ src: `/images/footer/driver-${d.id}.webp`, alt: `Chibi ${d.team} driver` }))
    .concat({ src: '/images/footer/hamilton-chibi.webp', alt: 'Chibi Lewis Hamilton in Ferrari kit giving a thumbs up' });
