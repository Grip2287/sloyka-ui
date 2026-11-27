// sloyka-check [папка] [--json] [--allow файл]. Код выхода: 0 чисто, 1 есть нарушения, 2 ошибка запуска.
import { resolve } from 'node:path';
import { checkProject, ALLOW_FILE_NAME } from './index.js';

const HELP = `sloyka-check [папка] [--json] [--allow файл]

  папка         что проверять (по умолчанию текущая); пути в отчёте относительны ей
  --json        машиночитаемый вывод
  --allow файл  файл исключений (по умолчанию <папка>/${ALLOW_FILE_NAME})
  -h, --help    эта справка

Код выхода: 0 нарушений нет, 1 есть нарушения, 2 ошибка запуска.`;

export function main(argv, io = {}) {
  const out = io.out || (s => console.log(s));
  const err = io.err || (s => console.error(s));
  let dir;
  let json = false;
  let allowFile;
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--json') json = true;
    else if (a === '--allow') {
      allowFile = argv[++i];
      if (!allowFile) return err('--allow требует путь к файлу'), 2;
    }
    else if (a === '-h' || a === '--help') return out(HELP), 0;
    else if (a.startsWith('-') || dir !== undefined) return err(`Неизвестный аргумент: ${a}\n${HELP}`), 2;
    else dir = a;
  }
  const cwd = io.cwd || process.cwd();

  let result;
  try {
    result = checkProject(resolve(cwd, dir ?? '.'), { allowFile: allowFile && resolve(cwd, allowFile) });
  } catch (e) {
    err(e.message);
    return 2;
  }

  const { violations, allowed, warnings, files } = result;
  if (json) {
    out(JSON.stringify({ violations, allowed, warnings, files }, null, 2));
    return violations.length ? 1 : 0;
  }
  for (const w of warnings) err(`Предупреждение: ${w}`);
  for (const a of allowed) out(`Исключено (${ALLOW_FILE_NAME}): ${a.file}:${a.line} ${a.rule} (причина: ${a.reason})`);
  for (const v of violations) out(`${v.file}:${v.line} ${v.rule} → ${v.message}`);
  out(
    violations.length
      ? `Нарушений: ${violations.length}${allowed.length ? `, исключено: ${allowed.length}` : ''} (проверено файлов: ${files})`
      : `Sloyka check: нарушений нет${allowed.length ? `, исключено: ${allowed.length}` : ''} (проверено файлов: ${files})`,
  );
  return violations.length ? 1 : 0;
}
