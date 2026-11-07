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
  customElements.define('rt-sequence-study',SequenceStudy);
  customElements.define('rt-collision-study',CollisionStudy);
})();
