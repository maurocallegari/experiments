/* Main site choreography. */
(()=>{
'use strict';
const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
const clamp=(n,a=0,b=1)=>Math.max(a,Math.min(b,n));
const range=(p,a,b)=>clamp((p-a)/(b-a));
const ease=t=>{t=clamp(t);return t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2};
const mix=(a,b,t)=>a+(b-a)*t;
const lerp=mix;
const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
const mobile=()=>innerWidth<=900;
const prog=el=>{const r=el.getBoundingClientRect();return clamp(-r.top/Math.max(1,el.offsetHeight-innerHeight))};

const loaderBar=$('.loader i em'),loaderPct=$('.loader small');
let lp=0;const loading=setInterval(()=>{lp=Math.min(92,lp+7);if(loaderBar)loaderBar.style.width=lp+'%';if(loaderPct)loaderPct.textContent=lp+'%'},70);
addEventListener('load',()=>{clearInterval(loading);if(loaderBar)loaderBar.style.width='100%';if(loaderPct)loaderPct.textContent='100%';setTimeout(()=>document.documentElement.classList.add('ready'),150)},{once:true});
setTimeout(()=>document.documentElement.classList.add('ready'),1400);

if(!reduced&&!mobile()&&window.Lenis){try{const l=new Lenis({duration:1.28,easing:t=>1-Math.pow(1-t,4),smoothWheel:true,wheelMultiplier:.9});const raf=t=>{l.raf(t);requestAnimationFrame(raf)};requestAnimationFrame(raf)}catch(e){}}

const head=$('.head'),bar=$('.progress i');
const hero=$('.hero'),copyA=$('.copy-a'),copyB=$('.copy-b'),desk=$('.desk'),scrollCue=$('.hero-index');
if(copyA){const heroSub=$('p',copyA);if(heroSub)heroSub.remove()}
if(desk&&!desk.querySelector('.hero-extra'))desk.insertAdjacentHTML('beforeend',`
  <article class="work hero-extra extra-chat" data-work="9" aria-hidden="true"><small>CHAT</small><b>Foto ricevuta</b><span>Marco · 16:28</span></article>
  <article class="work hero-extra extra-folder" data-work="10" aria-hidden="true"><small>DOCUMENTI</small><b>Pratica Rossi</b><span>4 allegati · 1 da verificare</span></article>
  <article class="work hero-extra extra-calendar" data-work="11" aria-hidden="true"><small>AGENDA</small><b>Intervento in sede</b><span>Domani · 10:00</span></article>
  <article class="work hero-extra extra-task" data-work="12" aria-hidden="true"><small>ATTIVITÀ</small><b>Inviare conferma</b><span>assegnata a te</span></article>
  <article class="work hero-extra extra-inbox" data-work="13" aria-hidden="true"><small>INBOX</small><b>3 richieste nuove</b><span>da smistare</span></article>
  <article class="work hero-extra extra-note" data-work="14" aria-hidden="true"><small>NOTA VOCALE</small><b>Richiamare cliente</b><span>02:10 · ieri</span></article>
  <article class="work hero-extra extra-receipt" data-work="15" aria-hidden="true"><small>ALLEGATO</small><b>foto_finale.jpg</b><span>versione da confermare</span></article>
  <article class="work hero-extra hero-chaos hero-chaos-email hce-1" data-work="16" aria-hidden="true"><span class="hce-icon"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3.5 6.5h17v11h-17z"/><path d="m4 7 8.1 6L20 7"/></svg></span><b>marta@cliente.it</b><small>Re: Re: preventivo</small><time>09:42</time></article>
  <article class="work hero-extra hero-chaos hero-chaos-email hce-2" data-work="17" aria-hidden="true"><span class="hce-icon"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3.5 6.5h17v11h-17z"/><path d="m4 7 8.1 6L20 7"/></svg></span><b>info@rossi.it</b><small>Qual è l'ultima versione?</small><time>11:06</time></article>
  <article class="work hero-extra hero-chaos hero-chaos-pdf hcp-1" data-work="18" aria-hidden="true"><span class="hce-pdf">PDF</span><b>scheda_tecnica.pdf</b><small>12 pagine</small></article>
  <article class="work hero-extra hero-chaos hero-chaos-voice hcv-1" data-work="19" aria-hidden="true"><span class="hce-wa">WA</span><b>Nota vocale</b><small>Marco · tecnico</small><span class="hce-wave"><i></i><i></i><i></i><i></i><i></i><em>02:10</em></span></article>
  <article class="work hero-extra hero-chaos hero-chaos-call hcc-1" data-work="20" aria-hidden="true"><span class="hce-call"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7.2 4.5 10 7.7 8.4 9.3c1 2.1 2.5 3.6 4.6 4.6l1.6-1.6 3.2 2.8c.6.5.7 1.3.2 1.9l-1.1 1.4c-.5.6-1.3.8-2 .5-5.1-1.9-8.9-5.7-10.8-10.8-.3-.7-.1-1.5.5-2l1.4-1.1c.6-.5 1.4-.4 1.9.2Z"/></svg></span><b>Marco · tecnico</b><small>chiamata persa · 03:42</small></article>
  <article class="work hero-extra hero-chaos hero-chaos-postit hcpst-1" data-work="21" aria-hidden="true">ricontrollare il prezzo</article>
  <article class="work hero-extra hero-chaos hero-chaos-postit hcpst-2" data-work="22" aria-hidden="true">manca un allegato</article>
  <article class="work hero-extra hero-chaos hero-chaos-postit hcpst-3" data-work="23" aria-hidden="true">richiamare dopo la firma</article>
  <article class="work hero-extra hero-chaos hero-chaos-postit hcpst-4" data-work="24" aria-hidden="true">da riportare in ufficio</article>
  <article class="work hero-extra hero-chaos hero-chaos-chat hccht-1" data-work="25" aria-hidden="true"><b>“Questo è il definitivo?”</b><span>✓✓</span></article>`);
const works=$$('[data-work]');
const heroChaos=$$('.hero-chaos');
function setHeroText(selector,value,root=document){const el=$(selector,root);if(el&&typeof value==='string')el.textContent=value;return el}
function applyHeroContent(data){
 const c=data&&data.hero;if(!c)return;
 const primary=c.primary||{},secondary=c.secondary||{},cards=c.cards||{};
 const h1=$('h1',copyA),em=h1&&$('em',h1);if(h1&&em){h1.firstChild.nodeValue=`${primary.title||''} `;em.textContent=primary.emphasis||''}
 const secondaryHeading=$('h2',copyB),secondaryEmphasis=secondary.emphasis||'';
 if(secondaryHeading&&typeof secondary.title==='string'&&secondaryEmphasis&&secondary.title.includes(secondaryEmphasis)){
   secondaryHeading.textContent='';
   secondaryHeading.append(document.createTextNode(secondary.title.slice(0,secondary.title.indexOf(secondaryEmphasis))));
   const emphasis=document.createElement('em');emphasis.textContent=secondaryEmphasis;secondaryHeading.append(emphasis);
 }else setHeroText('h2',secondary.title,copyB);
 setHeroText('p',secondary.body,copyB);
 const card=(name)=>name&&desk&&$(`.${name}`,desk);
 const mail=card('mail'),mailData=cards.mail||{};setHeroText('.mailbar span',mailData.app,mail);setHeroText('small',mailData.meta,mail);setHeroText('b',mailData.title,mail);setHeroText('p',mailData.body,mail);const attachment=$('.attachment',mail);if(attachment&&typeof mailData.attachment==='string'&&attachment.lastChild)attachment.lastChild.nodeValue=`${mailData.attachment}`;
 const word=card('word'),wordData=cards.word||{};setHeroText('small',wordData.app,word);setHeroText('b',wordData.title,word);setHeroText('.filename',wordData.file,word);setHeroText('strong',wordData.total,word);
 const excel=card('excel'),excelData=cards.excel||{};$$('.cells b',excel).forEach((el,i)=>{if(typeof excelData.columns?.[i]==='string')el.textContent=excelData.columns[i]});setHeroText('.sheethead b',excelData.file,excel);
 const paper=card('paper'),paperData=cards.paper||{};setHeroText('small',paperData.title,paper);setHeroText('p',paperData.body,paper);setHeroText('.lost',paperData.status,paper);
 const phone=card('phone'),phoneData=cards.phone||{};setHeroText('small',phoneData.time,phone);setHeroText('.avatar',phoneData.avatar,phone);setHeroText('b',phoneData.title,phone);setHeroText('p',phoneData.body,phone);
 const sticky=card('sticky'),stickyData=cards.sticky||{};setHeroText('small',stickyData.label,sticky);setHeroText('b',stickyData.title,sticky);
 const duplicate=card('duplicate'),duplicateData=cards.duplicate||{};setHeroText('small',duplicateData.label,duplicate);setHeroText('b',duplicateData.title,duplicate);setHeroText('span',duplicateData.meta,duplicate);
 const alert=card('alert'),alertData=cards.alert||{};setHeroText('b',alertData.title,alert);setHeroText('small',alertData.meta,alert);
 const call=card('call'),callData=cards.call||{};setHeroText('strong',callData.time,call);setHeroText('span',callData.title,call);
 Object.entries(c.extras||{}).forEach(([name,value])=>{const extra=card(`extra-${name}`);if(!extra||!value)return;setHeroText('small',value.label,extra);setHeroText('b',value.title,extra);setHeroText('span',value.meta,extra)});
 const chaos=c.chaos||{},emailData=Array.isArray(chaos.emails)?chaos.emails:[];
 emailData.forEach((item,i)=>{const el=card(`hce-${i+1}`);if(!el||!item)return;setHeroText('b',item.from,el);setHeroText('small',item.subject,el);setHeroText('time',item.time,el)});
 const pdfData=Array.isArray(chaos.pdfs)?chaos.pdfs:[];pdfData.forEach((item,i)=>{const el=card(`hcp-${i+1}`);if(!el||!item)return;setHeroText('b',item.file,el);setHeroText('small',item.meta,el)});
 const voice=chaos.voice||{};const voiceEl=card('hcv-1');if(voiceEl){setHeroText('b',voice.title,voiceEl);setHeroText('small',voice.from,voiceEl);setHeroText('.hce-wave em',voice.time,voiceEl)}
 const phoneCall=chaos.call||{};const phoneCallEl=card('hcc-1');if(phoneCallEl){setHeroText('b',phoneCall.name,phoneCallEl);setHeroText('small',phoneCall.meta,phoneCallEl)}
 (Array.isArray(chaos.postits)?chaos.postits:[]).forEach((value,i)=>{const el=card(`hcpst-${i+1}`);if(el&&typeof value==='string')el.textContent=value});
 const chat=chaos.chat||{},chatEl=card('hccht-1');if(chatEl){setHeroText('b',chat.text,chatEl);setHeroText('span',chat.status,chatEl)}
 Object.entries(c.sections||{}).forEach(([id,value])=>{const section=document.getElementById(id);if(!section||!value)return;const root=id==='cases'?$('.cases-head',section):section;if(id==='cases'){const heading=$('h2',root),markup=value.titleHtml||value.title;if(heading&&typeof markup==='string'&&markup.includes('<em>'))heading.innerHTML=markup;else setHeroText('h2',value.title,root)}else{const display=$('.display',root);if(display&&typeof value.html==='string')display.innerHTML=value.html;else setHeroText('.display',value.title,root)}const body=$('p',root);if(body&&typeof value.bodyHtml==='string')body.innerHTML=value.bodyHtml;else setHeroText('p',value.body,root);if(id==='cases'&&Array.isArray(value.items)){value.items.forEach((item,i)=>{const copy=caseEls[i]&&$('.case-copy',caseEls[i]);if(!copy||!item)return;setHeroText('h3',item.title,copy);setHeroText('p',item.body,copy)})}});
}
fetch(`hero-content.json?v=20260908-1615`,{cache:'no-store'}).then(r=>r.ok?r.json():Promise.reject(r.status)).then(applyHeroContent).catch(()=>{});
const cases=$('.cases'),casesHead=$('.cases-head'),track=$('#caseTrack'),caseEls=$$('[data-case]'),caseFill=$('#caseFill');
const casesTitle=casesHead&&$('h2',casesHead);if(casesTitle&&!casesTitle.querySelector('em')){const title=casesTitle.textContent.trim(),mark='tempo';const at=title.indexOf(mark);if(at>=0){casesTitle.textContent='';casesTitle.append(document.createTextNode(title.slice(0,at)));const em=document.createElement('em');em.textContent=title.slice(at);casesTitle.append(em)}}
if(caseEls[0]){const art=$('.case-art',caseEls[0]);if(art&&!art.querySelector('.rg-prev-d'))art.insertAdjacentHTML('beforeend',`<div class="ref-card rg-prev-d"><div class="ref-title"><b>Preventivo Rossi</b><em>rev_01</em></div><div class="ref-kv"><span>Totale</span><b>€ 4.980</b></div><div class="ref-kv"><span>Stato</span><b>in bozza</b></div></div><div class="ref-card rg-prev-e"><div class="ref-title"><b>Preventivo Rossi</b><em>rev_02</em></div><div class="ref-kv"><span>Totale</span><b>€ 5.200</b></div><div class="ref-kv"><span>Stato</span><b>inviato</b></div></div><div class="ref-card rg-prev-f"><div class="ref-title"><b>Preventivo Rossi</b><em>rev_04</em></div><div class="ref-kv"><span>Totale</span><b>€ 5.450</b></div><div class="ref-kv"><span>Stato</span><b>da ricontrollare</b></div></div><div class="ref-card rg-prev-g"><div class="ref-title"><b>Preventivo Rossi</b><em>rev_06</em></div><div class="ref-kv"><span>Totale</span><b>€ 5.600</b></div><div class="ref-kv"><span>Stato</span><b>firmato?</b></div></div>`)}
if(caseEls[3]){const art=$('.case-art',caseEls[3]);if(art&&!art.querySelector('.rg-mail-2'))art.insertAdjacentHTML('beforeend',`<div class="ref-card rg-mail-2"><div class="ref-title"><b>marta@cliente.it</b><em>10:18</em></div><p>Re: Re: aggiungo anche la foto.</p></div><div class="ref-card rg-mail-3"><div class="ref-title"><b>info@rossi.it</b><em>11:06</em></div><p>Qual è l'ultima versione? Ho perso il filo.</p></div><div class="ref-card rg-mail-4"><div class="ref-title"><b>marta@cliente.it</b><em>23:14</em></div><p>Scusi l'ora, inoltro tutto qui.</p></div><div class="ref-card rg-call rg-call-1"><span class="call-badge">CALL</span><b>Marco · tecnico</b><small>03:42 · richiamare</small></div><div class="ref-card rg-call rg-call-2"><span class="call-badge">CALL</span><b>Ufficio Rossi</b><small>08:17 · “quale PDF?”</small></div><div class="ref-card rg-call rg-call-3"><span class="call-badge">CALL</span><b>Numero sconosciuto</b><small>12:04 · nota non salvata</small></div>`)}
/* Rebuilt paper scene: the lost-sheet problem needs a whole trail of
   physical and digital hand-offs, not one report and one phone. */
if(caseEls[1]){const art=$('.case-art',caseEls[1]);if(art&&!art.querySelector('.c2-sheet-a'))art.insertAdjacentHTML('beforeend',`
  <div class="case-piece c2-sheet c2-sheet-a"><div class="c2-sheet-head"><b>RAPPORTO INTERVENTO</b><span>16:28</span></div><div class="c2-sheet-lines"><i></i><i></i><i></i></div><div class="c2-sheet-row"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="8"/><path d="m8 12 2.5 2.5L16 9"/></svg><span>verifica eseguita</span></div><div class="c2-sign-line"></div><small>firma sul posto</small></div>
  <div class="case-piece c2-sheet c2-sheet-b"><div class="c2-sheet-head"><b>RAPPORTO INTERVENTO</b><span>FOTO</span></div><div class="c2-sheet-lines"><i></i><i></i><i></i></div><div class="c2-sheet-row"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="8"/><path d="m8 12 2.5 2.5L16 9"/></svg><span>materiale utilizzato</span></div><div class="c2-sign-line"></div><small>da firmare</small></div>
  <div class="case-piece c2-sheet c2-sheet-c"><div class="c2-sheet-head"><b>RAPPORTO INTERVENTO</b><span>UFF.</span></div><div class="c2-sheet-lines"><i></i><i></i><i></i></div><div class="c2-sheet-total"><span>stato</span><b>da riportare</b></div></div>
  <div class="case-piece c2-photo"><div class="c2-photo-thumb"><svg viewBox="0 0 120 76" aria-hidden="true"><rect width="120" height="76" rx="7"/><circle cx="31" cy="24" r="9"/><path d="M9 64 43 35l20 18 16-14 31 25"/></svg></div><b>foto_rapportino.jpg</b><small>inviata su WhatsApp · 16:31</small></div>
  <div class="case-piece c2-voice"><span class="c2-wa">WA</span><div><b>Nota vocale</b><small>Marco · tecnico</small><div class="c2-wave"><i></i><i></i><i></i><i></i><i></i><em>00:38</em></div></div></div>
  <div class="case-piece c2-call"><span class="c2-call-icon"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7.2 4.5 10 7.7 8.4 9.3c1 2.1 2.5 3.6 4.6 4.6l1.6-1.6 3.2 2.8c.6.5.7 1.3.2 1.9l-1.1 1.4c-.5.6-1.3.8-2 .5-5.1-1.9-8.9-5.7-10.8-10.8-.3-.7-.1-1.5.5-2l1.4-1.1c.6-.5 1.4-.4 1.9.2Z"/></svg></span><div><b>Marco · tecnico</b><small>“Dov'è il rapportino?”</small></div><time>18:04</time></div>
  <div class="case-piece c2-location"><span class="c2-pin"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21s6-5.4 6-11a6 6 0 1 0-12 0c0 5.6 6 11 6 11Z"/><circle cx="12" cy="10" r="2"/></svg></span><div><b>AUTO · 18:12</b><small>il foglio è rimasto qui</small></div></div>
  <div class="case-piece c2-postit c2-postit-a">firmare prima di partire</div><div class="case-piece c2-postit c2-postit-b">portare in ufficio</div><div class="case-piece c2-postit c2-postit-c">ricordarsi di fatturare</div>`)}
/* The copy/paste case also gets a visible trail: the same value travels from
   an email into a spreadsheet and then into the management system. */
if(caseEls[2]){const art=$('.case-art',caseEls[2]);if(art&&!art.querySelector('.c3-mail-piece'))art.insertAdjacentHTML('beforeend',`
  <div class="case-piece c3-mail-piece"><span class="c3-mail-icon"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3.5 6.5h17v11h-17z"/><path d="m4 7 8.1 6L20 7"/></svg></span><div><b>marta@cliente.it</b><small>ordine #4582 · 09:42</small></div></div>
  <div class="case-piece c3-mail-piece c3-mail-piece-2"><span class="c3-mail-icon"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3.5 6.5h17v11h-17z"/><path d="m4 7 8.1 6L20 7"/></svg></span><div><b>info@rossi.it</b><small>inoltro dati · 11:06</small></div></div>
  <div class="case-piece c3-copy-piece"><span class="c3-copy-icon"><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="7" y="7" width="11" height="13" rx="1.5"/><path d="M16 7V4H5.5A1.5 1.5 0 0 0 4 5.5V17h3"/><path d="M10 11h5M10 15h5"/></svg></span><div><b>Copia manuale</b><small>stesso dato, nuovo errore</small></div></div>
  <div class="case-piece c3-route-piece"><span class="c3-route-icon">→</span><div><b>Excel → gestionale</b><small>4 campi da ricopiare</small></div></div>
  <div class="case-piece c3-postit-piece">ricopiare nel gestionale</div>
  <div class="case-piece c3-postit-piece c3-postit-piece-2">controllare di nuovo</div>
  <div class="case-piece c3-alert-piece"><span>!</span><div><b>dato non aggiornato</b><small>chi lo corregge?</small></div></div>`)}
/* The second slide intentionally inherits a few document shapes from the
   hero, then adds channel-specific evidence so the chaos reads immediately:
   separate mail threads, PDFs, WhatsApp voice notes, calls and post-its. */
if(caseEls[0]){
  const art=$('.case-art',caseEls[0]);
  if(art&&!art.querySelector('.rg-chaos-email-1'))art.insertAdjacentHTML('beforeend',`
    <div class="chaos-piece chaos-email rg-chaos-email-1"><span class="chaos-icon email-icon"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3.5 6.5h17v11h-17z"/><path d="m4 7 8.1 6L20 7"/></svg></span><div><b>marta@cliente.it</b><small>Re: preventivo — aggiungo foto</small></div><time>09:42</time></div>
    <div class="chaos-piece chaos-email rg-chaos-email-2"><span class="chaos-icon email-icon"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3.5 6.5h17v11h-17z"/><path d="m4 7 8.1 6L20 7"/></svg></span><div><b>info@rossi.it</b><small>Qual è l'ultima versione?</small></div><time>11:06</time></div>
    <div class="chaos-piece chaos-email rg-chaos-email-3"><span class="chaos-icon email-icon"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3.5 6.5h17v11h-17z"/><path d="m4 7 8.1 6L20 7"/></svg></span><div><b>marta@cliente.it</b><small>Inoltro tutto qui.</small></div><time>23:14</time></div>
    <div class="chaos-piece chaos-pdf rg-chaos-pdf-1"><span class="pdf-mark">PDF</span><div><b>scheda_tecnica.pdf</b><small>12 pagine · allegato</small></div></div>
    <div class="chaos-piece chaos-pdf rg-chaos-pdf-2"><span class="pdf-mark">PDF</span><div><b>foto_firmata.pdf</b><small>versione da verificare</small></div></div>
    <div class="chaos-piece chaos-voice rg-chaos-voice-1"><span class="wa-mark">WA</span><div><b>Nota vocale</b><small>Marco · tecnico</small><span class="voice-row"><i></i><i></i><i></i><i></i><i></i><i></i><em>02:10</em></span></div></div>
    <div class="chaos-piece chaos-voice rg-chaos-voice-2"><span class="wa-mark">WA</span><div><b>Nota vocale</b><small>“aspetta che ti spiego…”</small><span class="voice-row"><i></i><i></i><i></i><i></i><i></i><i></i><em>00:38</em></span></div></div>
    <div class="chaos-piece chaos-voice rg-chaos-voice-3"><span class="wa-mark">WA</span><div><b>Foto + audio</b><small>nessun oggetto</small><span class="voice-row"><i></i><i></i><i></i><i></i><i></i><i></i><em>01:24</em></span></div></div>
    <div class="chaos-piece chaos-call rg-chaos-call-1"><span class="call-icon"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7.2 4.5 10 7.7 8.4 9.3c1 2.1 2.5 3.6 4.6 4.6l1.6-1.6 3.2 2.8c.6.5.7 1.3.2 1.9l-1.1 1.4c-.5.6-1.3.8-2 .5-5.1-1.9-8.9-5.7-10.8-10.8-.3-.7-.1-1.5.5-2l1.4-1.1c.6-.5 1.4-.4 1.9.2Z"/></svg></span><div><b>Marco · tecnico</b><small>chiamata persa</small></div><time>03:42</time></div>
    <div class="chaos-piece chaos-call rg-chaos-call-2"><span class="call-icon"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7.2 4.5 10 7.7 8.4 9.3c1 2.1 2.5 3.6 4.6 4.6l1.6-1.6 3.2 2.8c.6.5.7 1.3.2 1.9l-1.1 1.4c-.5.6-1.3.8-2 .5-5.1-1.9-8.9-5.7-10.8-10.8-.3-.7-.1-1.5.5-2l1.4-1.1c.6-.5 1.4-.4 1.9.2Z"/></svg></span><div><b>Ufficio Rossi</b><small>“quale PDF?”</small></div><time>08:17</time></div>
    <div class="chaos-piece chaos-call rg-chaos-call-3"><span class="call-icon"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7.2 4.5 10 7.7 8.4 9.3c1 2.1 2.5 3.6 4.6 4.6l1.6-1.6 3.2 2.8c.6.5.7 1.3.2 1.9l-1.1 1.4c-.5.6-1.3.8-2 .5-5.1-1.9-8.9-5.7-10.8-10.8-.3-.7-.1-1.5.5-2l1.4-1.1c.6-.5 1.4-.4 1.9.2Z"/></svg></span><div><b>Numero sconosciuto</b><small>nota non salvata</small></div><time>12:04</time></div>
    <div class="chaos-piece chaos-postit rg-chaos-postit-1">ricontrollare il prezzo</div>
    <div class="chaos-piece chaos-postit rg-chaos-postit-2">richiamare dopo la firma</div>
    <div class="chaos-piece chaos-postit rg-chaos-postit-3">manca un allegato</div>
    <div class="chaos-piece chaos-postit rg-chaos-postit-4">da riportare in ufficio</div>
    <div class="chaos-piece chaos-chat rg-chaos-chat-1"><b>“Te l'avevo mandato ieri…”</b><span>✓✓</span></div>
    <div class="chaos-piece chaos-chat rg-chaos-chat-2"><b>“Questo è il definitivo?”</b><span>✓✓</span></div>`);
}
const chaosPieces=$$('.chaos-piece',caseEls[0]);
const ai=$('.ai-chapter'),aiNoise=$$('.ai-noise-card'),aiCore=$('.ai-orbit-core'),aiResult=$('.ai-result');
const pivot=$('.pivot'),sels=$$('.sel'),selCore=$('.sel-core');
const build=$('.build'),inputs=$$('.input'),product=$('.product'),output=$('.output');
const evolve=$('.evolve'),evApp=$('.ev-app'),newEls=$$('.ev-app .new'),need=$('.need');

const heroD=[{x:-12,y:38,r:-4,s:.74},{x:13,y:2,r:3,s:.72},{x:-12,y:0,r:-2,s:.74},{x:18,y:0,r:5,s:.70},{x:-9,y:0,r:-3,s:.68},{x:13,y:10,r:3,s:.74},{x:13,y:40,r:-2,s:.72},{x:-12,y:10,r:2,s:.70},{x:17,y:15,r:-4,s:.72},{x:17,y:28,r:-5,s:.76},{x:12,y:0,r:4,s:.74},{x:-18,y:45,r:5,s:.72},{x:-15,y:0,r:-3,s:.70},{x:-16,y:34,r:4,s:.76},{x:20,y:0,r:-5,s:.72},{x:-15,y:15,r:3,s:.74}];
const heroM=[{x:-5,y:1,r:-2,s:.86},{x:5,y:0,r:2,s:.84},{x:-4,y:1,r:-2,s:.86},{x:5,y:0,r:3,s:.84},{x:-4,y:1,r:-2,s:.82},{x:4,y:0,r:2,s:.86},{x:-3,y:1,r:-2,s:.84},{x:4,y:0,r:2,s:.83},{x:-3,y:1,r:-2,s:.84}];
const heroChaosD=[
  {x:-8,y:28,r:-7,s:.9},{x:0,y:-2,r:6,s:.88},{x:0,y:1,r:-3,s:.9},{x:0,y:0,r:-8,s:.9},
  {x:0,y:0,r:7,s:.9},{x:16,y:4,r:10,s:.9},{x:28,y:22,r:-5,s:.88},{x:-20,y:-3,r:4,s:.9},
  {x:20,y:0,r:4,s:.9},{x:18,y:17,r:-7,s:.9},{x:17,y:0,r:5,s:.9},{x:-20,y:28,r:6,s:.9},
  {x:-18,y:-3,r:-4,s:.9},{x:19,y:-4,r:-6,s:.9},{x:-16,y:-2,r:5,s:.9},{x:5,y:-4,r:-4,s:.9},
  {x:-14,y:16,r:-8,s:.92},{x:12,y:11,r:5,s:.9},{x:15,y:20,r:6,s:.9},{x:-14,y:7,r:-3,s:.9},
  {x:-28,y:8,r:4,s:.9},{x:15,y:12,r:-7,s:.9},{x:-12,y:16,r:5,s:.9},{x:8,y:2,r:4,s:.9},
  {x:-32,y:1,r:-5,s:.9},{x:0,y:0,r:-4,s:.9}
];
const heroChaosM=[{x:-5,y:5,r:-4,s:.9},{x:5,y:3,r:3,s:.88},{x:-2,y:-3,r:-2,s:.9},{x:7,y:4,r:4,s:.88},{x:-7,y:2,r:5,s:.86},{x:6,y:-2,r:4,s:.9},{x:4,y:6,r:-3,s:.9},{x:-4,y:3,r:4,s:.88},{x:7,y:9,r:3,s:.9}];
function heroMotion(){
 if(!hero)return;
 const p=prog(hero),m=mobile(),bOn=p>=.44;
 if(scrollCue){scrollCue.style.opacity=String(1-ease(range(p,.03,.2)));scrollCue.style.pointerEvents='none'}
 if(reduced){
   works.forEach(el=>{el.style.visibility=bOn?'visible':'hidden';el.style.opacity='1';el.style.transform='none';el.style.filter='none'});
   if(copyA){copyA.style.opacity='1';copyA.style.visibility=bOn?'hidden':'visible';copyA.style.transform='translateX(-50%)';copyA.style.filter='none'}
   if(copyB){copyB.style.opacity='1';copyB.style.visibility=bOn?'visible':'hidden';copyB.style.transform='translateX(-50%)';copyB.style.filter='none'}
   return;
 }
 const vectors=m?heroM:heroD,target=m?heroChaosM:heroChaosD,acc=ease(range(p,.04,.34)),gather=ease(range(p,.44,.72)),chaosY=!m&&bOn?10:0,appearY=!m&&bOn?34*(1-gather):0;
  works.forEach((el,i)=>{
   const v=vectors[i%vectors.length],z=target[i%target.length],entryStart=m?.22+(i%12)*.018:.45+(i%8)*.012,entry=ease(range(p,entryStart,Math.min(.78,entryStart+.2))),edge=m?(i%4===0?-26:i%4===1?26:i%4===2?-18:18):(i%4===0?-112:i%4===1?112:i%4===2?-84:84),edgeY=m?(i%4===0?-18:i%4===1?18:i%4===2?-10:10):(i%2?22:30);
   let x=edge*(1-entry)+(i%2?1:-1)*(m?5:11)*(1-entry)+lerp(v.x,z.x,gather)*gather+(i%2?1:-1)*acc*(m?1.5:3),y=edgeY*(1-entry)+(i%3-1)*(m?1:3)*(1-entry)+lerp(v.y,z.y,gather)*gather+appearY+chaosY*gather;
   const rot=lerp(v.r,z.r,gather)*gather,sc=lerp(1,lerp(v.s,z.s,gather),gather),visible=p>=entryStart;
   if(m&&visible&&desk){
    const area=desk.getBoundingClientRect(),pad=4;
    /* Rotated/zoomed cards can leave a small residual after one correction;
       settle twice so no visible card is clipped by the desk mask. */
    for(let pass=0;pass<3;pass++){
      el.style.transform=`translate3d(${x}vw,${y}vh,0) rotate(${rot}deg) scale(${sc})`;
      const box=el.getBoundingClientRect();
      let dx=0,dy=0;
      if(box.left<area.left+pad)dx+=area.left+pad-box.left;
      if(box.right>area.right-pad)dx-=box.right-(area.right-pad);
      if(box.top<area.top+pad)dy+=area.top+pad-box.top;
      if(box.bottom>area.bottom-pad)dy-=box.bottom-(area.bottom-pad);
      x+=dx/innerWidth*100;y+=dy/innerHeight*100;
      if(Math.abs(dx)<.25&&Math.abs(dy)<.25)break;
    }
   }
   el.style.transform=`translate3d(${x}vw,${y}vh,0) rotate(${rot}deg) scale(${sc})`;el.style.opacity='1';el.style.visibility=visible?'visible':'hidden';el.style.filter='none';
 });
 const bin=ease(range(p,.41,.62)),bout=ease(range(p,m?.965:.86,m?.999:.985));
 if(m){
   /* Mobile needs a real 01→02 handoff instead of a visibility toggle. The
      first message drifts away while the question fades in over the same
      scroll interval; neither copy is ever left in a clipped position. */
   const firstExit=ease(range(p,.22,.41)),first=1-firstExit,second=ease(range(p,.45,.64));
   if(copyA){copyA.style.opacity=first.toFixed(3);copyA.style.visibility=first>.002?'visible':'hidden';copyA.style.setProperty('transform',`translate(-50%,-50%) translateY(${(-firstExit*42).toFixed(1)}px) scale(${(1-firstExit*.12).toFixed(3)})`,'important');copyA.style.filter='none'}
   if(copyB){copyB.style.opacity=second.toFixed(3);copyB.style.visibility=second>.002?'visible':'hidden';copyB.style.setProperty('transform',`translate(-50%,0) translateY(${(72*(1-second)).toFixed(1)}px)`,'important');copyB.style.filter='none'}
 }else{
   if(copyA){copyA.style.opacity='1';copyA.style.visibility=bOn?'hidden':'visible';copyA.style.transform=`translateX(-50%) translateY(${bOn?-22:0}px)`;copyA.style.filter='none'}
   if(copyB){copyB.style.opacity='1';copyB.style.visibility=bOn?'visible':'hidden';copyB.style.transform=`translateX(-50%) translateY(${bOn?mix(18,0,bin)-12*bout:18}px)`;copyB.style.filter='none'}
 }
}

/* Cases crossfade at the handoff so the stage never drops to an empty frame. */
let casesPlayhead=0,casesReady=false,casesRaf=0,casesLast=0;
function casesMotion(now=performance.now()){
 if(!cases||!caseEls.length)return;
 const p=prog(cases),m=mobile(),n=caseEls.length,target=Math.min(n-.000001,p*n);
 if(!casesReady){casesPlayhead=target;casesReady=true}
 const dt=Math.min(80,Math.max(1,now-(casesLast||now)));casesLast=now;
 casesPlayhead+= (target-casesPlayhead)*(1-Math.exp(-dt/155));
 const scaled=clamp(casesPlayhead,0,n-.000001),idx=Math.min(n-1,Math.floor(scaled)),local=scaled-idx,finalOut=idx===n-1?ease(range(local,.86,.995)):0;
 if(track)track.style.setProperty('transform','none','important');
 if(casesHead){casesHead.style.opacity=String(1-finalOut);casesHead.style.transform=m?'none':`translateX(-50%) translateY(${(-finalOut*12).toFixed(1)}px)`}
 caseEls.forEach((el,i)=>{
   const art=$('.case-art',el),copy=$('.case-copy',el),isCurrent=i===idx,isNext=i===idx+1&&idx<n-1,blend=ease(range(local,.68,1)),vis=isCurrent?1-blend:isNext?blend:0,distance=Math.abs(scaled-i),offset=(i-scaled)*(m?8:6),lift=distance*(m?8:12);
   el.style.visibility=vis>.002?'visible':'hidden';el.style.opacity='1';el.style.zIndex=String(Math.round(vis*100));el.style.pointerEvents=vis>.7?'auto':'none';
   if(art){art.style.opacity=String(vis);art.style.transform=`translate3d(${offset.toFixed(2)}vw,${lift.toFixed(1)}px,0) scale(${mix(.97,1,vis)})`;art.style.filter=`blur(${((1-vis)*(m?2.2:3.2)).toFixed(2)}px)`;
    const pieces=[...art.children].filter(piece=>!piece.classList.contains('chaos-piece'));
    pieces.forEach((piece,k)=>{
      const stagger=idx===0?.025+(k%12)*.035:.06+(k%8)*.065;
      const reveal=idx===0&&isCurrent?ease(range(local,stagger,Math.min(.98,stagger+.28))):isNext?ease(range(blend,stagger,Math.min(.98,stagger+.34))):isCurrent?1:0;
      const side=(k%4)-1.5,fromX=side*(m?54:105)+(k%2?18:-18),fromY=((k%3)-1)*(m?42:72),spin=((k%5)-2)*(m?10:22);
      piece.style.opacity=String(reveal);piece.style.visibility=reveal>.01?'visible':'hidden';piece.style.translate=`${(fromX*(1-reveal)).toFixed(1)}px ${(fromY*(1-reveal)).toFixed(1)}px`;piece.style.rotate=`${(spin*(1-reveal)).toFixed(1)}deg`;piece.style.scale=(.72+.28*reveal).toFixed(3);
    });
   }
   if(copy){copy.style.opacity=String(vis);copy.style.transform=`translate3d(${(offset*.42).toFixed(2)}vw,${(lift*.65).toFixed(1)}px,0)`;copy.style.filter=`blur(${((1-vis)*(m?1.5:2.2)).toFixed(2)}px)`}
 });
 if(chaosPieces.length&&idx===0){
   chaosPieces.forEach((el,i)=>{
     const start=.025+(i%12)*.035,reveal=ease(range(local,start,Math.min(.98,start+.24))),side=(i%4)-1.5,fromX=side*(m?58:118)+(i%2?16:-16),fromY=((i%3)-1)*(m?44:76),spin=((i%5)-2)*(m?12:26);
     el.style.setProperty('opacity',String(reveal),'important');el.style.visibility=reveal>.01?'visible':'hidden';
     el.style.setProperty('translate',`${(fromX*(1-reveal)).toFixed(1)}px ${(fromY*(1-reveal)).toFixed(1)}px`,'important');el.style.setProperty('rotate',`${(spin*(1-reveal)).toFixed(1)}deg`,'important');el.style.setProperty('scale',(.72+.28*reveal).toFixed(3),'important');
   });
 }
 if(caseFill)caseFill.style.width=(p*100)+'%';
 if(Math.abs(target-casesPlayhead)>.0005&&!casesRaf)casesRaf=requestAnimationFrame(t=>{casesRaf=0;casesMotion(t)});
}

const aiVD=[[18,19],[-18,20],[17,-17],[-18,-15],[2,11],[-10,-18]],aiVM=[[11,11],[-11,12],[9,-10],[-10,-9],[1,6],[-6,-10]],aiR=[-6,5,5,-5,4,-7];
function aiMotion(){
 if(!ai)return;const p=prog(ai),m=mobile(),vec=m?aiVM:aiVD;
 if(reduced){aiNoise.forEach(el=>el.style.opacity='0');if(aiCore)aiCore.style.opacity='.2';if(aiResult)aiResult.style.opacity='1';return}
 const gather=ease(range(p,.08,.48)),coreIn=ease(range(p,.22,.50)),out=ease(range(p,.52,.82));
 aiNoise.forEach((el,i)=>{const v=vec[i%vec.length];el.style.opacity=String(1-gather*.96);el.style.filter=`blur(${gather*(m?1.8:3)}px)`;el.style.transform=`translate3d(${v[0]*gather}vw,${v[1]*gather}vh,0) rotate(${aiR[i%aiR.length]*(1-gather)}deg) scale(${mix(1,.62,gather)})`});
 if(aiCore){const co=ease(range(p,.67,.88));aiCore.style.opacity=String(coreIn*(1-co*.8));aiCore.style.transform=`translate(-50%,-50%) scale(${mix(.42,1,coreIn)})`;aiCore.style.boxShadow=`0 0 0 ${mix(0,m?10:15,coreIn*(1-out))}px rgba(160,205,210,.2),0 0 ${mix(0,m?42:80,coreIn*(1-out))}px rgba(160,205,210,.4)`}
 if(aiResult){aiResult.style.opacity=String(out);aiResult.style.transform=m?`translate(50%,-50%) translateY(${mix(24,0,out)}px) scale(${mix(.95,1,out)})`:`translateY(-50%) translateX(${mix(40,0,out)}px) scale(${mix(.95,1,out)})`}
}

function pivotMotion(){if(!pivot||reduced)return;const p=prog(pivot),t=ease(range(p,.12,.68)),core=ease(range(p,.43,.78)),m=mobile(),vec=m?[[-7,-5],[7,-5],[-7,5],[7,5],[0,-7],[3,7]]:[[-30,-24],[32,-24],[-34,25],[31,24],[1,-35],[8,34]];sels.forEach((el,i)=>{const[x,y]=vec[i];el.style.transform=`translate3d(${x*t}vw,${y*t}vh,0) scale(${mix(1,m?.82:.72,t)})`;el.style.opacity=String(1-t*.8)});if(selCore){const base=m?'translate(50%,-50%)':'translateY(-50%)';selCore.style.opacity=String(core);selCore.style.transform=`${base} scale(${mix(.82,1,core)})`}}

/* Reference choreography: EMAIL/FOTO/FIRMA are absorbed into STEALTH / PRATICHE, then PDF is generated. */
function buildMotion(){
 if(!build)return;const p=prog(build),m=mobile();if(reduced){inputs.forEach(el=>el.style.opacity='0');if(product)product.style.opacity='1';if(output)output.style.opacity='1';return}
 const ingest=ease(range(p,.06,.46)),settle=ease(range(p,.22,.62)),out=ease(range(p,.54,.98)),vec=m?[[20,14],[20,0],[17,-13]]:[[34,18],[32,-5],[27,-27]],rots=[-5,4,-2];
 inputs.forEach((el,i)=>{const[x,y]=vec[i];el.style.transform=`translate3d(${x*ingest}vw,${y*ingest}vh,0) rotate(${mix(rots[i],0,ingest)}deg) scale(${mix(1,m?.70:.64,ingest)})`;el.style.opacity=String(1-ingest*.98);el.style.filter=`blur(${ingest*(m?1.8:3)}px)`});
 if(product){product.style.opacity=String(mix(.82,1,settle));product.style.filter=`blur(${mix(m?1.5:2.5,0,settle)}px)`;product.style.transform=`translateY(-50%) translateX(${mix(m?18:28,0,settle)}px) scale(${mix(.94,1,settle)})`}
 if(output){output.style.opacity=String(out);output.style.filter=`blur(${mix(m?2:3.5,0,out)}px)`;output.style.transform=`translate3d(${mix(m?12:20,0,out)}px,${mix(m?24:34,0,out)}px,0) rotate(${mix(m?4:6,0,out)}deg) scale(${mix(.94,1,out)})`}
}

/* Evolution reference: existing app first; the new requirement becomes part of the same UI. */
function evolveMotion(){
 if(!evolve)return;const m=mobile(),r=evolve.getBoundingClientRect(),p=clamp((innerHeight*.88-r.top)/Math.max(1,innerHeight+r.height*.55));
 if(reduced){if(evApp)evApp.style.opacity='1';newEls.forEach(el=>el.style.opacity='1');if(need)need.style.opacity='1';return}
 const app=ease(range(p,.04,.34)),needIn=ease(range(p,.46,.96));
 if(evApp){evApp.style.opacity=String(mix(.72,1,app));evApp.style.filter=`blur(${mix(m?2:4,0,app)}px)`;evApp.style.transform=`translateY(-50%) translateX(${mix(m?-14:-28,0,app)}px) scale(${mix(.96,1,app)})`}
 newEls.forEach((el,i)=>{const t=ease(range(p,.28+i*.035,.70+i*.045));el.style.opacity=String(t);el.style.transform=`translate3d(${mix(m?10:18,0,t)}px,${mix(10,0,t)}px,0)`});
 if(need){need.style.opacity=String(needIn);need.style.filter=`blur(${mix(m?2:4,0,needIn)}px)`;need.style.transform=`translate3d(${mix(m?20:34,0,needIn)}px,${mix(22,0,needIn)}px,0) rotate(${mix(4,0,needIn)}deg) scale(${mix(.95,1,needIn)})`}
}

function globalUI(){const max=Math.max(1,document.documentElement.scrollHeight-innerHeight),p=clamp(scrollY/max);if(bar)bar.style.width=(p*100)+'%';if(head)head.classList.toggle('scrolled',scrollY>22)}
let ticking=false;function update(){ticking=false;globalUI();heroMotion();casesMotion();aiMotion();pivotMotion();buildMotion();evolveMotion()}addEventListener('scroll',()=>{if(!ticking){ticking=true;requestAnimationFrame(update)}},{passive:true});addEventListener('resize',update,{passive:true});update();
})();

