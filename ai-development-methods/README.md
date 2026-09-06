# AI Development Methods — 2026-09-06

Cinque note operative per decidere come evolvere ADS senza reinventare ciò che l'ecosistema sta già risolvendo.

## Leggile in questo ordine

1. **[GSD Core](GSD.md)** — il metodo: discuss → plan → execute → verify → ship, fresh-context execution e stato durevole.
2. **[OpenAI Symphony](SYMPHONY.md)** — il cambio di scala: issue tracker come control plane, workspace isolati, retry/reconciliation, *manage work not sessions*.
3. **[Reverse engineering del metodo pubblico di Francesco Giannicola](FRANCESCO-GIANNICOLA-METHOD.md)** — cosa emerge realmente da DVNS e dal suo ecosistema di progetti.
4. **[Developer AI Workflow Profile v1 — Francesco Giannicola](DEVELOPER-AI-WORKFLOW-PROFILE-FRANCESCO-GIANNICOLA.md)** — ricostruzione della workstation/toolchain reale con livelli di confidenza, fonti, diagramma, tool matrix e uno schema standard riutilizzabile per confrontare altri sviluppatori.
5. **[Replication Playbook](FRANCESCO-REPLICATION-PLAYBOOK.md)** — la risposta pratica a “come lo replico senza costruirmelo in ADS?”: evidenza sul bootstrap agent-generated, confronto degli strumenti già pronti e pilot Stealth a una sola variabile.

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

La ricerca più recente rende la scelta più concreta: **prima di sviluppare altro ADS generico, testare un repository harness già pronto**.

Il candidato operativo principale è `hoangnb24/repository-harness`; la guida Adobe sui Repository Harnesses è la reference con cui giudicarne la qualità; HAR entra solo se il pilot dimostra un problema specifico di isolamento/runtime evidence.

La direzione è quindi:

```text
REPO STANDARD GIÀ ESISTENTE
repository-harness

+

AGENTE
Codex / Claude

+

STEALTH-SPECIFIC
runtime config
business/project knowledge
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

Il quarto documento distingue ciò che è **confermato** da ciò che è soltanto **inferito** e ricostruisce quali strumenti emergono realmente dalle tracce pubbliche. Il quinto chiude il buco operativo: identifica strumenti pubblici che implementano già molti degli stessi principi e propone un test A/B reale invece di costruire altro framework custom.

---

## Prossimo esperimento consigliato

### Step 1 — nessun altro sviluppo ADS generico

Congelare temporaneamente state machine/orchestrator custom.

### Step 2 — pilot Assitec con una sola variabile nuova

Installare **solo** `repository-harness` su una branch pilot di Assitec ed eseguire l'onboarding brownfield.

Non aggiungere contemporaneamente GSD, Trailhead, HAR, OpenSpec o altri layer.

### Step 3 — feature reale invariata

```text
"Aggiungi un flag IS_DDL persistente ai dipendenti
 e nella scheda azienda mostra l'elenco dei DDL."
```

Misurare soprattutto:

> quanto deve intervenire Mauro prima di ottenere una PR con outcome realmente verificato?

### Step 4 — aggiungere un tool solo sul gap osservato

```text
repo/context debole      → Adobe harness-setup come alternativa/audit
runtime/evidence debole  → HAR
issue orchestration      → Trailhead
execute/verify discipline→ GSD
molti task paralleli     → Symphony-style orchestration
```

---

## Decision rule

Ogni nuovo strumento deve rispondere a questa domanda:

> **toglie più coordinamento umano di quanto aggiunga configurazione, stato e manutenzione?**

Se duplica GitHub, Codex, le skill o i verifier senza ridurre interventi reali, non entra nello stack.