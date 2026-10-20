(function(){
'use strict';
const L=window.RTLearning;
if(typeof MODULES==='undefined')return;
const diagrams=[
 [L.diagram('line'),'От −3 до 2: перемещение +5 м. Если затем вернуться в −3, перемещение станет 0, а путь — 10 м.'],
 [L.plot(t=>5+3*t,{minX:0,maxX:8,minY:0,maxY:32,label:'x, м'}).replace('>x</text>','>t, с</text>'),'Автобус: x₀ = 5 м, vₓ = 3 м/с. Каждую секунду координата увеличивается на 3 м. При t = 4 с получаем x = 17 м.'],
 [L.plot(t=>t*t,{minX:0,maxX:6,minY:0,maxY:40,label:'x, м'}).replace('>x</text>','>t, с</text>'),'Разгон из покоя при aₓ = 2 м/с²: x = t². За первую секунду путь равен 1 м, за вторую — ещё 3 м. График становится круче.'],
 [L.plot(t=>2*t,{minX:0,maxX:6,minY:0,maxY:12,label:'vₓ, м/с'}).replace('>x</text>','>t, с</text>'),'За 4 с скорость выросла от 0 до 8 м/с. Перемещение — площадь треугольника под v(t): ½ · 4 · 8 = 16 м. Наклон этой прямой показывает ускорение 2 м/с².'],
 [L.plot(t=>Math.max(0,8*t-9.81*t*t/2),{minX:0,maxX:2,minY:0,maxY:4,label:'y, м'}).replace('>x</text>','>t, с</text>'),'Бросок вверх со скоростью 8 м/с на Земле. Примерно через 0,82 с мяч достигает высоты 3,26 м. В вершине vᵧ = 0, но aᵧ = −9,81 м/с². После приземления показан покой.'],
 [L.diagram('meeting'),'Два пешехода начинают в точках 0 и 20 км и идут навстречу со скоростями 4 и 6 км/ч. Пересечение графиков (2 ч; 8 км) — время и место встречи.']
];
MODULES.forEach((m,i)=>{m.theory=`<figure class="learn-figure">${diagrams[i][0]}<figcaption>${diagrams[i][1]}</figcaption></figure>`+m.theory;});
const before=render;render=function(){before();L.typeset();};render();
})();
