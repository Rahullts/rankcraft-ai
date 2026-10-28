const fs = require('fs');
const path = require('path');

function patchRollup() {
  const rollupNativePath = path.resolve(__dirname, '../node_modules/rollup/dist/native.js');
  if (!fs.existsSync(rollupNativePath)) {
    return;
  }

  const content = fs.readFileSync(rollupNativePath, 'utf8');

  // Case 1: Already using wasm directly (e.g. overridden with @rollup/wasm-node)
  // or already contains the fallback
  if (content.includes('bindings_wasm.js') || content.includes('@rollup/wasm-node/dist/native.js')) {
    console.log('[patch-rollup] Rollup WASM compatibility verified.');
    return;
  }

  // Case 2: Native rollup file without fallback
  const targetRegex = /(const|let)\s+nativeModule\s*=\s*requireWithFriendlyError\([\s\S]*?\);/;
  if (targetRegex.test(content)) {
    const replacement = `let nativeModule;
try {
\tnativeModule = requireWithFriendlyError(
\t\texistsSync(path.join(__dirname, localName)) ? localName : \`@rollup/rollup-\${packageBase}\`
\t);
} catch (err) {
\ttry {
\t\tnativeModule = require('@rollup/wasm-node/dist/native.js');
\t} catch {
\t\tthrow err;
\t}
}`;
    const newContent = content.replace(targetRegex, replacement);
    fs.writeFileSync(rollupNativePath, newContent, 'utf8');
    console.log('[patch-rollup] Successfully applied WASM fallback to rollup/dist/native.js');
  } else {
    console.log('[patch-rollup] Target pattern not found in native.js, leaving unmodified.');
  }
}

patchRollup();
