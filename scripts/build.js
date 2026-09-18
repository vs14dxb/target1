'use strict';

const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const root = path.join(__dirname, '..');
const output = path.join(root, 'dist');
const directories = ['about', 'assets', 'brands', 'contact', 'products', 'wholesale'];
const files = ['index.html', 'robots.txt', 'sitemap.xml'];

execFileSync(process.execPath, [path.join(__dirname, 'generate.js')], { stdio: 'inherit' });
execFileSync(process.execPath, [path.join(__dirname, 'verify.js')], { stdio: 'inherit' });

fs.rmSync(output, { recursive: true, force: true });
fs.mkdirSync(output, { recursive: true });

for (const directory of directories) {
  fs.cpSync(path.join(root, directory), path.join(output, directory), { recursive: true });
}

for (const file of files) {
  fs.copyFileSync(path.join(root, file), path.join(output, file));
}

fs.writeFileSync(path.join(output, '.nojekyll'), '', 'utf8');
console.log('Prepared production site in dist/');

