const http = require('http');
const { spawn } = require('child_process');
const path = require('path');

const PORT = 8792;
const PROJECT_ROOT = path.resolve(__dirname, '..');

async function testProductionServer() {
  console.log('--- Testing Production Server on Port ' + PORT + ' ---');

  const serverProc = spawn('node', ['server/dist/index.js'], {
    cwd: PROJECT_ROOT,
    env: { ...process.env, PORT: String(PORT), NODE_ENV: 'production' },
    stdio: ['ignore', 'pipe', 'pipe']
  });

  serverProc.stdout.on('data', d => process.stdout.write('[Server] ' + d.toString()));
  serverProc.stderr.on('data', d => process.stderr.write('[Server Error] ' + d.toString()));

  // Wait 2 seconds for server to boot
  await new Promise(r => setTimeout(r, 2000));

  function get(urlPath) {
    return new Promise((resolve, reject) => {
      http.get(`http://127.0.0.1:${PORT}${urlPath}`, res => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => resolve({ status: res.statusCode, headers: res.headers, body: data }));
      }).on('error', reject);
    });
  }

  try {
    // 1. Health endpoint
    const health = await get('/api/health');
    console.log(`GET /api/health -> Status ${health.status}, OK: ${JSON.parse(health.body).ok}`);
    if (health.status !== 200 || !JSON.parse(health.body).ok) throw new Error('Health check failed');

    // 2. Root SPA endpoint
    const root = await get('/');
    console.log(`GET / -> Status ${root.status}, Contains root element: ${root.body.includes('id="root"')}`);
    if (root.status !== 200 || !root.body.includes('id="root"')) throw new Error('Root SPA check failed');

    // 3. SPA Route fallback (refreshing /generate)
    const spa = await get('/generate');
    console.log(`GET /generate -> Status ${spa.status}, Contains root element: ${spa.body.includes('id="root"')}`);
    if (spa.status !== 200 || !spa.body.includes('id="root"')) throw new Error('SPA route fallback failed');

    // 4. Undefined API route returns JSON 404, not HTML
    const api404 = await get('/api/undefined-endpoint');
    console.log(`GET /api/undefined-endpoint -> Status ${api404.status}, JSON: ${JSON.parse(api404.body).error.code}`);
    if (api404.status !== 404 || JSON.parse(api404.body).error.code !== 'NOT_FOUND') throw new Error('API 404 check failed');

    console.log('\nALL PRODUCTION SERVER CHECKS PASSED SUCCESSFULLY!');
  } finally {
    serverProc.kill();
    // Allow process to terminate
    await new Promise(r => setTimeout(r, 500));
  }
}

testProductionServer().catch(err => {
  console.error('\nProduction server test failed:', err);
  process.exit(1);
});
