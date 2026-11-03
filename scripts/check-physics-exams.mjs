import fs from 'node:fs';import vm from 'node:vm';import assert from 'node:assert/strict';
const root=new URL('../public/',import.meta.url),c={window:{RTLearning:{esc:s=>String(s)}},document:{},console};vm.createContext(c);vm.runInContext(fs.readFileSync(new URL('physics-exams.js',root),'utf8'),c);const {papers,score,max}=c.window.RTPhysicsExams;
for(const [year,p]of Object.entries(papers)){assert.equal(p.key.length,16);assert.equal(p.key.reduce((s,k,i)=>s+score(i+1,k,k),0),23);assert.equal(Array.from({length:22},(_,i)=>max(i+1)).reduce((s,n)=>s+n),39);for(let page=1;page<=p.pages;page++)assert(fs.statSync(new URL(`physics-exams/${year}/page-${page}.webp`,root)).size>1000);for(const pages of Object.values(p.rubrics))for(const page of pages)assert(page>=p.criteria&&page<=p.pages);assert.equal(score(1,'',p.key[0]),0);}
assert.equal(score(1,'213','213'),2);assert.equal(score(1,'214','213'),1);assert.equal(score(1,'244','213'),0);assert.equal(score(1,'2131','213'),0);
assert.equal(score(14,'31','13'),2);assert.equal(score(14,'12','13'),1);assert.equal(score(14,'1','13'),1);assert.equal(score(14,'123','13'),0);assert.equal(score(14,'24','13'),0);
assert.equal(score(9,'2,8','2.8'),1);assert.equal(score(9,'2.8 Н','2.8'),0);assert.equal(score(9,'Infinity','2.8'),0);assert.equal(score(3,'04','4'),0);
const raw=fs.readFileSync(new URL('math/data.js',root),'utf8'),data=JSON.parse(raw.slice(raw.indexOf('=')+1).trim().replace(/;$/,''));for(const t of data.tasks.filter(t=>t.kind==='written'))for(const page of t.rubricPages)assert(fs.existsSync(new URL(`math/images/criteria-${t.year}-${page}.webp`,root)));
console.log('Passed: 2 complete physics papers, 54 document pages, partial-credit grading, 39-point totals and inline mathematics criteria.');

// Walk the same buttons a student uses, including returning to the answer sheet from review.
for (const year of [2025, 2026]) {
  const buttons = new Map();
  const openPaper = {dataset: {pxOpen: String(year)}};
  const criteriaButton = {};
  const document = {
    querySelector(selector) {
      const button = {};
      buttons.set(selector, button);
      return button;
    },
    querySelectorAll(selector) {
      if (selector === '[data-px-open]') return [openPaper];
      if (selector === '[data-px-criteria]') return [criteriaButton];
      return [];
    },
    getElementById() { return null; }
  };
  const ctx = {
    window: {RTLearning: {esc: String}, scrollTo() {}}, document, state: {},
    page: 'physics-exams', heading: () => '', render() {}, save() {},
    setInterval: () => 0, clearInterval() {}
  };
  vm.createContext(ctx);
  vm.runInContext(fs.readFileSync(new URL('physics-exams.js',root),'utf8'),ctx);
  openPaper.onclick();
  const view = ctx.window.RTPhysicsExams.view;
  const session = ctx.state.physicsExams[year];
  session.answers[1] = '999';
  function assertHidden() {
    assert.doesNotMatch(view(), /data-px-criteria|Эталон|<summary>Ответ<\/summary>/);
  }
  assertHidden();
  criteriaButton.onclick();
  assertHidden();
  buttons.get('[data-px-review]').onclick();
  assertHidden();
  buttons.get('[data-px-cancel]').onclick();
  assertHidden();
  buttons.get('[data-px-review]').onclick();
  buttons.get('[data-px-finish]').onclick();
  assert.match(view(), new RegExp('<td>999</td><td>'+papers[year].key[0]+'</td>'));
  assert.match(view(), /data-px-criteria/);
  buttons.get('[data-px-new]').onclick();
  assertHidden();
}

const mathScript = fs.readFileSync(new URL('math/math.js', root), 'utf8');
const question = data.tasks.find(t => t.id === 'fipi-760E4B');
const mathSession = {
  kind: 'mixed', ids: [question.id], index: 0,
  answers: {[question.id]: '888'}, self: {}, notes: {}, done: false
};
const mathContext = {
  ms: {exam: mathSession}, byId: new Map([[question.id,question]]), DATA: data,
  examReview: false, answerKey: String, isCorrect: () => false,
  topHeading: () => '', escapeHtml: String
};
vm.createContext(mathContext);
for (const name of ['contextBlock','sourceBlock','solutionBlock','examSummary','mathExam','mathExamResult']) {
  vm.runInContext(mathScript.split('\n').find(line => line.startsWith('function '+name+'(')), mathContext);
}
for (const review of [false,true]) {
  mathContext.examReview = review;
  const markup = mathContext.mathExam();
  assert.match(markup,/888/);
  assert.doesNotMatch(markup,/Оригинал ↗|demo\.pdf|<h3>Ответ:|Теорема Пифагора c² = 289/);
  assert.ok(!markup.includes(question.solution));
}
mathSession.done = true;
const resultMarkup = mathContext.mathExam();
assert.match(resultMarkup, /Твой ответ: <b>888<\/b>/);
assert.match(resultMarkup, /<h3>Ответ: 17<\/h3>/);
assert.ok(resultMarkup.includes(question.solution));
