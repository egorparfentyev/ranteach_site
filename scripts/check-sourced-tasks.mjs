import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
const c={window:{},practice:()=>''};vm.createContext(c);
vm.runInContext(fs.readFileSync('public/math/data.js','utf8')+';globalThis.mathTasks=MATH_DATA.tasks;',c);
vm.runInContext(fs.readFileSync('public/verified-physics.js','utf8'),c);
const byId=new Map(c.mathTasks.map(t=>[t.id,t]));
const physical=new Map(c.window.RTVerifiedPhysics.map(t=>[t.id,t]));
for(const tasks of [c.mathTasks,c.window.RTVerifiedPhysics])assert.equal(new Set(tasks.map(t=>t.id)).size,tasks.length,'Duplicate task ID');
// Flag number-only variants before a curated card reaches Hosting. Keep TeX but omit drawings and decorative markup.
function structure(text){return text.replace(/<svg\b[\s\S]*?<\/svg>/gi, svg => ' ' + (svg.match(/aria-label="([^"]*)"/i)?.[1] || '') + ' ').replace(/<span[^>]*data-tex="([^"]*)"[^>]*><\/span>/gi,' $1 ').replace(/<[^>]+>/g,' ').normalize('NFKC').toLowerCase().replace(/[−–]/g,'-').replace(/\d+(?:[.,]\d+)?/g,'#').replace(/\s+/g,' ').trim();}
for(const items of [c.mathTasks.filter(t=>t.verifiedOn),c.window.RTVerifiedPhysics]){
 const seen=new Map();for(const t of items){const k=structure(t.html||t.q);assert.ok(!seen.has(k),`Same wording and structure after removing numbers: ${seen.get(k)} and ${t.id}`);seen.set(k,t.id);}
}
for(const t of c.mathTasks.filter(t=>t.verifiedOn)){assert.ok(t.sourceUrl&&t.solution&&t.answer);if(t.kind==='written')assert.ok(t.criteria);}
for(const [id,result] of [[333143,15*3/4],[339544,180-40],[339370,9/Math.sqrt(1-(4/5)**2)],[412198,160-160/2**5],[314507,5]])assert.ok(Math.abs(Number(byId.get('sdamgia-'+id).answer.replace(',','.'))-result)<1e-9);
assert.equal(5/5,8/(5+11)+.5);
for(const x of [-2,1])assert.equal(x**4,(x-2)**2);
for(const x of [-4,-1,1])assert.equal(x**3+4*x*x-x-4,0);
for(const x of [2-Math.sqrt(3),2+Math.sqrt(3)])assert.ok(Math.abs((x-2)**4-(x-2)**2-6)<1e-10);
for(let x=-5;x<=5;x+=.125)assert.equal((x-3)*(2*x+3)<-7,x>-.5&&x<2);
for(const [id,result] of [[25379,9.6e-16/1.6e-19/1000],[29602,60*2/3],[29745,3e8/25/1e6],[29838,900/(.5*30)],[25219,Math.round(330/520*10)/10],[25069,6500*.05]])assert.ok(Math.abs(Number(physical.get(id).answer.replace(',','.'))-result)<1e-9);
assert.ok(physical.get(1668).criteria.includes('2 балла'));
assert.ok(!c.practice().includes('${t.criteria'));
// Recalculate answers from the data of the official records, independently of their worked text.
for(const [code,value] of Object.entries({'097E41':1/5-41/50,'711640':21/5*3/7,'0A4D44':6000+4100*20,'0C5645':7*4/2,'FA194C':11*Math.sqrt(2)*Math.sqrt(2),'F36046':(Math.sqrt(11)+3)**2-6*Math.sqrt(11),'40EE48':Math.sqrt(4+297*4/3),'494C47':180/6**2,'4F5745':180-64,'41D84A':6*(8*Math.sqrt(3))/Math.sqrt(3),'FE3D40':90-30,'F77141':24/2,'F42F42':5*(59-32)/9,'F89C42':2**(8+17-20),'FD6745':(80-12)/80})){
  const t=byId.get('fipi-'+code);assert.ok(t.sourceUrl.endsWith('qid='+code));assert.ok(Math.abs(Number(t.answer.replace('−','-').replace(',','.'))-value)<1e-9);
}
for(const [code,value] of Object.entries({'D9EE45':2*2.1*10,'DF3949':2*10*(4-1),'F23E41':2-1.6,'01A441':10+1,'02ED46':179-4,'7F5A40':1*10*20,'F2EB40':(5-(-5))/1,'01FB46':(1050-300)/5,'4BF745':6*15/(25-15)}))assert.ok(Math.abs(Number(physical.get(code).answer.replace(',','.'))-value)<1e-9);
for(const t of [...c.mathTasks,...c.window.RTVerifiedPhysics].filter(t=>t.sourceGuid))assert.match(t.sourceGuid,/^[0-9a-f]{32}$/i);
console.log('Passed: sourced task IDs, numerical answers, algebra roots and intervals, written criteria.');
// Exercise the delegated form events: a first correct answer counts, repeated or revealed answers do not.
{
 const handlers={},store={verifiedSolved:[],verifiedSeen:[],attempts:0,correct:0,activity:{}};
 const env={window:{},practice:()=>'',document:{addEventListener:(name,callback)=>handlers[name]=callback},state:store,save:()=>{},today:()=> 'test-day'};vm.createContext(env);vm.runInContext(fs.readFileSync('public/verified-physics.js','utf8'),env);
 function submit(id,value,open=false){const status={},article={dataset:{verifiedTask:id},querySelector:()=>({open})};handlers.submit({target:{matches:()=>true,closest:()=>article,querySelector:q=>q==='input'?{value}:status},preventDefault(){}});return status.textContent;}
 assert.match(submit('F23E41','0.4'),/засчитана/);assert.equal(store.activity['test-day'],1);submit('F23E41','0,4');assert.equal(store.activity['test-day'],1);
 handlers.toggle({target:{matches:()=>true,open:true,closest:()=>({dataset:{verifiedTask:'02ED46'}})}});submit('02ED46','175');assert.equal(store.activity['test-day'],1);assert.ok(!store.verifiedSolved.includes('02ED46'));
 assert.match(submit('DF3949','0'),/не совпало/);assert.match(submit('DF3949','60'),/засчитана/);assert.equal(store.activity['test-day'],2);
 assert.match(submit('372','43'),/засчитана/);
 assert.match(submit('319','33'),/не совпало/);
 assert.match(submit('26240','43'),/не совпало/);
 assert.match(submit('26240','34'),/засчитана/);

}
// November bank expansion: verify circuit topology and conditional probability answers.
for(const [id,value] of Object.entries({'132BF1':220/(110/4),'9449F4':1/((1/2)/2),'9729F4':2.5*(4/1),'B61376':3/6,'54881C':1/(3/9),'882BF2':2,'D38070':1.5,'AFDA75':1/(1/2+1/2)+1/(1/6+1/6),'677676':30/(5+10),'46E193':1/(1/6+1/6)+3+5,'515CFE':1e6/(500*200),'67DDD0':400*2*(230-30)/1000,'3DF797':1e6/(500*10)}))assert.equal(Number(physical.get(id).answer),value,id);
for(const [id,value] of Object.entries({'34D340':(20+(206-20-8-12)/2)/206,'C0AE4C':1-.02,'AF1E46':1/10,'C67C4E':13/20,'7407F8':13/20}))assert.equal(Number(byId.get('fipi-'+id).answer),value,id);
let favourable=0;for(let a=1;a<=6;a++)for(let b=1;b<=6;b++)if([3,4,5].includes(a+b))favourable++;
assert.equal(Number(byId.get('fipi-27FFA4').answer),favourable/36);
// Solve each quadratic branch independently, filter its domain, then count distinct x values.
function roots(a,b,c){const delta=b*b-4*a*c;if(delta<0)return [];return delta===0?[-b/(2*a)]:[(-b-Math.sqrt(delta))/(2*a),(-b+Math.sqrt(delta))/(2*a)];}
function count(values){return new Set(values.map(x=>x.toFixed(8))).size;}
for(const m of [-10,-6.25,-3,-2,-1,-.5,-.25,-.1,0,.1,1,5.99,6,6.25,7,10]){
 const piece=roots(1,6,7-m).filter(x=>x>=-4).concat(m<6?[m-10]:[]);
 assert.equal(count(piece)===2,m===-2||m>-1&&m<6,'90FF4E at '+m);
 const mod=roots(-1,-5,-m).filter(x=>x<0).concat(roots(1,-1,-m).filter(x=>x>=0));
 assert.equal(count(mod)===2,m===-.25||m===6.25,'F486F7 at '+m);
 const shifted=roots(1,17,72-m).filter(x=>x<-8).concat(roots(1,11,24-m).filter(x=>x>=-8));
 assert.equal(count(shifted)===3,m===-.25||m===0,'675547 at '+m);
 const hole=roots(-.5,0,-m).filter(x=>x<0&&x!==-2).concat(roots(.5,0,-m).filter(x=>x>=0));
 assert.equal(count(hole)===0,m===-2,'D35EB0 at '+m);
}
for(const id of ['90FF4E','F486F7','675547','D35EB0'])assert.equal(byId.get('fipi-'+id).kind,'written');
// Check new inequality intervals against the original expressions, including boundaries.
const inequalities=[['72B7F0',1,x=>-9-6*x>9*x+9,x=>x< -1.2],['7FAC18',2,x=>3-2*x>=8*x-1,x=>x<=.4],['AA0F48',3,x=>x+2.7<=0&&x+4>=1,x=>x>=-3&&x<=-2.7],['F09B7D',2,x=>-27+3*x>0&&6-3*x< -6,x=>x>9],['19EB75',1,x=>-12+3*x>0&&9-4*x> -3,x=>false],['081E50',3,x=>-9+3*x>0&&2-3*x> -10,x=>x>3&&x<4],['5F475F',4,x=>x+3.2<=0&&x+1<=-1,x=>x<=-3.2],['2FAC43',2,x=>x*x-36>0,x=>x< -6||x>6],['E34C05',1,x=>81*x*x<=16,x=>x>=-4/9&&x<=4/9],['3CD425',2,x=>x-x*x>=0,x=>x>=0&&x<=1],['150B1F',3,x=>81*x*x>64,x=>x< -8/9||x>8/9]];
for(const [id,key,condition,interval] of inequalities){assert.equal(Number(byId.get('fipi-'+id).answer),key,id);for(let i=-100;i<=100;i++)assert.equal(condition(i/10),interval(i/10),id+' at '+i/10);}
// Mechanics batch: recalculate answers from source quantities and physical laws.
for(const [id,value] of Object.entries({'5B6946':2*3/(2+1),'901941':50*.04/10,'1DF5F4':1.4*.5,'AAF5F8':10*(3-2),'67E0F4':1.5/30,'3E2EF2':25-10,'4EE106':1200/60,'B5640C':20*10/2,'A93201':64/800*1000,'9F0DED':10/2*(3**2-2**2),'9381EC':20000/(1000*10),'6199E2':4*.5,'8038E3':1000/800,'04BD3F':2.4*2,'83C331':1/((.5**2)/.5),'8D7286':1/(2*.4),'8DE883':4**2,'771FB7':3/(.5**2)}))assert.ok(Math.abs(Number(physical.get(id).answer)-value)<1e-10,id);
