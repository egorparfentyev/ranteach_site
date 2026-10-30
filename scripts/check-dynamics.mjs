import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url),katex=require('../public/math/vendor/katex.js');
const read=f=>fs.readFileSync(new URL('../public/'+f,import.meta.url),'utf8');
const c={window:{katex},document:{},console};vm.createContext(c);
vm.runInContext(read('learning-upgrade.js'),c);vm.runInContext(read('dynamics-data.js'),c);vm.runInContext(read('dynamics-variants.js'),c);vm.runInContext(read('dynamics.js'),c);
const D=c.window.RTNewtonData,M=D.models;
assert.equal(D.lessons.length,7);assert.equal(D.tasks.length,178);assert.equal(new Set(D.tasks.map(t=>t.id)).size,178);assert.equal(D.tasks.filter(t=>t.source==='fipi').length,3);
let formulas=0;for(const l of D.lessons){assert(l.paragraphs.length>=5);assert(l.steps.length>=3);for(const s of [l.rule,...l.extra,...l.steps])if(s.includes('\\')){katex.renderToString(s,{throwOnError:true,strict:'ignore'});formulas++;}assert(D.tasks.filter(t=>t.topic===l.id).length>=5);assert(c.window.RTNewton.illustration(l.id).includes('<svg'));}
for(const t of D.tasks){assert(t.steps.length>=3);assert(D.accepts(t,t.answer));assert(!D.accepts(t,''));assert(!D.accepts(t,'Infinity'));assert(!D.accepts(t,'NaN'));assert(!D.accepts(t,t.answer+'abc'));assert(!D.accepts(t,'999999'));if(t.options)assert(+t.answer<=t.options.length);if(t.source==='fipi')assert(t.url.startsWith('https://doc.fipi.ru/'));for(const s of t.steps)if(s.includes('\\')){katex.renderToString(s,{throwOnError:true,strict:'ignore'});formulas++;}}
assert(D.accepts(D.tasks.find(t=>t.id==='n-s4'),'13,5'));assert(D.accepts(D.tasks.find(t=>t.id==='n-f3'),'−5'));assert(!D.accepts(D.tasks.find(t=>t.id==='n-f3'),'5'));const multi=D.tasks.find(t=>t.id==='n-fipi-2026-14');assert(D.accepts(multi,'31'));assert(!D.accepts(multi,'113'));assert(!D.accepts(multi,'1 3'));
// Independent model checks: inertia, acceleration, equal/opposite interaction, weight, Hooke, static threshold.
assert.equal(M.cart({mass:2,right:12,left:4,v0:0},2).x,8);assert.equal(M.cart({mass:4,right:12,left:4,v0:0},2).x,4);
assert.deepEqual({...M.cart({mass:2,right:0,left:0,v0:3},4)},{force:0,a:0,v:3,x:12});assert.equal(M.cart({mass:2,right:0,left:4,v0:4},2).v,0);assert.equal(M.cart({mass:2,right:0,left:4,v0:4},4).x,0);
const pair=M.pair({mass:2,mass2:4,force:8},2);assert.equal(pair.a1,-4);assert.equal(pair.a2,2);assert.equal(2*pair.x1+4*pair.x2,0);
for(const g of [10,1.62]){assert.equal(M.elevator({mass:50,g,ratio:-1}).weight,0);assert.equal(M.elevator({mass:50,g,ratio:0}).weight,50*g);assert(M.elevator({mass:50,g,ratio:-1}).gravity>0);}
assert.equal(M.elevator({mass:50,g:10,ratio:.2}).weight,600);assert.equal(M.spring({k:200,extension:3}).force,6);
for(const force of [0,14,15]){const q=M.friction({mass:5,force,mu:.3,g:10});assert(!q.moving);assert.equal(q.friction,force);assert.equal(q.a,0);}const sliding=M.friction({mass:5,force:16,mu:.3,g:10});assert(sliding.moving);assert.equal(sliding.friction,12);assert.equal(sliding.a,.8);
// A revealed solution cannot award credit, and repetition cannot award twice.
const p={solved:[],errors:['n-f1']};assert(!D.credit(p,'n-f1',true));assert.equal(p.solved.length,0);assert(D.credit(p,'n-f1',false));assert.equal(p.errors.length,0);assert(!D.credit(p,'n-f1',false));assert.equal(p.solved.length,1);
assert(c.window.RTNewton.illustration('demo').includes('A(0;3)'));assert(!/NaN|undefined/.test(c.window.RTNewton.readout()));
console.log(`Passed: 7 Newton lessons, 178 tasks, ${formulas} formulas, 6 lab models, official demo keys, answer validation and repeat/reveal credit guards.`);

for(const base of D.tasks.filter(t=>t.variant===1)){const family=D.tasks.filter(t=>t.family===base.id);assert.equal(family.length,5);assert.equal(new Set(family.map(t=>t.text)).size,5);}
// Independently computed base numeric answers, not merely a round trip through stored keys.
const expected={f1:18-7,f2:6+9,f3:9-14,f5:Math.hypot(3,4),i1:4,i3:800,i5:-2+3*4,s1:12/3,s2:.4*5,s3:2*(10-2)/4,s4:(10-4)/2*9/2,s5:1000*20/5,t1:6000,t2:8/4,t5:40*3/60,g1:3*10,g2:50*1.6,g3:50*12,g4:60*7,g5:0,h1:200*.03,h2:8/.04,h3:100*.03,h4:.2*10/50*100,h5:3,r1:.2*5*10,r2:3,r3:(20-.2*5*10)/5,r4:4/(.2*10),r5:2*3+2*9/2};
for(const [id,value]of Object.entries(expected))assert(D.accepts(D.tasks.find(t=>t.id==='n-'+id),value));
