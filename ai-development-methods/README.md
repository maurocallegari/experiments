# AI Development Methods — 2026-09-06

Quattro note operative per decidere come evolvere ADS senza reinventare ciò che l'ecosistema sta già risolvendo.

## Leggile in questo ordine

1. **[GSD Core](GSD.md)** — il metodo: discuss → plan → execute → verify → ship, fresh-context execution e stato durevole.
2. **[OpenAI Symphony](SYMPHONY.md)** — il cambio di scala: issue tracker come control plane, workspace isolati, retry/reconciliation, *manage work not sessions*.
3. **[Reverse engineering del metodo pubblico di Francesco Giannicola](FRANCESCO-GIANNICOLA-METHOD.md)** — cosa emerge realmente da DVNS e dal suo ecosistema di progetti.
4. **[Developer AI Workflow Profile v1 — Francesco Giannicola](DEVELOPER-AI-WORKFLOW-PROFILE-FRANCESCO-GIANNICOLA.md)** — ricostruzione della workstation/toolchain reale con livelli di confidenza, fonti, diagramma, tool matrix e uno schema standard riutilizzabile per confrontare altri sviluppatori.

---

## La sintesi in un diagramma

```mermaid
flowchart TD
    U[Mauro: "fammi X"] --> I[GitHub Issue / intent]
    I --> H[Agent harness · Codex]
    H --> R[Repo agent-ready]
    R --> K[Domain knowledge + skill mirate]
    K --> X[Implementazione]
    X --> V[Verifier reali]
    V --> PR[PR + evidence]
    PR --> CI[CI / review]
    CI -->|fail| X
    CI -->|pass| D[Merge / deploy gate]

    GSD[GSD: metodo per eseguire bene un lavoro] -. insegna .-> H
    SYM[Symphony: orchestrare molti lavori] -. scala .-> I
```

## Conclusione attuale

Non vedo più valore nel costruire ADS come un grande framework di orchestrazione AI.

La direzione più promettente è:

```text
ECOSISTEMA MATURO
Codex / skill / GitHub / eventuale workflow engine

+

STEALTH-SPECIFIC
local bootstrap
project/domain knowledge
project verifier
safe deploy / rollback / smoke
```

### GSD

Da **studiare anche se non lo adottiamo**. È quello che insegna di più su context engineering, separazione delle fasi, fresh-context subagents e verifica.

### Symphony

Da **capire come architettura**, non da installare. Dice dove andare quando il problema diventerà orchestrare decine di lavori anziché una singola sessione.

### Il pattern DVNS / Francesco

È il segnale più concreto: non serve necessariamente un framework enorme. Il vantaggio sembra derivare da:

```text
repository come memoria
+ agenti intercambiabili
+ skill di dominio
+ contratti fail-closed
+ runtime evidence
+ PR trasparenti
+ CI come autorità
```

Il quarto documento rende questa analisi più rigorosa: distingue ciò che è **confermato** da ciò che è soltanto **inferito** e soprattutto ricostruisce quali strumenti emergono realmente dalle tracce pubbliche. Il formato `Developer AI Workflow Profile v1` è pensato per essere riutilizzato identico sui prossimi sviluppatori che analizzeremo.

---

## Cosa farei dopo questa lettura

### Step 1 — nessun altro sviluppo ADS generico

Congelare temporaneamente l'espansione della state machine/orchestrator ADS.

### Step 2 — pilot su Assitec

Preparare Assitec come repo realmente agent-ready:

- `AGENTS.md` minimo;
- `PROJECT.md` utile;
- skill Stealth davvero necessarie;
- `dev/verify-local.sh` serio;
- almeno un verifier che dimostri un comportamento reale, non soltanto syntax/HTTP 200;
- issue → PR → CI/evidence.

### Step 3 — una feature reale

Usare `IS_DDL` come test:

```text
"Aggiungi un flag IS_DDL persistente ai dipendenti
 e nella scheda azienda mostra l'elenco dei DDL."
```

Il test non è “Codex scrive il codice?”. È:

> quanto devo intervenire io prima di avere una PR con outcome realmente verificato?

### Step 4 — solo dopo scegliere il workflow engine

Confrontare su quella stessa richiesta:

- Codex repo-native;
- GSD;
- Trailhead, se continua a maturare.

Non installare più sovrastrutture contemporaneamente: **uno possiede il workflow, gli altri al massimo forniscono skill/verifier specifici**.

---

## Decision rule

Ogni nuovo strumento deve rispondere a questa domanda:

> **toglie più coordinamento umano di quanto aggiunga configurazione, stato e manutenzione?**

Se duplica GitHub, Codex, le skill o i verifier senza ridurre interventi reali, non entra nello stack.
