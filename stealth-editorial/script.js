(()=>{
'use strict';

document.body.classList.add('wireframe-v2');
const wf=document.createElement('link');
wf.rel='stylesheet';
wf.href='wireframe.css?v=wireframe-2';
document.head.appendChild(wf);

const replace=(selector,html)=>{const el=document.querySelector(selector);if(el)el.innerHTML=html;};

replace('.hero-objects',`
  <div class="wf-window wf-hero-mail">
    <div class="wf-bar"><i class="wf-dot"></i><i class="wf-dot"></i><i class="wf-dot"></i><strong>POSTA IN ARRIVO</strong></div>
    <div class="wf-body">
      <div class="wf-mail-row"><div class="wf-avatar">MR</div><div><b>Marta · Cliente</b><div class="wf-text">Richiesta preventivo — urgente</div></div><small>09:42</small></div>
      <div class="wf-rule"></div>
      <span class="wf-chip">PDF · planimetria.pdf</span>
    </div>
  </div>
  <div class="wf-window wf-hero-word">
    <div class="wf-bar"><i class="wf-dot"></i><i class="wf-dot"></i><i class="wf-dot"></i><strong>DOCUMENTO</strong></div>
    <div class="wf-body">
      <div class="wf-word-head"><span class="wf-app">W</span><div><b>preventivo_finale_rev05.docx</b><small>modificato 8 minuti fa</small></div></div>
      <div class="wf-line dark mid"></div><div class="wf-line"></div><div class="wf-line short"></div>
      <div class="wf-total"><span>TOTALE</span><b>€ 5.600</b></div>
    </div>
  </div>
  <div class="wf-hero-note"><small>DA FARE</small><b>Richiamare Rossi dopo la firma</b><div class="wf-pencil"></div></div>
`);

replace('.versions',`
  <div class="wf-version v1">
    <div class="wf-bar"><i class="wf-dot"></i><i class="wf-dot"></i><i class="wf-dot"></i><strong>PREVENTIVO_ROSSI_REV03.DOCX</strong></div>
    <div class="wf-body"><div><div class="wf-label">CLIENTE</div><div class="wf-title">Rossi Srl</div><div class="wf-rule"></div><div class="wf-line dark mid"></div><div class="wf-line"></div><div class="wf-line short"></div></div><div class="wf-side"><div class="wf-label">REV</div><div class="wf-status">03</div><div class="wf-label" style="margin-top:18px">TOTALE</div><div class="wf-amount">€ 5.200</div></div></div>
  </div>
  <div class="wf-version v2">
    <div class="wf-bar"><i class="wf-dot"></i><i class="wf-dot"></i><i class="wf-dot"></i><strong>PREVENTIVO_ROSSI_REV05.DOCX</strong></div>
    <div class="wf-body"><div><div class="wf-label">CLIENTE</div><div class="wf-title">Rossi Srl</div><div class="wf-rule"></div><div class="wf-line dark"></div><div class="wf-line mid"></div><div class="wf-line short"></div></div><div class="wf-side"><div class="wf-label">REV</div><div class="wf-status">05</div><div class="wf-label" style="margin-top:18px">TOTALE</div><div class="wf-amount">€ 5.600</div></div></div>
  </div>
  <div class="wf-version v3">
    <div class="wf-bar"><i class="wf-dot"></i><i class="wf-dot"></i><i class="wf-dot"></i><strong>PREVENTIVO_ROSSI_FINALE.DOCX</strong></div>
    <div class="wf-body"><div><div class="wf-label">CLIENTE</div><div class="wf-title">Rossi Srl</div><div class="wf-rule"></div><div class="wf-line dark mid"></div><div class="wf-line"></div><div class="wf-line mid"></div></div><div class="wf-side"><div class="wf-label">STATO</div><div class="wf-status">FINALE?</div><div class="wf-label" style="margin-top:18px">TOTALE</div><div class="wf-amount">€ 5.600</div></div></div>
  </div>
  <div class="wf-version-stamp">7 VERSIONI</div>
`);

replace('.field',`
  <div class="wf-doc wf-report">
    <div class="wf-report-head"><div><small>RAPPORTO INTERVENTO</small><br><b>#RI-240918</b></div><span class="wf-chip">CARTA</span></div>
    <div class="wf-body">
      <div class="wf-form-row"><span>CLIENTE</span><div class="wf-field-line"></div></div>
      <div class="wf-form-row"><span>IMPIANTO</span><div class="wf-field-line"></div></div>
      <div class="wf-form-row"><span>TECNICO</span><div class="wf-field-line"></div></div>
      <div class="wf-checks"><div class="wf-check"><i class="wf-box">✓</i> verifica eseguita</div><div class="wf-check"><i class="wf-box">✓</i> materiale usato</div><div class="wf-check"><i class="wf-box"></i> da fatturare</div></div>
      <div class="wf-sign"><small>FIRMA CLIENTE</small><div class="wf-sign-line"></div></div>
    </div>
  </div>
  <div class="wf-phone">
    <div class="wf-phone-notch"></div>
    <div class="wf-phone-head"><div class="wf-avatar">MT</div><div><b>Marco · tecnico</b><small>online</small></div></div>
    <div class="wf-bubble">Ti mando la foto del rapportino così facciamo prima.</div>
    <div class="wf-photo"></div>
  </div>
  <div class="wf-lost-note">rimasto in macchina</div>
`);

replace('.duplicate',`
  <div class="wf-sheet">
    <div class="wf-bar"><i class="wf-dot"></i><i class="wf-dot"></i><i class="wf-dot"></i><strong>CLIENTI_2026.XLSX</strong></div>
    <div class="wf-sheet-grid">
      <div class="wf-cell head">Cliente</div><div class="wf-cell head">Ordine</div><div class="wf-cell head">Scad.</div>
      <div class="wf-cell active">Rossi Srl</div><div class="wf-cell active">#4582</div><div class="wf-cell active">12/09</div>
      <div class="wf-cell">Delta</div><div class="wf-cell">#4583</div><div class="wf-cell">18/09</div>
      <div class="wf-cell">Bianchi</div><div class="wf-cell">#4584</div><div class="wf-cell">20/09</div>
    </div>
  </div>
  <div class="wf-transfer"><span class="wf-transfer-copy">COPIA</span><i class="wf-transfer-line"></i><span>INCOLLA</span></div>
  <div class="wf-gest">
    <div class="wf-bar"><i class="wf-dot"></i><i class="wf-dot"></i><i class="wf-dot"></i><strong>GESTIONALE · PRATICA</strong></div>
    <div class="wf-gest-body">
      <div class="wf-gest-row"><span>Cliente</span><b>Rossi Srl</b></div>
      <div class="wf-gest-row"><span>Ordine</span><b>#4582</b></div>
      <div class="wf-gest-row"><span>Scadenza</span><b>12/09</b></div>
      <div class="wf-gest-row"><span>Stato</span><i class="wf-empty"></i></div>
      <div class="wf-gest-row"><span>Note</span><i class="wf-empty"></i></div>
    </div>
  </div>
`);

replace('.ai-flow',`
  <div class="wf-ai-inputs">
    <div class="wf-mini"><div class="wf-label">MAIL</div><div class="wf-line dark"></div><div class="wf-line mid"></div><div class="wf-line short"></div></div>
    <div class="wf-mini pdf"><div class="wf-label">ALLEGATO</div><div class="wf-line dark mid"></div><div class="wf-line"></div><div class="wf-line short"></div></div>
    <div class="wf-mini photo"><div class="wf-label">FOTO</div></div>
    <div class="wf-mini chat"><div class="wf-label">MESSAGGIO</div><div class="wf-mini-bubble">“Mi fai il preventivo anche con l’opzione B?”</div></div>
  </div>
  <div class="wf-ai-engine"><small>STEALTH</small><b>AI</b><span>legge · estrae · propone</span></div>
  <div class="wf-ai-output">
    <div class="wf-bar"><strong>DATI ESTRATTI</strong></div>
    <div class="wf-ai-output-body">
      <div class="wf-kv"><span>Cliente</span><b>Rossi Srl</b></div>
      <div class="wf-kv"><span>Richiesta</span><b>Preventivo opzione B</b></div>
      <div class="wf-kv"><span>Scadenza</span><b>12/09</b></div>
      <div class="wf-kv"><span>Allegati</span><b>2 documenti</b></div>
      <div class="wf-ai-action">AZIONE PROPOSTA → prepara il preventivo e mettilo in approvazione</div>
    </div>
  </div>
`);

const reveal=[...document.querySelectorAll('.reveal')];
if(!('IntersectionObserver'in window)){reveal.forEach(el=>el.classList.add('is-visible'));return;}
const io=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('is-visible');io.unobserve(entry.target);}})},{threshold:.14,rootMargin:'0px 0px -8% 0px'});
reveal.forEach(el=>io.observe(el));
})();
