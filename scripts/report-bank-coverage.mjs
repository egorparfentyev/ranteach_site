import fs from 'node:fs';
import vm from 'node:vm';
const ctx={window:{},practice:()=>''};vm.createContext(ctx);
vm.runInContext(fs.readFileSync('public/math/data.js','utf8')+';globalThis.math=MATH_DATA.tasks;',ctx);
vm.runInContext(fs.readFileSync('public/verified-physics.js','utf8'),ctx);
let report='# Покрытие типов заданий\n\nЦель — минимум 10 разных задач на тип. Число карточек не подтверждает разнообразие. Повторяющиеся демоверсии и числовые варианты требуют отдельной проверки.\n';
for(const [subject,tasks,field] of [['Математика',ctx.math,'subtype'],['Физика — карточки с проверенными источниками',ctx.window.RTVerifiedPhysics,'type']]){
 const groups=new Map();for(const t of tasks){const type=t[field]||'Без классификации',key=t.n+'|'+type;groups.set(key,(groups.get(key)||0)+1);}
 report+='\n## '+subject+'\n\n| Номер | Тип | Карточек | До 10 |\n|---|---|---:|---:|\n';
 for(const [key,count] of [...groups].sort((a,b)=>parseInt(a[0])-parseInt(b[0])||a[0].localeCompare(b[0],'ru'))){const [n,type]=key.split('|');report+=`| ${n} | ${type} | ${count} | ${type==='Без классификации'?'нужна классификация':Math.max(0,10-count)} |\n`;}
}
report+='\nУчебные тренажёры физики и демоверсии учитываются отдельно от карточек источников. Этот отчёт не является подтверждением полного покрытия программы.\n';
fs.mkdirSync('reports',{recursive:true});fs.writeFileSync('reports/bank-coverage.md',report);
console.log('Coverage report updated for both subjects.');
