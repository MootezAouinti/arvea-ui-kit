/**
 * Creates a changeset file from the current branch name.
 *
 * Branch prefix → bump type:
 *   feature/*          → minor
 *   bugfix/* | fix/*   → patch
 *   hotfix/*           → patch
 *   release/*          → major
 *   anything else      → patch
 *
 * Usage: node scripts/create-changeset.mjs [override-type]
 */

import { execSync }    from 'child_process';
import { writeFileSync, readdirSync } from 'fs';
import { randomBytes } from 'crypto';

// ── 1. Determine bump type ────────────────────────────────────────────────────

const BRANCH_RULES = [
  { prefix: 'feature/',  type: 'minor' },
  { prefix: 'feat/',     type: 'minor' },
  { prefix: 'release/',  type: 'major' },
  { prefix: 'bugfix/',   type: 'patch' },
  { prefix: 'fix/',      type: 'patch' },
  { prefix: 'hotfix/',   type: 'patch' },
];

function detectBumpType(branch) {
  for (const { prefix, type } of BRANCH_RULES) {
    if (branch.startsWith(prefix)) return type;
  }
  return 'patch';
}

const branch   = process.argv[2] ?? execSync('git rev-parse --abbrev-ref HEAD').toString().trim();
const bumpType = process.argv[3] ?? detectBumpType(branch);

// ── 2. Guard: skip if a changeset already exists ─────────────────────────────

const existing = readdirSync('.changeset').filter(f => f.endsWith('.md') && f !== 'README.md');
if (existing.length > 0) {
  console.log(`Changeset already exists (${existing[0]}), skipping.`);
  process.exit(0);
}

// ── 3. Resolve package names from workspaces ─────────────────────────────────

import { readdirSync as _readdirSync, existsSync } from 'fs';

const { workspaces } = JSON.parse(execSync('cat package.json').toString());
const packages = [];

for (const pattern of workspaces ?? []) {
  // Only look in packages/ directories, not apps/
  if (!pattern.startsWith('packages/')) continue;
  const dir = pattern.replace(/\/?\*$/, '/').replace(/\/?$/, '/');
  let dirs = [];
  try { dirs = _readdirSync(dir, { withFileTypes: true }).filter(d => d.isDirectory()); }
  catch { continue; }

  for (const entry of dirs) {
    const pkgPath = `${dir}${entry.name}/package.json`;
    if (!existsSync(pkgPath)) continue;
    try {
      const pkg = JSON.parse(execSync(`cat ${pkgPath}`).toString());
      if (!pkg.private && pkg.name) packages.push(pkg.name);
    } catch { /* skip */ }
  }
}

if (packages.length === 0) {
  console.error('No publishable packages found in workspaces.');
  process.exit(1);
}

// ── 4. Write the changeset file ───────────────────────────────────────────────

const id       = randomBytes(4).toString('hex');
const filename = `.changeset/auto-${id}.md`;

const frontmatter = packages.map(p => `"${p}": ${bumpType}`).join('\n');
const summary     = `${bumpType} bump from branch \`${branch}\``;

writeFileSync(filename, `---\n${frontmatter}\n---\n\n${summary}\n`);

console.log(`✓ Created ${filename}`);
console.log(`  packages : ${packages.join(', ')}`);
console.log(`  bump type: ${bumpType}`);
