import React, { Fragment } from 'react';
import dayjs from 'dayjs';
import { useState } from 'react'

const CreateEvent = ({ close }) => {
    const [eventName, setEventName] = useState('');
    const [date, setDate] = useState(dayjs().format('YYYY-MM-DD'));
    const [startTime, setStartTime] = useState('09:00:00');
    const [endTime, setEndTime] = useState('10:00:00');
    const [description, setDescription] = useState('');
    const [categoryId, setCategoryId] = useState('Category 1');

    const FormSubmitHandler = async () => {
        const res = await fetch('/api/create-event', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(
                {
                    eventName: eventName, 
                    date: date,
                    startTime : startTime,
                    endTime : endTime,
                    description : description,
                    categoryId: categoryId
                }
            )
        })
    }

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
                            id='newEvent'
                            name='newEvent'
                            className='bg-transparent w-2/3 text-white text-xl font-semibold placeholder:text-slate-400 focus:outline-none'
                            placeholder='New Event'
                            onChange={e => setEventName(e.target.value)}
                            required
                        />
                        <input 
                            type='date'
                            id='newEventDate'
                            name='newEventDate'
                            className='bg-transparent text-white focus:outline-none my-2'
                            defaultValue={ dayjs().format('YYYY-MM-DD') }
                            onChange={e => setDate(e.target.value)}
                            required
                        />
                        <div className='flex flex-row justify-start items-start w-full'>
                            <input 
                                type='time'
                                id=''
                                name=''
                                className='bg-transparent text-white focus:outline-none'
                                defaultValue='09:00:00'
                                onChange={e => setStartTime(e.target.value)}
                                required
                            />
                            <p className='px-3 text-white'>to</p>
                            <input 
                                type='time'
                                id=''
                                name=''
                                className='bg-transparent text-white focus:outline-none'
                                defaultValue='10:00:00'
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
                            onChange={e => setDescription(e.target.value)}
                        />
                        <input 
                            type='submit'
                            value='Create Event'
                            className='cursor-pointer self-end bg-blue-600 text-slate-200 hover:text-white px-4 py-2 mt-4 mb-1 rounded-md duration-150 ease-in-out'
                            onClick={FormSubmitHandler}
                        />
                    </form>
                </div>
            </div>
        </Fragment>
    );
};

export default CreateEvent;