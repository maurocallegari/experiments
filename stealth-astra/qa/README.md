# Verifica homepage Astra

## Esecuzione

Da `stealth-astra/`, con Node.js e Playwright installati:

```sh
node qa/check.cjs
```

Lo script serve solo questo checkout su `127.0.0.1:4173`, avvia Chromium e salva screenshot e risultati in `qa/captures/`. Se necessario, indicare il percorso del browser con `ASTRA_CHROMIUM`; `ASTRA_QA_OUTPUT` cambia la destinazione delle catture.

Copertura: 375×812, 390×844, 430×932, 768×1024, 1024×768, 1440×900, 1920×1080. Controlla overflow di pagina ed elementi, intersezioni fra composizioni e copy, risorse HTTP, errori JS, destinazioni delle ancore, font caricati, posizione fixed/sticky. Salva viste complete e dettagli delle sezioni. Verifica inoltre pagina senza JavaScript e con movimento ridotto.

Le catture vanno ispezionate visivamente: un risultato geometrico positivo non dimostra da solo qualità della composizione. I controlli automatici usano Chromium. Non certificano Safari su iPhone fisico, barre dinamiche iOS o VoiceOver.

## Risultato del 12 settembre 2026

Chromium 149.0.7827.0, sette risoluzioni: nessun overflow, nessuna intersezione tra visual e copy, nessun errore JS o risorsa mancante. Ancore raggiungibili; nessun elemento sticky/fixed. Pagina leggibile con JavaScript disabilitato. Nessuna animazione attiva con preferenza di movimento ridotto. Ispezionate viste complete e sezioni desktop/mobile, con una correzione a spaziatura e leggibilità prima della verifica finale.

## Pubblicazione

La pagina è standalone: servire `index.html`, `style.css`, `script.js` e `assets/` mantenendo i percorsi relativi. Nessuna build e nessuna dipendenza esterna in esecuzione.

Il workflow Pages preesistente non include `stealth-astra/` nel filtro né nella copia dell'artefatto. Questo intervento resta interamente dentro `stealth-astra/`; non modifica il workflow e non pubblica le altre varianti. Il salvataggio del codice nel repository non equivale alla pubblicazione della pagina su Pages.

## Revisione indipendente

Esito: **ship**, sulle evidenze Chromium e sul sorgente ispezionati. Tutte le sezioni narrative e i quattro attriti rispettano il brief. Hero centrata, grafica circoscritta, dashboard ricomposta su mobile, AI con controllo umano. Nessun difetto materiale trovato nelle schermate esaminate. Le dimensioni ridotte di alcune etichette appartengono a composizioni illustrative, accompagnate da spiegazioni leggibili e descrizioni accessibili. Nessun test su Safari fisico, VoiceOver o invio email effettuato.
