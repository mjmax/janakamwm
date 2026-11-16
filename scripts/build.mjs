import {mkdir,copyFile,cp,rm} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
const root = fileURLToPath(new URL('../',import.meta.url));
const out = new URL('../dist/',import.meta.url);
await rm(out,{recursive:true,force:true});
await mkdir(out,{recursive:true});
for (const file of ['index.html','styles.css','biography.css','app.js','config.js','galleries.js','.nojekyll']) await copyFile(new URL(file,new URL('../',import.meta.url)),new URL(file,out));
await cp(new URL('../assets/',import.meta.url),new URL('assets/',out),{recursive:true});
console.log(`Built static site: ${root}dist`);
