// expect: no-native-elements@4, no-component-classname-style@8, no-sl-css-overrides@8, no-sl-css-overrides@9, no-sl-css-overrides@13, no-sl-css-overrides@18
import { Stack } from 'sloyka';
import styled from "styled-components";
const mine = styled.div`
  color: red;
`;

export const A = () => <Stack className="sl-stack" />;
export const B = () => <Stack>{document.querySelector('.sl-btn')}</Stack>;

const css = `
  .row { margin: 0 }
  .sl-card:hover { color: red }
`;

const Mine = ({ className }: { className?: string }) => null;
export function C() {
  return <Mine className={cx('mine', 'sl-badge')} />;
}
