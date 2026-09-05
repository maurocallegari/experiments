import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {createRequire} from 'node:module';
const require = createRequire(import.meta.url);
const modules = process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES;
const sharp = require(modules ? `${modules}/sharp` : 'sharp');
const JSZip = require(modules ? `${modules}/jszip` : 'jszip');
const base = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const plugin = path.join(base, 'plugin/stealth-home-v4');
await fs.mkdir(path.join(base, 'preview'), {recursive:true});
await fs.mkdir(path.join(base, 'dist'), {recursive:true});
for (const name of ['request','quote','sheet','report']) {
  await sharp(path.join(plugin, `assets/${name}.svg`)).png().toFile(path.join(plugin, `assets/${name}.png`));
}
const fields = JSON.parse(await fs.readFile(path.join(plugin,'content.json'),'utf8'));
let html = await fs.readFile(path.join(plugin,'story.html'),'utf8');
const escape = value => value.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
html = html.replace(/\{\{([^}]+)\}\}/g, (_,key) => key.startsWith('asset:') ? `../plugin/stealth-home-v4/assets/${key.slice(6)}.svg` : escape(fields[key].default));
await fs.writeFile(path.join(base,'preview/index.html'), `<!doctype html><html lang="it"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Stealth — Homepage 2.0</title><link rel="stylesheet" href="../plugin/stealth-home-v4/assets/story.css"><style>body{margin:0;font-family:Arial,sans-serif}#header{height:72px;position:sticky;top:0;background:white;z-index:50;display:flex;justify-content:space-between;align-items:center;padding:0 5vw;font-size:13px;color:#53676b;border-bottom:1px solid #e3ecee}#header a{color:inherit;text-decoration:none}footer{padding:32px 5vw;color:#53676b;font-size:12px}#header strong{font-size:20px;color:#171717;font-weight:500}</style></head><body><header id="header"><strong>Stealth</strong><span>Anteprima — header simulato</span><a href="#sth-contact">Contatti</a></header>${html}<footer>Anteprima di sviluppo. Header e footer Enfold sono presenti solo su WordPress.</footer><script src="../plugin/stealth-home-v4/assets/story.js"></script></body></html>`);
const zip = new JSZip();
async function add(dir,rel='') {for(const entry of await fs.readdir(dir,{withFileTypes:true})){const name=path.posix.join(rel,entry.name);if(entry.isDirectory())await add(path.join(dir,entry.name),name);else zip.file(`stealth-home-v4/${name}`,await fs.readFile(path.join(dir,entry.name)));}}
await add(plugin);
await fs.writeFile(path.join(base,'dist/stealth-home-v4-2.0.0.zip'),await zip.generateAsync({type:'nodebuffer',compression:'DEFLATE'}));
console.log('Built preview, four PNG components and installable ZIP.');
