# Replicare il metodo emerso da Francesco — senza ricostruire ADS

**Data:** 2026-09-06  
**Domanda:** come si costruiscono repository che gli agenti riescono a capire, modificare e verificare bene, e quali pezzi esistono già invece di riscriverli in ADS?

## Risposta corta

La ricerca aggiuntiva cambia la raccomandazione operativa.

Non serve partire da un nuovo workflow engine Stealth. Esistono già strumenti che coprono il pezzo più importante che sembrava “fatto a mano”:

1. **`repository-harness`** — oggi è il candidato più vicino al bootstrap di una repo agent-ready: installa un piccolo protocollo repository-owned, `AGENTS.md`, workflow/documentazione strutturata, piani durevoli solo quando servono, decisioni, onboarding brownfield e validazione meccanica. Supporta esplicitamente Codex, Claude Code e Cursor.  
   Fonte: https://github.com/hoangnb24/repository-harness
2. **Adobe `harness-setup`** — una skill pubblica che crea o migra lo stesso tipo di repository harness usando standard aperti (`AGENTS.md`, `INVARIANTS.md`, `.agents/skills/`, docs, Makefile, validation). È una reference molto forte; **non va installata insieme a `repository-harness` come secondo sistema**, ma usata come checklist/reference oppure come alternativa.  
   Fonte: https://github.com/adobe/ai-repo-harness-guide
3. **HAR (`@osfactory/har`)** — copre il pezzo successivo: worktree isolati per agente, porte/database separati, verify deterministico, artifacts/evidence, tree hash validato, commit gate e Mission Control. È da aggiungere solo se il problema reale diventa ambiente concorrente/evidence, non come prerequisito universale.  
   Fonte: https://github.com/os-factory/har

Quindi la sequenza raccomandata non è “replichiamo tutto in ADS”, ma:

```text
REPOSITORY-HARNESS
        ↓
   repo agent-ready
        ↓
      CODEX
        ↓
verifier già del progetto
        ↓
     GitHub PR / CI
```

Poi **solo se un test reale dimostra un gap**:

```text
manca isolamento/evidence runtime → HAR
manca issue/work orchestration      → Trailhead o Symphony-style layer
manca disciplina execute/verify     → GSD come metodo
```

---

# 1. La prova che il bootstrap non viene necessariamente scritto a mano

Nel repository personale `metaforismo/Cumea`, uno dei primi commit è letteralmente:

```text
Scaffold: Vite + React + TS + Tailwind v4 base for OpenGrokBot
Co-Authored-By: Claude Fable 5
```

Commit:  
https://github.com/metaforismo/Cumea/commit/43a40803c21e799c47a22736fb5bb3a9931f7bb0

Il commit crea l'app base, package manifest, TypeScript/Vite e struttura iniziale.

Questo non dimostra che Francesco usi un prodotto di bootstrap segreto. Dimostra però qualcosa di più utile:

> **anche il bootstrap della repo viene delegato all'agente.**

È coerente con le altre tracce pubbliche:

- feature intere in Atlas Loop arrivano da branch `metaforismo/codex/...`;
- lavori complessi DVNS espongono vere sessioni Claude Code;
- test, CI, documentazione e tooling vengono evoluti nello stesso ciclo del prodotto.

Un esempio Atlas Loop è la PR/merge `codex/network-capture`:  
https://github.com/metaforismo/atlas-loop/commit/b860ab004686030461882767b385010ebb466df5

Quindi non bisogna immaginare:

```text
Francesco prepara a mano 50 file perfetti
→ poi lascia entrare l'AI
```

Il pattern più credibile è:

```text
repo iniziale minimale
→ agente crea scaffold
→ agente implementa
→ failure/review evidenzia un limite
→ quel limite diventa test / script / contratto / skill / doc
→ la repo diventa progressivamente più leggibile agli agenti
```

Questa è esattamente la dinamica descritta anche da OpenAI nel proprio esperimento di Harness Engineering: partire da una repo vuota, far generare a Codex scaffold, CI e `AGENTS.md`, poi fare compounding sui feedback loop.  
Fonte primaria: https://openai.com/index/harness-engineering/

---

# 2. Cosa è realmente “il metodo” da replicare

Il risultato visibile nelle repo di Francesco può essere ridotto a sei proprietà.

## 2.1 La repository è la memoria

Non una chat centrale e non un database proprietario del workflow.

