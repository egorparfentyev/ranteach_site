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
function structure(text){return text.replace(/<svg\b[\s\S]*?<\/svg>/gi,' ').replace(/<span[^>]*data-tex="([^"]*)"[^>]*><\/span>/gi,' $1 ').replace(/<[^>]+>/g,' ').normalize('NFKC').toLowerCase().replace(/[−–]/g,'-').replace(/\d+(?:[.,]\d+)?/g,'#').replace(/\s+/g,' ').trim();}
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
}
