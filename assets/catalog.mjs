/** Pure catalog helpers shared by the UI and the regression tests. */
export const FORMAT_ORDER = { whiteboard: 0, paper: 1 };
export function normalize(value) {
  return String(value).normalize('NFKD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[′’]/g, "'").trim();
}
const topicOrder = {
  calculus: ['Limits','Derivatives & Applications','Integrals & Antiderivatives','Convergence & Series','AP Calculus BC 2019'],
  vectors: ['Vector Basics','Dot Product','Cross Product'],
  algebra: ['Equations & Expressions','Sequences & Series','Ratios & Word Problems'],
  geometry: ['Triangles & Lengths','Circles','Coordinates & Conics','Area & Geometry Problems'],
  probability: ['Counting Methods','Probability Problems'],
  trigonometry: ['Angles & Trig Functions','Trigonometric Identities','Trigonometric Equations'],
  'number-theory': ['Primes & Divisibility','Digits & Place Value','Diophantine Equations','Induction & Reasoning']
};
const introductoryLessons = ['ToKwG72TLGs','Ji4gCRplvMU'];
function topicRank(video) { const rank = topicOrder[video.category]?.indexOf(video.topic); return rank === undefined || rank < 0 ? 99 : rank; }
const collator = new Intl.Collator('en', { numeric: true, sensitivity: 'base' });
export function compareLessons(a, b) {
  return FORMAT_ORDER[a.format] - FORMAT_ORDER[b.format] || topicRank(a) - topicRank(b) || collator.compare(a.topic, b.topic) || Number(!introductoryLessons.includes(a.id)) - Number(!introductoryLessons.includes(b.id)) || collator.compare(a.title, b.title) || a.sourceOrder - b.sourceOrder;
}
export function filterLessons(videos, { category = 'all', topic = 'all', format = 'all', q = '' } = {}) {
  const words = normalize(q).split(/\s+/).filter(Boolean);
  return videos.filter(v => (category === 'all' || v.category === category)
    && (topic === 'all' || v.topic === topic)
    && (format === 'all' || v.format === format)
    && words.every(word => normalize([v.title, v.originalTitle, v.category, v.topic, ...v.tags].join(' ')).includes(word)))
    .sort(compareLessons);
}
export function groupLessons(videos, categories) {
  return categories.map(category => ({ category, videos: videos.filter(v => v.category === category.id).sort(compareLessons) })).filter(group => group.videos.length);
}
export function readFilters(search) {
  const p = new URLSearchParams(search);
  return { category: p.get('category') || 'all', topic: p.get('topic') || 'all', format: p.get('format') || 'all', q: p.get('q') || '' };
}
export function filterSearch(filters, watch) {
  const p = new URLSearchParams();
  for (const key of ['category', 'topic', 'format', 'q']) if (filters[key] && filters[key] !== 'all') p.set(key, filters[key]);
  if (watch) p.set('watch', watch);
  return p.size ? '?' + p.toString() : '';
}
