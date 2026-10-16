import { cpSync, existsSync, mkdirSync, rmSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const repoRoot = join(root, '../..');
const docsDist = join(repoRoot, 'apps/docs/.vitepress/dist');
const outDocs = join(root, 'dist/docs');

const build = spawnSync('pnpm', ['--filter', '@switchboard-js/docs', 'build'], {
  cwd: repoRoot,
  stdio: 'inherit',
  shell: process.platform === 'win32',
});

if (build.status !== 0) {
  process.exit(build.status ?? 1);
}

if (!existsSync(docsDist)) {
  console.error('VitePress dist not found at', docsDist);
  process.exit(1);
}

rmSync(outDocs, { recursive: true, force: true });
mkdirSync(dirname(outDocs), { recursive: true });
cpSync(docsDist, outDocs, { recursive: true });
console.log('Merged docs into', outDocs);
