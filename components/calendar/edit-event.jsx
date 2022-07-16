import React, { Fragment, useState } from 'react';

const EditEvent = ({ event, close }) => {
    const [name, setName] = useState(event['Name']);
    const [date, setDate] = useState(event['Date']);
    const [startTime, setStartTime] = useState(event['StartTime']);
    const [endTime, setEndTime] = useState(event['EndTime']);
    const [description, setDescription] = useState(event['Description']);

    return (
        <Fragment>
            <div className='absolute h-full w-full bg-black/40 inset-0'></div>
            <div className='absolute flex justify-center items-center inset-0'>
                <div className='relative bg-slate-900 w-2/5 px-4 py-3 rounded-xl'>
                    <div 
                        className='group cursor-pointer absolute flex justify-center items-center h-6 w-6 top-3 right-3'
                        onClick={() => close()}
                    >
                        <i className='gg-close group-hover:text-white duration-150 ease-in-out'></i>
                    </div>
                    <form className='flex flex-col justify-start items-start w-full'>
                        <input 
                            type='text'
                            id='eventName'
                            name='eventName'
                            className='bg-transparent w-2/3 text-white text-xl font-semibold placeholder:text-slate-400 focus:outline-none'
                            placeholder='Event Name'
                            value={ name }
                            onChange={e => setName(e.target.value)}
                            required
                        />
                        <input 
                            type='date'
                            id='newEventDate'
                            name='newEventDate'
                            className='bg-transparent text-white focus:outline-none my-2'
                            value={ date }
                            onChange={e => setDate(e.target.value)}
                            required
                        />
                        <div className='flex flex-row justify-start items-start w-full'>
                            <input 
                                type='time'
                                id=''
                                name=''
                                className='bg-transparent text-white focus:outline-none'
                                value={ startTime }
                                onChange={e => setStartTime(e.target.value)}
                                required
                            />
                            <p className='px-3 text-white'>to</p>
                            <input 
                                type='time'
                                id=''
                                name=''
                                className='bg-transparent text-white focus:outline-none'
                                value={ endTime }
                                onChange={e => setEndTime(e.target.value)}
                                required
                            />
                        </div>
                        <textarea 
                            id=''
                            name=''
                            rows='4'
                            className='bg-transparent text-white placeholder:text-slate-400 border-2 border-slate-800 focus:border-blue-600 focus:outline-none w-full px-3 py-2 mt-3 rounded-lg'
                            placeholder='Description'
                            value={ description }
                            onChange={e => setDescription(e.target.value)}
                        />
                        <input 
                            type='submit'
                            value='Confirm Changes'
                            className='cursor-pointer self-end bg-blue-600 text-slate-200 hover:text-white px-4 py-2 mt-4 mb-1 rounded-md duration-150 ease-in-out'
                        />
                    </form>
                </div>
            </div>
        </Fragment>
    );
};

export default EditEvent;