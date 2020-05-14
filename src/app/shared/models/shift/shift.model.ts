export interface Shift {
  id: string;
  position: string;
  slot: string;
  location: string;
  day: number;
  shiftStart: [number, number];
  shiftEnd: [number, number];
}
