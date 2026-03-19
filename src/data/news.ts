import { NewsArticle, CategoryInfo, TagInfo } from '@/types';

export const newsArticles: NewsArticle[] = [
  {
    id: '1',
    title: 'NATO Secretary General Announces Enhanced Defense Posture in Baltic Region',
    summary: 'NATO Secretary General announced a significant reinforcement of allied forces in the Baltic region, including additional battalion groups and enhanced air defense capabilities amid growing tensions with Russia.',
    source: 'Reuters',
    category: 'military',
    tags: ['nato', 'russia', 'europe'],
    publishedAt: '2026-03-19T08:30:00Z',
    isBreaking: true,
    readTime: 4,
  },
  {
    id: '2',
    title: 'Taiwan Strait Tensions Rise as China Conducts Large-Scale Naval Exercises',
    summary: 'China has launched what state media describes as "routine" naval exercises near the Taiwan Strait, featuring aircraft carrier Shandong and multiple escort vessels in a display of military capability.',
    source: 'Financial Times',
    category: 'geopolitics',
    tags: ['china', 'taiwan', 'asia-pacific'],
    publishedAt: '2026-03-19T07:15:00Z',
    isBreaking: true,
    readTime: 5,
  },
  {
    id: '3',
    title: 'EU Agrees on New Sanctions Package Targeting Russian Energy Sector',
    summary: 'European Union member states have reached a consensus on the 14th sanctions package against Russia, focusing on liquefied natural gas imports and technology transfers in the energy sector.',
    source: 'Bloomberg',
    category: 'economy',
    tags: ['eu', 'russia', 'sanctions'],
    publishedAt: '2026-03-19T06:45:00Z',
    readTime: 3,
  },
  {
    id: '4',
    title: 'Ukraine Secures Additional Military Aid from Western Allies',
    summary: 'The United States and Germany have announced a new joint military aid package for Ukraine, including advanced air defense systems and armored vehicles worth approximately €8 billion.',
    source: 'The Guardian',
    category: 'military',
    tags: ['ukraine', 'usa', 'eu'],
    publishedAt: '2026-03-18T22:00:00Z',
    readTime: 4,
  },
  {
    id: '5',
    title: 'Cyber Attack Targets Critical Infrastructure in Multiple NATO Countries',
    summary: 'Security agencies across NATO member states are investigating a coordinated cyber attack that disrupted services in energy and transportation sectors, with suspected state-sponsored involvement.',
    source: 'CyberScoop',
    category: 'security',
    tags: ['nato', 'cyber', 'russia'],
    publishedAt: '2026-03-18T20:30:00Z',
    readTime: 6,
  },
  {
    id: '6',
    title: 'G7 Nations Coordinate New Trade Restrictions on Advanced Semiconductors',
    summary: 'The Group of Seven nations have aligned on expanded export controls for advanced semiconductor technology and chip manufacturing equipment, targeting China\'s technological development.',
    source: 'WSJ',
    category: 'economy',
    tags: ['china', 'trade', 'usa', 'eu'],
    publishedAt: '2026-03-18T18:15:00Z',
    readTime: 5,
  },
  {
    id: '7',
    title: 'Arctic Council Meeting Reveals Deepening Divisions Over Resource Rights',
    summary: 'The latest Arctic Council session ended without consensus on resource extraction rights and shipping lane governance, highlighting growing competition among Arctic nations.',
    source: 'Nature',
    category: 'geopolitics',
    tags: ['arctic', 'russia', 'nato'],
    publishedAt: '2026-03-18T16:00:00Z',
    readTime: 4,
  },
  {
    id: '8',
    title: 'Iran Nuclear Deal Revival Efforts Face New Obstacles',
    summary: 'Diplomatic negotiations to revive the Joint Comprehensive Plan of Action face renewed challenges as both parties present conflicting demands regarding nuclear facility inspections.',
    source: 'Al Jazeera',
    category: 'diplomacy',
    tags: ['middle-east', 'nuclear'],
    publishedAt: '2026-03-18T14:30:00Z',
    readTime: 5,
  },
  {
    id: '9',
    title: 'North Korea Conducts New Ballistic Missile Test Near Japanese Waters',
    summary: 'North Korea has test-fired an unspecified ballistic missile that landed in Japan\'s exclusive economic zone, prompting condemnation from Tokyo and emergency UN Security Council consultations.',
    source: 'NHK',
    category: 'military',
    tags: ['asia-pacific', 'nuclear'],
    publishedAt: '2026-03-18T12:00:00Z',
    isBreaking: true,
    readTime: 3,
  },
  {
    id: '10',
    title: 'European Elections 2026: Populist Gains Reshape Political Landscape',
    summary: 'Early results from European Parliament elections indicate significant gains for nationalist parties in several key member states, potentially affecting EU foreign policy consensus on Ukraine and migration.',
    source: 'Le Monde',
    category: 'geopolitics',
    tags: ['eu', 'elections'],
    publishedAt: '2026-03-18T10:00:00Z',
    readTime: 6,
  },
  {
    id: '11',
    title: 'US Indo-Pacific Command Requests Increased Defense Budget for Taiwan Defense',
    summary: 'INDOPACOM has submitted a budget proposal requesting $12 billion for Taiwan defense preparation, including missile defense systems and enhanced military presence in the region.',
    source: 'Defense News',
    category: 'military',
    tags: ['usa', 'taiwan', 'china', 'asia-pacific'],
    publishedAt: '2026-03-18T08:00:00Z',
    readTime: 4,
  },
  {
    id: '12',
    title: 'Global Military Spending Hits Record High in 2025, SIPRI Report Reveals',
    summary: 'Global military expenditure reached $2.2 trillion in 2025, with the highest growth rates in Europe and Asia-Pacific regions amid escalating geopolitical tensions.',
    source: 'SIPRI',
    category: 'military',
    tags: ['nato', 'china', 'russia'],
    publishedAt: '2026-03-17T15:00:00Z',
    readTime: 5,
  },
];

