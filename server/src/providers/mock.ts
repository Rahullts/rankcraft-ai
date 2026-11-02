import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { LlmProvider, LlmRequest, LlmResult } from './types.js';
import { generateNaturalMetaDescription } from '../lib/metaGenerator.js';
import { generateAdaptiveOutline, generateAdaptiveArticle, detectTopicDomain, AdaptiveOutlineSection } from '../lib/articleGenerator.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const FIXTURES_DIR = path.resolve(__dirname, '../../fixtures');

function extractPromptVar(text: string, key: string, fallback: string): string {
  const match = text.match(new RegExp(`${key}:\\s*([^\\n<]+)`, 'i'));
  return match && match[1].trim() ? match[1].trim() : fallback;
}

export class MockProvider implements LlmProvider {
  public name = 'mock';

  async generate(req: LlmRequest, signal?: AbortSignal): Promise<LlmResult> {
    if (signal?.aborted) {
      throw new Error('Request aborted');
    }

    // Simulate minor asynchronous processing
    await new Promise((resolve) => setTimeout(resolve, 60));

    const promptText = req.user;
    const topic = extractPromptVar(promptText, 'Topic', 'Growing herbs at home');
    
    // Also try to extract primary keyword from strategyJson tag if in later stage
    let primaryKw = extractPromptVar(promptText, 'Primary keyword', '');
    if (!primaryKw) {
      const stratMatch = promptText.match(/"primary":\s*"([^"]+)"/);
      primaryKw = stratMatch ? stratMatch[1] : 'indoor herb garden';
    }
    const audience = extractPromptVar(promptText, 'Target audience', 'Urban homeowners and beginners');

    // Extract target word count from prompt context (default 800)
    let targetWordCount = 800;
    const targetMatch = promptText.match(/(?:Target length|Total article length|target of|about)\s*[:]?\s*(?:about\s*)?(\d+)/i);
    if (targetMatch) {
      targetWordCount = parseInt(targetMatch[1], 10);
    }

    const domain = detectTopicDomain(topic, primaryKw);

