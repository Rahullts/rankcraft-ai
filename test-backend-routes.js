// Direct test of all Express backend endpoints on port 8787 (Valid and Invalid Input handling)
const BASE_URL = 'http://localhost:8787';

async function run() {
  console.log('=== 1. Testing GET /api/health ===');
  const hRes = await fetch(`${BASE_URL}/api/health`);
  console.log('Status:', hRes.status);
  const hJson = await hRes.json();
  console.log('Body:', JSON.stringify(hJson));
  if (hRes.status !== 200 || !hJson.ok) throw new Error('Health check failed');

  console.log('\n=== 2. Testing GET /api/prompts ===');
  const pRes = await fetch(`${BASE_URL}/api/prompts`);
  console.log('Status:', pRes.status);
  const pJson = await pRes.json();
  console.log('Prompt stages available:', Object.keys(pJson.data?.stages || {}));
  console.log('Prompt templates count:', (pJson.data?.templates || []).length);
  if (pRes.status !== 200 || !pJson.ok) throw new Error('Prompts check failed');

  const testInput = {
    topic: 'Sustainable Indoor Hydroponic Gardening',
    primaryKeyword: 'indoor hydroponic gardening',
    audience: 'Urban homeowners and beginners',
    industry: 'Home and Garden',
    market: 'India',
    intent: 'informational',
    tone: 'professional',
    language: 'English',
    wordCount: 800
  };

  console.log('\n=== 3. Testing POST /api/strategy ===');
  const sRes = await fetch(`${BASE_URL}/api/strategy`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ input: testInput })
  });
  console.log('Status:', sRes.status);
  const sJson = await sRes.json();
  if (sRes.status !== 200 || !sJson.ok) {
    console.error('Strategy Error:', sJson);
    throw new Error('Strategy failed');
  }
  const strategy = sJson.data.strategy;
  console.log(`Success! Titles: ${strategy.titles.length}, Meta: "${strategy.metaDescription}" (${strategy.metaDescription.length} chars)`);

  console.log('\n=== 4. Testing POST /api/outline ===');
  const oRes = await fetch(`${BASE_URL}/api/outline`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ input: testInput, strategy })
  });
  console.log('Status:', oRes.status);
  const oJson = await oRes.json();
  if (oRes.status !== 200 || !oJson.ok) {
    console.error('Outline Error:', oJson);
    throw new Error('Outline failed');
  }
  const outline = oJson.data.outline;
  console.log(`Success! Outline sections: ${outline.sections.length}`);

  console.log('\n=== 5. Testing POST /api/article ===');
  const aRes = await fetch(`${BASE_URL}/api/article`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ input: testInput, strategy, outline })
  });
  console.log('Status:', aRes.status);
  const aJson = await aRes.json();
  if (aRes.status !== 200 || !aJson.ok) {
    console.error('Article Error:', aJson);
    throw new Error('Article failed');
  }
  console.log(`Success! Article length: ${aJson.data.articleMarkdown.length} chars`);

  console.log('\n=== 6. Testing POST /api/faqs ===');
  const fRes = await fetch(`${BASE_URL}/api/faqs`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ input: testInput, strategy, outline })
  });
  console.log('Status:', fRes.status);
  const fJson = await fRes.json();
  if (fRes.status !== 200 || !fJson.ok) {
    console.error('FAQs Error:', fJson);
    throw new Error('FAQs failed');
  }
  console.log(`Success! FAQs count: ${fJson.data.faqs.length}`);

  console.log('\n=== 7. Testing POST /api/simple ===');
  const smpRes = await fetch(`${BASE_URL}/api/simple`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ input: testInput })
  });
  console.log('Status:', smpRes.status);
  const smpJson = await smpRes.json();
  if (smpRes.status !== 200 || !sJson.ok) {
    console.error('Simple Error:', smpJson);
    throw new Error('Simple failed');
  }
  console.log(`Success! Simple text length: ${smpJson.data.text.length} chars`);

  console.log('\n=== 8. Testing Validation Error Handling (400 Bad Request) ===');
  const badRes1 = await fetch(`${BASE_URL}/api/strategy`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ input: { topic: '' } })
  });
  console.log('Empty topic status code:', badRes1.status);
  const badJson1 = await badRes1.json();
  console.log('Validation error payload:', badJson1.error);
  if (badRes1.status !== 400 || badJson1.ok !== false || badJson1.error.code !== 'VALIDATION_ERROR') {
    throw new Error('Invalid input validation check failed');
  }

  const badRes2 = await fetch(`${BASE_URL}/api/simple`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({})
  });
  console.log('Empty simple request status code:', badRes2.status);
  const badJson2 = await badRes2.json();
  if (badRes2.status !== 400 || badJson2.ok !== false) {
    throw new Error('Simple invalid input validation check failed');
  }

  console.log('\n======================================================');
  console.log('ALL 7 BACKEND ENDPOINTS + VALIDATION CHECKS VERIFIED!');
  console.log('======================================================\n');
}

run().catch((err) => {
  console.error('\nTest failed with error:', err.message);
  process.exit(1);
});