/* Ported reference scenes choreography. */
(()=>{
'use strict';
const doc=document;
const qs=(s,c)=>(c||doc).querySelector(s);
const qsa=(s,c)=>Array.from((c||doc).querySelectorAll(s));
const clamp=(v,a=0,b=1)=>Math.min(b,Math.max(a,v));
const lerp=(a,b,t)=>a+(b-a)*t;
const norm=(v,a,b)=>clamp((v-a)/(b-a));
const easeOut=t=>1-Math.pow(1-clamp(t),3);
const easeInOut=t=>{t=clamp(t);return t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2};
const win=(p,a,b)=>easeOut(norm(p,a,b));
const RM=matchMedia('(prefers-reduced-motion: reduce)').matches;
/* Keep the JS breakpoint identical to the CSS breakpoint. A 900px viewport
   must use the same pinned/mobile choreography instead of falling through to
   the desktop scene engine. */
const mqMob=matchMedia('(max-width:900px)');
let vh=innerHeight;

const scenes=qsa('.ref-scene').map(el=>({el,id:el.id,beats:parseFloat(el.getAttribute('data-beats')||'1'),view:qs('.scene-view',el),fade:el.getAttribute('data-fade')||'inout'}));
/* Keep each mobile pin long enough for its choreography, without a trailing
   viewport where the content has already left the stage. */
const mobileHeights={ai:7.2,metodo:4.4,risultato:5.4,supporto:3.8};
const desktopHeights={ai:7.2,metodo:5.2,risultato:5.4};

function measureScenes(){
  vh=innerHeight;
  scenes.forEach(s=>{
    if(RM){s.el.style.removeProperty('height');return}
    if(mqMob.matches){const mult=mobileHeights[s.id]||1.7;s.el.style.setProperty('height',(mult*vh)+'px','important')}
    else s.el.style.setProperty('height',((desktopHeights[s.id]||s.beats+1)*vh)+'px');
  });
  measureMx();
}
function sceneFade(s,p){
  if(!s.view)return;
  if(mqMob.matches){s.view.style.setProperty('opacity','1','important');s.view.style.setProperty('transform','none','important');s.view.style.setProperty('filter','none','important');return}
  if(s.fade==='none'){s.view.style.opacity='1';s.view.style.transform='';s.view.style.filter='none';return}
  const vin=s.fade==='out'?1:win(p,0,.2),outStart=s.id==='ai'?.985:s.id==='metodo'?.92:.8,vout=s.fade==='in'?0:win(p,outStart,.999),o=Math.min(Math.max(vin,.46),1-vout);
  s.view.style.opacity=o.toFixed(3);s.view.style.transform='none';s.view.style.filter=`blur(${((1-o)*.8).toFixed(2)}px)`;
}

/* AI: mobile starts fully visible and changes only by physical motion. */
const aiStage=qs('#ai .ai-stage'),aiCore=qs('#ai .ai-core'),aiOutBox=qs('#ai .ai-out');
const nzEls=qsa('#ai .nz');
const outCard=qs('#ai .doc.out'),out2Card=qs('#ai .doc.out2'),out3Card=qs('#ai .doc.out2.o3');
function updateAIMobile(p){
  if(!aiStage||!aiCore)return;
  const gather=easeInOut(norm(p,.04,.66)),out=easeInOut(norm(p,.50,.78)),coreX=aiStage.clientWidth*.5,coreY=aiStage.clientHeight*.54;
  nzEls.forEach(el=>{
    const cx=el.offsetLeft+el.offsetWidth/2,cy=el.offsetTop+el.offsetHeight/2,dx=coreX-cx,dy=coreY-cy,rot=parseFloat(el.style.getPropertyValue('--r')||0),sc=lerp(1,.13,gather);
    el.style.setProperty('opacity','1','important');
    el.style.setProperty('transform',`translate3d(${(dx*gather).toFixed(1)}px,${(dy*gather).toFixed(1)}px,0) rotate(${(rot*(1-gather)).toFixed(2)}deg) scale(${sc.toFixed(3)})`,'important');
  });
  const coreGrow=lerp(.78,1.08,easeInOut(norm(p,.05,.55))),coreLeave=lerp(1,.46,out);
  aiCore.style.setProperty('opacity','1','important');
  aiCore.style.setProperty('transform',`scale(${(coreGrow*coreLeave).toFixed(3)})`,'important');
  aiCore.classList.toggle('hot',p>.34&&p<.78);
  if(aiOutBox){const y=(1-out)*aiStage.clientHeight*1.08;aiOutBox.style.setProperty('opacity','1','important');aiOutBox.style.setProperty('transform',`translate3d(0,${y.toFixed(1)}px,0) scale(${lerp(.94,1,out).toFixed(3)})`,'important')}
  [outCard,out2Card,out3Card].forEach(el=>{if(el){el.style.setProperty('opacity','1','important');el.style.setProperty('transform','none','important')}});
}
function updateAIDesktop(p){
  nzEls.forEach((el,i)=>{const d=parseFloat(el.style.getPropertyValue('--d'))||i,w=win(p,.02+d*.035,.18+d*.035),tc=easeInOut(norm(p,.3,.54));let base='translate(0,0)';if(tc>0&&aiCore){const r=el.getBoundingClientRect(),c=aiCore.getBoundingClientRect(),dx=(c.left+c.width/2)-(r.left+r.width/2),dy=(c.top+c.height/2)-(r.top+r.height/2);base=`translate(${(dx*tc).toFixed(1)}px,${(dy*tc).toFixed(1)}px) rotate(${((1-tc)*parseFloat(el.style.getPropertyValue('--r')||0)).toFixed(1)}deg) scale(${(1-tc*.45).toFixed(3)})`;el.style.opacity=(w*(1-tc)).toFixed(3)}else el.style.opacity=w.toFixed(3);el.style.transform=base});
  const cp=win(p,.28,.48),oc=easeInOut(norm(p,.56,.80));if(aiOutBox){aiOutBox.style.opacity=oc.toFixed(3);aiOutBox.style.transform=oc>0?`scale(${lerp(.92,1,oc).toFixed(3)})`:''}if(aiCore){aiCore.style.transform=`scale(${lerp(.4,1,cp).toFixed(3)})`;aiCore.style.opacity=(cp*(1-oc)).toFixed(3);aiCore.classList.toggle('hot',p>.5&&oc<.35)}
  const o1=win(p,.50,.68);if(outCard){outCard.style.opacity=o1.toFixed(3);outCard.style.transform=`translateY(${((1-o1)*30).toFixed(1)}px) scale(${lerp(.96,1,o1).toFixed(3)})`}
  const o2=win(p,.60,.74);if(out2Card){out2Card.style.opacity=o2.toFixed(3);out2Card.style.transform=`translateY(${((1-o2)*26).toFixed(1)}px) scale(${lerp(.96,1,o2).toFixed(3)})`}
  const o3=win(p,.68,.80);if(out3Card){out3Card.style.opacity=o3.toFixed(3);out3Card.style.transform=`translateY(${((1-o3)*26).toFixed(1)}px) scale(${lerp(.96,1,o3).toFixed(3)})`}
}
function updateAI(p){mqMob.matches?updateAIMobile(p):updateAIDesktop(p)}
const approve=qs('#oApprove');if(approve)approve.addEventListener('click',()=>{const b=qs('#aiOut .out-badge');if(b)b.textContent='Inviata ✓';approve.textContent='Inviata ✓';approve.style.background='#2f7d55';approve.style.borderColor='#2f7d55'});

/* On mobile, restore the previous teal selection scene. It reuses the same
   work artifacts as the AI/chaos visually: preventivo, carta, telefono, mail. */
let mxBox=qs('#mx');
if(mqMob.matches&&mxBox){
  mxBox.classList.add('selection-stage-mobile');
  mxBox.innerHTML=`
    <div class="selection-object sel-doc duplicate" data-r="-8" data-vx="-62" data-vy="-36"><span>REV_03</span><b>Preventivo</b></div>
    <div class="selection-object sel-doc keep" data-r="3" data-fx="-36" data-fy="-22"><span>DATI</span><b>Preventivo</b></div>
    <div class="selection-object sel-paper duplicate" data-r="8" data-vx="58" data-vy="-30"><small>copia carta</small><i></i><i></i></div>
    <div class="selection-object sel-phone keep" data-r="4" data-fx="42" data-fy="34"><div class="phone-notch"></div><small>foto + firma</small></div>
    <div class="selection-object sel-mail keep" data-r="-3" data-fx="-28" data-fy="44"><small>richiesta cliente</small><b>ordine.pdf</b></div>
    <div class="selection-ring"></div>`;
}

const mxInners=qsa('#mx .mx-inner'),mIdx=qs('#mIdx'),mxTrack=qs('#mxTrack');
mxBox=qs('#mx');
const selectionObjects=qsa('#metodo .selection-object'),selectionKeeps=qsa('#metodo .selection-object.keep'),selectionDuplicates=qsa('#metodo .selection-object.duplicate'),selectionRing=qs('#metodo .selection-ring');
let mxCur=0,mxX=[],mxTrackX=0;
function measureMx(){if(mqMob.matches)return;if(!mxTrack||!mxBox||RM){mxX=[];return}const sw=mxBox.clientWidth;/* Allow negative offsets: the first card must be centered too. */mxX=mxInners.map(el=>el.offsetLeft+el.offsetWidth/2-sw/2);mxTrackX=mxX[mxCur]||0}
function updateMetodoMobile(p){
  if(!mxBox||!selectionObjects.length)return;
  const t=easeInOut(norm(p,.03,.94)),centerX=mxBox.clientWidth*.5,centerY=mxBox.clientHeight*.52;
  selectionDuplicates.forEach(el=>{const vx=parseFloat(el.dataset.vx||0),vy=parseFloat(el.dataset.vy||0),r=parseFloat(el.dataset.r||0);el.style.setProperty('opacity','1','important');el.style.setProperty('transform',`translate3d(${(vx*t).toFixed(1)}px,${(vy*t).toFixed(1)}px,0) rotate(${(r*(1-t*.55)).toFixed(2)}deg) scale(${lerp(1,.88,t).toFixed(3)})`,'important')});
  selectionKeeps.forEach(el=>{const fx=parseFloat(el.dataset.fx||0),fy=parseFloat(el.dataset.fy||0),r=parseFloat(el.dataset.r||0),cx=el.offsetLeft+el.offsetWidth/2,cy=el.offsetTop+el.offsetHeight/2,dx=centerX+fx-cx,dy=centerY+fy-cy;el.style.setProperty('opacity','1','important');el.style.setProperty('transform',`translate3d(${(dx*t).toFixed(1)}px,${(dy*t).toFixed(1)}px,0) rotate(${(r*(1-t)).toFixed(2)}deg) scale(${lerp(1,.93,t).toFixed(3)})`,'important')});
  if(selectionRing){selectionRing.style.setProperty('opacity','.42','important');selectionRing.style.setProperty('transform',`translate(-50%,-50%) scale(${lerp(.72,1.04,t).toFixed(3)})`,'important')}
}
function updateMetodoDesktop(p){
 const count=mxX.length||mxInners.length;
 if(!count)return;
 const position=clamp(p)*(count-1),base=Math.floor(position),next=Math.min(count-1,base+1),blend=easeInOut(position-base);
 const target=mix(mxX[base]||0,mxX[next]||0,blend);
 mxCur=Math.min(count-1,Math.round(position));
 if(mxTrack){mxTrackX=lerp(mxTrackX,target,.16);if(Math.abs(target-mxTrackX)<.5)mxTrackX=target;mxTrack.style.transform=`translate3d(${(-mxTrackX).toFixed(1)}px,0,0)`}
 mxInners.forEach((el,i)=>el.classList.toggle('is-c',i===mxCur));
 if(mIdx)mIdx.textContent=('0'+(mxCur+1)).slice(-2)
}
function updateMetodo(p){mqMob.matches?updateMetodoMobile(p):updateMetodoDesktop(p)}

const dash=qs('#dash'),rcaps=qsa('.rcap');
if(dash&&!dash.querySelector('.ai-assist-panel'))dash.querySelector('.dash-main')?.insertAdjacentHTML('beforeend',`<div class="ai-assist-panel" aria-hidden="true"><span class="ai-assist-icon"><svg class="ic" aria-hidden="true"><use href="#i-spark"/></svg></span><div class="ai-assist-copy"><small>AI ASSIST</small><b>Preventivo pronto da controllare</b><p>Ho riunito email, PDF e dati cliente nella pratica Rossi.</p></div><span class="ai-assist-status">1 controllo</span></div>`);
const aiAssist=qs('.ai-assist-panel');
let counted=false;
function mobileCaptionOpacity(p,i){
  const start=i/3,end=(i+1)/3,fade=.07;
  if(i===0&&p<=start)return 1;
  if(i===2&&p>=end)return 1;
  if(p<start||p>end)return 0;
  if(p<start+fade)return clamp((p-start)/fade);
  if(p>end-fade)return clamp((end-p)/fade);
  return 1;
}
function countUp(el){const T=+el.getAttribute('data-count'),t0=performance.now(),D=1100;(function f(t){const pp=clamp((t-t0)/D);el.textContent=Math.round(T*easeOut(pp));if(pp<1)requestAnimationFrame(f)})(t0)}
function updateRisultato(p){if(!dash)return;dash.classList.toggle('live',p>.03&&p<.98);const states=[[.02,.35],[.34,.67],[.66,.99]],cur=Math.min(2,Math.floor(clamp(p)*3));dash.classList.toggle('b0',cur===0);dash.classList.toggle('b1',cur===1);dash.classList.toggle('b2',cur===2);if(aiAssist)aiAssist.setAttribute('aria-hidden',cur===2?'false':'true');rcaps.forEach((c,i)=>{if(mqMob.matches){const v=mobileCaptionOpacity(p,i);c.style.setProperty('opacity',String(v),'important');c.style.transform=`translateY(${((1-v)*8).toFixed(1)}px)`}else if(cur===i){const w=easeOut(norm(p,states[i][0],states[i][0]+.05));c.style.opacity=w.toFixed(3);c.style.transform=`translateY(${((1-w)*10).toFixed(1)}px)`}else{c.style.opacity='0';c.style.transform='translateY(10px)'}});if(!counted&&p>.02){counted=true;qsa('[data-count]',dash).forEach(countUp)}}

const egWin=qs('.eg-win'),supPs=qsa('.sup-p');
function updateSupporto(p){if(egWin){if(mqMob.matches){egWin.style.setProperty('opacity','1','important');egWin.style.setProperty('transform',`translateY(${lerp(14,0,easeOut(norm(p,0,.18))).toFixed(1)}px)`,'important')}else{const ew=win(p,.06,.2);egWin.style.opacity=ew.toFixed(3);egWin.style.transform=`translateY(${((1-ew)*26).toFixed(1)}px)`}egWin.classList.toggle('on',p>.34)}supPs.forEach((s,i)=>{if(mqMob.matches){s.style.setProperty('opacity','1','important');s.style.setProperty('transform','none','important')}else{const w=win(p,.42+i*.08,Math.min(.995,.74+i*.12));s.style.opacity=w.toFixed(3);s.style.transform=`translateY(${((1-w)*20).toFixed(1)}px)`}})}

function updateScenes(){
 vh=innerHeight;
 const candidates=scenes.map((s,i)=>({s,i,r:s.el.getBoundingClientRect()})).filter(x=>x.r.bottom>0&&x.r.top<vh);
 let current=candidates.filter(x=>x.r.top<=0).sort((a,b)=>b.r.top-a.r.top)[0]||candidates.sort((a,b)=>a.r.top-b.r.top)[0];
 const casesPin=qs('.cases-pin');
 if(casesPin){
   const laterScene=current&&['ai','metodo','risultato','supporto'].includes(current.s.id);
   casesPin.style.setProperty('display',laterScene?'none':'block','important');
 }
 scenes.forEach((s,i)=>{
   const active=current&&current.i===i;
   if(!active){if(s.view){s.view.style.setProperty('display','none','important');s.view.style.setProperty('visibility','hidden','important');s.view.style.setProperty('opacity','0','important')}return}
   const r=current.r,p=clamp(-r.top/Math.max(1,r.height-vh));
   if(s.view){s.view.style.setProperty('display','flex','important');s.view.style.setProperty('visibility','visible','important');}
   sceneFade(s,p);
   /* Mobile scenes stay pinned in one viewport. Moving the entire view down
      made the final cards fall below the fold and get clipped by the pin. */
   if(mqMob.matches&&s.view)s.view.style.setProperty('transform','none','important');
   if(s.id==='ai')updateAI(p);else if(s.id==='metodo')updateMetodo(p);else if(s.id==='risultato')updateRisultato(p);else if(s.id==='supporto')updateSupporto(p)
 });
}
let ticking=false;function frame(){ticking=false;updateScenes()}addEventListener('scroll',()=>{if(!ticking){ticking=true;requestAnimationFrame(frame)}},{passive:true});let rt;addEventListener('resize',()=>{clearTimeout(rt);rt=setTimeout(()=>{measureScenes();frame()},180)},{passive:true});addEventListener('load',()=>{measureScenes();frame()},{once:true});setTimeout(()=>{measureScenes();frame()},300);measureScenes();frame();
})();
