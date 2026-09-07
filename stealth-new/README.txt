STEALTH — scroll experience (allineata a stealthsoftware.it)
============================================================

One-page scrollytelling per Stealth S.r.l.
HTML + CSS + JS vanilla. Font Manrope self-hosted, smooth-scroll Lenis venduto:
nessuna CDN, funziona offline.

FILE
----
  index.html            struttura e contenuti (hero + 7 sezioni + footer dati reali)
  style.css             design system: bianco/#f8f8f8, ink #1A1F2C, teal #a0cdd2 (stealthsoftware.it)
  script.js             motore scroll: Lenis, pin scrub, parallasse, reveal, contatori
  fonts/                manrope-latin(.ext).woff2 (variable 200-800, self-hosted)
  vendor/lenis.min.js   smooth scroll (MIT, venduto)

SEZIONI (scene bloccate: animazioni interne + dissolvenza, mai due sezioni a metà)
-------
  0 hero         copy centrata + collage che si sparpaglia con lo scroll
  1 problema     display centrato, benefit in ingresso lenta
  2 ai           caos (mail, whatsapp, telefono, scadenze…) → core AI →
                 la pratica preparata si sposta al centro e riempie la scena
  3 casi         pannelli sempre centrati: transizione rapida + dwelling,
                 finestre pesate (l'ultima slide dura di più), nessuna card
  4 metodo       linea che cresce, step 01→03 in sequenza
  5 risultato    dashboard con spot: 3 momenti (dato/attività/AI) con didascalie
  6 supporto     "E lo facciamo evolvere con te" + OGGI → DOMANI
  7 cta          dissolvenza al nero (velo), contenuti in ingresso, dwell lungo
  footer         Stealth S.r.l.: indirizzo, P.IVA, link reali a stealthsoftware.it

NOTE
----
  - Dati e link reali: info@stealthsoftware.it, tel 800 86 45 09, P.IVA 04978390260.
  - Parametri di debug: ?nopreload salta il preloader, &y=NNNN scorre a un offset (per screenshot).
  - < 900px: pin e scrub disattivati, sezioni impilate.
  - prefers-reduced-motion: animazioni disattivate, contenuto sempre visibile.
  - senza JS: tutto il contenuto resta visibile (html.no-js).

DEPLOY
------
  Carica index.html, style.css, script.js, fonts/, vendor/ nella cartella del repo
  GitHub Pages e pusha. Niente build.

Colori e font in :root di style.css (--bg, --ink-deep, --teal, --sans).
