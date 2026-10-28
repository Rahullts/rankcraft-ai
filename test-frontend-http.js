async function checkAll() {
  console.log('--- Verifying Frontend & Backend HTTP endpoints ---');

  // 1. Direct Backend
  const bRes = await fetch('http://localhost:8787/api/health');
  const bData = await bRes.json();
  console.log('1. Direct Backend (http://localhost:8787/api/health):', bRes.status, bData.ok ? 'OK' : 'FAIL');

  // 2. Frontend HTML
  const fHtmlRes = await fetch('http://localhost:5173');
  const fHtml = await fHtmlRes.text();
  console.log('2. Frontend HTML (http://localhost:5173):', fHtmlRes.status, 'Length:', fHtml.length, 'Has root:', fHtml.includes('id="root"'));

  // 3. Vite Client Runtime
  const vClientRes = await fetch('http://localhost:5173/@vite/client');
  const vClient = await vClientRes.text();
  console.log('3. Vite Client Runtime (http://localhost:5173/@vite/client):', vClientRes.status, 'Length:', vClient.length);

  // 4. React App Entry Module
  const appModuleRes = await fetch('http://localhost:5173/src/main.tsx');
  const appModule = await appModuleRes.text();
  console.log('4. React App Module (http://localhost:5173/src/main.tsx):', appModuleRes.status, 'Length:', appModule.length, 'Has React:', appModule.includes('React'));

  // 5. Frontend Proxy to Backend
  const proxyRes = await fetch('http://localhost:5173/api/health');
  const proxyData = await proxyRes.json();
  console.log('5. Frontend Proxy (http://localhost:5173/api/health):', proxyRes.status, proxyData.ok ? 'PROXY WORKING' : 'PROXY FAILED');

  console.log('--- All HTTP integration checks complete ---');
}

checkAll().catch(err => {
  console.error('Error during check:', err);
  process.exit(1);
});
