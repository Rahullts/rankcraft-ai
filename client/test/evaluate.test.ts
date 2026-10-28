import { describe, it, expect } from 'vitest';
import { evaluate } from '../src/lib/evaluate';

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
        answer: 'Basil, mint, and chives are the easiest varieties for indoor growers. They adapt well to windowsill light conditions, tolerate occasional harvesting mistakes, and provide rapid growth throughout the entire growing season.'
      },
      {
        question: 'How much light do indoor herbs need?',
        answer: 'Most culinary herbs need at least six hours of direct sunlight daily to thrive. If natural window light is limited during winter months, a standard full-spectrum LED grow light provides adequate supplemental energy.'
      },
      {
        question: 'Can I use regular garden soil?',
        answer: 'Never use regular garden topsoil for indoor containers because it compacts easily and drains poorly. Instead, choose a well-aerated potting mix containing perlite, vermiculite, and peat moss for optimal root aeration.'
      },
      {
        question: 'How often should I water my indoor herb garden?',
        answer: 'Water your indoor herb garden only when the top inch of soil feels dry to the touch. Pour water evenly until it drains through the bottom holes, then discard excess liquid from the saucer.'
      },
      {
        question: 'When can I harvest the herbs?',
        answer: 'Begin harvesting once your plants have developed several strong sets of true leaves. Never remove more than one-third of total foliage at once so the plant retains sufficient energy for ongoing development.'
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
    // Package scope applicable max automated points: 90
    expect(result.applicableAutomatedMax).toBe(90);
    // Automated points should be high (at least 80)
    expect(result.automatedPoints).toBeGreaterThanOrEqual(80);
    // Manual points: 4 + 5 = 9
    expect(result.manualPoints).toBe(9);
    // Total points
    expect(result.totalPoints).toBe(result.automatedPoints + 9);
    // Outline fidelity checked
    expect(result.outlineFidelity).toBeDefined();
    expect(result.outlineFidelity!.percentage).toBeGreaterThanOrEqual(80);
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
    // In article scope, R1, R2, R3, R7 are N/A (max 50 automated points)
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
    // 90 - 5 (R8) = 85 applicable automated max
    expect(result.applicableAutomatedMax).toBe(85);
  });

  it('awards full points for Rule R2 when meta description is within 155-160 chars', () => {
    const result = evaluate('package', sampleData);
    const r2 = result.rules.find((r) => r.id === 'R2');
    expect(r2?.status).toBe('pass');
    expect(r2?.points).toBe(10);
  });
});
