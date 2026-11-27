// Проверка длинных слов: ничего не должно вылезать за экран.
import { Card, KeyValue, Status, Tag, List, Row, Banner, Nav } from '../react';

export default { title: 'Проверки/Длинный текст', argTypes: { slScale: { table: { disable: true } }, slRadius: { table: { disable: true } } }, parameters: { pair: false } };

const W = 'Высококвалифицированныйспециалист';
const MAIL = 'very.long.email.address@example-company.ru';

export const LongText = {
  name: 'Длинный текст',
  render: () => (
    <div style={{ display: 'grid', gap: 16 }}>
      <Card accent="ok">
        <Card.Head title={W} subtitle={MAIL} aside={<Tag>{W}</Tag>} />
        <KeyValue items={[['Почта', MAIL], [W, W]]} />
        <Card.Foot><Status tone="ok">На связи</Status></Card.Foot>
      </Card>
      <List><Row title={`${W} ${MAIL}`} status={<Status>Офлайн</Status>} /></List>
      <Banner tone="warn" title={W}>{MAIL}</Banner>
      <Nav rail><Nav.Item icon="users" href="#">{W}</Nav.Item></Nav>
    </div>
  ),
};
