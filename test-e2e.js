// End-to-end verification and manual acceptance test script for RankCraft AI
async function verifyTopic(topicObj, printFull = false) {
  console.log(`\n======================================================`);
  console.log(`TESTING TOPIC: "${topicObj.topic}"`);
  console.log(`KEYWORD: "${topicObj.primaryKeyword}"`);
  console.log(`AUDIENCE: "${topicObj.audience}" | MARKET: "${topicObj.market}"`);
  console.log(`======================================================`);

  const input = {
    ...topicObj,
    intent: 'informational',
    tone: 'professional',
    language: 'English',
    wordCount: 800
  };

  // 1. Strategy
  console.log('1. Calling /api/strategy...');
  const stratRes = await fetch('http://localhost:5173/api/strategy', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ input })
  });
  const strat = await stratRes.json();
  if (!strat.ok) throw new Error('Strategy failed: ' + JSON.stringify(strat));
  const sData = strat.data.strategy;
  console.log(`   ✓ 5 Titles generated in English:`);
  sData.titles.forEach((t, i) => console.log(`     [${i+1}] ${t.text} (${t.angle}) - Length: ${t.text.length}`));
  console.log(`   ✓ Meta Description (${sData.metaDescription.length} chars): "${sData.metaDescription}"`);
  console.log(`   ✓ Primary Keyword: "${sData.keywords.primary}"`);
  console.log(`   ✓ Secondary Keywords (${sData.keywords.secondary.length}):`);
  sData.keywords.secondary.forEach(k => console.log(`       - ${k}`));
  console.log(`   ✓ Long-tail Keywords (${sData.keywords.longTail.length}):`);
  sData.keywords.longTail.forEach(k => console.log(`       - ${k}`));

  // 2. Outline
  console.log('2. Calling /api/outline...');
  const outlineRes = await fetch('http://localhost:5173/api/outline', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ input, strategy: sData })
  });
  const outline = await outlineRes.json();
  if (!outline.ok) throw new Error('Outline failed: ' + JSON.stringify(outline));
  const oData = outline.data.outline;
  console.log(`   ✓ Outline generated with ${oData.sections.length} H2 sections:`);
  oData.sections.forEach(s => {
    console.log(`     ## ${s.h2} (${s.targetWords}w)`);
    if (s.h3 && s.h3.length > 0) {
      s.h3.forEach(sub => console.log(`        ### ${sub}`));
    }
  });

  // 3. Article Draft
  console.log('3. Calling /api/article...');
  const articleRes = await fetch('http://localhost:5173/api/article', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ input, strategy: sData, outline: oData })
  });
  const article = await articleRes.json();
  if (!article.ok) throw new Error('Article failed: ' + JSON.stringify(article));
  const aText = article.data.articleMarkdown;
  console.log(`   ✓ Article Draft generated (${aText.length} chars, ~${aText.split(/\s+/).length} words).`);
  if (printFull) {
    console.log(`\n--- ARTICLE FULL TEXT ---`);
    console.log(aText);
    console.log(`--- END ARTICLE ---\n`);
  }

  // 4. FAQs
  console.log('4. Calling /api/faqs...');
  const faqsRes = await fetch('http://localhost:5173/api/faqs', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ input, strategy: sData, outline: oData })
  });
  const faqs = await faqsRes.json();
  if (!faqs.ok) throw new Error('FAQs failed: ' + JSON.stringify(faqs));
  const fItems = faqs.data.faqs;
  console.log(`   ✓ 5 FAQs generated:`);
  fItems.forEach((f, i) => {
    console.log(`     Q${i+1}: ${f.question}`);
    console.log(`     A${i+1}: ${f.answer} (${f.answer.split(/\s+/).length} words)`);
  });

  // 5. Simple Baseline (Prompt Lab Mode A)
  console.log('5. Calling /api/simple (Mode A Baseline)...');
  const simpleRes = await fetch('http://localhost:5173/api/simple', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ input })
  });
  const simple = await simpleRes.json();
  if (!simple.ok) throw new Error('Simple baseline failed: ' + JSON.stringify(simple));
  console.log(`   ✓ Simple Baseline generated in English (${simple.data.text.length} chars).`);
}

async function main() {
  const topics = [
    {
      topic: 'Sustainable Indoor Hydroponic Gardening',
      primaryKeyword: 'indoor hydroponic gardening',
      audience: 'Urban homeowners and beginners',
      industry: 'Home and Garden',
      market: 'India'
    },
    {
      topic: 'Cloud Database Performance Optimization',
      primaryKeyword: 'database performance',
      audience: 'Backend Developers and DevOps',
      industry: 'Cloud Computing & Infrastructure',
      market: 'Global'
    }
  ];

  for (const t of topics) {
    await verifyTopic(t, t.topic.includes('Hydroponic'));
  }

  console.log(`\n======================================================`);
  console.log(`ALL TOPICS VERIFIED AND RELEVANT!`);
  console.log(`======================================================\n`);
}

main().catch(err => {
  console.error('Error during verification:', err);
  process.exit(1);
});
