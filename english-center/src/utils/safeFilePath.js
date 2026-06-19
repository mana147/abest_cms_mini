const path = require('path');
const fs = require('fs');

const PUBLIC_DIR = path.join(__dirname, '../../public');

function safeResolve(relativePath) {
  if (!relativePath) return null;
  const resolved = path.resolve(PUBLIC_DIR, '.' + relativePath);
  if (!resolved.startsWith(PUBLIC_DIR)) return null;
  return resolved;
}

function safeUnlink(relativePath) {
  const resolved = safeResolve(relativePath);
  if (!resolved) return;
  fs.unlink(resolved, (err) => {
    if (err && err.code !== 'ENOENT') {
      console.error('safeUnlink error:', err.message);
    }
  });
}

module.exports = { safeUnlink, safeResolve };
