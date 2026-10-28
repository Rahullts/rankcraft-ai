import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { LlmProvider, LlmRequest, LlmResult } from './types.js';
import { generateNaturalMetaDescription } from '../lib/metaGenerator.js';

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
      if (isHerbDefault) {
        const content = fs.readFileSync(path.join(FIXTURES_DIR, 'mockOutline.json'), 'utf-8');
        return { text: content, usage: { inputTokens: 680, outputTokens: 310 } };
      }

      if (isHydroponic) {
        const hydroOutline = {
          intro: "Hook urban homeowners with the ease of soil-less growing, introduce indoor hydroponic gardening, and preview system setup steps.",
          sections: [
            {
              h2: "Choosing the Right Hydroponic System for Small Spaces",
              h3: [
                "Deep water culture vs nutrient film technique",
                "Compact vertical towers for apartment balconies"
              ],
              purpose: "Help urban beginners select a compact, leak-proof system suitable for indoor apartments.",
              targetWords: 200
            },
            {
              h2: "Lighting and Environmental Controls for Indoor Greens",
              h3: [
                "Selecting full-spectrum LED grow lights",
                "Managing room airflow and temperature"
              ],
              purpose: "Guide growers in providing adequate light without excessive heat buildup.",
              targetWords: 180
            },
            {
              h2: "Nutrient Solutions and pH Monitoring Essentials",
              h3: [
                "Mixing macro and micronutrient concentrates",
                "Maintaining balanced water pH between 5.5 and 6.5"
              ],
              purpose: "Explain how to deliver balanced plant nutrition and prevent nutrient lockout.",
              targetWords: 180
            },
            {
              h2: "Routine Care and Indoor Hydroponic Gardening Tips",
              h3: [
                "Weekly reservoir maintenance and water changes",
                "Harvesting greens for continuous regrowth"
              ],
              purpose: "Provide practical daily and weekly checklists to ensure healthy, thriving crops.",
              targetWords: 180
            },
            {
              h2: "Conclusion: Start Your Indoor Hydroponic Gardening Journey",
              h3: [],
              purpose: "Summarise core steps and provide a clear first step for beginners.",
              targetWords: 60
            }
          ]
        };

        return {
          text: JSON.stringify(hydroOutline, null, 2),
          usage: { inputTokens: 680, outputTokens: 310 }
        };
      }

      if (isDatabase) {
        const dbOutline = {
          intro: "Hook backend engineers with the impact of query latency, introduce database performance, and outline optimization pillars.",
          sections: [
            {
              h2: "Identifying Query Bottlenecks and Execution Plans",
              h3: [
                "Analyzing slow query logs with explain analyze",
                "Index scan versus sequential table scan"
              ],
              purpose: "Show developers how to locate expensive queries and diagnose execution costs.",
              targetWords: 200
            },
            {
              h2: "Optimizing Indexes and Table Schemas for Speed",
              h3: [
                "Designing composite B-tree indexes",
                "Pruning redundant and unused indexes"
              ],
              purpose: "Explain how targeted indexing reduces disk I/O without hurting write throughput.",
              targetWords: 180
            },
            {
              h2: "Implementing Connection Pooling and In-Memory Caching",
              h3: [
                "Sizing connection pools with PgBouncer",
                "Offloading read queries to Redis cache layers"
              ],
              purpose: "Describe how caching and connection reuse protect database CPU under heavy traffic.",
              targetWords: 180
            },
            {
              h2: "Scaling and Monitoring Database Performance in Production",
              h3: [
                "Deploying read replicas for query distribution",
                "Setting alerts for storage IOPS and p99 latency"
              ],
              purpose: "Provide production scaling strategies and proactive observability practices.",
              targetWords: 180
            },
            {
              h2: "Conclusion: Maintain Fast Database Performance",
              h3: [],
              purpose: "Summarise the main takeaways and give one clear next action.",
              targetWords: 60
            }
          ]
        };

        return {
          text: JSON.stringify(dbOutline, null, 2),
          usage: { inputTokens: 680, outputTokens: 310 }
        };
      }

      if (isBattery) {
        const batteryOutline = {
          intro: "Introduce solid state battery technology and its role in transforming electric vehicle range, charging, and safety.",
          sections: [
            {
              h2: "Understanding Solid State Battery Chemistry and Design",
              h3: [
                "Solid ceramic versus liquid electrolytes",
                "Lithium metal anodes and energy density"
              ],
              purpose: "Explain the electrochemical differences that make solid state cells promising.",
              targetWords: 200
            },
            {
              h2: "Thermal Safety and Fast Charging Capabilities",
              h3: [
                "Eliminating flammable liquid solvents",
                "Managing dendritic growth during high-rate charging"
              ],
              purpose: "Cover safety improvements and charging advantages over conventional lithium-ion packs.",
              targetWords: 180
            },
            {
              h2: "Manufacturing Challenges and Cost Roadblocks",
              h3: [
                "Solid-electrolyte interface resistance",
                "Scaling roll-to-roll production lines"
              ],
              purpose: "Discuss real-world commercialization hurdles without hype.",
              targetWords: 180
            },
            {
              h2: "Conclusion: The Horizon for Solid State Battery Commercialization",
              h3: [],
              purpose: "Summarise the timeline and market outlook for solid state battery adoption.",
              targetWords: 160
            }
          ]
        };

        return {
          text: JSON.stringify(batteryOutline, null, 2),
          usage: { inputTokens: 680, outputTokens: 310 }
        };
      }

      // Adaptive Outline for any other topic
      const dynamicOutline = {
        intro: `Hook the reader with the value of ${topic}, introduce ${primaryKw} in the opening, and preview the practical roadmap.`,
        sections: [
          {
            h2: `Understanding the Core Principles of ${primaryKw}`,
            h3: [`Key terminology and essentials`, `Practical requirements for ${audience}`],
            purpose: `Explain foundational concepts clearly without confusing jargon.`,
            targetWords: 200
          },
          {
            h2: `Essential Equipment and Initial Setup for ${primaryKw}`,
            h3: [`Selecting appropriate tools`, `Step-by-step setup procedure`],
            purpose: `Provide practical advice for setting up properly from day one.`,
            targetWords: 180
          },
          {
            h2: `Daily Execution and Practical Tips for ${primaryKw}`,
            h3: [`Establishing a consistent routine`, `Troubleshooting common beginner mistakes`],
            purpose: `Explain routine maintenance and practical execution techniques.`,
            targetWords: 180
          },
          {
            h2: `Conclusion: Start Your ${primaryKw} Today`,
            h3: [],
            purpose: `Summarise main takeaways and provide one actionable next step.`,
            targetWords: 160
          }
        ]
      };

      return {
        text: JSON.stringify(dynamicOutline, null, 2),
        usage: { inputTokens: 680, outputTokens: 310 }
      };
    }

    // -------------------------------------------------------------------------
    // Stage 3: Article Draft
    // -------------------------------------------------------------------------
    if (promptText.includes('write the full article in Markdown')) {
      if (isHerbDefault) {
        const content = fs.readFileSync(path.join(FIXTURES_DIR, 'mockArticle.md'), 'utf-8');
        return { text: content, usage: { inputTokens: 1150, outputTokens: 780 } };
      }

      if (isHydroponic) {
        const hydroArticle = `# Indoor Hydroponic Gardening: A Guide for Beginners

Indoor hydroponic gardening is one of the most rewarding ways for urban homeowners to enjoy fresh, crisp vegetables without owning an outdoor yard. By cultivating plants in water enriched with essential mineral nutrients rather than garden soil, you can grow vibrant leafy greens and herbs directly inside your living room or kitchen.

Soil-less cultivation eliminates messy potting mix, weeds, and many common soil-borne garden pests. Whether you live in a compact city apartment or a suburban townhouse, adopting indoor hydroponic gardening lets you harvest fresh produce throughout every season with remarkable water and space efficiency.

## Choosing the Right Hydroponic System for Small Spaces

Selecting an appropriate growing method is the first step toward a thriving home garden. While commercial greenhouses use complex industrial arrangements, domestic setups require simple, clean, and reliable designs that fit neatly into tight residential spaces.

### Deep water culture vs nutrient film technique
Deep Water Culture (DWC) is the most forgiving method for beginners. In a DWC system, plant roots hang suspended through small net pots into an aerated reservoir of water and dissolved nutrients. An aquarium air pump connected to porous air stones supplies continuous oxygen directly to the root zone, preventing root suffocation and promoting rapid growth. Nutrient Film Technique (NFT), by contrast, recirculates a shallow stream of nutrient solution over roots through gently sloping channels, which suits larger crops but requires careful pump maintenance.

### Compact vertical towers for apartment balconies
When floor space is restricted, vertical hydroponic towers provide an ideal solution. Vertical towers stack growing ports in a cylindrical column, pumping nutrient solution to the top and letting it cascade downward over the roots. This configuration uses vertical height rather than horizontal floor space, enabling homeowners to grow twenty or more plants in a two-foot square corner.

## Lighting and Environmental Controls for Indoor Greens

Plants grown indoors cannot rely entirely on natural sunlight filtered through residential window glass. Providing proper supplemental light and stable room ventilation ensures vigorous photosynthesis and crisp foliage.

### Selecting full-spectrum LED grow lights
Modern full-spectrum LED fixtures replicate natural sunlight efficiently without emitting excessive heat that could scorch delicate leaves. Look for LED panels that combine blue wavelengths for leafy vegetative growth with balanced red wavelengths for sturdy stem development. Running your grow lights on an inexpensive digital timer for fourteen to sixteen hours each day gives plants the consistent energy they need to thrive.

### Managing room airflow and temperature
Stagnant, humid indoor air invites mold and fungal spores. Position a small oscillating fan near your growing system to maintain gentle air circulation across the foliage. Aim to keep indoor temperatures between twenty and twenty-five degrees Celsius, which promotes optimal transpiration and nutrient uptake.

## Nutrient Solutions and pH Monitoring Essentials

Because hydroponic plants do not have soil to act as a nutritional buffer, you must supply every essential mineral directly through the water reservoir.

### Mixing macro and micronutrient concentrates
Hydroponic fertilizers come as concentrated liquid or dry mineral salts formulated specifically for soil-less growing. These blends supply nitrogen, phosphorus, and potassium, alongside secondary minerals like calcium and magnesium. Always follow the manufacturer mixing instructions carefully, and never use conventional outdoor garden fertilizers, which lack crucial trace elements and can foul water pumps.

### Maintaining balanced water pH between 5.5 and 6.5
Water pH controls how readily plant roots absorb dissolved minerals. In hydroponics, the target pH range is between 5.5 and 6.5. If the solution becomes too acidic or too alkaline, plants experience nutrient lockout and display yellowing foliage even when nutrients are present. Check your reservoir every few days using an inexpensive digital pH pen or indicator drops, adjusting with small amounts of dilute pH-Up or pH-Down solution as needed.

## Routine Care and Indoor Hydroponic Gardening Tips

A small, consistent maintenance routine keeps your indoor hydroponic garden healthy and productive week after week without demanding hours of intensive labor.

### Weekly reservoir maintenance and water changes
Plants drink water daily while absorbing nutrients at varying rates. Top off your reservoir mid-week with clean filtered water to compensate for natural evaporation. Every two to three weeks, drain the reservoir completely, wipe down the container, and refill it with a freshly mixed nutrient solution to prevent mineral salt accumulation.

### Harvesting greens for continuous regrowth
Use the cut-and-come-again harvesting technique for leafy greens such as lettuce, kale, and spinach. Gently clip only the outer mature leaves with clean kitchen shears, leaving the inner growth crown intact. The plant will continue producing new foliage from the center, providing a continuous harvest for months from a single seedling.

Key daily and weekly practices include:
- Check water reservoir levels daily and top off with clean water.
- Inspect leaf undersides weekly for signs of common pests like aphids.
- Test pH twice per week to keep readings within the optimal range.
- Rinse aeration stones monthly to maintain strong oxygen bubble delivery.

## Conclusion: Start Your Indoor Hydroponic Gardening Journey

Embarking on indoor hydroponic gardening gives you total control over the freshness and quality of the food on your table. By choosing a straightforward Deep Water Culture reservoir or compact vertical tower, pairing it with full-spectrum LED lights, and maintaining clean nutrient water, you can cultivate vibrant greens all year long. Pick your favorite herb or leafy salad green today, set up your reservoir, and enjoy the satisfaction of growing fresh produce right at home.`;

        return {
          text: hydroArticle,
          usage: { inputTokens: 1150, outputTokens: 820 }
        };
      }

      if (isDatabase) {
        const dbArticle = `# Database Performance: Complete Optimization Guide

Maintaining high database performance is critical for any engineering team operating cloud applications at scale. When user concurrency grows, inefficient SQL queries and unoptimized storage architectures quickly turn into painful latency bottlenecks that degrade user experience.

Optimizing database performance does not require immediate, costly infrastructure upgrades. By methodically diagnosing slow query patterns, designing targeted indexes, and adding caching layers, you can dramatically improve response times and maximize throughput on your existing cloud hardware.

## Identifying Query Bottlenecks and Execution Plans

Effective performance tuning begins with accurate measurement rather than guesswork. Identifying which queries consume the most CPU and disk input-output allows you to focus your efforts where they make the largest impact.

### Analyzing slow query logs with explain analyze
Enable slow query logging in your database management system to record statements exceeding a defined execution threshold. Once you identify high-latency queries, inspect them using execution plan commands such as EXPLAIN ANALYZE. The execution plan details the exact path the query optimizer took, highlighting high-cost sequential table scans and sorting operations that indicate missing indexes.

### Index scan versus sequential table scan
A sequential scan reads every single row in a table from disk into memory to evaluate filter conditions. While sequential scans are acceptable on tiny tables, they devastate performance on tables containing millions of rows. In contrast, an index scan traverses a compact balanced tree structure, allowing the engine to pinpoint matching records in milliseconds.

## Optimizing Indexes and Table Schemas for Speed

Indexes are among the most powerful tools for accelerating query execution, but they must be deployed thoughtfully to avoid unintended side effects.

### Designing composite B-tree indexes
When queries filter by multiple columns in a WHERE clause or join across foreign keys, single-column indexes are often inadequate. Designing composite B-tree indexes that match the exact column order of your frequent query filters allows the database engine to satisfy queries with minimal row lookups. Place high-cardinality equality columns first in composite index definitions to maximize selectivity.

### Pruning redundant and unused indexes
Every index created on a table introduces computational overhead during INSERT, UPDATE, and DELETE operations. The database engine must synchronously update every associated index structure whenever data changes. Query your database system catalogs to identify unused indexes and safely remove them to restore write throughput and reclaim valuable storage space.

## Implementing Connection Pooling and In-Memory Caching

High-traffic applications frequently exhaust database resources through connection spikes and repetitive read requests that can be handled more efficiently outside the primary database engine.

### Sizing connection pools with PgBouncer
Opening a new database connection consumes significant server memory and requires an expensive transport layer handshake. Utilizing a lightweight connection pooler like PgBouncer allows hundreds of application instances to share a modest pool of persistent database connections, preventing connection exhaustion during traffic surges.

### Offloading read queries to Redis cache layers
Repetitive read operations on frequently accessed data place unnecessary load on your primary storage engine. By introducing an in-memory key-value store such as Redis, you can serve high-frequency read queries in sub-millisecond timeframes. Cache common catalog items, user session profiles, and configuration settings, invalidating entries gracefully when underlying data changes.

## Scaling and Monitoring Database Performance in Production

Sustainable optimization requires ongoing observability and proactive scaling strategies as your data volume expands.

### Deploying read replicas for query distribution
Analytical reports and read-heavy dashboard queries can overwhelm a primary database instance dedicated to transactional writes. Setting up asynchronous read replicas allows you to distribute read traffic across secondary nodes, safeguarding write latency on the primary database instance during business hours.

### Setting alerts for storage IOPS and p99 latency
Do not wait for customer complaints to discover latency degradation. Configure real-time alerts around key operational indicators:
- Monitor storage IOPS utilization to prevent disk throttling.
- Track 95th and 99th percentile query latency to catch slow outliers.
- Alert on connection pool saturation before requests begin queuing.
- Track CPU and memory utilization thresholds proactively.

## Conclusion: Maintain Fast Database Performance

Achieving fast, reliable database performance is an ongoing operational practice rather than a one-time project. By continuously inspecting slow query execution plans, refining your index strategy, and protecting database connections with pooling and caching, you build a resilient data tier that scales smoothly. Select your slowest endpoint today, analyze its query plan, and take the first step toward lasting performance improvements.`;

        return {
          text: dbArticle,
          usage: { inputTokens: 1150, outputTokens: 810 }
        };
      }

      // Adaptive Natural Article for any other topic
      const dynamicArticle = `# ${primaryKw}: Essential Guide for Beginners

Developing a solid understanding of ${primaryKw} is one of the most effective ways for ${audience.toLowerCase()} to achieve sustainable results in ${topic}. By focusing on proven techniques and establishing a reliable routine, you can build confidence and see tangible improvements.

Starting with a clear foundation is the secret to long-term success. Rather than attempting advanced tactics immediately, build your routine on consistent daily habits. When you integrate ${primaryKw} into your everyday schedule, making continuous progress becomes natural and rewarding.

## Understanding the Core Principles of ${primaryKw}

Clear principles form the bedrock of any successful initiative. For beginners and experienced practitioners alike, understanding why specific steps matter allows you to adapt to changing requirements smoothly.

### Key terminology and essentials
Begin by establishing clear definitions and standard practices. When you understand the fundamental terminology, evaluating tools and following tutorials becomes much simpler and more enjoyable.

### Practical requirements for ${audience}
Tailor your approach to your specific context. Focus on practical tools that solve immediate challenges rather than overly complex setups that introduce unnecessary confusion.

## Essential Equipment and Initial Setup for ${primaryKw}

Having the right equipment simplifies execution. High quality tools and thoughtful configurations protect your time and prevent common bottlenecks.

### Selecting appropriate tools
Select tools that fit your space and experience level. Reliable equipment saves hours of troubleshooting and provides predictable results week after week.

### Step-by-step setup procedure
Before getting started, verify your preparation with a structured sequence:
- Review your space and equipment to confirm everything is ready.
- Set up your workspace cleanly to keep daily maintenance easy.
- Keep basic reference notes handy for quick troubleshooting.

## Daily Execution and Practical Tips for ${primaryKw}

Consistency matters far more than sporadic bursts of effort. Developing a predictable schedule helps you maintain steady momentum.

### Establishing a consistent routine
Follow a structured sequence for daily tasks. Check on your progress regularly, make minor adjustments promptly, and review your results with patience.

### Troubleshooting common beginner mistakes
Regular observation helps you catch minor issues early. Keep an eye on basic indicators and refine your approach based on observed outcomes rather than rushing into major changes.

## Conclusion: Start Your ${primaryKw} Today

Developing confidence in ${primaryKw} is an empowering step toward sustained success in ${topic}. By understanding foundational principles, adopting a practical setup, and maintaining consistent habits, you can achieve reliable, positive outcomes. Choose your primary goal today and take your first concrete action with ${primaryKw}.`;

      return {
        text: dynamicArticle,
        usage: { inputTokens: 1150, outputTokens: 780 }
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
              answer: "Most residential growers refresh their water reservoir every two to three weeks. In between full reservoir changes, top off evaporated water with fresh filtered water and check electrical conductivity to prevent nutrient salt accumulation around plant roots."
            },
            {
              question: "What is the ideal pH range for indoor hydroponic vegetables?",
              answer: "Most leafy greens and herbs prefer a slightly acidic pH range between 5.5 and 6.5. Maintaining this specific balance ensures plant roots absorb dissolved nitrogen, phosphorus, and trace minerals efficiently without causing nutrient lockout or stunted growth."
            },
            {
              question: "How much space is needed to start an indoor hydroponic garden?",
              answer: "You can start with as little space as a single countertop corner or a compact two-foot shelf. Vertical tower configurations and compact countertop reservoirs allow urban apartment dwellers to cultivate dozens of fresh plants simultaneously in tight residential footprints."
            }
          ]
        };

        return {
          text: JSON.stringify(hydroFaqs, null, 2),
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

      // Adaptive Natural FAQs for any other topic
      const dynamicFaqs = {
        faqs: [
          {
            question: `What is the most effective way to begin with ${primaryKw}?`,
            answer: `The best approach is to start with a simple, focused setup rather than trying to do everything at once. Master the fundamental techniques first, observe your initial results carefully, and expand your routine gradually as your confidence develops.`
          },
          {
            question: `What essential equipment is needed to get started?`,
            answer: `You only need a few basic tools suited to your immediate goals and workspace. Starting with reliable, straightforward equipment keeps your setup manageable, prevents early frustration, and allows you to learn the core principles effectively.`
          },
          {
            question: `How much time does routine maintenance require?`,
            answer: `Routine care typically takes only ten to fifteen minutes each day once your initial setup is in place. Consistent, brief daily check-ins are much more effective than sporadic, time-consuming overhauls and help prevent common beginner mistakes.`
          },
          {
            question: `What are the most common mistakes beginners make?`,
            answer: `The most frequent mistake is rushing into complex techniques before establishing consistent daily habits. Skipping basic preparation often leads to inconsistent outcomes, so focus on mastering the core steps before exploring advanced methods.`
          },
          {
            question: `How should progress and results be evaluated?`,
            answer: `Evaluate your progress by observing steady, incremental improvements in your daily routine and outcomes. Keeping a brief log of your observations helps you identify what works best in your specific environment over time.`
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
