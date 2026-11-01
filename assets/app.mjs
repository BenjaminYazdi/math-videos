import { filterLessons, groupLessons, readFilters, filterSearch, compareLessons } from './catalog.mjs';

const $ = selector => document.querySelector(selector);
const isLibrary = document.body.dataset.page === 'library';
const formatNames = { whiteboard: 'Whiteboard', paper: 'Pencil & paper' };
const dialog = $('#lesson-dialog');
let videos = [], categories = [], filters = readFilters(location.search), activeVideo = null;
let limits = new Map(), toastTimer, searchTimer;
let previousFocus = null;

function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}
function notify(message) {
  const toast = $('#toast');
  clearTimeout(toastTimer);
  toast.textContent = message;
  toast.hidden = false;
  toastTimer = setTimeout(() => { toast.hidden = true; }, 3000);
}
function categoryName(id) { return categories.find(c => c.id === id)?.name || 'Math'; }
function sanitizeFilters() {
  if (!categories.some(c => c.id === filters.category)) filters.category = 'all';
  if (!['all', 'whiteboard', 'paper'].includes(filters.format)) filters.format = 'all';
  if (filters.topic !== 'all' && !videos.some(v => (filters.category === 'all' || v.category === filters.category) && v.topic === filters.topic)) filters.topic = 'all';
  filters.q = filters.q.slice(0, 200);
}
function updateUrl(mode = 'replace', watch = activeVideo?.id) {
  const url = location.pathname + filterSearch(filters, watch);
  if (url !== location.pathname + location.search) history[mode + 'State'](null, '', url);
}
function setupFilterControls() {
  $('#search').value = filters.q;
  $('#category-filter').value = filters.category;
  $('#format-filter').value = filters.format;
  const topicSelect = $('#topic-filter');
  const topics = [...new Set(videos.filter(v => filters.category === 'all' || v.category === filters.category).map(v => v.topic))].sort((a,b) => a.localeCompare(b, 'en', {numeric: true}));
  topicSelect.replaceChildren(new Option('All topics', 'all'), ...topics.map(t => new Option(t,t)));
  topicSelect.value = filters.topic;
  $('.clear-search').hidden = !filters.q;
  const nav = $('#subject-links');
  nav.replaceChildren();
  for (const c of [{id:'all',name:'All subjects'}, ...categories]) {
    const count = c.id === 'all' ? videos.length : videos.filter(v => v.category === c.id).length;
    const link = el('a', '', c.name);
    link.href = 'library.html' + filterSearch({...filters,category:c.id,topic:'all'});
    link.setAttribute('aria-current', String(filters.category === c.id));
    link.append(el('span','',String(count)));
    link.addEventListener('click', event => {
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      event.preventDefault(); setCategory(c.id);
    });
    nav.append(link);
  }
  document.title = filters.category === 'all' ? 'Video Library — Math Videos' : `${categoryName(filters.category)} — Math Videos`;
}
function setCategory(id) {
  clearTimeout(searchTimer);
  filters.category = id; filters.topic = 'all'; limits.clear();
  updateUrl('push'); renderLibrary();
}
function lessonCard(video) {
  const card = el('a', 'lesson-card');
  card.href = 'library.html' + filterSearch(filters, video.id);
  card.setAttribute('aria-label', `Watch ${video.title} — ${formatNames[video.format]}`);
  const thumb = el('div','thumb');
  const img = el('img');
  img.src = `assets/thumbnails/${video.id}.jpg`;
  img.width = 320; img.height = 180; img.alt = ''; img.loading = 'lazy'; img.decoding = 'async';
  const play = el('span','mini-play','▶'); play.setAttribute('aria-hidden','true');
  thumb.append(img,play);
  if (video.duration) thumb.append(el('span','duration-badge',video.duration));
  const meta = el('div','lesson-meta'); meta.append(el('span',`pill ${video.format}`,formatNames[video.format]));
  card.append(thumb,meta,el('h3','',video.title),el('span','topic-label',video.topic));
  card.addEventListener('click', event => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault(); openLesson(video.id);
  });
  return card;
}
function renderLibrary() {
  sanitizeFilters(); setupFilterControls();
  const filtered = filterLessons(videos, filters);
  const count = $('#result-count'); count.replaceChildren(el('strong','',`${filtered.length} ${filtered.length===1?'video':'videos'}`));
  count.append(document.createTextNode(filters.category === 'all' ? ' across the library' : ` in ${categoryName(filters.category)}`));
  const results = $('#results'); results.replaceChildren();
  if (!filtered.length) {
    const empty = el('section','empty-state');
    empty.append(el('h2','','No lessons found.'));
    empty.append(el('p','','Try a shorter search, choose a different topic, or reset the filters to explore the whole collection.'));
    const reset = el('button','btn secondary small','Reset filters'); reset.addEventListener('click',resetFilters); empty.append(reset); results.append(empty); return;
  }
  for (const group of groupLessons(filtered, categories)) {
    const section = el('section','category-section'); section.id = `subject-${group.category.id}`;
    section.setAttribute('aria-labelledby',`heading-${group.category.id}`);
    const heading = el('div','category-head'); const h = el('h2','',group.category.name); h.id = `heading-${group.category.id}`;
    heading.append(h,el('small','',`${group.videos.length} videos`)); section.append(heading);
    for (const format of ['whiteboard','paper']) {
      const list = group.videos.filter(v => v.format === format);
      if (!list.length) continue;
      const label = el('h3','format-heading',`${formatNames[format]} · ${list.length}`); section.append(label);
      const grid = el('div','video-grid');
      const key = group.category.id + '-' + format;
      const limit = limits.get(key) || (filters.category === 'all' ? 6 : 12);
      grid.append(...list.slice(0,limit).map(lessonCard)); section.append(grid);
      if (list.length > limit) {
        const more = el('button','show-more',`Show ${Math.min(12,list.length-limit)} more ${formatNames[format].toLowerCase()} videos (${list.length-limit} remaining)`);
        more.id = 'more-' + key;
        more.addEventListener('click', () => {
          limits.set(key, limit+12); renderLibrary();
          // Preserve keyboard continuity at the first newly revealed lesson.
          const target = document.getElementById(`subject-${group.category.id}`);
          const grids = [...target.querySelectorAll('.video-grid')];
          const formatGrid = grids[[...target.querySelectorAll('.format-heading')].findIndex(n => n.textContent.startsWith(formatNames[format]))];
          formatGrid?.children[limit]?.focus({preventScroll:true});
        });
        section.append(more);
      }
    }
    results.append(section);
  }
}
function resetFilters() {
  clearTimeout(searchTimer);
  filters = {category:'all', topic:'all', format:'all', q:''}; limits.clear();
  updateUrl('push'); renderLibrary();
}
function wireLibrary() {
  $('#search-form').addEventListener('submit',event => {event.preventDefault(); $('#search').blur();});
  $('#search-form').addEventListener('reset',event => {event.preventDefault();resetFilters();});
  $('#search').addEventListener('input',event => {
    filters.q = event.target.value;
    clearTimeout(searchTimer);
    searchTimer = setTimeout(() => {limits.clear();updateUrl();renderLibrary();},160);
  });
  $('.clear-search').addEventListener('click',() => {clearTimeout(searchTimer);filters.q='';limits.clear();updateUrl();renderLibrary();$('#search').focus();});
  $('#category-filter').addEventListener('change',event => setCategory(event.target.value));
  for (const [selector,key] of [['#topic-filter','topic'],['#format-filter','format']]) {
    $(selector).addEventListener('change',event => {clearTimeout(searchTimer);filters[key]=event.target.value;limits.clear();updateUrl('push');renderLibrary();});
  }
}
function openLesson(id, {syncUrl = true} = {}) {
  const video = videos.find(v => v.id === id);
  if (!video) { notify('That lesson is not in this library.'); if (syncUrl) updateUrl('replace',null); return; }
  if (!dialog.open) previousFocus = document.activeElement;
  activeVideo = video;
  $('#lesson-title').textContent = video.title;
  const badges = $('#lesson-badges'); badges.replaceChildren(el('span',`pill ${video.format}`,formatNames[video.format]));
  $('#lesson-description').textContent = video.reviewStatus === 'subject-uncertain'
    ? 'An original recording from Benjamin’s high-school math collection. Its exact subject is still being reviewed.'
    : `${categoryName(video.category)} · ${video.topic}. An original lesson from Benjamin’s high-school math collection.`;
  $('#youtube-link').textContent = 'Watch on YouTube ↗';
  $('#youtube-link').href = `https://www.youtube.com/watch?v=${video.id}`;
  $('#lesson-subject').href = 'library.html' + filterSearch({category:video.category});
  const frame = el('iframe');
  frame.title = video.title;
  frame.src = `https://www.youtube-nocookie.com/embed/${video.id}?rel=0`;
  frame.allow = 'accelerometer; encrypted-media; gyroscope; picture-in-picture; fullscreen';
  frame.allowFullscreen = true;
  frame.referrerPolicy = 'strict-origin-when-cross-origin';
  $('#player').replaceChildren(frame);
  const sameTopic = videos.filter(v => v.category === video.category && v.topic === video.topic).sort(compareLessons);
  const next = sameTopic[sameTopic.findIndex(v => v.id === id)+1];
  $('#related-row').hidden = !next;
  if (next) {$('#next-lesson').textContent = next.title + ' →';$('#next-lesson').onclick = () => openLesson(next.id);}
  if (syncUrl) updateUrl('push',id);
  if (!dialog.open) dialog.showModal();
  else $('.close-dialog').focus({preventScroll:true});
}
function clearPlayer() {
  $('#player').replaceChildren(); activeVideo = null;
}
function closeLesson({syncUrl = true} = {}) {
  if (dialog.open) dialog.close();
  clearPlayer();
  if (syncUrl) updateUrl('replace',null);
  if (previousFocus?.isConnected) previousFocus.focus({preventScroll:true});
}
$('.close-dialog').addEventListener('click',() => closeLesson());
dialog.addEventListener('cancel',event => {event.preventDefault();closeLesson();});
dialog.addEventListener('click',event => {
  if (event.target !== dialog) return;
  const r = dialog.getBoundingClientRect();
  if (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) closeLesson();
});
$('#share-lesson').addEventListener('click',async () => {
  if (!activeVideo) return;
  const url = new URL('library.html', location.href); url.search = filterSearch({category:activeVideo.category},activeVideo.id);
  try {await navigator.clipboard.writeText(url.href);notify('Lesson link copied.');}
  catch {notify('Copy the lesson link from your address bar.');}
});
window.addEventListener('popstate',() => {
  filters = readFilters(location.search); limits.clear();
  if (isLibrary) renderLibrary();
  const id = new URLSearchParams(location.search).get('watch');
  if (id) openLesson(id,{syncUrl:false}); else closeLesson({syncUrl:false});
});
async function initialize() {
  try {
    const responses = await Promise.all(['videos','categories'].map(name => fetch(new URL(`../data/${name}.json`,import.meta.url))));
    if (responses.some(response => !response.ok)) throw new Error('Catalog request failed');
    [videos,categories] = await Promise.all(responses.map(response => response.json()));
    sanitizeFilters();
    if (isLibrary) {wireLibrary();renderLibrary();}
    const watch = new URLSearchParams(location.search).get('watch');
    if (watch) openLesson(watch,{syncUrl:false});
  } catch (error) {
    if (isLibrary) {
      const panel = el('div','library-error'); panel.append(el('h2','','The library couldn’t load.'));
      panel.append(el('p','','Check your connection and reload this page, or browse the collection on YouTube.'));
      const link = el('a','','Open Math Videos on YouTube ↗'); link.href='https://www.youtube.com/@mathvideos6394/videos'; panel.append(link);
      $('#results').replaceChildren(panel);
    }
    console.error('Could not initialize the video library:', error);
  }
}
initialize();
