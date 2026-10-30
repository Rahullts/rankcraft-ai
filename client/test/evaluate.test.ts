import { describe, it, expect } from 'vitest';
import { evaluate } from '../src/lib/evaluate';
import { parseMarkdownHeadings } from '../src/lib/text';

describe('Evaluation Engine (Section E - Rules R1-R10)', () => {
  const sampleData = {
    input: {
      primaryKeyword: 'indoor herb garden',
      wordCount: 300,
      language: 'English',
      intent: 'informational'
    },
    strategy: {
      titles: [
        { text: 'Indoor Herb Garden: Complete Beginner Guide', angle: 'Comprehensive' },
        { text: 'How to Start an Indoor Herb Garden at Home', angle: 'How-to' },
        { text: '5 Tips for an Indoor Herb Garden on a Budget', angle: 'Listicle' },
        { text: 'The Ultimate Indoor Herb Garden Setup', angle: 'Setup' },
        { text: 'Indoor Herb Garden Mistakes and Solutions', angle: 'Troubleshooting' }
      ],
      metaDescription: 'Learn how to build an indoor herb garden at home with simple tips on lighting, watering, pots, and soil. Grow vibrant fresh herbs all year round starting now!', // 158 chars
      keywords: {
        primary: 'indoor herb garden',
        secondary: ['kitchen herbs', 'herb lighting', 'indoor potting soil', 'herbs on windowsill', 'culinary herbs at home'],
        longTail: [
          'how to start an indoor herb garden',
          'best indoor herb garden for beginners',
          'easy herbs to grow indoors in kitchen',
          'indoor herb garden lighting requirements',
          'watering schedule for indoor herb pots'
        ]
      }
    },
    outline: {
      sections: [
        { h2: 'Why Start an Indoor Herb Garden?', h3: ['Year-round Fresh Flavors', 'Cost Savings and Convenience'] },
        { h2: 'Essential Supplies for Your Herb Garden', h3: ['Pots and Drainage Needs', 'Grow Lights for Indoor Spaces'] },
        { h2: 'Caring for Your Indoor Herb Garden', h3: ['Watering Routine Guidelines', 'Harvesting Tips for Bushy Growth'] },
        { h2: 'Troubleshooting Common Herb Problems', h3: ['Yellowing Leaves and Moisture', 'Pest Prevention and Control'] }
      ]
    },
    articleMarkdown: `# How to Start an Indoor Herb Garden

An indoor herb garden brings vibrant flavor directly into your kitchen. Whether you have a sunny windowsill or use grow lights, growing your own fresh herbs is rewarding and practical for every home cook.

## Why Start an Indoor Herb Garden?

Starting an indoor herb garden offers multiple daily benefits for any cook.

### Year-round Fresh Flavors
Fresh basil and mint elevate simple dishes without supermarket plastic packaging. Having access to vibrant herbs transforms everyday culinary experiences at home.

### Cost Savings and Convenience
Store-bought cut herbs spoil quickly, whereas living plants keep producing. You save money while enjoying better taste whenever you prepare a meal.

## Essential Supplies for Your Herb Garden

You only need a few basic tools to build a thriving indoor herb garden setup. High quality potting mix and appropriate containers form the foundation of success.

### Pots and Drainage Needs
Ensure pots have holes so roots do not sit in standing water. Terracotta or plastic pots with saucers protect your surfaces from excess moisture.

### Grow Lights for Indoor Spaces
Herbs need at least six hours of bright light daily. Small LED panels provide the right spectrum without generating excessive heat for delicate foliage.

## Caring for Your Indoor Herb Garden

Consistency is key to a flourishing indoor herb garden. Careful observation helps you identify moisture changes before plants experience stress.

### Watering Routine Guidelines
Check the top inch of soil before watering. Overwatering causes root rot, so allow soil surfaces to dry slightly between watering sessions.

### Harvesting Tips for Bushy Growth
Pinch leaves from the top to encourage bushy side growth. Regular trimming prevents premature flowering and keeps plants productive.

## Troubleshooting Common Herb Problems

Even experienced gardeners encounter occasional challenges with indoor plants.

### Yellowing Leaves and Moisture
Yellow leaves often indicate excessive moisture or insufficient drainage. Reduce watering frequency and verify that pot holes remain clear.

### Pest Prevention and Control
Wipe foliage with gentle soapy water if small gnats appear. Proper air circulation prevents mildew and insect infestations naturally.

In summary, maintaining an indoor herb garden provides culinary joy and fresh aroma all year long.`,
    faqs: [
      {
        question: 'What is the best herb for indoors?',
        answer: 'Basil, mint, chives and parsley are the easiest varieties for indoor beginner growers. They adapt exceptionally well to windowsill light conditions, tolerate occasional pruning mistakes, and provide rapid green growth throughout the entire growing season without requiring complex plant care routines.'
      },
      {
        question: 'How much light do indoor herbs need?',
        answer: 'Most culinary herbs need at least six hours of direct sunlight daily to thrive indoors. If natural window light is limited during darker winter months, a standard full-spectrum LED grow light positioned six inches above the foliage provides adequate supplemental energy for steady, healthy growth.'
      },
      {
        question: 'Can I use regular garden soil?',
        answer: 'Never use regular outdoor garden topsoil for indoor containers because it compacts easily and drains poorly. Instead, choose a well-aerated potting mix containing perlite, vermiculite, and peat moss to ensure optimal root aeration and prevent moisture-related root rot in small residential pots.'
      },
      {
        question: 'How often should I water my indoor herb garden?',
        answer: 'Water your indoor herb garden only when the top inch of soil feels dry to the touch. Pour water evenly across the surface until it drains through the bottom holes, then discard excess pooled liquid from the saucer to prevent dangerous root rot from developing.'
      },
      {
        question: 'When can I harvest the herbs?',
        answer: 'Begin harvesting once your plants have developed several strong sets of true leaves on their main stems. Never remove more than one-third of total foliage during a single harvesting session so the plant retains sufficient energy reserves for ongoing healthy growth and leaf production.'
      }
    ],
    manualReview: {
      intentMatch: 4,
      toneAudienceFit: 5
    }
  };

  it('evaluates complete package scope scoring up to 100 points', () => {
    const result = evaluate('package', sampleData);

    expect(result.rules.length).toBe(10);
    expect(result.applicableAutomatedMax).toBe(90);
    expect(result.automatedPoints).toBeGreaterThanOrEqual(80);
    expect(result.manualPoints).toBe(9);
    expect(result.totalPoints).toBe(result.automatedPoints + 9);
    expect(result.isHumanReviewPending).toBe(false);
    expect(result.outlineFidelity).toBeDefined();
    expect(result.outlineFidelity!.percentage).toBe(100);
  });

  it('evaluates article scope with package-only rules marked as N/A', () => {
    const articleOnlyData = {
      input: {
        primaryKeyword: 'indoor herb garden',
        wordCount: 300,
        language: 'English'
      },
      articleMarkdown: sampleData.articleMarkdown,
      manualReview: {
        intentMatch: 5,
        toneAudienceFit: 4
      }
    };

    const result = evaluate('article', articleOnlyData);
    expect(result.rules.length).toBe(10);
    const r1 = result.rules.find((r) => r.id === 'R1');
    const r2 = result.rules.find((r) => r.id === 'R2');
    const r3 = result.rules.find((r) => r.id === 'R3');
    const r7 = result.rules.find((r) => r.id === 'R7');

    expect(r1?.status).toBe('na');
    expect(r2?.status).toBe('na');
    expect(r3?.status).toBe('na');
    expect(r7?.status).toBe('na');
    expect(result.applicableAutomatedMax).toBe(50);
  });

  it('marks Rule R8 as N/A for non-English languages', () => {
    const nonEnglishData = {
      ...sampleData,
      input: {
        ...sampleData.input,
        language: 'Spanish'
      }
    };

    const result = evaluate('package', nonEnglishData);
    const r8 = result.rules.find((r) => r.id === 'R8');
    expect(r8?.status).toBe('na');
    expect(r8?.points).toBe(0);
    expect(result.applicableAutomatedMax).toBe(85);
  });

  it('awards full points for Rule R2 when meta description is within 155-160 chars', () => {
    const result = evaluate('package', sampleData);
    const r2 = result.rules.find((r) => r.id === 'R2');
    expect(r2?.status).toBe('pass');
    expect(r2?.points).toBe(10);
  });

  it('does NOT award passing status for Rule R2 when description is outside 155-160 chars', () => {
    const shortData = {
      ...sampleData,
      strategy: {
        ...sampleData.strategy,
        metaDescription: 'Learn how to start an indoor herb garden at home quickly.' // 57 chars
      }
    };
    const result = evaluate('package', shortData);
    const r2 = result.rules.find((r) => r.id === 'R2');
    expect(r2?.status).not.toBe('pass');
    expect(r2?.points).toBeLessThan(10);
  });

  it('does NOT silently mark missing required package outputs as N/A', () => {
    const missingOutputsData = {
      input: sampleData.input,
      articleMarkdown: sampleData.articleMarkdown
      // strategy and faqs omitted in package scope
    };

    const result = evaluate('package', missingOutputsData as any);
    const r1 = result.rules.find((r) => r.id === 'R1');
    const r2 = result.rules.find((r) => r.id === 'R2');
    const r3 = result.rules.find((r) => r.id === 'R3');
    const r7 = result.rules.find((r) => r.id === 'R7');

    expect(r1?.status).toBe('fail');
    expect(r1?.maxPoints).toBe(10);
    expect(r2?.status).toBe('fail');
    expect(r2?.maxPoints).toBe(10);
    expect(r3?.status).toBe('fail');
    expect(r3?.maxPoints).toBe(10);
    expect(r7?.status).toBe('fail');
    expect(r7?.maxPoints).toBe(10);
    // Denominator remains 90, preventing artificial score inflation
    expect(result.applicableAutomatedMax).toBe(90);
  });

  it('properly validates heading structure in R4 and detects invalid level skips', () => {
    // Markdown jumping from H1 (#) directly to H3 (###) without H2 (##)
    const invalidJumpMarkdown = `# Main Title
### Skipped Level Subheading
Some text here.
## First H2
### Subsection One
Text here.
## Second H2
### Subsection Two
Text here.
## Third H2
Text here.
## Fourth H2
Text here.`;

    const audit = parseMarkdownHeadings(invalidJumpMarkdown);
    expect(audit.invalidJumps.length).toBeGreaterThan(0);
    expect(audit.invalidJumps[0].from).toBe(1);
    expect(audit.invalidJumps[0].to).toBe(3);

    const result = evaluate('package', {
      ...sampleData,
      articleMarkdown: invalidJumpMarkdown
    });
    const r4 = result.rules.find((r) => r.id === 'R4');
    expect(r4?.points).toBeLessThan(10);
  });

  it('evaluates Outline Fidelity with heading-aware matching rather than loose substring matching', () => {
    const dataWithParagraphMention = {
      ...sampleData,
      outline: {
        sections: [
          { h2: 'Unique H2 Section Title', h3: ['Sub Topic Alpha'] },
          { h2: 'Missing Heading From Draft', h3: ['Missing Sub Heading'] }
        ]
      },
      articleMarkdown: `# Main Article

## Unique H2 Section Title

### Sub Topic Alpha
Even though the text mentions Missing Heading From Draft in a paragraph, it is NOT an actual H2 heading in the markdown structure.

## Another Different Heading

### Another Sub Topic
Content continues here.

## Third Heading

## Fourth Heading
Conclusion.`
    };

    const result = evaluate('package', dataWithParagraphMention);
    expect(result.outlineFidelity).toBeDefined();
    // Only 'Unique H2 Section Title' and 'Sub Topic Alpha' are matched (2 out of 4)
    expect(result.outlineFidelity!.matched).toBe(2);
    expect(result.outlineFidelity!.total).toBe(4);
    expect(result.outlineFidelity!.percentage).toBe(50);
    expect(result.outlineFidelity!.missingHeadings).toContain('H2: Missing Heading From Draft');
    expect(result.outlineFidelity!.missingHeadings).toContain('H3: Missing Sub Heading');
  });

  it('marks Rule R10 as pending when manual review has not been submitted', () => {
    const pendingData = {
      ...sampleData,
      manualReview: undefined
    };

    const result = evaluate('package', pendingData);
    const r10 = result.rules.find((r) => r.id === 'R10');
    expect(r10?.status).toBe('pending');
    expect(r10?.points).toBe(0);
    expect(result.isHumanReviewPending).toBe(true);
    expect(result.manualPoints).toBe(0);
    expect(result.totalPoints).toBe(result.automatedPoints);
  });

  it('evaluates Rule R7 based on canonical 40-70 words per FAQ answer', () => {
    const shortFaqsData = {
      ...sampleData,
      faqs: [
        { question: 'What is herb gardening?', answer: 'It is growing herbs at home on windowsills.' }, // 8 words (too short)
        { question: 'How much water is needed?', answer: 'Water whenever the soil feels dry to touch.' }, // 8 words
        { question: 'Which herbs are easiest?', answer: 'Mint and basil are the easiest varieties.' }, // 7 words
        { question: 'Is direct light necessary?', answer: 'Yes bright sunlight is always required.' }, // 6 words
        { question: 'When can harvesting begin?', answer: 'Harvest once leaves are mature.' } // 5 words
      ]
    };

    const result = evaluate('package', shortFaqsData);
    const r7 = result.rules.find((r) => r.id === 'R7');
    expect(r7?.status).not.toBe('pass');
    expect(r7?.points).toBeLessThan(10);
  });

  it('scans for unsupported claims in R9 and flags unverified patterns', () => {
    const claimMarkdown = `# High Yield Indoor Gardening

Our indoor herb garden setup offers a 100% guaranteed harvest. Studies show that 95% of home cooks prefer fresh herbs. We have over 2 million customers worldwide and are ranked #1 in the entire nation.`;

    const result = evaluate('package', {
      ...sampleData,
      articleMarkdown: claimMarkdown
    });
    const r9 = result.rules.find((r) => r.id === 'R9');
    expect(r9?.points).toBeLessThan(10);
    expect(r9?.evidence).toContain('warning flag(s)');
  });

  it('R8 Readability: isolates clean prose and prevents long headings, lists, and code blocks from inflating sentence length', () => {
    const markdownWithHeavyFormatting = `# Comprehensive Guide to Modern High Efficiency Culinary Herb Cultivation for Urban Apartment Dwellers
## First Major Strategic Consideration Regarding Proper Spectrum Selection and Indoor Lighting Hardware
Here is the first clean narrative sentence explaining indoor lighting methods. Sunlight is essential for Mediterranean herbs to produce rich aromatic oils. Position your containers near south facing windows to ensure maximum daily illumination.
\`\`\`typescript
const lightingConfig = { spectrum: 'full', lumens: 5000, durationHours: 14 };
function checkSensor() { return true; }
\`\`\`
## Detailed Soil Composition and Moisture Retention Architecture for Small Pots
- Premium indoor potting mix with coarse horticultural perlite
- Organic worm castings for gentle sustained microbial nutrient delivery
- Sphagnum peat moss for balanced root moisture retention capacity
- Horticultural sand to enhance drainage speed across root balls
- Coarse perlite particles to prevent root suffocation in glazed containers
- Crushed pumice to maintain microscopic aeration channels between watering sessions
1. Measure moisture content using a calibrated digital probe.
2. Allow container soil to dry slightly before irrigating again.
Proper drainage prevents moisture stagnation and root rot in small residential pots. Consistent observation helps beginner gardeners keep delicate herbs healthy throughout winter.
## Troubleshooting and Seasonal Temperature Regulation
Herb pots require protection against freezing windowpane drafts.`;

    const result = evaluate('article', {
      input: {
        primaryKeyword: 'culinary herbs',
        wordCount: 300,
        language: 'English'
      },
      articleMarkdown: markdownWithHeavyFormatting
    });

    const r8 = result.rules.find((r) => r.id === 'R8');
    expect(r8?.points).toBe(5);
    expect(r8?.status).toBe('pass');
  });

  it('R10 Completion-State: requires BOTH intentMatch and toneAudienceFit to be numbers', () => {
    // Only intentMatch defined
    const onlyIntent = evaluate('package', {
      ...sampleData,
      manualReview: { intentMatch: 4, toneAudienceFit: undefined }
    });
    const r10OnlyIntent = onlyIntent.rules.find((r) => r.id === 'R10');
    expect(r10OnlyIntent?.status).toBe('pending');
    expect(r10OnlyIntent?.points).toBe(0);
    expect(onlyIntent.isHumanReviewPending).toBe(true);

    // Only toneAudienceFit defined
    const onlyTone = evaluate('package', {
      ...sampleData,
      manualReview: { intentMatch: undefined, toneAudienceFit: 5 }
    });
    const r10OnlyTone = onlyTone.rules.find((r) => r.id === 'R10');
    expect(r10OnlyTone?.status).toBe('pending');
    expect(r10OnlyTone?.points).toBe(0);
    expect(onlyTone.isHumanReviewPending).toBe(true);

    // Both defined
    const bothDefined = evaluate('package', {
      ...sampleData,
      manualReview: { intentMatch: 4, toneAudienceFit: 5 }
    });
    const r10Both = bothDefined.rules.find((r) => r.id === 'R10');
    expect(r10Both?.status).toBe('pass');
    expect(r10Both?.points).toBe(9);
    expect(bothDefined.isHumanReviewPending).toBe(false);
  });

  it('Outline Fidelity Precision: rejects substring partial matches', () => {
    const dataWithPartialMatches = {
      ...sampleData,
      outline: {
        sections: [
          { h2: 'Essential Soil Requirements for Herbs', h3: ['Detailed Drainage Mechanics'] }
        ]
      },
      articleMarkdown: `# Main Guide
## Essential Soil
### Detailed Drainage
Some text here.
## Another Section
### Sub Topic
More text.`
    };

    const result = evaluate('package', dataWithPartialMatches);
    expect(result.outlineFidelity).toBeDefined();
    expect(result.outlineFidelity!.matched).toBe(0);
    expect(result.outlineFidelity!.total).toBe(2);
    expect(result.outlineFidelity!.missingHeadings).toContain('H2: Essential Soil Requirements for Herbs');
    expect(result.outlineFidelity!.missingHeadings).toContain('H3: Detailed Drainage Mechanics');
  });

  it('Outline Fidelity Precision: enforces 1-to-1 matching and avoids duplicate matching', () => {
    const dataWithDuplicates = {
      ...sampleData,
      outline: {
        sections: [
          { h2: 'General Overview', h3: [] },
          { h2: 'General Overview', h3: [] }
        ]
      },
      articleMarkdown: `# Main Guide
## General Overview
Article only contains a single H2 named General Overview.
## Another Section
More text.`
    };

    const result = evaluate('package', dataWithDuplicates);
    expect(result.outlineFidelity).toBeDefined();
    expect(result.outlineFidelity!.matched).toBe(1);
    expect(result.outlineFidelity!.total).toBe(2);
    expect(result.outlineFidelity!.percentage).toBe(50);
    expect(result.outlineFidelity!.matchedHeadings).toEqual(['H2: General Overview']);
    expect(result.outlineFidelity!.missingHeadings).toEqual(['H2: General Overview']);
  });

  it('Outline Fidelity Precision: enforces strict H2-to-H2 and H3-to-H3 level consistency', () => {
    const dataWithSwappedLevels = {
      ...sampleData,
      outline: {
        sections: [
          { h2: 'Lighting Requirements', h3: ['Pots and Drainage'] }
        ]
      },
      articleMarkdown: `# Main Guide
## Pots and Drainage
Some text.
### Lighting Requirements
Some text.`
    };

    const result = evaluate('package', dataWithSwappedLevels);
    expect(result.outlineFidelity).toBeDefined();
    expect(result.outlineFidelity!.matched).toBe(0);
    expect(result.outlineFidelity!.missingHeadings).toContain('H2: Lighting Requirements');
    expect(result.outlineFidelity!.missingHeadings).toContain('H3: Pots and Drainage');
  });

  it('Outline Fidelity Precision: tolerates harmless punctuation, casing, and whitespace differences', () => {
    const dataWithHarmlessDiffs = {
      ...sampleData,
      outline: {
        sections: [
          { h2: '1. Essential Soil Requirements:', h3: ['Pots & Drainage Needs?'] }
        ]
      },
      articleMarkdown: `# Main Guide
## 1 Essential Soil Requirements
### Pots   Drainage Needs
Some text.`
    };

    const result = evaluate('package', dataWithHarmlessDiffs);
    expect(result.outlineFidelity).toBeDefined();
    expect(result.outlineFidelity!.matched).toBe(2);
    expect(result.outlineFidelity!.total).toBe(2);
    expect(result.outlineFidelity!.percentage).toBe(100);
  });
});