La verità durevole vive in:

```text
code
+ docs
+ issue
+ test
+ script
+ Git history
+ PR
+ CI
```

## 2.2 Le istruzioni diventano progressive

L'agente deve trovare una mappa piccola, non ricevere tutto il progetto nel prompt.

```text
entrypoint piccolo
→ documento pertinente
→ codice pertinente
→ test pertinente
```

## 2.3 Le procedure ricorrenti diventano tooling

Se una cosa è solo semantica/decisionale: doc o skill.

Se può essere provata deterministicamente: script/test/contract.

Esempio osservato nel suo `app-icon-design-skill`:

```text
skill procedurale
+
gate di approvazione umano
+
script Python QA
+
validazione Xcode/runtime
```

Fonte: https://github.com/metaforismo/app-icon-design-skill

## 2.4 Gli agenti fanno PR-sized work

Le branch `codex/...` di Atlas Loop e Bite mostrano lavori autonomi sufficientemente grandi da diventare PR indipendenti, non autocomplete di poche righe.

## 2.5 “Done” non viene deciso dall'agente

Il claim viene ricondotto a evidence:

```text
test
browser/runtime
hash/schema
logs
screenshot
CI
```

Le PR DVNS sono particolarmente chiare perché elencano anche **cosa NON è stato eseguito**.

## 2.6 Il sistema migliora dopo gli errori

La regola implicita è:

```text
se l'agente sbaglia una volta
→ correggi il task

se una classe di errore torna
→ cambia la repo/harness
```

Questa seconda riga è il compounding.

---

# 3. Lo strumento già pronto più vicino: `repository-harness`

Repository:

https://github.com/hoangnb24/repository-harness

## Perché è importante

La descrizione coincide quasi parola per parola con il problema che stavamo cercando di risolvere in ADS:

> turn a software repository into a legible, agent-ready workspace.

Il repository resta il system of record e non viene introdotto un workflow database nascosto.

### Struttura installata

```text
project/
├── AGENTS.md
├── docs/
│   ├── WORKFLOW.md
│   ├── HARNESS.md
│   ├── ARCHITECTURE.md
│   ├── product/
│   ├── plans/
│   │   ├── active/
│   │   └── completed/
│   ├── decisions/
│   └── templates/
├── .agents/
│   └── skills/
│       ├── onboard-repository/
│       └── audit-onboarding-proposal/
├── scripts/
└── tests/
```

### Workflow proporzionale

Non impone lo stesso processo a tutto:

```text
read-only
→ inspect → answer with evidence

bounded change
→ inspect → edit → relevant proof

multi-session / coordination-heavy
→ durable execution plan in Git

material ambiguity
→ stop before mutation
```

Questo è molto più vicino al comportamento desiderato di ADS V2 rispetto a un workflow obbligatorio gigantesco.

### Brownfield

Dopo l'installazione ha una skill esplicita:

```text
$onboard-repository
```

che fa un primo passaggio read-only e propone modifiche evidence-backed prima di applicarle.

Questa è precisamente la parte che in ADS abbiamo scritto a mano per ogni progetto.

### Multi-harness

Supporta esplicitamente:

```text
Codex
Claude Code
Cursor
altri coding agent
```

Quindi il contratto della repo non dipende dal provider.

## Valutazione per Stealth

| Aspetto | Valutazione |
|---|---|
| Bootstrap repo agent-ready | **molto forte** |
| Brownfield | **molto forte** |
| Knowledge/context | **molto forte** |
| Workflow proporzionale | **forte** |
| Codex | **supportato** |
| Claude | **supportato** |
| Project runtime | limitato: resta project-specific |
| Multi-agent runtime | non è il suo scopo principale |
| Issue orchestration | non è il suo scopo |
| Deploy | non è il suo scopo |

### Decisione

**È il primo candidato che testerei su Assitec prima di scrivere altro ADS.**

---

# 4. Adobe `harness-setup`: stessa famiglia, reference più istituzionale

Adobe ha pubblicato una guida completa ai **Repository Harnesses for AI Coding Agents** e due skill pubbliche:

```text
harness-setup
harness-inspect
```

Guide/repo:  
https://opensource.adobe.com/ai-repo-harness-guide/  
https://github.com/adobe/ai-repo-harness-guide

`harness-setup` rileva automaticamente se la repo:

- non ha harness;
- ha `.claude/` / `.cursor/` / Copilot rules;
- ha un `AGENTS.md` monolitico;
- ha solo parti del harness.

Poi crea o migra verso:

```text
AGENTS.md
INVARIANTS.md
CLAUDE.md shim (solo se serve)
.agents/skills/
docs/ARCHITECTURE.md
docs/SETUP.md
docs/TESTING.md
Makefile / safe commands
```

con un before/after probe e validation finale.

La guida insiste su una regola importante che combacia molto con Francesco:

> **le skill non sono obbligatorie. Si creano solo per task frequenti o abbastanza error-prone da beneficiarne realmente.**

## Perché non installerei Adobe + repository-harness assieme

Coprono in larga parte lo stesso layer:

```text
repo knowledge
entrypoint
invariants
docs
skills
validation surface
```

Aggiungerli entrambi significherebbe tornare al problema delle sovrastrutture duplicate.

### Uso consigliato

```text
repository-harness = implementazione operativa da testare
Adobe guide/skill   = reference e audit checklist
```

Se `repository-harness` non convince durante il pilot, Adobe `harness-setup` diventa la prima alternativa, non un secondo layer.

---

# 5. HAR: il pezzo che assomiglia di più all'evidence runtime

Repository/progetto:

https://github.com/os-factory/har  
https://harproject.dev/

HAR non risolve principalmente la documentazione della repo. Risolve l'altro problema:

```text
un agente deve poter eseguire il progetto
in un ambiente ripetibile
senza pestare i piedi agli altri
lasciando prove verificabili
```

## Cosa offre

```text
har onboard
har env launch 1
har env verify 1 --full
har env complete 1
```

Ogni slot ha:

- worktree proprio;
- branch proprio;
- porte proprie;
- database proprio se necessario;
- pipeline di verify coerente;
- artifact/evidence;
- tree hash legato alla verifica;
- commit gate opzionale;
- Mission Control locale;
- MCP per gli agenti.

## Somiglianza con il metodo osservato

Molto alta sul lato:

```text
runtime reale
→ prova
→ artifact
→ risultato legato all'esatto tree
```

È concettualmente vicino ad Atlas Loop, ma generalizzato al lifecycle del repository.

## Perché NON lo installerei subito

Per Assitec oggi il primo problema da dimostrare non è “5 agenti collidono sui worktree”.

È:

> **Codex, entrando nella repo, capisce correttamente cosa deve fare e sa come dimostrare che l'ha fatto?**

Se mettiamo subito HAR, Trailhead, GSD e repository-harness non sapremo quale pezzo ha realmente migliorato il risultato.

### Trigger per introdurre HAR

Solo se nel pilot vediamo uno di questi problemi:

- agenti concorrenti che condividono DB/porte;
- ambiente locale difficile da riprodurre;
- verifier ad-hoc che divergono;
- bisogno di evidence artifacts/tree hash;
- necessità reale di Mission Control multi-repo/multi-agent.

---

# 6. Cosa NON ho trovato attribuibile a Francesco

Dopo la ricerca pubblica non ho evidenza sufficiente che Francesco utilizzi personalmente come standard quotidiano:

```text
GSD
Trailhead
OpenSpec
Spec Kit
Superpowers
repository-harness
HAR
Adobe harness-setup
```

Questo è importante.

Non sto dicendo:

> Francesco usa repository-harness.

Sto dicendo:

> **repository-harness implementa oggi, come prodotto open-source, molti degli stessi principi che osserviamo nelle repo di Francesco.**

La distinzione evita di inventare il suo stack e ci dà comunque una strada replicabile.

---

# 7. La nuova conclusione sul suo “strumento segreto”

L'ipotesi più supportata oggi non è un unico framework privato.

È questa:

```text
Codex / Claude
      ↓
repo che migliora continuamente
      ↓
GitHub issues / branch / PR
      ↓
test + contratti + runtime tooling
      ↓
CI
```

E quando gli manca una superficie di verifica o controllo, **costruisce un tool specialistico**:

- Atlas Loop → evidence iOS/runtime;
- AgentKeys → controllo semantico dei coding agent;
- Cumea → workspace multi-provider/agent;
- skill app-icons → workflow visuale ripetibile con QA deterministico.

Quindi sì: una parte se l'è costruita.

Ma il **pattern generale di repo harness non dobbiamo costruircelo noi**: oggi esistono implementazioni pubbliche abbastanza vicine da meritare un pilot prima di ADS custom.

