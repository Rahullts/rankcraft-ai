import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { LlmProvider, LlmRequest, LlmResult } from './types.js';
import { generateNaturalMetaDescription } from '../lib/metaGenerator.js';
import { generateAdaptiveOutline, generateAdaptiveArticle } from '../lib/articleGenerator.js';

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

    const topicLower = topic.toLowerCase();
    const kwLower = primaryKw.toLowerCase();

    const isHerbDefault = (topicLower === 'growing herbs at home' || (topicLower.includes('herb') && kwLower.includes('herb'))) && !topicLower.includes('hydroponic');
    const isHydroponic = topicLower.includes('hydroponic') || kwLower.includes('hydroponic');
    const isDatabase = topicLower.includes('database') || kwLower.includes('database') || topicLower.includes('query');
    const isBattery = topicLower.includes('battery') || kwLower.includes('battery') || topicLower.includes('electric vehicle');

    // -------------------------------------------------------------------------
    // Stage 1: Strategy
    // -------------------------------------------------------------------------
    if (promptText.includes('produce the SEO strategy elements')) {
      if (isHerbDefault) {
        const content = fs.readFileSync(path.join(FIXTURES_DIR, 'mockStrategy.json'), 'utf-8');
        return { text: content, usage: { inputTokens: 420, outputTokens: 260 } };
      }

      if (isHydroponic) {
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

      if (isDatabase) {
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

      if (isBattery) {
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

      // Adaptive Natural Strategy for any other topic
      const meta = generateNaturalMetaDescription(primaryKw, topic);
      const dynamicStrategy = {
        titles: [
          { text: `${primaryKw}: Essential Guide for Beginners`, angle: "guide" },
          { text: `How to Get Started with ${primaryKw} Today`, angle: "how-to" },
          { text: `5 Practical Steps for Better ${primaryKw}`, angle: "list" },
          { text: `${primaryKw} vs Traditional Methods: Review`, angle: "comparison" },
          { text: `Can You Implement ${primaryKw} on a Budget?`, angle: "question" }
        ],
        metaDescription: meta,
        keywords: {
          primary: primaryKw,
          secondary: [
            `${primaryKw} equipment`,
            `${primaryKw} best practices`,
            `${primaryKw} setup guide`,
            `${primaryKw} practical tips`,
            `${primaryKw} essentials`
          ],
          longTail: [
            `how to get started with ${primaryKw}`,
            `best tools for ${primaryKw} beginners`,
            `step by step guide to ${primaryKw}`,
            `common mistakes to avoid in ${primaryKw}`,
            `practical tips for ${primaryKw} success`
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
      const h1Match = promptText.match(/"text":\s*"([^"]+)"/);
      if (h1Match) {
        expectedH1 = h1Match[1];
      }

      const articleText = generateAdaptiveArticle({
        topic,
        primaryKeyword: primaryKw,
        audience,
        targetWords: targetWordCount,
        expectedH1: expectedH1 ? `# ${expectedH1}` : undefined
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
      if (isHerbDefault) {
        const content = fs.readFileSync(path.join(FIXTURES_DIR, 'mockFaqs.json'), 'utf-8');
        return { text: content, usage: { inputTokens: 520, outputTokens: 340 } };
      }

      if (isHydroponic) {
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

      if (isBattery) {
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

      if (isDatabase) {
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

      // Adaptive Natural FAQs for any other topic (strictly 40-70 words per answer)
      const dynamicFaqs = {
        faqs: [
          {
            question: `What is the most effective way to begin with ${primaryKw}?`,
            answer: `The most effective approach is to start with a focused, manageable routine rather than attempting complex advanced methods right away. Master the fundamental techniques first, observe your initial outcomes carefully, and gradually expand your workflow as your personal confidence and practical familiarity develop over time.`
          },
          {
            question: `What essential equipment is needed to get started?`,
            answer: `You only need a few reliable, high-quality basic tools suited to your immediate workspace and practical goals. Starting with straightforward, proven equipment keeps your initial process simple, eliminates unnecessary technical confusion, and allows you to understand core operating principles thoroughly before investing in specialized upgrades.`
          },
          {
            question: `How much time does routine maintenance require?`,
            answer: `Routine maintenance typically requires only ten to fifteen minutes each day once your initial configuration is established. Maintaining consistent, brief daily check-ins is far more effective than sporadic weekend overhauls and helps you identify minor adjustments before small inconsistencies impact your overall workflow.`
          },
          {
            question: `What are the most common mistakes beginners make?`,
            answer: `The most common mistake is rushing into complicated configurations before mastering basic principles and establishing regular habits. Skipping initial preparation often leads to inconsistent outcomes, so prioritize steady daily practice, keep detailed notes on your results, and refine your approach based on observed evidence.`
          },
          {
            question: `How should progress and overall results be evaluated?`,
            answer: `Evaluate your ongoing progress by tracking steady, incremental improvements in your daily routine and verifiable outcomes. Keeping a brief written log of your observations helps you understand what methods work best in your specific environment, enabling continuous, data-driven optimization over extended periods.`
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
    if (isHerbDefault) {
      const simple = fs.readFileSync(path.join(FIXTURES_DIR, 'mockSimple.md'), 'utf-8');
      return { text: simple, usage: { inputTokens: 120, outputTokens: 95 } };
    }

    if (isHydroponic) {
      const simpleHydro = `# An Introduction to Sustainable Indoor Hydroponic Gardening

Indoor hydroponic gardening is a popular method for urban homeowners to grow plants inside without soil. It uses water and mineral nutrients instead of garden dirt.

There are several things to consider when starting. You need a container for water, some grow lights if you do not have sunlight, and nutrient fertilizer. Many people grow lettuce and herbs because they are easy to manage.

In summary, indoor hydroponic gardening is a good way to have fresh greens at home, but it requires regular watering and care to get good results.`;

      return {
        text: simpleHydro,
        usage: { inputTokens: 120, outputTokens: 95 }
      };
    }

    if (isDatabase) {
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
