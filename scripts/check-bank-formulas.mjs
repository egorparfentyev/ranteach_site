import fs from 'node:fs';
import vm from 'node:vm';
import {createRequire} from 'node:module';

const require = createRequire(import.meta.url);
const katex = require('../public/math/vendor/katex.min.js');
const context = vm.createContext({});
vm.runInContext(fs.readFileSync('public/math/data.js', 'utf8') + ';globalThis.data=MATH_DATA;', context);

function decodeMarkup(value) {
  return value.replace(/&quot;/g,'"').replace(/&#39;/g,"'").replace(/&lt;/g,'<')
    .replace(/&gt;/g,'>').replace(/&amp;/g,'&');
}

let count = 0;
for (const task of context.data.tasks) {
  const markup = (task.html + ' ' + task.solution).matchAll(/data-tex="([^"]*)"/g);
  const formulas = Array.from(markup, match => decodeMarkup(match[1]));
  if (task.answerTex) formulas.push(task.answerTex);
  for (const formula of formulas) {
    try {
      katex.renderToString(formula, {throwOnError:true, trust:false, strict:'ignore'});
      count++;
    } catch (error) {
      throw Error(task.id + ': ' + error.message);
    }
  }
}
console.log(`Passed: ${count} bank formulas rendered with KaTeX.`);
