import { addDays, addWeeks, startOfYear, getQuarter, isWithinInterval } from 'date-fns';
import { Cycle, Quarter, Sprint } from '../types';

export const isCurrentSprint = (sprint: Sprint): boolean => {
  const now = new Date();
  return isWithinInterval(now, { start: sprint.startDate, end: sprint.endDate });
};

export const isCurrentCycle = (cycle: Cycle): boolean => {
  const now = new Date();
  return isWithinInterval(now, { start: cycle.startDate, end: cycle.endDate });
};

export const calculateSprintsForDuration = (cycleStartDate: Date, cycleEndDate: Date, sprintDuration: number): Sprint[] => {
  const sprints: Sprint[] = [];
  const totalWeeks = 6.5; // Total cycle duration
  const numberOfSprints = Math.floor(totalWeeks / sprintDuration);

  for (let sprintNum = 0; sprintNum < numberOfSprints; sprintNum++) {
    const sprintStartDate = addWeeks(cycleStartDate, sprintNum * sprintDuration);
    const sprintEndDate = addDays(sprintStartDate, (sprintDuration * 7) - 1);
    
    // Only add the sprint if it doesn't exceed the cycle end date
    if (sprintEndDate <= cycleEndDate) {
      sprints.push({
        startDate: sprintStartDate,
        endDate: sprintEndDate,
        number: sprintNum + 1
      });
    }
  }

  return sprints;
};

export const generateYearlyPlan = (year: number) => {
  let startDate = startOfYear(new Date(year, 0, 1));

  // Ensure startDate is a weekday (Monday to Friday)
  const dayOfWeek = getDay(startDate); // 0 = Sunday, 6 = Saturday
  if (dayOfWeek === 0) {
    startDate = addDays(startDate, 1); // Move to Monday
  } else if (dayOfWeek === 6) {
    startDate = addDays(startDate, 2); // Move to Monday
  }

  const cycles: Cycle[] = [];
  const quarters: Quarter[] = [];

  // 8 cycles per year, each approximately 6.5 weeks
  for (let cycleNum = 0; cycleNum < 8; cycleNum++) {
    const cycleStartDate = addWeeks(startDate, cycleNum * 6.5);
    const cycleEndDate = addWeeks(cycleStartDate, 6.5);

    const cycle: Cycle = {
      startDate: cycleStartDate,
      endDate: cycleEndDate,
      number: cycleNum + 1,
      sprints: [],
      quarter: getQuarter(cycleStartDate),
      sprintDuration: 2,
      isException: false
    };

    cycle.sprints = calculateSprintsForDuration(cycleStartDate, cycleEndDate, cycle.sprintDuration);
    cycles.push(cycle);
  }

  // Group cycles by quarter
  for (let q = 1; q <= 4; q++) {
    const quarterCycles = cycles.filter(cycle => cycle.quarter === q);
    if (quarterCycles.length > 0) {
      quarters.push({
        number: q,
        cycles: quarterCycles,
        startDate: quarterCycles[0].startDate,
        endDate: quarterCycles[quarterCycles.length - 1].endDate
      });
    }
  }

  return { cycles, quarters };
};


export const updateCycleSprints = (cycle: Cycle, newSprintDuration: number): Cycle => {
  return {
    ...cycle,
    sprintDuration: newSprintDuration,
    sprints: calculateSprintsForDuration(cycle.startDate, cycle.endDate, newSprintDuration),
    isException: true
  };
};
