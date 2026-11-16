import http from 'node:http';
import {readFile} from 'node:fs/promises';
import {resolve,extname,sep} from 'node:path';
const root = resolve('.');
const types={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.jpg':'image/jpeg','.png':'image/png','.svg':'image/svg+xml'};
http.createServer(async(req,res)=>{
  try {
    const url = new URL(req.url,'http://localhost');
    let pathname = decodeURIComponent(url.pathname);
    if (pathname === '/janakamwm') {res.writeHead(302,{Location:'/janakamwm/'});res.end();return;}
    if (pathname.startsWith('/janakamwm/')) pathname=pathname.slice('/janakamwm'.length);
    const file = resolve(root, '.' + (pathname.endsWith('/') ? pathname+'index.html':pathname));
    if (!file.startsWith(root+sep)) {res.writeHead(403);res.end();return;}
    const body=await readFile(file);
    res.writeHead(200,{'Content-Type':types[extname(file)]||'application/octet-stream','Cache-Control':'no-store'});res.end(body);
  } catch {res.writeHead(404);res.end('Not found');}
}).listen(4173,'127.0.0.1',()=>console.log('Portfolio preview: http://127.0.0.1:4173/janakamwm/'));
