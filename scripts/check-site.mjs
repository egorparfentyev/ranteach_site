import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
const base = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const root = path.join(base, 'public');
const files = fs.readdirSync(root, {recursive:true}).filter(f => fs.statSync(path.join(root,f)).isFile());
let scripts = 0, assets = 0;
function localAsset(ref, folder) {
  if (/^(?:https?:|data:|#|\/\/)/.test(ref)) return;
  const clean = decodeURIComponent(ref.split(/[?#]/)[0]);
  if (!clean) return;
  const target = path.resolve(folder, clean);
  assert(target === root || target.startsWith(root + path.sep), `Path leaves public directory: ${ref}`);
  assert(fs.existsSync(target), `Missing asset: ${ref}`);
  assets++;
}
for (const entry of ['index.html','math/index.html']) {
  const file=path.join(root,entry),text=fs.readFileSync(file,'utf8');
  for(const ref of text.matchAll(/(?:src|href)="([^"]+)"/g))localAsset(ref[1],path.dirname(file));
}
for(const file of files) {
  if(file.endsWith('.js')) {
    new vm.Script(fs.readFileSync(path.join(root,file),'utf8'),{filename:file});
    scripts++;
  }
  if(file.endsWith('.css')) {
    const text=fs.readFileSync(path.join(root,file),'utf8');
    for(const ref of text.matchAll(/url\(["']?([^"')]+)["']?\)/g))localAsset(ref[1],path.dirname(path.join(root,file)));
  }
}
const raw=fs.readFileSync(path.join(root,'math/data.js'),'utf8');
const data=JSON.parse(raw.slice(raw.indexOf('=')+1).trim().replace(/;$/,''));
assert.equal(new Set(data.tasks.map(t=>t.id)).size,data.tasks.length,'Task IDs must be unique');
assert(data.topics.length >= 21 && data.tasks.length >= 284,'The mathematics course is incomplete');
for(const t of data.tasks) {
  assert(data.topics[t.topic],`Unknown task topic: ${t.id}`);
  if(t.kind==='short')assert(t.answer!==null&&t.answer!==undefined,`Missing answer: ${t.id}`);
  if(t.context)assert(data.contexts[t.context],`Missing context: ${t.id}`);
}
for(const html of [...Object.values(data.contexts),...data.tasks.map(t=>t.html)]) {
  for(const ref of html.matchAll(/src="([^"]+)"/g))localAsset(ref[1],path.join(root,'math'));
}
for(const doc of [...data.materials,...data.demos]) {
  for(const key of ['file','pdf','spec','codifier'])if(doc[key])localAsset(doc[key],path.join(root,'math'));
}
for(const d of data.demos) {
  assert.equal(d.ids.length,25);
  assert.deepEqual(d.ids.map(id=>data.tasks.find(t=>t.id===id)?.n),Array.from({length:25},(_,i)=>i+1));
}
const config=JSON.parse(fs.readFileSync(path.join(base,'firebase.json'),'utf8'));
assert.equal(config.hosting.public,'public');
assert.equal(config.hosting.site,'ranteach');
for(const f of files)assert(!/(?:^|\/)(?:\.env|.*service.?account.*\.json|.*credentials.*\.json|.*\.pem|.*\.key)$/i.test(f),`Credential-like file in public: ${f}`);
console.log(`Passed: ${scripts} JavaScript files, ${assets} asset references, ${data.tasks.length} mathematics tasks, ${data.demos.length} complete demos.`);
