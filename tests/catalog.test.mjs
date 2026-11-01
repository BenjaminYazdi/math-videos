import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {filterLessons,groupLessons,readFilters,filterSearch} from '../assets/catalog.mjs';
const videos=JSON.parse(await readFile(new URL('../data/videos.json',import.meta.url)));
const categories=JSON.parse(await readFile(new URL('../data/categories.json',import.meta.url)));

test('all 350 math videos remain unique and reachable by ID',()=>{
  assert.equal(videos.length,350);assert.equal(new Set(videos.map(v=>v.id)).size,350);
  for(const v of videos){assert.match(v.id,/^[\w-]{11}$/);assert.ok(v.originalTitle);assert.ok(categories.some(c=>c.id===v.category));}
});
test('whiteboard recordings precede every paper recording in each category',()=>{
  for(const group of groupLessons(filterLessons(videos),categories)){
    let paperSeen=false;
    for(const v of group.videos){if(v.format!=='whiteboard')paperSeen=true;else assert.equal(paperSeen,false,group.category.name);}
  }
});
test('numbered multipart series use natural order',()=>{
  const series=filterLessons(videos,{q:'convergent divergent'});
  assert.equal(series.length,14);
  assert.deepEqual(series.map(v=>Number(v.title.match(/part (\d+)/i)[1])),Array.from({length:14},(_,i)=>i+1));
  const cross=filterLessons(videos,{category:'vectors',q:'cross product'});
  assert.deepEqual(cross.map(v=>v.title),['The Cross Product part 1','The Cross Product part 2']);
});
test('search is case-insensitive, word-order independent, and includes original titles',()=>{
  assert.deepEqual(filterLessons(videos,{q:'2019 AMC'}),filterLessons(videos,{q:'amc 2019'}));
  assert.ok(filterLessons(videos,{q:'October 8, 2019'}).some(v=>v.id==='herLvuShqEw'));
});
test('subject, recording style, and topic filters intersect',()=>{
  const found=filterLessons(videos,{category:'calculus',format:'whiteboard',topic:'AP Calculus BC 2019'});
  assert.equal(found.length,9);assert.ok(found.every(v=>v.category==='calculus'&&v.format==='whiteboard'));
  assert.equal(filterLessons(videos,{category:'vectors',format:'paper'}).length,0);
});
test('search with no matches returns an empty collection',()=>assert.equal(filterLessons(videos,{q:'unfindable zzzz 9384'}).length,0));
test('filter URLs round-trip punctuation and Unicode',()=>{
  const f={category:'trigonometry',topic:'Angles & Trig Functions',format:'paper',q:'sin(π-x)'};
  const url=filterSearch(f,'Z3umq8k7nak');assert.deepEqual(readFilters(url),f);
  assert.equal(new URLSearchParams(url).get('watch'),'Z3umq8k7nak');
});
test('integer solutions are not confused with calculus integrals',()=>{
  const v=videos.find(v=>v.id==='BA4qqL6mC1A');assert.equal(v.category,'number-theory');assert.equal(v.topic,'Diophantine Equations');
});
test('format review accounts for the entire imported catalog',()=>{
  assert.equal(videos.filter(v=>v.format==='whiteboard').length,81);
  assert.equal(videos.filter(v=>v.format==='paper').length,269);
});
test('the two ambiguous lessons are classified after reviewing playback',()=>{
  assert.equal(videos.find(v=>v.id==='qNlzFN8dck0').topic,'Induction & Reasoning');
  assert.equal(videos.find(v=>v.id==='maK-V--mlL0').category,'geometry');
  assert.equal(videos.filter(v=>v.reviewStatus==='subject-uncertain').length,0);
});

test('catalog contains all 350 math videos and excludes the old stream placeholder',async()=>{
  const snapshot=JSON.parse(await readFile(new URL('../docs/channel-uploads.json',import.meta.url)));
  assert.equal(snapshot.paginationComplete,true);assert.equal(snapshot.pagesRead,4);
  assert.deepEqual(videos.map(v=>v.id).sort(),snapshot.uploads.filter(v=>v.id!=='hrGzJkbr1Zw').map(v=>v.id).sort());
  assert.equal(videos.some(v=>v.id==='hrGzJkbr1Zw'),false);
});
test('all nineteen AP Calculus problems sort in numeric order within each format',()=>{
  const found=filterLessons(videos,{topic:'AP Calculus BC 2019'});
  assert.equal(found.length,19);
  assert.deepEqual(found.map(v=>Number(v.title.match(/Problem (\d+)/)[1])),Array.from({length:19},(_,i)=>i+1));
});
