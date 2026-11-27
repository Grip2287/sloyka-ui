// expect: no-component-classname-style@8, no-sl-css-overrides@8, no-sl-css-overrides@9, no-sl-css-overrides@13, no-sl-css-overrides@16
import { Stack } from 'sloyka';

const mine = styled.div`
  color: red;
`;

export const A = () => <Stack className="sl-stack" />;
export const B = () => <Stack>{document.querySelector('.sl-btn')}</Stack>;

const css = `
  .row { margin: 0 }
  .sl-card:hover { color: red }
`;

const cls = cx('mine', 'sl-badge');
export function C() {
  return <Stack>{mine}{css}{cls}</Stack>;
}
