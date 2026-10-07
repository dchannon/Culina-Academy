import { readdir, readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const githubPrefix = 'https://github.com/dchannon/Culina-Academy/blob/main/';

function withoutCode(content) {
  return content.replace(/^\s*(`{3,}|~{3,})[^\n]*\n[\s\S]*?^\s*\1\s*$/gm, '');
}

function anchors(content, extension) {
  if (extension === '.html') {
    return new Set([...content.matchAll(/\bid=["']([^"']+)["']/g)].map(match => match[1]));
  }
  const used = new Map();
  const result = new Set();
  for (const match of withoutCode(content).matchAll(/^#{1,6}\s+(.+?)\s*#*\s*$/gm)) {
    const slug = match[1].replace(/<[^>]+>/g, '').replace(/`/g, '')
      .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1').toLowerCase()
      .replace(/[^\p{L}\p{N}\p{M}\s_-]/gu, '').replace(/\s/g, '-');
    const count = used.get(slug) ?? 0;
    result.add(count ? `${slug}-${count}` : slug);
    used.set(slug, count + 1);
  }
  for (const match of content.matchAll(/\b(?:id|name)=["']([^"']+)["']/g)) result.add(match[1]);
  return result;
}

async function documents(root) {
  const result = [];
  for (const entry of await readdir(root, { withFileTypes: true })) {
    if (['.git', 'node_modules', '.playwright-cli', 'output'].includes(entry.name)) continue;
    const full = path.join(root, entry.name);
    if (entry.isDirectory()) result.push(...await documents(full));
    else if (entry.name.endsWith('.md') || entry.name === 'index.html') result.push(full);
  }
  return result;
}

export async function validateDocLinks(root = repoRoot) {
  const errors = [];
  let checked = 0;
  const anchorCache = new Map();
  for (const file of await documents(root)) {
    const content = withoutCode(await readFile(file, 'utf8'));
    const links = [
      ...[...content.matchAll(/!?\[[^\]\n]*\]\(\s*(<[^>]+>|[^\s)]+)(?:\s+[^)]*)?\)/g)].map(match => match[1]),
      ...[...content.matchAll(/^\s*\[[^\]]+\]:\s*(\S+)/gm)].map(match => match[1]),
      ...[...content.matchAll(/\b(?:href|src)=["']([^"']+)["']/g)].map(match => match[1]),
    ];
    for (let link of links) {
      link = link.replace(/^<|>$/g, '').replaceAll('&amp;', '&');
      const github = link.startsWith(githubPrefix);
      if (github) link = link.slice(githubPrefix.length);
      else if (/^[a-z][a-z\d+.-]*:/i.test(link) || link.startsWith('//')) continue;
      const [resource, fragment] = link.split('#');
      let target;
      try {
        const relative = decodeURIComponent(resource.split('?')[0]);
        target = resource ? path.resolve(github || relative.startsWith('/') ? root : path.dirname(file), relative.replace(/^\//, '')) : file;
        const rel = path.relative(root, target);
        if (rel.startsWith('..') || path.isAbsolute(rel)) throw new Error('link leaves repository');
        const info = await stat(target);
        if (fragment && info.isFile() && ['.md', '.html'].includes(path.extname(target))) {
          if (!anchorCache.has(target)) anchorCache.set(target, anchors(await readFile(target, 'utf8'), path.extname(target)));
          if (!anchorCache.get(target).has(decodeURIComponent(fragment))) throw new Error(`missing heading or anchor: ${fragment}`);
        }
        checked++;
      } catch (error) {
        errors.push(`${path.relative(root, file).replaceAll('\\', '/')}: ${link} (${error.message})`);
      }
    }
  }
  return { checked, errors };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const { checked, errors } = await validateDocLinks();
  if (errors.length) {
    console.error(errors.join('\n'));
    process.exitCode = 1;
  } else console.log(`Validated ${checked} local documentation links and anchors.`);
}
