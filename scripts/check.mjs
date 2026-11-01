import {readFile,access} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import assert from 'node:assert/strict';
const root=fileURLToPath(new URL('../',import.meta.url));
const read=name=>readFile(path.join(root,name),'utf8');
const videos=JSON.parse(await read('data/videos.json'));
const categories=JSON.parse(await read('data/categories.json'));
const audit=JSON.parse(await read('docs/catalog-audit.json'));
for(const v of videos){
  await access(path.join(root,`assets/thumbnails/${v.id}.jpg`));
  assert.ok(v.title&&v.topic&&v.originalTitle);
  assert.ok(['whiteboard','paper'].includes(v.format));
  assert.ok(categories.some(c=>c.id===v.category));
  const entry=audit.videos.find(a=>a.id===v.id);
  assert.ok(entry,`Missing audit entry: ${v.id}`);assert.equal(entry.format,v.format);assert.equal(entry.category,v.category);
}
for(const page of ['index.html','library.html']){
  const html=await read(page);
  assert.match(html,/<html lang="en">/);assert.match(html,/<title>[^<]+<\/title>/);assert.match(html,/<main[^>]*id="main"/);
  const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);assert.equal(new Set(ids).size,ids.length,`Duplicate IDs in ${page}`);
  for(const match of html.matchAll(/\b(?:src|href)="([^"]+)"/g)){
    const url=match[1];if(/^(https?:|mailto:|#)/.test(url))continue;
    const local=url.split(/[?#]/)[0];if(local)await access(path.join(root,local));
  }
}
const home=await read('index.html');
assert.ok(home.includes(`<strong>${videos.length}</strong>`),'Homepage lesson count is stale');
for(const c of categories){
  const count=videos.filter(v=>v.category===c.id).length;
  assert.ok(home.includes(`category=${c.id}`),`Missing subject card ${c.id}`);
  assert.ok(home.includes(`<span>${count} ${count===1?'video':'videos'}</span>`),`Missing lesson count ${c.id}`);
}
assert.equal(videos.length,audit.videos.length);
console.log(`Catalog and site checks passed: ${videos.length} unique videos, ${categories.length} subjects, all thumbnails and page assets present.`);
