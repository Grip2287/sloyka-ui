// expect: no-component-classname-style@8, no-invalid-prop-value@9, no-component-classname-style@10, no-component-classname-style@11
import { Button, Stack } from 'sloyka';

const p = { a: 1 };

export const Spreads = () => (
  <Stack>
    <Button {...{ className: 'x' }} />
    <Stack {...{ gap: 9, direction: 'row' }} />
    <Button {...p} />
    <Button {...{ variant: 'primary', ...p }} />
  </Stack>
);
