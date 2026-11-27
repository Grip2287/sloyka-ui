import { Fragment } from 'react';
import { Page, Stack, Card, Button, Text, Table } from 'sloyka';
import * as S from 'sloyka';
import { Banner } from '@grip2287/sloyka';
import { classes } from 'sloyka/components.json';
import 'sloyka/styles.css?inline';

const rows = ['один', 'два'];

function Row({ label }: { label: string }) {
  return <Text weight="strong">{label}</Text>;
}

function Summary() {
  return (
    <>
      <Card.Head>Сводка</Card.Head>
      <Stack gap={3} direction="row">
        {rows.map(r => (
          <Fragment key={r}>
            <Row label={r} />
          </Fragment>
        ))}
      </Stack>
    </>
  );
}

export default function Home() {
  return (
    <Page width="wide">
      <Banner tone="ok">Готово</Banner>
      <Card accent="ok">
        <Summary />
        <S.Button variant="primary" size="md" type="submit">
          Сохранить
        </S.Button>
        <Button variant={dynamicVariant()}>Динамика</Button>
        <Button {...{ variant: "primary", size: "sm" }}>Spread</Button>
      </Card>
      <Table />
    </Page>
  );
}

function dynamicVariant() {
  return 'ghost' as const;
}
