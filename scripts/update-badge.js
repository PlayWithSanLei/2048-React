import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const coveragePath = path.join(__dirname, '../coverage/coverage-summary.json');
const readmePath = path.join(__dirname, '../README.md');

try {
  if (!fs.existsSync(coveragePath)) {
    console.error('Coverage summary not found. Please run tests with coverage first.');
    process.exit(1);
  }

  const coverage = JSON.parse(fs.readFileSync(coveragePath, 'utf8'));
  const total = coverage.total.lines.pct;
  const color = total < 50 ? 'red' : total < 80 ? 'yellow' : 'brightgreen';
  
  // Format: ![Coverage](https://img.shields.io/badge/coverage-95%25-brightgreen?style=flat-square)
  const badgeUrl = `https://img.shields.io/badge/coverage-${total}%25-${color}?style=flat-square`;
  const badgeMarkdown = `![Coverage](${badgeUrl})`;

  let readme = fs.readFileSync(readmePath, 'utf8');
  
  // Replace existing badge
  const badgeRegex = /!\[Coverage\]\(https:\/\/img\.shields\.io\/badge\/coverage-[\d.]+%25-[a-z]+\?style=flat-square\)/;
  
  if (badgeRegex.test(readme)) {
    readme = readme.replace(badgeRegex, badgeMarkdown);
    fs.writeFileSync(readmePath, readme);
    console.log(`Updated coverage badge to ${total}% (${color})`);
  } else {
    console.warn('Coverage badge not found in README.md');
  }

} catch (error) {
  console.error('Error updating coverage badge:', error);
  process.exit(1);
}
