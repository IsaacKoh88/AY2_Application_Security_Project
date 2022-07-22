import React, { useState } from 'react';

const Event = ({ id, event, categories, editEvent, success }) => {
    const [expand, setExpand] = useState(false);

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

    /** toggle event description display */
    const handleClickDetails = () => {
        setExpand(!expand);
    };

    const DeleteHandler = async () => {
        const response = await fetch('/api/'+id+'/event/delete', 
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body : JSON.stringify(
                    {
                        eventID: event.ID,
                    }
                )
            }
        );

        if (response.status === 200) {
            success();
        };
    }

    return (
        <div 
            className={`group cursor-pointer flex flex-col justify-start items-center w-full px-3 py-2 my-2 rounded-lg transition-max-h duration-300 ease-in-out overflow-hidden ${expand ? 'max-h-screen' : 'max-h-10'} ${getCategoryColor(categories.find(e => e.ID === event.CategoryID).Color)}`}
            onClick={() => handleClickDetails()}
        >
            <div className='flex flex-row justify-between items-center w-full'>
                <p className={`font-semibold duration-300 ease-linear ${expand ? 'text-white' : 'text-slate-200 group-hover:text-white'}`}>{ event.Name }</p>
                <p className={`font-semibold duration-300 ease-linear ${expand ? 'text-white' : 'text-slate-200 group-hover:text-white'}`}>{ event.StartTime } - { event.EndTime }</p>
            </div>
            <p className={`flex justify-start items-start text-white w-full mt-1`}>{ event['Description'] }</p>
            <div className={`flex flex-row justify-end items-center w-full mt-2 mb-1`}>
                <div 
                    className='cursor-pointer bg-slate-200 px-3 py-2 mr-2 rounded-md'
                    onClick={() => editEvent(event.ID)}
                >
                    <p className='text-blue-500 font-semibold duration-150 ease-in-out'>Edit Event</p>
                </div>
                <div 
                    className='group cursor-pointer bg-slate-200 px-3 py-2 ml-2 rounded-md'
                    onClick={() => DeleteHandler()}
                >
                    <p className='text-red-500 font-semibold duration-150 ease-in-out'>Delete Event</p>
                </div>
            </div>
        </div>
    );
};

export default Event;