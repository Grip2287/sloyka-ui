/** Склеивает классы: ложные значения отбрасываются. */
export function cx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(' ');
}
