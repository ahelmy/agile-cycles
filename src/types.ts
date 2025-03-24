export interface Sprint {
  startDate: Date;
  endDate: Date;
  number: number;
}

export interface Cycle {
  startDate: Date;
  endDate: Date;
  number: number;
  sprints: Sprint[];
  quarter: number;
  sprintDuration: number;
  isException: boolean;
}

export interface Quarter {
  number: number;
  cycles: Cycle[];
  startDate: Date;
  endDate: Date;
}