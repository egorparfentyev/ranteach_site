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
  customElements.define('rt-sequence-study',SequenceStudy);
  customElements.define('rt-collision-study',CollisionStudy);
})();
