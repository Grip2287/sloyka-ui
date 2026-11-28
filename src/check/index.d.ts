export type RuleId = 'no-native-elements' | 'no-component-classname-style' | 'no-deep-imports' | 'no-sl-css-overrides' | 'no-invalid-prop-value'
  | 'native-unknown-class' | 'native-own-class' | 'native-own-tag' | 'native-no-inline-style' | 'native-no-style-tag' | 'native-js-markup';

export interface Violation {
  /** Путь относительно проверяемой папки, через «/». */
  file: string;
  line: number;
  rule: RuleId;
  message: string;
}

export interface AllowedViolation extends Violation {
  reason: string;
}

export interface CheckResult {
  violations: Violation[];
  allowed: AllowedViolation[];
  warnings: string[];
  /** Файлы, которые не удалось разобрать: проверка не пройдена (CLI завершается с кодом 2). */
  errors: string[];
  /** Использованный файл исключений или null. */
  allowFile: string | null;
  /** Сколько файлов проверено. */
  files: number;
}

export interface CheckOptions {
  /** Путь к sloyka.allow.json; false отключает чтение; по умолчанию <dir>/sloyka.allow.json, если есть. */
  allowFile?: string | false;
}

export const RULE_IDS: RuleId[];
export function checkProject(dir: string, options?: CheckOptions): CheckResult;
