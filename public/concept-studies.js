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
  customElements.define('rt-sequence-study',SequenceStudy);
  customElements.define('rt-collision-study',CollisionStudy);
})();
