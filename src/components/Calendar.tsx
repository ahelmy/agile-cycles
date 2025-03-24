import { useState } from 'react';
import { format } from 'date-fns';
import { Quarter, Cycle, Sprint } from '../types';
import { isCurrentCycle, isCurrentSprint, updateCycleSprints } from '../utils/dateUtils';

interface CalendarProps {
  quarters: Quarter[];
  year: number;
}

export const Calendar = ({ quarters, year }: CalendarProps) => {
  const [showCurrent, setShowCurrent] = useState(false);
  const [localQuarters, setLocalQuarters] = useState(quarters);

  const handleSprintDurationChange = (cycleToUpdate: Cycle, newDuration: number) => {
    const updatedQuarters = localQuarters.map(quarter => ({
      ...quarter,
      cycles: quarter.cycles.map(cycle => 
        cycle.number === cycleToUpdate.number ? updateCycleSprints(cycle, newDuration) : cycle
      )
    }));
    setLocalQuarters(updatedQuarters);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-center">
          Agile Calendar {year}
        </h1>
        <button
          onClick={() => setShowCurrent(!showCurrent)}
          className="px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600 transition-colors"
        >
          {showCurrent ? 'Show All' : 'Highlight Current'}
        </button>
      </div>
      
      <div className="space-y-8">
        {localQuarters.map((quarter) => (
          <div 
            key={quarter.number}
            className="bg-white rounded-lg shadow-lg p-6"
          >
            <h2 className="text-2xl font-semibold mb-4">
              Q{quarter.number} ({format(quarter.startDate, 'MMM d')} - {format(quarter.endDate, 'MMM d')})
            </h2>
            
            <div className="space-y-4">
              {quarter.cycles.map((cycle) => {
                const isCurrent = isCurrentCycle(cycle);
                const shouldShow = !showCurrent || isCurrent;
                
                return (
                  <div 
                    key={cycle.number}
                    className={`border rounded-lg p-4 transition-all duration-300 ${
                      shouldShow ? 'opacity-100' : 'opacity-40'
                    } ${
                      isCurrent ? 'bg-indigo-50 border-indigo-200' : cycle.isException ? 'bg-yellow-50' : 'bg-gray-50'
                    }`}
                  >
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="text-xl font-medium flex items-center gap-2">
                        Cycle {cycle.number}
                        {isCurrent && (
                          <span className="text-sm bg-indigo-500 text-white px-2 py-1 rounded">
                            Current
                          </span>
                        )}
                        {cycle.isException && (
                          <span className="text-sm bg-yellow-500 text-white px-2 py-1 rounded">
                            Custom Duration
                          </span>
                        )}
                      </h3>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-600">Sprint Duration:</span>
                        <select
                          value={cycle.sprintDuration}
                          onChange={(e) => handleSprintDurationChange(cycle, Number(e.target.value))}
                          className="border rounded px-2 py-1 text-sm"
                        >
                          <option value="1">1 week</option>
                          <option value="2">2 weeks</option>
                          <option value="3">3 weeks</option>
                          <option value="4">4 weeks</option>
                        </select>
                      </div>
                    </div>
                    <p className="text-gray-600 mb-3">
                      {format(cycle.startDate, 'MMM d')} - {format(cycle.endDate, 'MMM d')}
                    </p>
                    
                    <div className="grid grid-cols-3 gap-4">
                      {cycle.sprints.map((sprint) => {
                        const isSprintCurrent = isCurrentSprint(sprint);
                        
                        return (
                          <div 
                            key={sprint.number}
                            className={`p-3 rounded border transition-colors ${
                              isSprintCurrent 
                                ? 'bg-indigo-100 border-indigo-300' 
                                : 'bg-white'
                            }`}
                          >
                            <h4 className="font-medium">
                              Sprint {sprint.number}
                              {isSprintCurrent && (
                                <span className="ml-2 text-xs bg-indigo-500 text-white px-2 py-0.5 rounded">
                                  Active
                                </span>
                              )}
                            </h4>
                            <p className="text-sm text-gray-500">
                              {format(sprint.startDate, 'MMM d')} - {format(sprint.endDate, 'MMM d')}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};