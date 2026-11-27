// expect: no-native-elements@11, no-native-elements@12, no-native-elements@17, no-native-elements@25, no-native-elements@30
import { Page, Stack, Button } from 'sloyka';

const items = ['a', 'b'];

export function Screen() {
  return (
    <Page>
      <Stack>
        <Button>Нормальная</Button>
        <button type="button">Купить</button>
        <table />
        {items.map(i => (
          <Button key={i}>{i}</Button>
        ))}
        <>
          <span>внутри фрагмента</span>
        </>
      </Stack>
    </Page>
  );
}

function Box() {
  return <div>user component</div>;
}

export function Other() {
  return (
    <html lang="ru" />
  );
}
