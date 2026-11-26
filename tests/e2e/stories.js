import { readFileSync } from 'node:fs';
const idx = JSON.parse(readFileSync('storybook-static/index.json', 'utf8'));
export const stories = Object.values(idx.entries).filter(e => e.type === 'story');
export const url = (id, theme) => `/iframe.html?id=${id}&viewMode=story&globals=theme:${theme}`;