    // -------------------------------------------------------------------------
    // Stage 1: Strategy
    // -------------------------------------------------------------------------
    if (promptText.includes('produce the SEO strategy elements')) {
      if (domain === 'herb') {
        const content = fs.readFileSync(path.join(FIXTURES_DIR, 'mockStrategy.json'), 'utf-8');
        return { text: content, usage: { inputTokens: 420, outputTokens: 260 } };
      }

      if (domain === 'hydroponic') {
        const hydroStrategy = {
          titles: [
            { text: "Indoor Hydroponic Gardening: A Guide for Beginners", angle: "guide" },
            { text: "How to Start an Indoor Hydroponic Gardening Setup", angle: "how-to" },
            { text: "7 Essential Tips for Indoor Hydroponic Gardening", angle: "list" },
            { text: "Hydroponics vs Soil: Best Setup for Indoor Greens", angle: "comparison" },
            { text: "Can Indoor Hydroponic Gardening Work in Small Flats?", angle: "question" }
          ],
          metaDescription: "Discover how indoor hydroponic gardening lets urban homeowners grow fresh greens at home without soil. Learn essential lighting, nutrient, and pH tips today!",
          keywords: {
            primary: primaryKw || "indoor hydroponic gardening",
            secondary: [
              "hydroponic nutrient solution",
              "indoor grow lights for greens",
              "deep water culture setup",
              "soil-less indoor vegetable garden",
              "pH balancing for hydroponics",
              "compact urban hydroponic systems"
            ],
            longTail: [
              "how to start indoor hydroponics in an apartment",
              "best leafy greens for home hydroponic systems",
              "maintaining proper pH levels in hydroponic water",
              "energy efficient led lighting for indoor greens",
              "how often to change hydroponic nutrient water",
              "troubleshooting yellow leaves in hydroponic plants"
            ]
          }
        };

        return {
          text: JSON.stringify(hydroStrategy, null, 2),
          usage: { inputTokens: 420, outputTokens: 260 }
        };
      }

      if (domain === 'database') {
        const dbStrategy = {
          titles: [
            { text: "Database Performance: Complete Optimization Guide", angle: "guide" },
            { text: "How to Improve Database Performance in Cloud Systems", angle: "how-to" },
            { text: "7 Proven Ways to Boost Database Performance", angle: "list" },
            { text: "Indexing vs Caching for Database Performance", angle: "comparison" },
            { text: "Can You Scale Database Performance on a Budget?", angle: "question" }
          ],
          metaDescription: "Boost your cloud database performance with proven indexing, query tuning, and caching techniques. Discover practical latency reduction tips for engineers today!",
          keywords: {
            primary: primaryKw || "database performance",
            secondary: [
              "query indexing strategies",
              "cloud connection pooling",
              "redis cache layer",
              "read replica scaling",
              "database latency monitoring",
              "slow query log analysis"
            ],
            longTail: [
              "how to optimize slow sql queries in cloud",
              "best practices for postgres connection pooling",
              "reducing database query latency with redis",
              "how to identify unindexed database queries",
              "scaling read replicas for database performance",
              "managing connection limits under high concurrency"
            ]
          }
        };

        return {
          text: JSON.stringify(dbStrategy, null, 2),
          usage: { inputTokens: 420, outputTokens: 260 }
        };
      }

      if (domain === 'battery') {
        const batteryStrategy = {
          titles: [
            { text: "Solid State Battery: The Future of Clean Transport", angle: "guide" },
            { text: "How Solid State Battery Chemistry Powers Modern EVs", angle: "how-to" },
            { text: "5 Key Advances in Solid State Battery Technology", angle: "list" },
            { text: "Solid State vs Lithium-Ion: Which Battery Wins?", angle: "comparison" },
            { text: "Will Solid State Battery Pack Costs Drop by 2030?", angle: "question" }
          ],
          metaDescription: "Explore cutting-edge solid state battery technology with comprehensive insights on energy density, safety, and charging. Read the full expert breakdown now!",
          keywords: {
            primary: primaryKw || "solid state battery",
            secondary: [
              "solid electrolyte separator",
              "electric vehicle battery pack",
              "lithium metal anode",
              "fast charging thermal control",
              "battery energy density"
            ],
            longTail: [
              "how solid state batteries improve ev range",
              "solid state vs lithium ion battery comparison",
              "manufacturing challenges for solid state batteries",
              "fire safety benefits of ceramic solid electrolytes",
              "fast charging performance of solid state cells"
            ]
          }
        };

        return {
          text: JSON.stringify(batteryStrategy, null, 2),
          usage: { inputTokens: 420, outputTokens: 260 }
        };
      }

      if (domain === 'cinema_ai') {
        const cinemaAiStrategy = {
          titles: [
            { text: "AI in the Movie Industry: Transforming Modern Cinema", angle: "guide" },
            { text: "How Artificial Intelligence Is Changing Movie Production", angle: "how-to" },
            { text: "7 Ways AI in the Movie Industry Accelerates Filmmaking", angle: "list" },
            { text: "Traditional Filmmaking vs AI: The Future of Production", angle: "comparison" },
            { text: "Will AI in the Movie Industry Replace Human Creativity?", angle: "question" }
          ],
          metaDescription: generateNaturalMetaDescription(primaryKw || "AI in the movie industry", topic),
          keywords: {
            primary: primaryKw || "AI in the movie industry",
            secondary: [
              "generative cinema tools",
              "virtual production VFX",
              "neural rendering techniques",
              "algorithmic script analysis",
              "digital actor likeness rights",
              "automated post-production editing"
            ],
            longTail: [
              "how artificial intelligence is changing movie production",
              "ethical considerations for ai in filmmaking",
              "best generative ai tools for filmmakers",
              "ai visual effects workflows in hollywood",
              "future of artificial intelligence in cinema",
              "protecting actor digital likenesses in movies"
            ]
          }
        };

        return {
          text: JSON.stringify(cinemaAiStrategy, null, 2),
          usage: { inputTokens: 420, outputTokens: 260 }
        };
      }

      if (domain === 'cinema_lgbtq') {
        const lgbtqStrategy = {
          titles: [
            { text: "LGBTQ+ Representation in Modern Cinema: Complete Guide", angle: "guide" },
            { text: "How LGBTQ+ Representation in Modern Cinema Has Evolved", angle: "how-to" },
            { text: "7 Groundbreaking Films in Modern Queer Cinema", angle: "list" },
            { text: "Independent Queer Cinema vs Mainstream Studio Films", angle: "comparison" },
            { text: "Why Does Authentic LGBTQ+ Casting Matter in Movies?", angle: "question" }
          ],
          metaDescription: generateNaturalMetaDescription(primaryKw || "LGBTQ+ representation in modern cinema", topic),
          keywords: {
            primary: primaryKw || "LGBTQ+ representation in modern cinema",
            secondary: [
              "authentic queer casting",
              "intersectional queer narratives",
              "independent lgbtq cinema",
              "queer film festival acclaim",
              "diverse cinematic storytelling",
              "international film distribution challenges"
            ],
            longTail: [
              "evolution of lgbtq representation in cinema",
              "importance of authentic queer casting in movies",
              "groundbreaking independent lgbtq films",
              "how modern cinema portrays queer characters",
              "diversity and inclusion behind the camera",
              "navigating international censorship for queer films"
            ]
          }
        };

        return {
          text: JSON.stringify(lgbtqStrategy, null, 2),
          usage: { inputTokens: 420, outputTokens: 260 }
        };
      }

      if (domain === 'education_ai') {
        const eduStrategy = {
          titles: [
            { text: "AI in Education: Transforming Modern Classroom Learning", angle: "guide" },
            { text: "How AI in Education Empowers Teachers and Students", angle: "how-to" },
            { text: "7 Powerful Ways AI in Education Improves Student Outcomes", angle: "list" },
            { text: "Traditional Instruction vs AI Adaptive Learning", angle: "comparison" },
            { text: "Can AI in Education Bridge Classroom Learning Gaps?", angle: "question" }
          ],
          metaDescription: generateNaturalMetaDescription(primaryKw || "AI in education", topic),
          keywords: {
            primary: primaryKw || "AI in education",
            secondary: [
              "adaptive learning platforms",
              "intelligent tutoring systems",
              "automated grading workflows",
              "student data privacy protections",
              "multimodal accessibility aids",
              "predictive learning analytics"
            ],
            longTail: [
              "how artificial intelligence is transforming classroom learning",
              "benefits of adaptive learning systems for students",
              "ethical considerations for ai in education",
              "ai grading tools for teachers",
              "personalized learning pathways using artificial intelligence",
              "protecting student data privacy in digital education"
            ]
          }
        };

        return {
          text: JSON.stringify(eduStrategy, null, 2),
          usage: { inputTokens: 420, outputTokens: 260 }
        };
      }

      if (domain === 'cybersecurity') {
        const cyberStrategy = {
          titles: [
            { text: "Cybersecurity in Everyday Life: Practical Defense Guide", angle: "guide" },
            { text: "How to Practice Cybersecurity in Everyday Life at Home", angle: "how-to" },
            { text: "7 Essential Habits for Cybersecurity in Everyday Life", angle: "list" },
            { text: "Passwords vs Passkeys: Which Security Method Is Safer?", angle: "comparison" },
            { text: "Is Multi-Factor Authentication Enough for Full Security?", angle: "question" }
          ],
          metaDescription: generateNaturalMetaDescription(primaryKw || "cybersecurity in everyday life", topic),
          keywords: {
            primary: primaryKw || "cybersecurity in everyday life",
            secondary: [
              "multi-factor authentication",
              "password manager best practices",
              "home wifi router security",
              "phishing attack prevention",
              "credit report security freeze",
              "device automated data backup"
            ],
            longTail: [
              "how to protect personal data from online scams",
              "best cybersecurity practices for everyday life",
              "securing smart home devices from hackers",
              "importance of multi-factor authentication today",
              "recognizing modern phishing emails and texts",
              "safeguarding digital identity and financial accounts"
            ]
          }
        };

        return {
          text: JSON.stringify(cyberStrategy, null, 2),
          usage: { inputTokens: 420, outputTokens: 260 }
        };
      }

      if (domain === 'climate_sustainability') {
        const climateStrategy = {
          titles: [
            { text: "Climate Change and Sustainable Living: Actionable Guide", angle: "guide" },
            { text: "How Sustainable Living Helps Mitigate Climate Change", angle: "how-to" },
            { text: "7 Practical Steps for Climate Change and Sustainable Living", angle: "list" },
            { text: "Individual Sustainable Living vs Corporate Climate Action", angle: "comparison" },
            { text: "Can Households Transition to Sustainable Living on a Budget?", angle: "question" }
          ],
          metaDescription: generateNaturalMetaDescription(primaryKw || "sustainable living", topic),
          keywords: {
            primary: primaryKw || "sustainable living",
            secondary: [
              "household carbon footprint",
              "residential energy efficiency",
              "zero-waste food planning",
              "sustainable mobility choices",
              "community solar programs",
              "circular economy initiatives"
            ],
            longTail: [
              "how to live sustainably and reduce climate impact",
              "practical ways to lower household carbon emissions",
              "transitioning to renewable energy at home",
              "zero waste strategies for daily life",
              "community actions for environmental conservation",
              "cost effective home electrification methods"
            ]
          }
        };

        return {
          text: JSON.stringify(climateStrategy, null, 2),
          usage: { inputTokens: 420, outputTokens: 260 }
        };
      }

      // Adaptive Natural Strategy for any other topic
      const meta = generateNaturalMetaDescription(primaryKw, topic);
      const dynamicStrategy = {
        titles: [
          { text: `${primaryKw}: Essential Guide for Beginners`, angle: "guide" },
          { text: `How to Get Started with ${primaryKw} Today`, angle: "how-to" },
          { text: `7 Practical Strategies for Better ${primaryKw}`, angle: "list" },
          { text: `${primaryKw} vs Conventional Methods: Review`, angle: "comparison" },
          { text: `Can You Implement ${primaryKw} on a Budget?`, angle: "question" }
        ],
        metaDescription: meta,
        keywords: {
          primary: primaryKw,
          secondary: [
            `${primaryKw} best practices`,
            `${primaryKw} implementation`,
            `${primaryKw} core principles`,
            `${primaryKw} methodology`,
            `${primaryKw} optimization`,
            `${primaryKw} strategic frameworks`
          ],
          longTail: [
            `how to get started with ${primaryKw}`,
            `best practices for ${primaryKw} implementation`,
            `step by step guide to ${primaryKw}`,
            `common mistakes to avoid in ${primaryKw}`,
            `practical strategies for ${primaryKw} success`,
            `measuring outcomes and progress in ${primaryKw}`
          ]
        }
      };

      return {
        text: JSON.stringify(dynamicStrategy, null, 2),
        usage: { inputTokens: 420, outputTokens: 260 }
      };
    }

