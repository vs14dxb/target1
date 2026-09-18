'use strict';

const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');

function collectHtmlFiles(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === 'node_modules' || entry.name === '.git' || entry.name === '.worktrees') continue;
      collectHtmlFiles(full, out);
    } else if (entry.name.endsWith('.html')) {
      out.push(full);
    }
  }
  return out;
}

function verify() {
  const files = collectHtmlFiles(ROOT);
  let errors = 0;

  for (const file of files) {
    const html = fs.readFileSync(file, 'utf8');
    const relFromRoot = '/' + path.relative(ROOT, file).split(path.sep).join('/');

    if (!/<title>[^<]+<\/title>/.test(html)) {
      console.error(`[MISSING TITLE] ${relFromRoot}`);
      errors++;
    }
    if (!/rel="canonical"/.test(html)) {
      console.error(`[MISSING CANONICAL] ${relFromRoot}`);
      errors++;
    }
    if (!/<h1\b[^>]*>/.test(html)) {
      console.error(`[MISSING H1] ${relFromRoot}`);
      errors++;
    }
    if (!/<meta property="og:image" content="https?:\/\//.test(html)) {
      console.error(`[MISSING ABSOLUTE OG IMAGE] ${relFromRoot}`);
      errors++;
    }
    for (const imageTag of html.matchAll(/<img\b[^>]*>/g)) {
      if (!/\bwidth="\d+"/.test(imageTag[0]) || !/\bheight="\d+"/.test(imageTag[0])) {
        console.error(`[IMAGE DIMENSIONS] ${relFromRoot} -> ${imageTag[0]}`);
        errors++;
      }
    }
    if (/undefined|\[object Object\]/.test(html)) {
      console.error(`[TEMPLATE LEAK] ${relFromRoot}`);
      errors++;
    }

    const linkRegex = /(?:href|src)="((?:\/|\.\.?\/)[^"#]+)"/g;
    let match;
    while ((match = linkRegex.exec(html))) {
      const linkPath = match[1];
      if (linkPath.startsWith('//')) continue;
      const targetFull = linkPath.startsWith('/')
        ? path.join(ROOT, linkPath)
        : path.resolve(path.dirname(file), linkPath);
      if (!fs.existsSync(targetFull)) {
        console.error(`[BROKEN LINK] ${relFromRoot} -> ${linkPath}`);
        errors++;
      }
    }

    const jsonLdRegex = /<script type="application\/ld\+json">([\s\S]*?)<\/script>/g;
    while ((match = jsonLdRegex.exec(html))) {
      try {
        JSON.parse(match[1]);
      } catch (e) {
        console.error(`[INVALID JSON-LD] ${relFromRoot}`);
        errors++;
      }
    }
  }

  console.log(`Checked ${files.length} HTML files, ${errors} error(s).`);
  if (errors > 0) process.exit(1);
}

if (require.main === module) {
  verify();
}

module.exports = verify;
