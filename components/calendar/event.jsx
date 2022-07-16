import React from 'react';

const Event = ({ event, categories }) => {
    const getCategoryColor = Color => {
        if (Color === 'rose') {
            return 'bg-rose-600';
        } else if (Color === 'pink') {
            return 'bg-pink-600';
        } else if (Color === 'fuchsia') {
            return 'bg-fuchsia-600';
        } else if (Color === 'purple') {
            return 'bg-purple-600';
        } else if (Color === 'violet') {
            return 'bg-violet-600';
        } else if (Color === 'indigo') {
            return 'bg-indigo-600';
        } else if (Color === 'blue') {
            return 'bg-blue-600';
        } else if (Color === 'sky') {
            return 'bg-sky-600';
        } else if (Color === 'cyan') {
            return 'bg-cyan-600';
        } else if (Color === 'teal') {
            return 'bg-teal-600';
        } else if (Color === 'emerald') {
            return 'bg-emerald-600';
        } else if (Color === 'green') {
            return 'bg-green-600';
        } else if (Color === 'lime') {
            return 'bg-lime-600';
        } else if (Color === 'yellow') {
            return 'bg-yellow-600';
        } else if (Color === 'amber') {
            return 'bg-amber-600';
        } else if (Color === 'orange') {
            return 'bg-orange-600';
        } else if (Color === 'red') {
            return 'bg-red-600';
        } else {
            return 'bg-neutral-600';
        };
    };

    return (
        <div className={`cursor-pointer flex flex-row justify-between items-center w-full px-3 py-2 my-2 rounded-lg ${getCategoryColor(categories.find(e => e['Name'] === event['Category'])['Color'])}`}>
            <p className='text-slate-200'>{event['Name']}</p>
            <p className='text-slate-200'>{event['StartTime']} - {event['EndTime']}</p>
        </div>
    );
};

export default Event;