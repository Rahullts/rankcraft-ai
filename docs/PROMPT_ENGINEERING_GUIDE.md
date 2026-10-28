# Prompt Engineering Guide & Theoretical Framework

## Project: RankCraft AI - AI SEO Content Assistant
**Document Purpose:** In-depth technical and pedagogical guide to the prompt patterns, mathematical constraints, and ablation findings implemented in the project.

---

## 1. Theoretical Overview of Prompt Engineering
Prompt engineering is not mere phrasing trial-and-error; it is the formal discipline of conditioning the prior distribution of autoregressive language models to maximize the likelihood of desired, compliant outputs.

Mathematically, for an autoregressive model parameterized by $\theta$:
$$P(Y | X) = \prod_{t=1}^{T} P(y_t | y_{<t}, X; \theta)$$

When $X$ is an unconstrained baseline prompt ($X_{basic}$), the conditional probability distribution spreads over broad conversational styles, colloquial variations, and unbounded token lengths. 

When $X$ is an engineered prompt ($X_{improved}$), constraints act as conditioning filters, drastically narrowing the search space:
$$X_{improved} = \{ \text{Role}, \text{Context}, \text{Constraints}, \text{Exemplars}, \text{Schema} \}$$

---

## 2. Core Prompt Techniques Implemented

### 2.1 Persona & Role Prompting
- **Implementation:** Assigns the persona of a *Senior Search Quality Architect* and *Lead SEO Content Strategist*.
- **Theoretical Mechanism:** Activates specialized latent representations associated with Google's Search Quality Rater Guidelines (E-E-A-T: Experience, Expertise, Authoritativeness, and Trustworthiness).
- **Ablation Finding:** Baseline prompts use generic casual words ("awesome", "nice"), while role-conditioned prompts adopt technical terminology ("sub-millisecond latency", "B-tree indexing").

### 2.2 Boundary & Length Constraints
- **Implementation:** Specifies *“TARGET: Exactly 155 to 160 characters (including spaces and punctuation).”*
- **Theoretical Mechanism:** Autoregressive models do not possess an internal character counter. By combining exact target ranges with structural exemplars and call-to-action formulas, the model targets the desired token window.
- **Result:** Mode A produces descriptions between 45 and 90 characters (score: 2.0 / 5.0). Mode B achieves 155-160 characters (score: 5.0 / 5.0).

### 2.3 Search Intent & Journey Grounding
- **Implementation:** Classifies query into *Informational*, *Commercial*, *Transactional*, or *Navigational*.
- **Theoretical Mechanism:** Instructs the model to align document structure with user psychological stages (Discovery -> Evaluation -> Technical Decision).

### 2.4 Negative Constraints & Anti-Stuffing
- **Implementation:** Caps primary keyword density strictly between 1.2% and 1.8%, while mandating front-loaded placement in Title, H1, and first 100 words.
- **Theoretical Mechanism:** Prevents penalization by search engine spam filters.

### 2.5 Deterministic JSON Grammar Enforcement
- **Implementation:** Mandates a strict 12-key JSON output with explicit types.
- **Theoretical Mechanism:** Eliminates markdown code wrapper inconsistencies and guarantees reliable parsing.

### 2.6 Anti-Hallucination Directives
- **Implementation:** Explicitly forbids fabricating search volume metrics (e.g. "12,000 monthly searches").
- **Theoretical Mechanism:** Avoids deceiving users with simulated commercial search statistics.

---

## 3. Side-by-Side Prompt Template Architecture

```
+-------------------------------------------------------------------------------+
|                               INPUT PARAMETERS                                |
| Topic: Cloud Database Performance | Primary KW: database performance          |
| Audience: Backend Engineers       | Word Count: 1,200 | Intent: Informational |
+-------------------------------------------------------------------------------+
                                      |
         +----------------------------+----------------------------+
         |                                                         |
         v                                                         v
+-----------------------------+               +----------------------------------+
|   MODE A: BASIC BASELINE    |               |  MODE B: ADVANCED ENGINEERED     |
| - 3 lines of natural text   |               | - Role & Persona assignment      |
| - No length boundaries      |               | - E-E-A-T search guidelines      |
| - No keyword density rules  |               | - 155-160 char meta boundary     |
| - Generic JSON request      |               | - 1.2% - 1.8% density target     |
|                             |               | - Few-shot high-CTR title models |
|                             |               | - 12-module JSON schema contract |
+-----------------------------+               +----------------------------------+
         |                                                         |
         v                                                         v
+-----------------------------+               +----------------------------------+
|      OUTPUT: 66.9% (C)      |               |        OUTPUT: 85.8% (A)         |
| Meta: 65 chars (truncated)  |               | Meta: 158 chars (SERP optimal)   |
| Words: 210 words (short)    |               | Words: 1,180 words (compliant)   |
| Density: 0.4% (weak)        |               | Density: 1.4% (optimal)          |
| FAQs: 2 items (incomplete)  |               | FAQs: 5 items (complete)         |
+-----------------------------+               +----------------------------------+
```

---

## 4. Heuristic Scoring Formulas

The heuristic evaluation engine calculates scores objectively using the following mathematical formulas:

### 4.1 Approximated Flesch Reading Ease Formula
$$\text{Reading Ease} = 206.835 - 1.015 \left( \frac{\text{Total Words}}{\text{Total Sentences}} \right) - 84.6 \left( \frac{\text{Total Syllables}}{\text{Total Words}} \right)$$
- Target range for online technical content: **60.0 to 75.0** (Plain, scannable English).

### 4.2 Keyword Density Formula
$$\text{Density}_{\%} = \left( \frac{\text{Count}(\text{Primary Keyword})}{\text{Total Draft Words}} \right) \times 100$$
- Score = 5.0 if $0.8\% \le \text{Density} \le 2.2\%$ with title and meta integration.
- Score = 2.5 if $\text{Density} > 2.5\%$ (Keyword stuffing penalty).
- Score = 1.5 if $\text{Density} = 0\%$ (Omission penalty).

### 4.3 Meta Description Length Penalty
- Score = 5.0 if $150 \le \text{Length} \le 165$ characters.
- Score = 3.8 if $130 \le \text{Length} < 150$ characters.
- Score = 3.5 if $165 < \text{Length} \le 190$ characters (Ellipsis risk).
- Score = 2.0 if $\text{Length} < 130$ or $\text{Length} > 190$ characters.
