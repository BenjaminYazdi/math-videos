import { cp, mkdir, rm, writeFile, readdir, copyFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
const root = fileURLToPath(new URL('../', import.meta.url));
const dist = path.join(root, 'dist');
// Delete only this project's generated output directory.
await rm(dist, {recursive:true,force:true});
await mkdir(dist,{recursive:true});
async function copyTree(source,target) {
  await mkdir(target,{recursive:true});
  const entries=await readdir(source,{withFileTypes:true});
  await Promise.all(entries.map(entry=>entry.isDirectory()
    ? copyTree(path.join(source,entry.name),path.join(target,entry.name))
    : copyFile(path.join(source,entry.name),path.join(target,entry.name))));
}
await Promise.all(['assets','data'].map(item=>copyTree(path.join(root,item),path.join(dist,item))));
await Promise.all(['index.html','library.html','404.html','robots.txt','.nojekyll'].map(item=>copyFile(path.join(root,item),path.join(dist,item))));
try {await cp(path.join(root,'CNAME'),path.join(dist,'CNAME'));} catch(error) {if(error.code!=='ENOENT') throw error;}
await writeFile(path.join(dist,'.nojekyll'),'');
console.log('Static site built in dist/. No dependencies, API keys, or server runtime required.');
