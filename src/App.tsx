import { useState } from 'react';
import { Calendar } from './components/Calendar';
import { generateYearlyPlan } from './utils/dateUtils';
import './App.css';

function App() {
  const currentYear = new Date().getFullYear();
  const [year, setYear] = useState(currentYear);
  const { quarters } = generateYearlyPlan(year);

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto py-8">
        <div className="mb-6 flex justify-center space-x-4">
          <button
            onClick={() => setYear(year - 1)}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Previous Year
          </button>
          <button
            onClick={() => setYear(year + 1)}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Next Year
          </button>
        </div>
        <Calendar quarters={quarters} year={year} />
      </div>
    </div>
  );
}

export default App;