import fs from 'node:fs/promises';
import path from 'node:path';
import http from 'node:http';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url);
const {chromium}=require(process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES+'/playwright');
const chromiumPackage=await import(path.resolve('qa-runtime/node_modules/@sparticuz/chromium/build/index.js'));
const binary=chromiumPackage.default;
const base=path.resolve('experiments/stealth-homepage');
const output=path.join(base,'qa');await fs.mkdir(output,{recursive:true});
const server=http.createServer(async(req,res)=>{try{const rel=decodeURIComponent(new URL(req.url,'http://localhost').pathname);const file=path.resolve(base,'.'+rel);if(!file.startsWith(base+path.sep))throw Error('path');const data=await fs.readFile(file);const ext=path.extname(file);res.setHeader('Content-Type',({'.html':'text/html','.css':'text/css','.js':'text/javascript','.svg':'image/svg+xml','.png':'image/png'})[ext]||'application/octet-stream');res.end(data);}catch{res.writeHead(404).end();}});
await new Promise(r=>server.listen(8127,'127.0.0.1',r));
const browser=await chromium.launch({executablePath:path.resolve('qa-runtime/chromium'),args:['--no-sandbox','--disable-dev-shm-usage','--disable-gpu','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader'],headless:true});
const results=[];
try{
 for(const spec of [{name:'desktop',width:1440,height:900},{name:'mobile',width:390,height:844},{name:'small',width:320,height:568},{name:'tablet',width:768,height:1024},{name:'reduced',width:390,height:844,reducedMotion:'reduce'},{name:'nojs',width:390,height:844,javaScriptEnabled:false}]){
  const context=await browser.newContext({viewport:{width:spec.width,height:spec.height},reducedMotion:spec.reducedMotion||'no-preference',javaScriptEnabled:spec.javaScriptEnabled!==false});
  const page=await context.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto('http://127.0.0.1:8127/preview/index.html',{waitUntil:'networkidle'});
  const motion=await page.locator('.sth-story').evaluate(e=>e.classList.contains('sth-motion'));
  const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1);
  const missing=await page.locator('.sth-story img').evaluateAll(async xs=>{await Promise.all(xs.map(async x=>{x.loading='eager';try{await x.decode();}catch{}}));return xs.filter(x=>!x.complete||x.naturalWidth===0).length;});
  await page.screenshot({path:path.join(output,`${spec.name}-opening.png`)});
  if(spec.name==='desktop'||spec.name==='mobile'){
   for(const [index,name] of ['quotes','paper','data'].entries()){
    if(motion){await page.locator('.sth-chapters a').nth(index+1).click();await page.waitForTimeout(1000);}
    else await page.locator('.sth-panel').nth(index+1).scrollIntoViewIfNeeded();
    await page.screenshot({path:path.join(output,`${spec.name}-${name}.png`)});
   }
   for(const name of ['ai','team','build','contact']){
    await page.locator(`#sth-${name}`).evaluate(e=>window.scrollTo(0,scrollY+e.getBoundingClientRect().top-72));await page.waitForTimeout(100);
    await page.screenshot({path:path.join(output,`${spec.name}-${name}.png`)});
   }
  }
  const target=await page.locator('.sth-contact-link').getAttribute('href');
  results.push({name:spec.name,motion,overflow,missing,errors,target});await context.close();
 }
 await fs.writeFile(path.join(output,'results.json'),JSON.stringify(results,null,2));console.log(JSON.stringify(results,null,2));
}finally{await browser.close();server.close();}
