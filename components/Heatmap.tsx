import React from 'react';

// Generates dummy data for the last year
const generateHeatmapData = () => {
  const data = new Map<string, number>();
  const today = new Date();
  for (let i = 0; i < 365; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    const dateString = date.toISOString().split('T')[0];
    data.set(dateString, Math.floor(Math.random() * 15)); // Random activity count
  }
  return data;
};

const contributionData = generateHeatmapData();

const getColor = (count: number) => {
  if (count === 0) return 'bg-gray-700';
  if (count <= 3) return 'bg-green-900';
  if (count <= 6) return 'bg-green-700';
  if (count <= 9) return 'bg-green-500';
  return 'bg-green-300';
};

const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const monthLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export const Heatmap: React.FC = () => {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 364);

    const days = [];
    const months = [];
    
    const weekDayCells = [];
    for (let i = 0; i < 7; i++) {
        if (i % 2 !== 0) {
            weekDayCells.push(<div key={`day-${i}`} className="text-xs text-gray-400 h-4">{weekDays[i]}</div>);
        } else {
            weekDayCells.push(<div key={`day-spacer-${i}`} className="h-4"></div>);
        }
    }
    
    let currentDate = new Date(startDate);
    let lastMonth = -1;

    const firstDayOfWeek = startDate.getDay();
    for(let i = 0; i < firstDayOfWeek; i++) {
        days.push(<div key={`pad-${i}`} className="w-4 h-4" />);
    }

    for (let i = 0; i < 365; i++) {
        const dateString = currentDate.toISOString().split('T')[0];
        const count = contributionData.get(dateString) || 0;

        const weekIndex = Math.floor((i + firstDayOfWeek) / 7);

        if (currentDate.getDate() === 1 && currentDate.getMonth() !== lastMonth) {
            months.push(
                <div key={currentDate.getMonth()} className="text-xs text-gray-400 absolute" style={{ left: `${weekIndex * 18}px` }}>
                   {monthLabels[currentDate.getMonth()]}
                </div>
            );
            lastMonth = currentDate.getMonth();
        }

        days.push(
            <div
                key={dateString}
                className={`w-4 h-4 rounded-sm ${getColor(count)}`}
                title={`${count} submissions on ${dateString}`}
            />
        );
        currentDate.setDate(currentDate.getDate() + 1);
    }

    return (
        <div className="bg-gray-800 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-white mb-4">Submission Activity</h3>
            <div className="flex">
                <div className="flex flex-col justify-between mr-2 py-5">
                    {weekDayCells}
                </div>
                <div className="flex-grow overflow-x-auto">
                     <div className="relative h-5">
                        {months}
                    </div>
                    <div className="grid grid-flow-col grid-rows-7 gap-1">
                        {days}
                    </div>
                </div>
            </div>
            <div className="flex justify-end items-center mt-4 text-xs text-gray-400 gap-2">
                <span>Less</span>
                <div className="w-4 h-4 rounded-sm bg-gray-700"></div>
                <div className="w-4 h-4 rounded-sm bg-green-900"></div>
                <div className="w-4 h-4 rounded-sm bg-green-700"></div>
                <div className="w-4 h-4 rounded-sm bg-green-500"></div>
                <div className="w-4 h-4 rounded-sm bg-green-300"></div>
                <span>More</span>
            </div>
        </div>
    );
};
