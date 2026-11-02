(function(){
const tasks=[];for(let j=1;j<=15;j++){
const add=(n,type,q,a,unit,solution)=>tasks.push({id:`pb-${n}-${j}`,n,type,q,a,unit,solution});
add(6,'Равноускоренное движение',`Тело движется без начальной скорости с ускорением 2 м/с². Найдите путь за ${j+1} с.`,(j+1)**2,'м',`s = at²/2 = 2 · ${j+1}²/2 = ${(j+1)**2} м.`);
add(7,'Сила Архимеда',`Тело объёмом ${j} л полностью погружено в воду. Найдите силу Архимеда. Плотность воды 1000 кг/м³, g = 10 м/с².`,10*j,'Н',`V = ${j/1000} м³. Fₐ = ρgV = 1000 · 10 · ${j/1000} = ${10*j} Н.`);
add(8,'Нагревание вещества',`Какое количество теплоты нужно для нагревания ${j} кг воды на 5 °C? Удельная теплоёмкость воды 4200 Дж/(кг · °C). Ответ дайте в кДж.`,21*j,'кДж',`Q = cmΔT = 4200 · ${j} · 5 = ${21000*j} Дж = ${21*j} кДж.`);
add(9,'Закон Ома',`К резистору сопротивлением ${j+2} Ом приложено напряжение ${3*(j+2)} В. Найдите силу тока.`,3,'А',`I = U/R = ${3*(j+2)}/${j+2} = 3 А.`);
add(10,'Работа электрического тока',`Лампа мощностью ${j+10} Вт работает 20 с. Найдите потреблённую энергию.`,20*(j+10),'Дж',`A = Pt = ${j+10} · 20 = ${20*(j+10)} Дж.`);
add(11,'Состав атомного ядра',`Массовое число ядра равно ${2*(j+5)+1}, зарядовое число — ${j+5}. Сколько нейтронов содержит ядро?`,j+6,'',`A = Z + N, поэтому N = A − Z = ${2*(j+5)+1} − ${j+5} = ${j+6}.`);
}
let number='all',type='all';const E=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function view(){const list=tasks.filter(t=>(number==='all'||String(t.n)===number)&&(type==='all'||t.type===type));return heading('Банк заданий по физике','Авторская тренировка по темам ОГЭ. Номер обозначает учебную позицию, а не ID задания ФИПИ.')+`<div class="nw-filter"><label>Номер<select id="pb-number"><option value="all">Все номера</option>${[6,7,8,9,10,11].map(n=>`<option ${number===String(n)?'selected':''}>${n}</option>`).join('')}</select></label><label>Тип задачи<select id="pb-type"><option value="all">Все типы</option>${[...new Set(tasks.filter(t=>number==='all'||String(t.n)===number).map(t=>t.type))].map(v=>`<option ${type===v?'selected':''}>${v}</option>`).join('')}</select></label></div><p>${list.length} заданий · авторские материалы ranteach</p><div class="px-native-list">${list.map(t=>`<article class="px-native-task"><h3 class="px-task-number">№ ${t.n} · ${E(t.id)}</h3><p>${E(t.q)}</p><details><summary>Ответ</summary><p>${String(t.a).replace('.',',')} ${t.unit}</p><details><summary>Решение</summary><p>${E(t.solution)}</p></details></details></article>`).join('')}</div>`;}
window.RTPhysicsBank={view,tasks};document.addEventListener('change',e=>{if(e.target.id==='pb-number'){number=e.target.value;type='all';render();}if(e.target.id==='pb-type'){type=e.target.value;render();}});
})();
