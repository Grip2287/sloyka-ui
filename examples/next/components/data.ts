export type Tone = 'ok' | 'warn' | 'crit';

export interface Site {
  id: string;
  name: string;
  address: string;
  state: Tone;
  stateText: string;
  devices: number;
}

export interface Event {
  id: string;
  time: string;
  site: string;
  text: string;
  tone: Tone;
  toneText: string;
}

export const SITES: Site[] = [
  { id: 's1', name: 'КПП-1', address: 'ул. Заводская, 12', state: 'ok', stateText: 'На связи', devices: 14 },
  { id: 's2', name: 'Склад №4', address: 'Промзона, корпус 7', state: 'warn', stateText: 'Задержка', devices: 9 },
  { id: 's3', name: 'Шлюз-04', address: 'Набережная, 3', state: 'crit', stateText: 'Нет связи', devices: 6 },
  { id: 's4', name: 'Офис', address: 'пр. Мира, 40', state: 'ok', stateText: 'На связи', devices: 21 },
];

export const EVENTS: Event[] = [
  { id: 'e1', time: '11:04', site: 'Шлюз-04', text: 'Потеряна связь с контроллером', tone: 'crit', toneText: 'Авария' },
  { id: 'e2', time: '10:52', site: 'Склад №4', text: 'Ответ дольше 2 секунд', tone: 'warn', toneText: 'Внимание' },
  { id: 'e3', time: '10:31', site: 'КПП-1', text: 'Добавлена камера КПП-2', tone: 'ok', toneText: 'Норма' },
];