export const categories: CategoryInfo[] = [
  { id: 'geopolitics', name: 'Geopolítica', icon: 'globe', color: 'blue' },
  { id: 'military', name: 'Militar', icon: 'shield', color: 'red' },
  { id: 'economy', name: 'Economía', icon: 'chart', color: 'amber' },
  { id: 'technology', name: 'Tecnología', icon: 'cpu', color: 'cyan' },
  { id: 'diplomacy', name: 'Diplomacia', icon: 'handshake', color: 'violet' },
  { id: 'security', name: 'Seguridad', icon: 'lock', color: 'green' },
];

export const tags: TagInfo[] = [
  { id: 'nato', name: 'OTAN', count: 8 },
  { id: 'china', name: 'China', count: 6 },
  { id: 'taiwan', name: 'Taiwán', count: 4 },
  { id: 'russia', name: 'Rusia', count: 7 },
  { id: 'ukraine', name: 'Ucranía', count: 5 },
  { id: 'usa', name: 'EE.UU.', count: 9 },
  { id: 'eu', name: 'UE', count: 6 },
  { id: 'europe', name: 'Europa', count: 3 },
  { id: 'middle-east', name: 'Medio Oriente', count: 3 },
  { id: 'asia-pacific', name: 'Asia-Pacífico', count: 5 },
  { id: 'arctic', name: 'Ártico', count: 2 },
  { id: 'nuclear', name: 'Nuclear', count: 4 },
  { id: 'cyber', name: 'Ciberseguridad', count: 3 },
  { id: 'sanctions', name: 'Sanciones', count: 4 },
  { id: 'elections', name: 'Elecciones', count: 2 },
  { id: 'trade', name: 'Comercio', count: 3 },
];

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffMins = Math.floor(diffMs / (1000 * 60));

  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
}

export function getCategoryColor(categoryId: string): string {
  const colors: Record<string, string> = {
    geopolitics: 'var(--accent-blue)',
    military: 'var(--accent-red)',
    economy: 'var(--accent-amber)',
    technology: 'var(--accent-blue)',
    diplomacy: '#8b5cf6',
    security: 'var(--accent-green)',
  };
  return colors[categoryId] || 'var(--text-secondary)';
}
