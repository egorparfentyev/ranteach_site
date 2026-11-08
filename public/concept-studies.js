(() => {
  const format = value => value.toLocaleString('ru-RU', { maximumFractionDigits: 3 });
  const styles = `<style>
    :host{display:block;margin:1.2rem 0;color:inherit;font:inherit}
    details{padding:1.1rem;border:1px solid var(--line,#d8dedb);border-radius:14px;background:white}
    summary{cursor:pointer;font-weight:700;font-size:1.1rem}
    p{line-height:1.65}label{display:block;margin:.55rem 0}input,select,button{font:inherit}
    input{max-width:100%;vertical-align:middle}svg{display:block;width:100%;max-width:620px;height:auto}
    button{padding:.45rem .85rem;border:1px solid #715793;border-radius:7px;background:white;cursor:pointer}
    output{display:block;margin:.8rem 0;line-height:1.55;font-variant-numeric:tabular-nums}
  </style>`;
  class SequenceStudy extends HTMLElement {
    connectedCallback() {
      if (this.shadowRoot) return;
      const root = this.attachShadow({mode:'open'});
      root.innerHTML = styles + `<details><summary>Прогрессии · исследовать ряд чисел</summary>
        <p>В первом ряду зала 4 места. Если каждый следующий ряд длиннее на два места, получится 4, 6, 8… Это арифметическая прогрессия. Если количество каждый раз удваивается, получится 4, 8, 16… Это геометрическая прогрессия.</p>
        <label>Как строится ряд <select><option value="add">Прибавляем 2</option><option value="multiply">Умножаем на 2</option></select></label>
        <label>Номер члена <input type="range" min="1" max="7" value="3"></label>
        <svg viewBox="0 0 520 200" role="img" aria-label="Высоты столбцов показывают первые семь членов прогрессии"></svg>
        <output></output><p>Чтобы от первого члена добраться до выбранного, сделай на один шаг меньше, чем его номер. Для первого члена шагов понадобится ноль.</p></details>`;
      const draw = () => {
        const n = Number(root.querySelector('input').value);
        const add = root.querySelector('select').value === 'add';
        const terms = Array.from({length:7}, (_,i) => add ? 4+2*i : 4*2**i);
        root.querySelector('svg').innerHTML = terms.map((v,i) => {
          const height = v / terms[6] * 130, x = 15 + 72*i;
          return `<rect x="${x}" y="${160-height}" width="44" height="${height}" fill="${i===n-1?'#126a51':'#acd6c5'}"/><g text-anchor="middle" font-family="sans-serif" font-size="15"><text x="${x+22}" y="${153-height}">${v}</text><text x="${x+22}" y="185">№${i+1}</text></g>`;
        }).join('');
        root.querySelector('output').innerHTML = add
          ? `a<sub>${n}</sub> = 4 + (${n} − 1) · 2 = <b>${terms[n-1]}</b>`
          : `b<sub>${n}</sub> = 4 · 2<sup>${n} − 1</sup> = <b>${terms[n-1]}</b>`;
      };
      root.addEventListener('input',draw);draw();
    }
  }
  class CollisionStudy extends HTMLElement {
    connectedCallback() {
      if (this.shadowRoot) return;
      const root = this.attachShadow({mode:'open'});
      root.innerHTML = styles + `<details><summary>Импульс · столкновение тележек</summary>
        <p>Левая тележка массой 2 кг едет со скоростью 3 м/с. Правая стоит на горизонтальном пути. При ударе сцепка защёлкивается. За короткое время удара внешними горизонтальными силами пренебрегаем.</p>
        <label>Масса правой тележки <input type="range" min="1" max="6" value="4"> <b></b></label>
        <svg viewBox="0 0 530 105" role="img" aria-label="Тележки до удара и после сцепления"><path d="M10 82H520" stroke="#998eaa" stroke-width="3"/>
        <g fill="#8655b9"><rect width="48" height="29" y="40" rx="5"/><circle cx="10" cy="75" r="6"/><circle cx="38" cy="75" r="6"/></g>
        <g fill="#b47a2a"><rect width="48" height="29" y="40" rx="5"/><circle cx="10" cy="75" r="6"/><circle cx="38" cy="75" r="6"/></g></svg>
        <label>Время <input type="range" min="0" max="4" step="0.01" value="0"></label>
        <button type="button">Запустить</button><output></output>
        <p>До удара весь импульс несёт левая тележка. После удара тот же импульс приходится на общую массу. Увеличь массу правой тележки и сравни расстояния, которые сцепленные тележки проходят за одну секунду.</p></details>`;
      const [mass,time] = root.querySelectorAll('input'), button=root.querySelector('button');
      const draw = () => {
        const m=Number(mass.value), t=Number(time.value), speed=6/(2+m);
        const x=20+75*Math.min(t,2)+25*speed*Math.max(0,t-2);
        const positions=[x,218+25*speed*Math.max(0,t-2)];
        root.querySelectorAll('svg g').forEach((g,i)=>g.setAttribute('transform',`translate(${positions[i]},0)`));
        root.querySelector('b').textContent=m+' кг';
        root.querySelector('output').innerHTML=`t = ${format(t)} с · ${t<2?'до удара':'после сцепления'}<br>p = 2 · 3 = 6 кг · м/с<br>Скорость после удара v = 6 / (2 + ${m}) ≈ ${format(speed)} м/с`;
      };
      const stop=()=>{cancelAnimationFrame(this.frame);this.frame=0;button.textContent='Запустить';};
      root.addEventListener('input',()=>{stop();draw();});
      root.querySelector('details').addEventListener('toggle',e=>{if(!e.target.open)stop();});
      button.onclick=()=>{
        if(this.frame){stop();return;}
        if(Number(time.value)>=4)time.value=0;
        const start=performance.now()-1000*Number(time.value);
        const tick=now=>{time.value=Math.min(4,(now-start)/1000);draw();if(Number(time.value)>=4)stop();else this.frame=requestAnimationFrame(tick);};
        button.textContent='Пауза';this.frame=requestAnimationFrame(tick);
      };
      draw();
    }
    disconnectedCallback(){cancelAnimationFrame(this.frame);this.frame=0;}
  }
  class RayStudy extends HTMLElement {
    connectedCallback() {
      if (this.shadowRoot) return;
      const root = this.attachShadow({mode:'open'});
      const control = (title, initialSign, initialValue) => `<fieldset><legend>${title}</legend>
        <label>x <select aria-label="Знак ограничения">${['>','≥','<','≤'].map(sign =>
          `<option ${sign===initialSign?'selected':''}>${sign}</option>`).join('')}</select>
        <input type="range" min="-5" max="5" value="${initialValue}" aria-label="Граница луча"> <b></b></label></fieldset>`;
      root.innerHTML = styles + `<details><summary>Как найти пересечение лучей</summary>
        <p>Решение системы должно удовлетворять обоим условиям. Верхние две строки показывают условия отдельно, нижняя — их общую часть. Пустой кружок исключает граничное число, закрашенный включает его.</p>
        ${control('Первое условие','≥',-2)}${control('Второе условие','≤',3)}
        <svg viewBox="0 0 440 166" role="img" aria-label="Два луча и их пересечение"></svg><output></output>
        <p>Поставь обе границы в ноль. Проверь, при каких знаках общим решением останется одно число.</p></details>`;
      const draw = () => {
        const ranges = [...root.querySelectorAll('fieldset')].map(group => {
          const v = Number(group.querySelector('input').value), sign = group.querySelector('select').value;
          group.querySelector('b').textContent = v;
          return sign==='>' || sign==='≥' ? [v,Infinity,sign==='≥',false] : [-Infinity,v,false,sign==='≤'];
        });
        const lower = Math.max(...ranges.map(r=>r[0])), upper = Math.min(...ranges.map(r=>r[1]));
        const includeLower = ranges.every(r=>r[0]!==lower || r[2]);
        const includeUpper = ranges.every(r=>r[1]!==upper || r[3]);
        const empty = lower>upper || (lower===upper && !(includeLower && includeUpper));
        const pos = v => 220 + 32*Math.max(-6,Math.min(6,v));
        ranges.push([lower,upper,includeLower,includeUpper]);
        root.querySelector('svg').innerHTML = ranges.map(([a,b,ac,bc],i)=>{
          const y=25+i*53, color=['#287866','#94651e','#422879'][i];
          const axis=`<path d="M22 ${y}H418" stroke="#bac8c2"/>`;
          if(i===2 && empty) return axis+`<text x="220" y="${y+22}" text-anchor="middle">∅</text>`;
          const points=a===b?[[a,true]]:[[a,ac],[b,bc]];
          return axis+`<path d="M${pos(a)} ${y}H${pos(b)}" stroke="${color}" stroke-width="5"/>`+
            points.filter(([v])=>Number.isFinite(v)).map(([v,closed])=>
            `<circle cx="${pos(v)}" cy="${y}" r="5" stroke="${color}" stroke-width="2" fill="${closed?color:'white'}"/>
            <text x="${pos(v)}" y="${y+22}" text-anchor="middle">${v}</text>`).join('');
        }).join('');
        const interval=(includeLower?'[':'(')+(Number.isFinite(lower)?lower:'−∞')+'; '+
          (Number.isFinite(upper)?upper:'+∞')+(includeUpper?']':')');
        root.querySelector('output').textContent = empty?'Общих решений нет.':
          lower===upper?'Единственное общее решение: x = '+lower:'Общая часть: '+interval;
      };
      root.addEventListener('input',draw);
      draw();
    }
  }
  customElements.define('rt-ray-study',RayStudy);
  class RootStudy extends HTMLElement {
    connectedCallback() {
      if (this.shadowRoot) return;
      const root = this.attachShadow({mode:'open'});
      root.innerHTML = styles + `<details><summary>Почему корень из квадрата равен модулю</summary>
        <p>У квадрата площадь равна a². Если a отрицательно, эта площадь всё равно положительна. Длина стороны равна |a|. Арифметический квадратный корень показывает неотрицательную длину стороны.</p>
        <label>Значение a <input type="range" min="-6" max="6" value="-3" step="1"></label>
        <svg viewBox="0 0 390 200" role="img" aria-label="Площадь квадрата и расстояние до нуля"></svg>
        <output></output><p>Проверь a = −3 и a = 3. Одинаковым квадратам соответствуют противоположные значения a.</p></details>`;
      const draw = () => {
        const a = Number(root.querySelector('input').value), side = Math.abs(a), px = side*20;
        const x = 245+a*18;
        root.querySelector('svg').innerHTML =
          `<rect x="20" y="${150-px}" width="${px}" height="${px}" fill="#d6eade" stroke="#287858" stroke-width="2"/>
          <text x="20" y="178" font-size="16">Площадь ${a*a}</text>
          <path d="M130 80H365" stroke="#758a7e" stroke-width="2"/>
          <path d="M245 80H${x}" stroke="#29815f" stroke-width="6"/>
          <circle cx="${x}" cy="80" r="5" fill="#29815f"/>
          <path d="M245 70v20" stroke="#758a7e"/>
          <text x="245" y="112" text-anchor="middle">0</text>
          <text x="${x}" y="53" text-anchor="middle">a = ${a}</text>`;
        root.querySelector('output').innerHTML =
          `a² = (${a})² = ${a*a}<br>√${a*a} = ${side}<br>√a² = |a| = ${side}`;
      };
      root.addEventListener('input',draw);
      draw();
    }
  }
  customElements.define('rt-root-study',RootStudy);
  class GravityWorkStudy extends HTMLElement {
    connectedCallback() {
      if (this.shadowRoot) return;
      const root = this.attachShadow({mode:'open'});
      root.innerHTML = styles + `<details><summary>Работа тяжести на пути вниз и обратно вверх</summary>
        <p>Рассмотрим тело массой 1 кг при g = 10 м/с². Оно проходит от высоты 4 м до пола, затем поднимается на 3 м. Передвигай точку по пути и сравни работу на каждом участке с работой от начала движения.</p>
        <label>Положение на пути <input type="range" min="0" max="100" value="0"></label>
        <svg viewBox="0 0 440 250" role="img" aria-label="Спуск с четырёх метров и подъём до трёх метров"></svg>
        <output></output>
        <p>На спуске тяжесть помогает движению и совершает положительную работу. На подъёме работа отрицательна. Суммарная работа от начальной до текущей высоты равна mg(h₀ − h). Сила удара о пол при этом совершает свою работу.</p></details>`;
      const draw = () => {
        const progress=Number(root.querySelector('input').value)/100;
        const down=progress<=.5;
        const height=down?4*(1-progress*2):3*(progress*2-1);
        const x=down?105:275, y=210-height*40;
        const total=10*(4-height);
        const leg=down?total:-10*height;
        root.querySelector('svg').innerHTML =
          `<path d="M35 222H405" stroke="#968a9f" stroke-width="4"/>
          <path d="M105 50V210M275 210V90" stroke="#bcb1cc" stroke-width="3" stroke-dasharray="6 5" fill="none"/>
          <g fill="#51445f" font-size="16"><text x="50" y="33">Начало · 4 м</text><text x="222" y="70">Конец · 3 м</text><text x="180" y="245">Пол · 0 м</text></g>
          <circle cx="${x}" cy="${y}" r="13" fill="#8256b1"/>
          <text x="${x+28}" y="${y+6}" font-size="17" fill="#51445f">h = ${format(height)} м</text>`;
        root.querySelector('output').innerHTML =
          `${down?'Спуск':'Подъём после отскока'}<br>Работа на текущем участке = ${format(leg)} Дж<br>
          Работа от начала пути = 1 · 10 · (4 − ${format(height)}) = ${format(total)} Дж`;
      };
      root.addEventListener('input',draw);draw();
    }
  }
  customElements.define('rt-gravity-work-study',GravityWorkStudy);
  class HeatingStudy extends HTMLElement {
    connectedCallback() {
      if (this.shadowRoot) return;
      const root = this.attachShadow({mode:'open'});
      root.innerHTML = styles + `<details><summary>Нагревание и плавление льда</summary>
        <p>Лёд начинают нагревать при −20 °C. На первом участке растёт температура льда, на втором он плавится при 0 °C, на третьем нагревается образовавшаяся вода.</p>
        <label>Масса льда <input type="range" min="0.25" max="2" step="0.25" value="1"> <b></b></label>
        <label>Подведённая теплота <input type="range" min="0" max="540" step="0.5" value="200"> <b></b></label>
        <svg viewBox="0 0 480 280" role="img" aria-label="Температура от подведённой теплоты"></svg>
        <output></output>
        <p>Для наклонных участков Q = cmΔt. На горизонтальном участке температура постоянна и Q = λm. Сравни ширину участка плавления при массе 0,5 кг и 2 кг.</p></details>`;
      const [mass,heat] = root.querySelectorAll('input');
      const draw = () => {
        const m=Number(mass.value);
        const warmed=42*m, melted=372*m, limit=540*m;
        heat.max=limit;
        const q=Number(heat.value);
        const x=value=>62+360*value/1080;
        const y=value=>202-2.7*(value+20);
        const t=q<warmed?-20+q/(2.1*m):q<=melted?0:(q-melted)/(4.2*m);
        const caption=q<warmed?'Лёд нагревается':q<melted?'Лёд плавится':'Вода нагревается';
        const stage=q<warmed?'Q = c<sub>л</sub>mΔt':q<melted?'Q<sub>пл</sub> = Q − c<sub>л</sub>m · 20':'Q<sub>в</sub> = Q − c<sub>л</sub>m · 20 − λm';
        const grid=[-20,0,20,40].map(value=>`<path d="M62 ${y(value)}H422" stroke="#e7ddeb"/>
          <text x="52" y="${y(value)+5}" text-anchor="end">${value}</text>`).join('');
        const ticks=[0,270,540,810,1080].map(value=>`<path d="M${x(value)} 40V202" stroke="#e7ddeb"/>
          <text x="${x(value)}" y="226" text-anchor="middle">${value}</text>`).join('');
        root.querySelector('svg').innerHTML =
          `<g font-size="14" fill="#543a69">${grid}${ticks}<text x="18" y="28">t, °C</text>
          <text x="420" y="255" text-anchor="end">Q, кДж</text></g>
          <path d="M62 40V202H422" fill="none" stroke="#8d779d" stroke-width="2"/>
          <path d="M62 202L${x(warmed)} ${y(0)}" fill="none" stroke="#637db4" stroke-width="4"/>
          <path d="M${x(warmed)} ${y(0)}H${x(melted)}" fill="none" stroke="#9a5caf" stroke-width="4"/>
          <path d="M${x(melted)} ${y(0)}L${x(limit)} ${y(40)}" fill="none" stroke="#b3733a" stroke-width="4"/>
          <circle cx="${x(q)}" cy="${y(t)}" r="6" fill="#4b235f" stroke="white" stroke-width="2"/>`;
        const labels=root.querySelectorAll('label b');
        labels[0].textContent=format(m)+' кг';
        labels[1].textContent=format(q)+' кДж';
        root.querySelector('output').innerHTML=`<b>${caption} · ${format(t)} °C</b><br>
          ${stage}<br>Нагрев льда до 0 °C: 2,1 · ${format(m)} · 20 = ${format(warmed)} кДж<br>
          Полное плавление: 330 · ${format(m)} = ${format(melted-warmed)} кДж`;
      };
      root.addEventListener('input',draw);draw();
    }
  }
  customElements.define('rt-heating-study',HeatingStudy);
  class ParallelogramAreaStudy extends HTMLElement {
    connectedCallback() {
      if (this.shadowRoot) return;
      const root = this.attachShadow({mode:'open'});
      root.innerHTML = styles + `<details><summary>Почему сумма площадей не зависит от положения точки</summary>
        <p>Основание параллелограмма равно 10, высота — 6. У двух треугольников основания одинаковой длины. Передвигай точку E и смотри, как одна высота увеличивается на столько же, на сколько уменьшается другая.</p>
        <label>Высота точки E над нижней стороной <input type="range" min="0.5" max="5.5" step="0.5" value="2"></label>
        <svg viewBox="0 0 490 260" role="img" aria-label="Два треугольника внутри параллелограмма"></svg>
        <output></output><p>У каждого треугольника площадь равна половине произведения основания на высоту. Складываем высоты, получаем полную высоту параллелограмма, поэтому сумма площадей всегда равна половине его площади.</p></details>`;
      const draw = () => {
        const lower=Number(root.querySelector('input').value), upper=6-lower;
        const x=240+10*lower, y=212-26*lower;
        root.querySelector('svg').innerHTML =
          `<polygon points="65,212 125,56 385,56 325,212" fill="#f5faf7" stroke="#28634f" stroke-width="2"/>
          <polygon points="125,56 385,56 ${x},${y}" fill="#c4e5d7" stroke="#438f74" stroke-width="2"/>
          <polygon points="65,212 325,212 ${x},${y}" fill="#efe7ca" stroke="#9e7935" stroke-width="2"/>
          <path d="M${x} 56V212" stroke="#4d6458" stroke-width="2" stroke-dasharray="5 5"/>
          <circle cx="${x}" cy="${y}" r="4" fill="#164b38"/>
          <g font-size="16" fill="#2d5547"><text x="255" y="39" text-anchor="middle">Верхнее основание · 10</text>
          <text x="195" y="239" text-anchor="middle">Нижнее основание · 10</text><text x="${x+15}" y="${y+5}">E</text></g>`;
        root.querySelector('output').innerHTML =
          `Высоты: ${format(upper)} + ${format(lower)} = 6<br>
          Верхняя площадь: 10 · ${format(upper)} / 2 = ${format(5*upper)}<br>
          Нижняя площадь: 10 · ${format(lower)} / 2 = ${format(5*lower)}<br>
          <b>Сумма площадей: ${format(5*upper)} + ${format(5*lower)} = 30</b>`;
      };
      root.addEventListener('input',draw);draw();
    }
  }
  customElements.define('rt-parallelogram-area-study',ParallelogramAreaStudy);
  class SimilarityStudy extends HTMLElement {
    connectedCallback() {
      if (this.shadowRoot) return;
      const root = this.attachShadow({mode:'open'});
      root.innerHTML = styles + `<details><summary>Подобие · параллельное сечение треугольника</summary>
        <p>Основание AC равно 12, высота из B равна 6. Двигай отрезок MN параллельно основанию. У малого треугольника сохраняются углы большого, поэтому все его длины меняются в одном отношении.</p>
        <label>Доля пути от вершины к основанию <input type="range" min=".2" max=".8" step=".05" value=".5"> <b></b></label>
        <svg viewBox="0 0 490 280" role="img" aria-label="Отрезок MN параллелен основанию AC. Верхний треугольник BMN подобен всему треугольнику ABC."></svg>
        <output></output>
        <p>Поставь сечение посередине. Стороны и высота малого треугольника будут вдвое меньше, а площадь — вчетверо. Проверь это по числам рядом с рисунком.</p>
      </details>`;
      const slider = root.querySelector('input');
      const svg = root.querySelector('svg');
      const readout = root.querySelector('output');
      const draw = () => {
        const k = Number(slider.value);
        const xM = 134 - 94*k;
        const xN = 134 + 266*k;
        const y = 34 + 180*k;
        const base = 12*k;
        const height = 6*k;
        const area = base*height/2;
        root.querySelector('b').textContent = format(k);
        svg.innerHTML = `<rect width="490" height="280" rx="15" fill="#f5faf7"/>
          <path d="M40 214L134 34L400 214Z" fill="#e5f1e9" stroke="#24634e" stroke-width="2.5"/>
          <path d="M${xM} ${y}L134 34L${xN} ${y}Z" fill="#bce2d1" stroke="none"/>
          <path d="M134 34L40 214M134 34L400 214" fill="none" stroke="#24634e" stroke-width="2.5"/>
          <path d="M134 34V214" fill="none" stroke="#527567" stroke-dasharray="5 5"/>
          <path d="M${xM} ${y}H${xN}" fill="none" stroke="#a16a23" stroke-width="3.5"/>
          <g font-family="system-ui,sans-serif" font-size="17" fill="#274e42" text-anchor="middle">
            <text x="134" y="22">B</text><text x="25" y="234">A</text><text x="415" y="234">C</text>
            <text x="${xM-16}" y="${y+5}">M</text><text x="${xN+17}" y="${y+5}">N</text>
            <text x="222" y="256">Основание AC = 12</text>
          </g>`;
        readout.innerHTML = `Коэффициент подобия <b>k = ${format(k)}</b><br>MN = 12 · ${format(k)} = ${format(base)}<br>Малая высота = 6 · ${format(k)} = ${format(height)}<br>Малая площадь = ${format(base)} · ${format(height)} / 2 = <b>${format(area)}</b> из 36`;
      };
      slider.addEventListener('input', draw);
      draw();
    }
  }
  customElements.define('rt-similarity-study',SimilarityStudy);

  class HorizontalLevelStudy extends HTMLElement {
    connectedCallback() {
      if (this.shadowRoot) return;
      const root = this.attachShadow({mode:'open'});
      root.innerHTML = styles + `<details><summary>Сколько точек пересечения с прямой y = m</summary>
        <p>При x &lt; 0 функция задана формулой y = x + 2. При x ≥ 0 действует y = (x − 1)². Двигай горизонтальную прямую. Пустая точка (0; 2) не считается пересечением.</p>
        <label>Уровень m <input type="range" min="-1" max="4" step="0.25" value="1.5"></label>
        <svg viewBox="0 0 480 295" role="img" aria-label="Кусочный график и горизонтальная прямая"></svg>
        <output></output>
        <p>Проверь отдельно уровни 0, 1 и 2. Число пересечений может измениться в вершине или на границе между формулами.</p></details>`;
      const x=v=>244+45*v, y=v=>195-36*v;
      const vertical=Array.from({length:9},(_,i)=>i-4).map(v=>`<path d="M${x(v)} 15V267" stroke="#deebe4"/>
        <text x="${x(v)}" y="288" text-anchor="middle">${v}</text>`).join('');
      const horizontal=Array.from({length:8},(_,i)=>i-2).map(v=>`<path d="M64 ${y(v)}H424" stroke="#deebe4"/>
        <text x="49" y="${y(v)+5}" text-anchor="end">${v}</text>`).join('');
      const parabola=Array.from({length:81},(_,i)=>{
        const v=(1+Math.sqrt(5))*i/80;
        return `${x(v)},${y((v-1)**2)}`;
      }).join(' ');
      const draw = () => {
        const m=Number(root.querySelector('input').value);
        const intersections=[];
        if(m<2)intersections.push(m-2);
        if(m===0)intersections.push(1);
        if(m>0)intersections.push(...[1-Math.sqrt(m),1+Math.sqrt(m)].filter(v=>v>=0));
        const points=intersections.map(v=>`<circle cx="${x(v)}" cy="${y(m)}" r="5" fill="#63348d" stroke="white" stroke-width="2"/>`).join('');
        root.querySelector('svg').innerHTML=`<g font-size="14" fill="#456156">${vertical}${horizontal}</g>
          <path d="M64 195H424M244 15V267" stroke="#7d978a" stroke-width="2"/>
          <path d="M64 267L244 123" fill="none" stroke="#b47b2e" stroke-width="3"/>
          <polyline points="${parabola}" fill="none" stroke="#24785b" stroke-width="3"/>
          <path d="M64 ${y(m)}H424" stroke="#8754ad" stroke-width="2" stroke-dasharray="6 5"/>
          <circle cx="244" cy="123" r="5" fill="white" stroke="#b47b2e" stroke-width="2"/>
          <circle cx="244" cy="159" r="4" fill="#24785b"/>${points}`;
        root.querySelector('output').innerHTML=`<b>m = ${format(m)} · пересечений: ${intersections.length}</b><br>
          ${intersections.length?'Абсциссы точек: '+intersections.map(format).join(' · '):'На этом уровне общих точек нет.'}`;
      };
      root.addEventListener('input',draw);draw();
    }
  }
  customElements.define('rt-horizontal-level-study',HorizontalLevelStudy);
  class CircuitPowerStudy extends HTMLElement {
    connectedCallback() {
      if (this.shadowRoot) return;
      const root=this.attachShadow({mode:'open'});
      root.innerHTML=styles+`<details><summary>Как соединение меняет мощность</summary>
        <p>Источник поддерживает 12 В. Сопротивление первого резистора 6 Ом. Измени сопротивление второго и сравни показания при последовательном и параллельном соединениях.</p>
        <label>Соединение <select><option value="series">Последовательное</option><option value="parallel">Параллельное</option></select></label>
        <label>Сопротивление R<sub>2</sub> <input type="range" min="6" max="30" value="18"> <b></b></label>
        <svg viewBox="0 0 480 246" role="img" aria-label="Схема соединения двух резисторов"></svg>
        <output></output>
        <p>При последовательном соединении ток общий, поэтому P = I²R больше у большего сопротивления. При параллельном соединении напряжение общее, поэтому P = U²/R больше у меньшего сопротивления.</p></details>`;
      const resistor=(x,y,id)=>`<rect x="${x}" y="${y-15}" width="82" height="30" rx="4" fill="#eadff4"/>
        <text x="${x+41}" y="${y+6}" fill="#50345f" stroke="none" text-anchor="middle" font-size="17">${id}</text>`;
      const draw=()=>{
        const r1=6,r2=Number(root.querySelector('input').value),u=12;
        const series=root.querySelector('select').value==='series';
        const total=series?r1+r2:1/(1/r1+1/r2);
        const current=u/total;
        const i1=series?current:u/r1, i2=series?current:u/r2;
        const p1=i1*i1*r1, p2=i2*i2*r2;
        const wire=series
          ?'<path d="M64 169H128M210 169H272M354 169H416V53H251M229 53H64V169"/>'+resistor(128,169,'R₁')+resistor(272,169,'R₂')
          :'<path d="M229 53H64V197H200M282 197H416V53H251M64 123H200M282 123H416"/>'+resistor(200,123,'R₁')+resistor(200,197,'R₂')+
            '<circle cx="64" cy="123" r="4" fill="#8052a9"/><circle cx="416" cy="123" r="4" fill="#8052a9"/>';
        root.querySelector('svg').innerHTML=`<rect width="480" height="246" rx="12" fill="#faf6ff"/>
          <g stroke="#8052a9" stroke-width="3" fill="none">${wire}<path d="M229 35V71M251 43V63"/></g>
          <text x="240" y="24" fill="#50345f" text-anchor="middle" font-size="16">12 В</text>`;
        root.querySelector('b').textContent=format(r2)+' Ом';
        root.querySelector('output').innerHTML=`<b>R<sub>общ</sub> = ${format(total)} Ом · I<sub>общ</sub> = ${format(current)} А</b><br>
          R<sub>1</sub>: U = ${format(i1*r1)} В, I = ${format(i1)} А, P = ${format(p1)} Вт<br>
          R<sub>2</sub>: U = ${format(i2*r2)} В, I = ${format(i2)} А, P = ${format(p2)} Вт<br>
          Общая мощность = ${format(p1+p2)} Вт`;
      };
      root.addEventListener('input',draw);draw();
    }
  }
  customElements.define('rt-circuit-power-study',CircuitPowerStudy);
  class WaveStudy extends HTMLElement {
    connectedCallback() {
      if (this.shadowRoot) return;
      const root = this.attachShadow({mode:'open'});
      root.innerHTML = styles + `<style>
        .wave-plots{display:flex;flex-wrap:wrap;gap:1rem}
        .wave-plots figure{flex:1 1 350px;min-width:0;margin:0}
        .wave-plots figcaption{font-weight:650;margin:0 0 .4rem}
      </style><details><summary>Волна · колебания точки и движение гребня</summary>
        <p>На первом графике видно форму волны в один момент, на втором — как один поплавок поднимается и опускается со временем. Две оранжевые точки показывают одно и то же положение поплавка.</p>
        <label>Скорость волны <input data-speed type="range" min="1" max="4" step=".2" value="3.2"> <b data-speed-label></b></label>
        <label>Частота <input data-frequency type="range" min="1" max="3" step=".25" value="2"> <b data-frequency-label></b></label>
        <div class="wave-plots">
        <figure><figcaption>Форма волны · координата x</figcaption>
        <svg viewBox="0 0 580 235" role="img" aria-label="Профиль бегущей волны, поплавок и отметки двух соседних гребней">
          <rect width="580" height="235" rx="14" fill="#f8f4fc"/>
          <path d="M38 103H540" fill="none" stroke="#9788a6" stroke-width="1.5"/>
          <path d="M38 148V157M162 148V157M286 148V157M410 148V157M534 148V157" fill="none" stroke="#9788a6" stroke-width="1.5"/>
          <g fill="#4a3761" font-size="16" text-anchor="middle" font-family="system-ui,sans-serif">
            <text x="38" y="177">0</text><text x="162" y="177">2</text><text x="286" y="177">4</text><text x="410" y="177">6</text><text x="534" y="177">8 м</text>
            <text x="224" y="30">Поплавок</text>
            <text x="485" y="30">Ход волны →</text>
          </g>
          <path d="M224 39V142" fill="none" stroke="#a76d25" stroke-dasharray="4 5"/>
          <polyline data-wave fill="none" stroke="#7138aa" stroke-width="3.5" stroke-linejoin="round"/>
          <circle data-float cx="224" r="7" fill="#b87225" stroke="white" stroke-width="2"/>
          <g data-crests fill="#7138aa" stroke="white" stroke-width="2"><circle cy="61" r="4.5"/><circle cy="61" r="4.5"/></g>
          <path data-span fill="none" stroke="#7138aa" stroke-width="2"/>
          <text data-wavelength y="225" text-anchor="middle" fill="#4a3761" font-size="17">λ</text>
        </svg></figure>
        <figure><figcaption>Движение поплавка · время t</figcaption>
        <svg viewBox="0 0 580 235" role="img" aria-label="График высоты поплавка. Оранжевая точка соответствует текущему времени.">
          <rect width="580" height="235" rx="14" fill="#f8f4fc"/>
          <path d="M38 45V148H534M38 103H534M162 45V148M286 45V148M410 45V148M534 45V148" fill="none" stroke="#dfd3ec" stroke-width="1.5"/>
          <path d="M38 103H534" fill="none" stroke="#9788a6" stroke-width="1.5"/>
          <polyline data-history fill="none" stroke="#7138aa" stroke-width="3.5" stroke-linejoin="round"/>
          <path data-now fill="none" stroke="#a76d25" stroke-dasharray="4 5"/>
          <circle data-history-float r="7" fill="#b87225" stroke="white" stroke-width="2"/>
          <g fill="#4a3761" font-size="16" text-anchor="middle" font-family="system-ui,sans-serif">
            <text x="113" y="30">Смещение поплавка</text>
            <text data-time-tick x="38" y="177"/><text data-time-tick x="162" y="177"/><text data-time-tick x="286" y="177"/><text data-time-tick x="410" y="177"/><text data-time-tick x="534" y="177"/>
            <text x="286" y="215">Время, с</text>
          </g>
        </svg></figure>
        </div>
        <label>Время <input data-time type="range" min="0" max="8" step=".01" value="0"> <b data-time-label></b></label>
        <button type="button">Запустить</button>
        <output></output>
        <p>Расстояние от одного гребня до следующего — длина волны λ. За один период гребень проходит это расстояние. Если оставить скорость прежней и увеличить частоту, длина волны уменьшится.</p>
      </details>`;
      const speed = root.querySelector('[data-speed]');
      const frequency = root.querySelector('[data-frequency]');
      const time = root.querySelector('[data-time]');
      const button = root.querySelector('button');
      const [speedLabel, frequencyLabel, timeLabel] = [...root.querySelectorAll('label b')];
      const wave = root.querySelector('[data-wave]');
      const float = root.querySelector('[data-float]');
      const history = root.querySelector('[data-history]');
      const historyFloat = root.querySelector('[data-history-float]');
      const now = root.querySelector('[data-now]');
      const timeTicks = root.querySelectorAll('[data-time-tick]');
      const crests = root.querySelectorAll('[data-crests] circle');
      const span = root.querySelector('[data-span]');
      const wavelength = root.querySelector('[data-wavelength]');
      const output = root.querySelector('output');
      const px = x => 38 + 62*x;
      const draw = () => {
        const v = Number(speed.value);
        const f = Number(frequency.value);
        const t = Number(time.value);
        const length = v/f;
        const y = (x, moment) => 103 - 42*Math.cos(2*Math.PI*(x/length-f*moment));
        wave.setAttribute('points',Array.from({length:201},(_,i)=> {
          const x = i/25;
          return `${px(x)},${y(x,t).toFixed(1)}`;
        }).join(' '));
        const floatHeight = y(3,t);
        float.setAttribute('cy',floatHeight);
        const windowStart = Math.max(0,Math.min(6,t-1));
        history.setAttribute('points',Array.from({length:161},(_,i) => {
          const elapsed = i/80;
          return `${(38+248*elapsed).toFixed(1)},${y(3,windowStart+elapsed).toFixed(1)}`;
        }).join(' '));
        const cursor = 38+248*(t-windowStart);
        now.setAttribute('d',`M${cursor} 45V148`);
        historyFloat.setAttribute('cx',cursor);
        historyFloat.setAttribute('cy',floatHeight);
        timeTicks.forEach((label,i) => { label.textContent = format(windowStart+i/2); });
        const x1 = px((v*t)%length);
        const x2 = x1 + 62*length;
        crests[0].setAttribute('cx',x1);
        crests[1].setAttribute('cx',x2);
        span.setAttribute('d',`M${x1} 190v13m0-6H${x2}m0-7v13`);
        wavelength.setAttribute('x',(x1+x2)/2);
        speedLabel.textContent = format(v)+' м/с';
        frequencyLabel.textContent = format(f)+' Гц';
        timeLabel.textContent = format(t)+' с';
        output.innerHTML = `Период T = 1 / ν = <b>${format(1/f)} с</b><br>Длина волны λ = v / ν = ${format(v)} / ${format(f)} = <b>${format(length)} м</b>`;
      };
      this.stop = () => {
        cancelAnimationFrame(this.frame);
        this.frame = 0;
        button.textContent = 'Запустить';
      };
      root.addEventListener('input',() => { this.stop(); draw(); });
      root.querySelector('details').addEventListener('toggle',event => {
        if (!event.target.open) this.stop();
      });
      button.addEventListener('click',() => {
        if (this.frame) {
          this.stop();
          return;
        }
        if (Number(time.value) >= 8) time.value = 0;
        const start = performance.now() - 1000*Number(time.value);
        const tick = now => {
          time.value = Math.min(8,(now-start)/1000);
          draw();
          if (Number(time.value) >= 8) this.stop();
          else this.frame = requestAnimationFrame(tick);
        };
        button.textContent = 'Пауза';
        this.frame = requestAnimationFrame(tick);
      });
      draw();
    }
    disconnectedCallback() {
      this.stop?.();
    }
  }
  customElements.define('rt-wave-study',WaveStudy);
  class LensStudy extends HTMLElement {
    connectedCallback() {
      if (this.shadowRoot) return;
      const root = this.attachShadow({mode:'open'});
      root.innerHTML = styles + `<details><summary>Собирающая линза · действительное и мнимое изображение</summary>
        <p>Двигай предмет вдоль оптической оси. Один луч проходит через центр линзы без отклонения. Другой идёт параллельно оси, а за линзой проходит через фокус.</p>
        <label>Расстояние до предмета <input type="range" min=".5" max="4" step=".05" value="2"> <b></b></label>
        <svg viewBox="0 0 640 300" role="img" aria-label="Ход двух лучей через собирающую линзу"></svg>
        <output></output>
        <p>Формула тонкой линзы: 1/F = 1/d + 1/b. Здесь d — расстояние до предмета, b — до действительного изображения. Для мнимого изображения b отрицательно.</p>
        <p>При расстоянии меньше F лучи за линзой расходятся. Пунктир показывает их продолжения. Мнимое изображение видно через линзу, но его нельзя поймать на экране.</p>
      </details>`;
      const slider = root.querySelector('input');
      const output = root.querySelector('output');
      const picture = root.querySelector('svg');
      const draw = () => {
        const distance = Number(slider.value);
        const inFocus = distance === 1;
        const image = inFocus ? 0 : distance / (distance - 1);
        const height = .45;
        const imageHeight = inFocus ? 0 : -height * image / distance;
        const scale = Math.min(68, 242 / Math.max(distance, Math.abs(image)), 83 / Math.max(height, Math.abs(imageHeight)));
        const x = value => 320 + value * scale;
        const y = value => 149 - value * scale;
        const rayStart = x(-distance);
        const rayHeight = y(height);
        const right = 596;
        const rayX = (right - 320) / scale;
        const real = distance > 1;
        const segment = (x1,y1,x2,y2,color,width,dashed=false) => `<path d="M${x1} ${y1}L${x2} ${y2}" fill="none" stroke="${color}" stroke-width="${width}"${dashed?' stroke-dasharray="5 5"':''}/>`;
        const arrow = (at,to,color,dashed=false) => {
          const direction = to < 149 ? 1 : -1;
          return segment(at,149,at,to,color,3.8,dashed) + `<path d="M${at-5} ${to+7*direction}L${at} ${to}L${at+5} ${to+7*direction}" fill="none" stroke="${color}" stroke-width="2.5"/>`;
        };
        const mark = (n,label) => `<path d="M${x(n)} 143v12" stroke="#816f98" stroke-width="1.5"/><text x="${x(n)}" y="258" text-anchor="middle" fill="#543b70" font-size="16">${label}</text>`;
        const marks = scale > 23 ? mark(-2,'2F')+mark(-1,'F')+mark(1,'F')+mark(2,'2F') : '';
        const forward = segment(rayStart,rayHeight,320,rayHeight,'#ab702b',2.5) +
          segment(320,rayHeight,right,y(height*(1-rayX)),'#ab702b',2.5) +
          segment(rayStart,rayHeight,right,y(-height*rayX/distance),'#5378a9',2.5);
        const backward = real || inFocus ? '' : segment(320,rayHeight,x(image),y(imageHeight),'#ab702b',2,true) +
          segment(320,149,x(image),y(imageHeight),'#5378a9',2,true);
        const imageArrow = inFocus ? '' : arrow(x(image),y(imageHeight),'#ad5726',!real);
        picture.innerHTML = `<rect width="640" height="300" rx="16" fill="#f7f2fc"/>
          <defs><clipPath id="rt-lens-rays"><rect x="39" y="44" width="557" height="191"/></clipPath></defs>
          <path d="M39 149H603m-8-5 8 5-8 5" fill="none" stroke="#897ba1" stroke-width="1.6"/>
          <g clip-path="url(#rt-lens-rays)">${forward}${backward}</g>
          ${marks}${arrow(rayStart,rayHeight,'#4f3d78')}${imageArrow}
          <path d="M320 77V220m-8-8 8 8 8-8M312 85l8-8 8 8" fill="none" stroke="#7850a4" stroke-width="3"/>
          <g font-family="system-ui,sans-serif" font-size="16">
            <text x="53" y="28" fill="#4f3d78">Предмет</text>
            <text x="320" y="28" text-anchor="middle" fill="#7850a4">Линза</text>
            <text x="587" y="28" text-anchor="end" fill="#ad5726">Изображение</text>
          </g>`;
        root.querySelector('b').textContent = format(distance)+'F';
        if (inFocus) {
          output.textContent = 'Предмет находится в фокусе. Лучи за линзой параллельны, поэтому изображения на конечном расстоянии нет.';
        } else {
          const status = real ? 'действительное, перевёрнутое' : 'мнимое, прямое';
          output.innerHTML = `Расстояние от линзы до изображения <b>${format(Math.abs(image))}F</b><br>Увеличение по модулю <b>${format(Math.abs(image / distance))}</b><br>Изображение ${status}.`;
        }
      };
      slider.addEventListener('input',draw);
      draw();
    }
  }
  customElements.define('rt-lens-study',LensStudy);
  class PulleyStudy extends HTMLElement {
    connectedCallback() {
      if (this.shadowRoot) return;
      const root = this.attachShadow({mode:'open'});
      root.innerHTML = styles + `<details><summary>Блоки · сила тяги и путь верёвки</summary>
        <p>Подними один и тот же груз двумя способами. Сравни силу тяги и то, сколько верёвки проходит через руку. Блоки и верёвка лёгкие, трения нет, груз поднимается равномерно.</p>
        <label>Тип блока <select><option value="fixed">Неподвижный</option><option value="moving">Подвижный</option></select></label>
        <label>Масса груза <input data-mass type="range" min="1" max="10" step="1" value="4"> <b data-mass-label></b></label>
        <svg viewBox="0 0 580 300" role="img" aria-label="Модель подъёма груза с помощью блока"></svg>
        <label>Высота подъёма <input data-rise type="range" min="0" max="1" step=".01" value="0"> <b data-rise-label></b></label>
        <button type="button">Запустить подъём</button><output></output>
        <p>Подвижный блок поддерживают две ветви верёвки. Каждая несёт половину нагрузки, зато для подъёма на один метр нужно вытянуть два метра верёвки.</p>
      </details>`;
      const mode = root.querySelector('select');
      const mass = root.querySelector('[data-mass]');
      const rise = root.querySelector('[data-rise]');
      const button = root.querySelector('button');
      const stage = root.querySelector('svg');
      const output = root.querySelector('output');
      const draw = () => {
        const moving = mode.value === 'moving';
        const branches = moving ? 2 : 1;
        const m = Number(mass.value);
        const height = Number(rise.value);
        const travel = height * 54;
        const wheelY = moving ? 175 - travel : 84;
        const hookX = moving ? 279 : 247;
        const weightY = 226 - travel;
        const endY = moving ? 151 - 2*travel : 140 + travel;
        const rope = moving
          ? `M247 39V${wheelY}a32 32 0 0 0 64 0V${endY}`
          : `M247 ${weightY}V84a32 32 0 0 1 64 0V${endY}`;
        const anchor = moving
          ? `M215 39H282M279 ${wheelY+30}V${weightY}`
          : 'M240 39H318M279 39V54';
        const tipY = endY + (moving ? -20 : 24);
        const wingY = tipY + (moving ? 7 : -7);
        stage.innerHTML = `<rect width="580" height="300" rx="15" fill="#f7f2fc"/>
          <path d="M128 266H475" fill="none" stroke="#c8b9d7" stroke-dasharray="4 5"/>
          <path d="${anchor}" fill="none" stroke="#7950a4" stroke-width="3" stroke-linecap="round"/>
          <circle cx="279" cy="${wheelY}" r="28.5" fill="#e1d4f1" stroke="#7950a4" stroke-width="3"/>
          <circle cx="279" cy="${wheelY}" r="4" fill="#7950a4"/>
          <path d="${rope}" fill="none" stroke="#594373" stroke-width="3" stroke-linecap="round"/>
          <path d="M311 ${endY}V${tipY}M304 ${wingY}L311 ${tipY}L318 ${wingY}" fill="none" stroke="#ab6e28" stroke-width="3" stroke-linecap="round"/>
          <rect x="${hookX-30}" y="${weightY}" width="60" height="36" rx="7" fill="#d6bcee" stroke="#7950a4" stroke-width="2"/>
          <g font-family="system-ui,sans-serif" font-size="17" fill="#4f3964">
            <text x="${hookX}" y="${weightY+24}" text-anchor="middle">${m} кг</text>
            <text x="335" y="${(endY+tipY)/2+6}" fill="#8e5318">Тяга ${format(m*10/branches)} Н</text>
            <text x="84" y="287">Начальный уровень нижней грани груза</text>
          </g>`;
        root.querySelector('[data-mass-label]').textContent = m+' кг';
        root.querySelector('[data-rise-label]').textContent = format(height)+' м';
        output.innerHTML = `Сила тяги <b>${format(m*10/branches)} Н</b><br>Верёвка прошла <b>${format(branches*height)} м</b><br>Работа тяги = ${format(m*10/branches)} · ${format(branches*height)} = <b>${format(m*10*height)} Дж</b>`;
      };
      this.stop = () => {
        cancelAnimationFrame(this.frame);
        this.frame = 0;
        button.textContent = 'Запустить подъём';
      };
      root.addEventListener('input',()=>{this.stop();draw();});
      root.querySelector('details').addEventListener('toggle',event=>{if(!event.target.open)this.stop();});
      button.addEventListener('click',()=>{
        if (this.frame) {
          this.stop();
          return;
        }
        if (Number(rise.value) >= 1) rise.value = 0;
        const start = performance.now() - 2400 * Number(rise.value);
        const tick = now => {
          rise.value = Math.min(1,(now-start)/2400);
          draw();
          if (Number(rise.value) >= 1) this.stop();
          else this.frame = requestAnimationFrame(tick);
        };
        button.textContent = 'Пауза';
        this.frame = requestAnimationFrame(tick);
      });
      draw();
    }
    disconnectedCallback() {
      this.stop?.();
    }
  }
  customElements.define('rt-pulley-study',PulleyStudy);


  customElements.define('rt-sequence-study',SequenceStudy);
  customElements.define('rt-collision-study',CollisionStudy);
})();
