export type Direction = 'in' | 'out';
export type Clocking = { id: number, direction: Direction, userid: number, datetime: string };
export type WorktimeReport = { [key: string]: Worktime };
export type Worktime = { worktime: number, ob1: number, ob2: number, ob3: number };