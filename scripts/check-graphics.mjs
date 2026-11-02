import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
for(const file of ['public/math/math.js','public/math-experiments.js','public/phenomena.js']){
 const source=fs.readFileSync(file,'utf8');
 for(const match of source.matchAll(/<path\b([^>]*?)\/>/g))assert.match(match[1],/\bfill=/,`${file}: path needs explicit fill`);
}
const context={heading:()=>'',labView:null,document:{addEventListener(){}},Math,Number};vm.createContext(context);
vm.runInContext(fs.readFileSync('public/phenomena.js','utf8').replace('labView=view;',`globalThis.inspect=(kind,time,opts={})=>{mode=kind;t=time;if(opts.v!==undefined)v=opts.v;if(opts.g!==undefined)g=opts.g;if(opts.angle!==undefined)angle=opts.angle;return {html:view(),end:endTime()}};labView=view;`),context);
for(const mode of ['uniform','rotation','vertical','projectile','spring','friction','buoyancy'])for(const time of [0,.5,4]){
 const result=context.inspect(mode,time);assert.ok(result.html.includes('phen-play'));assert.ok(!/NaN|undefined|Infinity/.test(result.html));
}
assert.ok(Math.abs(context.inspect('vertical',0,{v:10,g:10}).end-2)<1e-9);
assert.ok(Math.abs(context.inspect('projectile',0,{v:10,g:10,angle:30}).end-1)<1e-9);
console.log('Passed: explicit SVG fills, seven animated scenes, finite readouts and flight duration.');