    // -------------------------------------------------------------------------
    // Stage 2: Outline
    // -------------------------------------------------------------------------
    if (promptText.includes('create the outline for the article')) {
      const outlineData = generateAdaptiveOutline({
        topic,
        primaryKeyword: primaryKw,
        audience,
        targetWords: targetWordCount
      });

      return {
        text: JSON.stringify(outlineData, null, 2),
        usage: { inputTokens: 680, outputTokens: 310 }
      };
    }

    // -------------------------------------------------------------------------
    // Stage 3: Article Draft
    // -------------------------------------------------------------------------
    if (promptText.includes('write the full article in Markdown')) {
      let expectedH1 = '';
      const h1Match = promptText.match(/"text":\s*"([^"]+)"/) || promptText.match(/#\s+([^\n]+)/);
      if (h1Match) {
        expectedH1 = h1Match[1];
      }

      // Extract outlineSections if present in <outline> tag
      let outlineSections: AdaptiveOutlineSection[] | undefined;
      const outlineMatch = promptText.match(/<outline>([\s\S]*?)<\/outline>/);
      if (outlineMatch) {
        try {
          const parsed = JSON.parse(outlineMatch[1]);
          if (parsed && Array.isArray(parsed.sections)) {
            outlineSections = parsed.sections;
          }
        } catch {
          // fallback to adaptive outline generator
        }
      }

