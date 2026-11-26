import type { ReactNode } from 'react';
import type { SloykaMarked } from '../../core';
import { defineMeta, cx, checkChildren } from '../../core';
import { Icon, type IconName } from '../../icons';

export interface EmptyProps {
  icon: IconName;
  title: string;
  text?: string;
  /** Кнопка действия. */
  action?: ReactNode;
}

function EmptyView({ owner, dropzone, icon, title, text, action }: EmptyProps & { owner: SloykaMarked; dropzone: boolean }) {
  checkChildren(owner, action);
  return (
    <div className={cx('sl-empty', dropzone && 'sl-dropzone')}>
      <Icon name={icon} />
      <div className="sl-empty__title">{title}</div>
      {text && <div>{text}</div>}
      {action}
    </div>
  );
}

const PROPS = {
  icon: { type: 'IconName', required: true }, title: { type: 'string', required: true },
  text: { type: 'string' }, action: { type: 'ReactNode' },
};
const GROUP = 'Пустое состояние и загрузка файла';

function EmptyImpl(p: EmptyProps) { return <EmptyView {...p} owner={Empty as unknown as SloykaMarked} dropzone={false} />; }
export const Empty = defineMeta(EmptyImpl, { n: '14', group: GROUP, name: 'Empty', allowed: ['Button', 'Text', 'Stack'], props: PROPS });

function DropzoneImpl(p: EmptyProps) { return <EmptyView {...p} owner={Dropzone as unknown as SloykaMarked} dropzone />; }
/** Пустое состояние в пунктирной рамке: «куда перетащить или загрузить файл». */
export const Dropzone = defineMeta(DropzoneImpl, { n: '14', group: GROUP, name: 'Dropzone', allowed: ['Button', 'Text', 'Stack'], props: PROPS });
