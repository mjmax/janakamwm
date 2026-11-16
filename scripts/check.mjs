import assert from 'node:assert/strict';
import {readFile,access} from 'node:fs/promises';
import vm from 'node:vm';
const html = await readFile(new URL('../index.html',import.meta.url),'utf8');
const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(match=>match[1]);
assert.equal(new Set(ids).size,ids.length,'HTML IDs must be unique');
for(const [,href] of html.matchAll(/\bhref="#([^"]+)"/g)) assert(ids.includes(href),`Missing anchor: ${href}`);
for(const [,path] of html.matchAll(/(?:src|href)="([^"#:]+)"/g)) {
  if(!/^https?:|^mailto:|^tel:/.test(path)) await access(new URL('../'+path,import.meta.url));
}
const config = await readFile(new URL('../config.js',import.meta.url),'utf8');
for(const template of [1,4]) {
  const document = {documentElement:{dataset:{}}};
  vm.runInNewContext(config.replace(/PORTFOLIO_TEMPLATE = \d/,`PORTFOLIO_TEMPLATE = ${template}`),{document});
  assert.equal(document.documentElement.dataset.template,String(template));
}
assert(html.includes('https://mjmax.github.io/janakamwm/'));
console.log('Passed: local asset links, section anchors, unique IDs, both template configurations, and GitHub Pages URL.');