      // Check if this is a retry revision
      const isRetry = promptText.includes('REVISION INSTRUCTIONS') || promptText.includes('ACTION REQUIRED:');
      if (isRetry) {
        const retryTargetMatch = promptText.match(/Requested target:\s*(\d+)/i) || promptText.match(/target of\s*(\d+)/i);
        if (retryTargetMatch) {
          targetWordCount = parseInt(retryTargetMatch[1], 10);
        }
        const preserveH1Match = promptText.match(/Must preserve the exact top-level H1:\s*#\s*([^\n]+)/i);
        if (preserveH1Match) {
          expectedH1 = preserveH1Match[1].trim();
        }
      }

      const articleText = generateAdaptiveArticle({
        topic,
        primaryKeyword: primaryKw,
        audience,
        targetWords: targetWordCount,
        expectedH1: expectedH1 ? (expectedH1.startsWith('# ') ? expectedH1 : `# ${expectedH1}`) : undefined,
        outlineSections
      });

      return {
        text: articleText,
        usage: { inputTokens: 1150, outputTokens: Math.round(targetWordCount * 1.1) }
      };
    }

    // -------------------------------------------------------------------------
    // Stage 4: FAQs
    // -------------------------------------------------------------------------
    if (promptText.includes('write 5 FAQs a reader of this article might ask')) {
      if (domain === 'herb') {
        const content = fs.readFileSync(path.join(FIXTURES_DIR, 'mockFaqs.json'), 'utf-8');
        return { text: content, usage: { inputTokens: 520, outputTokens: 340 } };
      }

      if (domain === 'hydroponic') {
        const hydroFaqs = {
          faqs: [
            {
              question: "Which vegetables and herbs grow best in indoor hydroponic gardening?",
              answer: "Leafy greens and culinary herbs thrive best in indoor home setups. Crops like butterhead lettuce, spinach, kale, basil, and mint grow quickly with minimal root space. Fruiting crops such as tomatoes require significantly higher light intensity and trellis support, making greens the ideal starting choice for urban homeowners."
            },
            {
              question: "Do indoor hydroponic gardens require specialized grow lights?",
              answer: "Yes, natural window light is rarely sufficient for consistent indoor growth throughout the year. Full-spectrum LED grow lights provide the specific blue and red wavelengths plants need for photosynthesis without producing excessive heat or consuming substantial electrical power in residential apartments."
            },
            {
              question: "How often should the hydroponic nutrient water be replaced?",
              answer: "Most residential hydroponic growers refresh their nutrient water reservoir every two to three weeks to sustain vigorous plant growth. In between full reservoir changes, top off evaporated water with fresh filtered water and check electrical conductivity regularly to prevent excessive mineral salt accumulation from stressing delicate plant roots."
            },
            {
              question: "What is the ideal pH range for indoor hydroponic vegetables?",
              answer: "Most leafy greens and kitchen herbs prefer a slightly acidic pH balance maintained between 5.5 and 6.5. Maintaining this specific chemical balance ensures root hairs absorb dissolved nitrogen, phosphorus, and trace minerals efficiently without causing nutrient lockout or premature foliage discoloration during active growing cycles."
            },
            {
              question: "How much space is needed to start an indoor hydroponic garden?",
              answer: "You can start with as little space as a single countertop corner or a compact two-foot vertical shelf. Vertical tower configurations and modular countertop reservoirs allow urban apartment dwellers to cultivate dozens of fresh vegetable plants simultaneously without consuming valuable residential floor area."
            }
          ]
        };

        return {
          text: JSON.stringify(hydroFaqs, null, 2),
          usage: { inputTokens: 520, outputTokens: 340 }
        };
      }

      if (domain === 'battery') {
        const batteryFaqs = {
          faqs: [
            {
              question: "How long do modern electric vehicle battery packs typically last in passenger cars?",
              answer: "Most modern electric vehicle lithium-ion battery packs are engineered to last between ten and fifteen years with responsible charging habits. Advanced thermal management systems and battery buffer zones prevent rapid cell degradation, allowing vehicles to retain substantial driving range over hundreds of thousands of miles."
            },
            {
              question: "What is the difference between LFP and NMC battery chemistries?",
              answer: "Lithium iron phosphate batteries offer superior thermal stability, longer cycle life, and lower manufacturing costs while tolerating daily full charges. Nickel manganese cobalt chemistries provide higher energy density and lighter pack weights, which makes them preferable for long-range performance vehicles operating in colder regional climates."
            },
            {
              question: "Does frequent DC fast charging damage an electric vehicle battery pack?",
              answer: "Frequent high-power direct current fast charging accelerates internal battery cell heating, which can contribute to gradual capacity loss over several years. Automotive engineers recommend relying primarily on slower alternating current charging overnight while reserving high-voltage fast chargers for extended highway travel and urgent journeys."
            },
            {
              question: "How does cold winter weather affect electric vehicle battery range and efficiency?",
              answer: "Freezing ambient temperatures temporarily slow down electrochemical reactions within battery cells and require supplemental energy to heat the vehicle cabin. As a result, winter driving range can drop by fifteen to thirty percent, though preconditioning the battery pack while plugged in mitigates much of this loss."
            },
            {
              question: "What happens to electric vehicle battery packs after they are retired from cars?",
              answer: "Retired vehicle batteries rarely go directly to scrap yards because they typically retain seventy to eighty percent of their original storage capacity. They are repurposed into stationary energy storage systems for solar installations and commercial buildings before eventually entering advanced closed-loop industrial recycling facilities to recover valuable minerals."
            }
          ]
        };

        return {
          text: JSON.stringify(batteryFaqs, null, 2),
          usage: { inputTokens: 520, outputTokens: 340 }
        };
      }

      if (domain === 'database') {
        const dbFaqs = {
          faqs: [
            {
              question: "What is the most common cause of slow database performance in cloud apps?",
              answer: "Missing or poorly designed indexes represent the most frequent cause of database latency spikes. When queries cannot use an index, the database engine executes sequential table scans across millions of rows, consuming extensive disk input-output operations and blocking concurrent connection threads."
            },
            {
              question: "How does connection pooling improve database performance under high load?",
              answer: "Connection pooling maintains a warm pool of reusable connections between application servers and the database. By avoiding the expensive transport layer security handshake and process initialization overhead for every request, connection poolers prevent thread exhaustion and lower tail latency."
            },
            {
              question: "When should an engineering team add an in-memory cache like Redis?",
              answer: "Introduce an in-memory cache when read workloads repeat frequently and data changes infrequently. Caching hot queries offloads repetitive reads from primary storage engines, freeing transactional database resources for critical write operations and maintaining fast sub-millisecond responses."
            },
            {
              question: "What are the trade-offs of adding multiple indexes to a database table?",
              answer: "While indexes significantly accelerate read queries, every additional index introduces write overhead during insert, update, and delete statements. The database engine must update every associated B-tree structure simultaneously, increasing write latency and expanding total disk storage footprint."
            },
            {
              question: "How can developers verify whether a database query uses an index?",
              answer: "Run the query with an explain command in your database console to inspect the execution plan. The output reveals whether the query planner selected an index scan or resorted to a full sequential scan, showing exact execution costs and row estimates."
            }
          ]
        };

        return {
          text: JSON.stringify(dbFaqs, null, 2),
          usage: { inputTokens: 520, outputTokens: 340 }
        };
      }

      if (domain === 'cinema_ai') {
        const cinemaAiFaqs = {
          faqs: [
            {
              question: "How is artificial intelligence being used in modern movie production?",
              answer: "Filmmakers use artificial intelligence across pre-production, principal photography, and post-production. Machine learning algorithms assist in generating early storyboards, simulating realistic visual effects, automating color grading, and cleaning background audio. These tools accelerate repetitive technical tasks while allowing creative directors to focus on storytelling."
            },
            {
              question: "Will artificial intelligence replace human actors and screenwriters in cinema?",
              answer: "Industry consensus emphasizes that artificial intelligence serves as a collaborative tool rather than a replacement for human artistry. While neural networks can generate dialogue prompts or background digital extras, authentic emotional resonance, nuanced character journeys, and cultural depth require genuine human perspective and lived experiences."
            },
            {
              question: "What ethical concerns surround digital likenesses and voice cloning in film?",
              answer: "Major ethical debates center on intellectual property ownership, informed consent, and compensation for performers. Film unions and studios are actively negotiating contractual protections to prevent unauthorized synthetic reproductions of actor likenesses or vocal performances without clear authorization and fair remuneration."
            },
            {
              question: "How does artificial intelligence impact visual effects budgets and timelines?",
              answer: "Neural rendering and automated motion tracking significantly shorten post-production schedules. Tasks that previously required weeks of manual rotoscoping can now be completed in hours. This efficiency lowers VFX barriers for independent filmmakers while allowing major studios to create complex visual spectacles more cost-effectively."
            },
            {
              question: "What skills should upcoming filmmakers learn to adapt to AI technologies?",
              answer: "Aspiring filmmakers should balance traditional cinematic fundamentals with fluency in emerging digital tools. Understanding narrative pacing, cinematography, and dramatic performance remains vital, alongside practical familiarity with virtual production engines, algorithmic editing suites, and prompt-driven pre-visualization platforms. Embracing ongoing technical education ensures creators remain competitive while preserving their personal creative vision across rapidly evolving production environments."
            }
          ]
        };

        return {
          text: JSON.stringify(cinemaAiFaqs, null, 2),
          usage: { inputTokens: 520, outputTokens: 340 }
        };
      }

      if (domain === 'cinema_lgbtq') {
        const lgbtqFaqs = {
          faqs: [
            {
              question: "Why is authentic representation important in modern cinema?",
              answer: "Authentic representation validates diverse lived experiences and fosters broader cultural empathy among global audiences. When cinema portrays multifaceted LGBTQ+ characters with emotional depth rather than relying on tired caricatures or tragic tropes, it enriches the storytelling landscape and reflects the genuine diversity of modern society."
            },
            {
              question: "How has LGBTQ+ cinema evolved from early independent films to mainstream releases?",
              answer: "Early LGBTQ+ cinematic narratives were largely confined to underground independent circuits due to commercial censorship and restrictive studio codes. Over recent decades, sustained advocacy and critical acclaim have propelled queer stories into mainstream multiplexes and major streaming platforms, earning prestigious awards and global box-office success."
            },
            {
              question: "What role does authentic casting play in contemporary film production?",
              answer: "Casting actors whose identities align with their characters brings invaluable nuance, cultural understanding, and emotional authenticity to complex roles. It also addresses systemic industry disparities by providing equitable professional opportunities for underrepresented performers who have historically faced marginalization within mainstream studio casting systems."
            },
            {
              question: "What challenges do queer filmmakers face in international film distribution?",
              answer: "Filmmakers often encounter regulatory hurdles, censorship mandates, and restrictive age ratings in conservative overseas territories. Navigating these regional distribution barriers requires strategic partnerships with international sales agents, community film festivals, and digital streaming outlets that protect narrative integrity while reaching supportive global audiences."
            },
            {
              question: "How can independent film festivals support emerging LGBTQ+ cinematic voices?",
              answer: "Independent film festivals provide crucial exhibition platforms, networking pipelines, and distribution avenues for visionary queer creators. By highlighting innovative scripts and facilitating connections with established producers and distributors, these festivals nurture emerging storytellers and champion narratives that push creative and cultural boundaries."
            }
          ]
        };

        return {
          text: JSON.stringify(lgbtqFaqs, null, 2),
          usage: { inputTokens: 520, outputTokens: 340 }
        };
      }

      if (domain === 'education_ai') {
        const eduFaqs = {
          faqs: [
            {
              question: "How does artificial intelligence personalize learning for individual students?",
              answer: "Artificial intelligence systems analyze student interaction patterns, assessment scores, and pacing in real time. By identifying conceptual misunderstandings immediately, adaptive learning platforms deliver customized practice exercises and targeted remedial explanations tailored to each learner's unique strengths, challenges, and cognitive learning preferences."
            },
            {
              question: "What role do educators play in an AI-enhanced classroom environment?",
              answer: "Educators remain the irreplaceable foundation of effective education. Rather than replacing teachers, artificial intelligence automates routine administrative responsibilities like grading and attendance logging, freeing valuable classroom hours so instructors can deliver individualized student mentorship, foster critical discussions, and provide compassionate emotional guidance."
            },
            {
              question: "How does educational technology protect student data privacy and security?",
              answer: "Schools and technology vendors must enforce stringent data governance protocols, including end-to-end encryption, strict access controls, and compliance with privacy regulations. Responsible platforms minimize sensitive data collection, prohibit behavioral advertising, and ensure that student educational records remain secure and confidential at all times."
            },
            {
              question: "Can artificial intelligence help identify students who need early academic support?",
              answer: "Yes, predictive analytics can evaluate continuous learning engagement metrics to detect struggling students weeks before formal midterm evaluations take place. This early alert capability enables teachers and academic counselors to organize proactive pedagogical interventions, preventing students from falling behind in challenging subject curricula."
            },
            {
              question: "What are the primary challenges in deploying AI tools across diverse schools?",
              answer: "Key challenges include bridging digital divide disparities, securing reliable internet connectivity, providing comprehensive teacher training, and preventing algorithmic training biases. Ensuring equitable technology distribution ensures that all students, regardless of socioeconomic background or geographic location, benefit from modern digital educational innovations while receiving high-quality pedagogical support."
            }
          ]
        };

        return {
          text: JSON.stringify(eduFaqs, null, 2),
          usage: { inputTokens: 520, outputTokens: 340 }
        };
      }

      if (domain === 'cybersecurity') {
        const cyberFaqs = {
          faqs: [
            {
              question: "What are the most essential cybersecurity practices for everyday computer users?",
              answer: "The most effective cybersecurity habits include enabling multi-factor authentication on every account, using a dedicated password manager to create unique complex passphrases, maintaining automatic operating system updates, and exercising vigilant caution before clicking on unsolicited email links, unfamiliar downloads, or suspicious text attachments."
            },
            {
              question: "Why is multi-factor authentication so crucial for personal online accounts?",
              answer: "Multi-factor authentication adds an indispensable extra verification layer beyond a simple password. Even if malicious actors acquire your login credentials through a third-party data breach, they cannot access your account without the secondary biometric prompt, security key, or temporary authentication token generated on your device."
            },
            {
              question: "How can individuals protect their home Wi-Fi networks from unauthorized intrusion?",
              answer: "Homeowners should immediately change default router administrator passwords, enable strong WPA3 wireless encryption, and disable remote administrative access. Creating an isolated guest Wi-Fi network specifically for smart home appliances and IoT devices prevents compromised gadgets from exposing personal computers and sensitive data."
            },
            {
              question: "How do modern phishing attacks deceive users and how can they be recognized?",
              answer: "Phishing attacks use deceptive branding, psychological urgency, and spoofed sender addresses to manipulate victims into revealing confidential information. Users can identify phishing schemes by scrutinizing email header domains, verifying unusual financial requests through independent channels, and avoiding urgent prompts demanding immediate credential entry."
            },
            {
              question: "What steps should someone take immediately if they suspect a security breach?",
              answer: "If you suspect an account compromise, disconnect affected devices from the internet immediately. Reset all critical account passwords starting with your primary email, revoke active login sessions, enable multi-factor authentication, monitor banking statements for fraudulent charges, and report the breach to relevant platform security teams."
            }
          ]
        };

        return {
          text: JSON.stringify(cyberFaqs, null, 2),
          usage: { inputTokens: 520, outputTokens: 340 }
        };
      }

      if (domain === 'climate_sustainability') {
        const climateFaqs = {
          faqs: [
            {
              question: "What are the most effective household actions to reduce climate impact?",
              answer: "The highest-impact residential changes include improving home thermal insulation, switching to electric heat pump heating, transitioning to clean renewable electricity providers, and reducing private vehicle mileage through public transit or cycling. Additionally, minimizing household food waste and adopting plant-forward diets deliver substantial immediate environmental benefits."
            },
            {
              question: "How does reducing household food waste help mitigate global climate change?",
              answer: "Food waste decomposing in municipal landfills generates significant quantities of potent methane gas. By planning weekly meals deliberately, storing fresh produce correctly, and composting organic scraps, households prevent methane emissions while conserving the vast water, land, and energy resources required for commercial agriculture."
            },
            {
              question: "Is transitioning to renewable energy affordable for ordinary homeowners and renters?",
              answer: "Yes, renewable adoption is increasingly accessible through community solar programs, municipal clean energy aggregations, and regional utility green tariffs that require zero upfront equipment purchase. Homeowners can also leverage government tax credits and energy efficiency rebates that significantly reduce the initial cost of solar panel installations."
            },
            {
              question: "How can sustainable daily transportation choices lower individual carbon footprints?",
              answer: "Transportation represents one of the largest single components of personal emissions. Choosing active commuting like walking or biking for short trips, carpooling, utilizing electrified public transit, and transitioning to electric vehicles dramatically decreases fossil fuel consumption and improves localized urban air quality for surrounding communities."
            },
            {
              question: "Why is individual sustainable living important when corporate emissions are so high?",
              answer: "Individual consumer choices shape market demand, encouraging corporations to accelerate decarbonization across consumer supply chains. Moreover, grassroots adoption of sustainable habits builds widespread cultural momentum that empowers civic leaders to enact bolder municipal clean energy policies, infrastructure upgrades, and environmental regulations."
            }
          ]
        };

        return {
          text: JSON.stringify(climateFaqs, null, 2),
          usage: { inputTokens: 520, outputTokens: 340 }
        };
      }

      // Adaptive Natural FAQs for any other topic (strictly 40-70 words per answer)
      const dynamicFaqs = {
        faqs: [
          {
            question: `What is the most effective way to begin with ${primaryKw}?`,
            answer: `The most effective way is to begin with the core foundational concepts before exploring advanced methodologies. Building a clear understanding of fundamental principles allows you to evaluate strategies objectively, avoid common trial-and-error setbacks, and develop a reliable framework that adapts to your evolving operational requirements over time.`
          },
          {
            question: `What are the most critical factors for successful implementation?`,
            answer: `Successful implementation depends on clear baseline planning, consistent execution of proven methodologies, and disciplined progress tracking. Prioritizing structured workflows and avoiding premature complexity ensures that your team or individual efforts achieve predictable, high-quality outcomes while maintaining long-term focus on primary strategic objectives.`
          },
          {
            question: `What common misconceptions or pitfalls should practitioners avoid?`,
            answer: `The most frequent mistake is attempting advanced tactics before establishing solid core competencies. Neglecting foundational preparation often leads to inconsistent outcomes and unnecessary frustration. Focus instead on mastering essential principles, documenting your observations carefully, and making gradual, evidence-based adjustments as your practical experience expands.`
          },
          {
            question: `How should progress and strategic outcomes be measured effectively?`,
            answer: `Measure progress by tracking meaningful qualitative and quantitative benchmarks aligned with your long-term goals. Establishing consistent review intervals helps you identify trends early, validate whether specific techniques are delivering expected value, and make timely adjustments before minor inefficiencies turn into substantial operational obstacles.`
          },
          {
            question: `How can practitioners stay informed about future developments in this field?`,
            answer: `Staying informed requires engaging regularly with authoritative industry research, participating in peer discussions, and observing real-world case studies. Continuous learning ensures that your knowledge base remains current, enabling you to incorporate emerging best practices and adapt proactively as broader technological and market landscapes evolve.`
          }
        ]
      };

      return {
        text: JSON.stringify(dynamicFaqs, null, 2),
        usage: { inputTokens: 520, outputTokens: 340 }
      };
    }

