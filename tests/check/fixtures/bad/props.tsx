// expect: no-component-classname-style@9, no-component-classname-style@10, no-component-classname-style@11, no-component-classname-style@12
// expect: no-invalid-prop-value@13, no-invalid-prop-value@14, no-component-classname-style@15, no-invalid-prop-value@16
import { Button, Card, Stack } from 'sloyka';
import * as S from 'sloyka';

export function Props() {
  return (
    <Stack>
      <Button className="wide">Одна</Button>
      <Button style={{ color: 'red' }}>Две</Button>
      <Card.Head dangerouslySetInnerHTML={{ __html: '<b>x</b>' }} />
      <S.Stack className="gap" />
      <Button variant="huge">Три</Button>
      <Stack gap={9} direction="row" />
      <S.Card.Head style={{}} />
      <Button size={'xl'} variant={`primary`} type="submit" />
    </Stack>
  );
}
