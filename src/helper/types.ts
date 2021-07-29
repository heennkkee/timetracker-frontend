export type Direction = 'in' | 'out';
export type Clocking = { id: number, direction: Direction, userid: number, datetime: string };
export type WorktimeReport = { [key: string]: Worktime };
export type Worktime = { worktime: number, scheduled: number, isHoliday: boolean, ob1: number, ob2: number, ob3: number };
export type WorktimeSummary = { worktime: number, scheduled: number, ob1: number, ob2: number, ob3: number };