    // -------------------------------------------------------------------------
    // Mode A: Simple Prompt Baseline
    // -------------------------------------------------------------------------
    if (domain === 'herb') {
      const simple = fs.readFileSync(path.join(FIXTURES_DIR, 'mockSimple.md'), 'utf-8');
      return { text: simple, usage: { inputTokens: 120, outputTokens: 95 } };
    }

    if (domain === 'hydroponic') {
      const simpleHydro = `# An Introduction to Sustainable Indoor Hydroponic Gardening

Indoor hydroponic gardening is a popular method for urban homeowners to grow plants inside without soil. It uses water and mineral nutrients instead of garden dirt.

There are several things to consider when starting. You need a container for water, some grow lights if you do not have sunlight, and nutrient fertilizer. Many people grow lettuce and herbs because they are easy to manage.

In summary, indoor hydroponic gardening is a good way to have fresh greens at home, but it requires regular watering and care to get good results.`;

      return {
        text: simpleHydro,
        usage: { inputTokens: 120, outputTokens: 95 }
      };
    }

    if (domain === 'database') {
      const simpleDb = `# An Introduction to Cloud Database Performance Optimization

Database performance is an important subject for backend developers and cloud engineers. When applications get more traffic, queries can become slow.

To improve performance, developers should look at slow queries, create indexes on database tables, and use caching tools like Redis. It is also helpful to monitor query latency so you know when the database is struggling.

In summary, paying attention to database performance helps applications stay fast and reliable for users.`;

      return {
        text: simpleDb,
        usage: { inputTokens: 120, outputTokens: 95 }
      };
    }

    const simpleBaseline = `# An Introduction to ${topic}

Learning about ${topic} is an important subject that many ${audience.toLowerCase()} explore today. It is helpful to know about ${primaryKw} when getting started.

There are several things to consider. You should understand the basic ideas, use good tools, and practice regularly. Many people find that ${primaryKw} helps them in their work and daily projects.

In summary, having a basic understanding of ${topic} will help you make progress and achieve your goals.`;

    return {
      text: simpleBaseline,
      usage: { inputTokens: 120, outputTokens: 95 }
    };
  }
}
