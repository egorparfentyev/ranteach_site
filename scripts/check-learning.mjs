import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url),katex=require('../public/math/vendor/katex.js');
const read=f=>fs.readFileSync(new URL('../public/'+f,import.meta.url),'utf8');
const c={window:{},document:{},console};vm.createContext(c);vm.runInContext(read('learning-upgrade.js'),c);const L=c.window.RTLearning;
const decode=s=>s.replace(/&quot;/g,'"').replace(/&#39;/g,"'").replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&amp;/g,'&');let formulas=0;
function check(html){assert(!/NaN|undefined/.test(html));for(const m of html.matchAll(/data-tex="([^"]+)"/g)){katex.renderToString(decode(m[1]),{throwOnError:true,strict:'ignore'});formulas++;}}
for(let i=0;i<21;i++){const html=L.lessonHTML(i);check(html);assert(html.includes('<svg'));assert.equal((html.match(/<li>/g)||[]).length,3);}
const raw=read('math/data.js'),data=JSON.parse(raw.slice(raw.indexOf('=')+1).trim().replace(/;$/,''));for(const lesson of data.theory)for(const s of lesson.sections)for(const p of s.parts)check(p);
vm.runInContext(read('data.js'),c);vm.runInContext(read('practice-extra.js'),c);vm.runInContext(read('learning-content.js').split('const CONCEPTS')[0],c);for(const m of vm.runInContext('MODULES',c))check(m.theory);
vm.runInContext(read('motion-studio.js'),c);const S=c.window.RTMotion.scenarios;
assert.equal(S.uniform.value(4)[0],17);assert.equal(S.acceleration.value(2)[0]-S.acceleration.value(1)[0],3);assert.deepEqual(Array.from(S.braking.value(6)),[16,0,0]);assert.equal(S.return.value(8)[0],0);assert.equal(S.return.value(4)[1],null);
for(const g of [9.81,1.62]){const apex=S.moon.value(8/g,g);assert(Math.abs(apex[1])<1e-8);assert(Math.abs(apex[0]-64/(2*g))<1e-8);assert.deepEqual(Array.from(S.moon.value(16/g,g)),[0,0,0]);}
for(const s of Object.values(S))for(const f of s.eq){katex.renderToString(f,{throwOnError:true,strict:'ignore'});formulas++;}
// Guest migration and account isolation across subject switches.
const mem=new Map([['kinetika-v1','{"solved":[1]}']]),store={getItem:k=>mem.get(k)??null,setItem:(k,v)=>mem.set(k,v),removeItem:k=>mem.delete(k)};
const sc={window:{},localStorage:store};vm.createContext(sc);vm.runInContext(read('progress-store.js'),sc);const P=sc.window.RTProgress;
assert.equal(P.getItem('kinetika-v1'),'{"solved":[1]}');assert(!mem.has('kinetika-v1'));P.use('student-a');assert.equal(P.getItem('kinetika-v1'),null);P.setItem('kinetika-v1','{"solved":[2]}');P.use('student-b');assert.equal(P.getItem('kinetika-v1'),null);P.use();assert.equal(P.getItem('kinetika-v1'),'{"solved":[1]}');P.use('student-a');assert.equal(P.getItem('kinetika-v1'),'{"solved":[2]}');
console.log(`Passed: ${formulas} valid formulas, 21 illustrated lessons, 5 motion models, Earth/Moon apex and landing, isolated student/guest storage.`);