---

# 8. Pilot Stealth consigliato — una sola variabile nuova

## Fase A — snapshot attuale

Su `sth-assitec`:

1. tenere la branch pilot separata;
2. registrare l'attuale qualità dell'onboarding/AGENTS/project verifier;
3. usare una richiesta reale invariata:

```text
Aggiungi un flag IS_DDL persistente ai dipendenti e nella scheda azienda mostra l'elenco dei dipendenti marcati come DDL.
```

Misurare:

```text
numero interventi umani
numero correzioni
file letti inutilmente
ambiguità inventate
verifiche realmente eseguite
regressioni
qualità PR finale
```

## Fase B — solo `repository-harness`

Installare **solo** repository-harness nella branch pilot.

Eseguire il suo onboarding brownfield.

Adattare esclusivamente ciò che è realmente specifico di Assitec:

```text
PHP 5.6 runtime
DB locale assitec
Stealth CRUD conventions
configure/local rules
dev/verify-local.sh
```

Non aggiungere GSD, Trailhead, HAR, OpenSpec o altro.

## Fase C — ripetere il task

Nuova sessione Codex, stessa richiesta.

Confrontare A/B.

### Condizione di successo

Il harness è utile se diminuisce materialmente:

```text
Mauro deve correggere il contesto
Mauro deve ricordare i test
Mauro deve spiegare dove mettere le cose
Mauro deve scoprire a posteriori che Codex non ha verificato
```

## Fase D — diagnosticare il gap rimasto

Solo dopo:

| Gap osservato | Tool da testare |
|---|---|
| Repo/context ancora debole | Adobe `harness-setup` come alternativa/audit |
| Verify/environment non ripetibile | HAR |
| Issue/task orchestration richiede troppo intervento | Trailhead |
| Agente perde disciplina tra plan/execute/verify | GSD |
| Molti task concorrenti, umano fa context switching | Symphony-style orchestration |

Questo evita di installare cinque sistemi e poi non sapere quale serva.

---

# 9. Stack che consiglierei OGGI

## Per il pilot

```text
Codex
+
repository-harness
+
GitHub
+
verifier Assitec già esistente
```

**Nient'altro.**

## Se il pilot funziona

Lo standard diventa:

```text
GLOBAL
Codex / Claude

REPO STANDARD
repository-harness

PROJECT-SPECIFIC
runtime config
business knowledge
verifier reali
safe deploy
```

Non chiamerei più il layer centrale “ADS orchestrator”.

Se serve mantenere il nome ADS, ADS diventa al massimo il nome del **bootstrap Stealth specifico**, non un framework che duplica il repository harness.

## Se il pilot non funziona

Non aggiungiamo automaticamente più framework.

Identifichiamo quale delle quattro classi ha fallito:

```text
CONTEXT
EXECUTION
VERIFICATION
ORCHESTRATION
```

e aggiungiamo un solo strumento che possiede quel problema.

---

# 10. Decisione netta

La ricerca non supporta più la strada:

```text
costruiamo ADS V2
con onboarding + state machine + spec + verifier + workflow + orchestration
```

Supporta invece questa:

```text
1. adottare un repo harness già esistente
2. tenere GitHub come history/state durevole
3. lasciare Codex/Claude eseguire
4. investire solo nei verifier specifici del prodotto
5. aggiungere orchestrazione solo quando il volume la richiede
```

**Primo candidato da provare: `repository-harness`.**  
**Reference per giudicarlo: Adobe Repository Harness Guide.**  
**Primo add-on solo se emerge il bisogno di runtime/evidence isolation: HAR.**

Questa è oggi la strada più vicina a replicare il risultato osservato senza ricostruire da zero la stessa infrastruttura.

---

## Decisione operativa per il prossimo test

**Non considero più `Codex + Trailhead` la scelta di default prima di aver testato il repository layer.** Trailhead resta candidato per il problema *issue/work orchestration*, ma sarebbe prematuro usarlo per correggere un problema di context/repo harness.

Il prossimo esperimento corretto è quindi uno solo:

```text
Assitec
+ repository-harness
+ Codex
+ verifier Assitec
```

Se questo migliora già drasticamente il lavoro, abbiamo eliminato una grossa parte di ADS senza introdurre un orchestratore. Se non basta, il fallimento ci dirà **quale** layer aggiungere dopo.