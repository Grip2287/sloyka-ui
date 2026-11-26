import { execSync } from 'node:child_process';
// Одна сборка на весь прогон: параллельные сборки мешают друг другу на Windows (EBUSY).
export default function setup() { execSync('npm run build', { stdio: 'pipe' }); }
