import React, { Fragment, useState } from 'react';
import dayjs from 'dayjs';

const EditTodo = ({ todo, close }) => {
    const [name, setName] = useState(todo['Name']);
    const [date, setDate] = useState(todo['Date']);

    return (
        <Fragment>
            <div 
                className='absolute h-full w-full bg-black/40 inset-0' 
                onClick={() => close()} 
            />
            <div className='absolute bg-slate-900 h-44 w-1/4 inset-0 px-3 py-3 m-auto rounded-xl'>
                <form className='flex flex-col justify-start items-start w-full'>
                    <input 
                        type='text'
                        id='todoName'
                        name='todoName'
                        className='bg-slate-800 w-full text-white text-xl font-semibold placeholder:text-slate-400 focus:outline-none px-3 py-2 rounded-md'
                        placeholder='To-do Name'
                        value={ name }
                        onChange={e => setName(e.target.value)}
                        required
                    />
                    <input 
                        type='date'
                        id='newEventDate'
                        name='newEventDate'
                        className='bg-slate-800 w-full text-white focus:outline-none px-3 py-2 my-2 rounded-md'
                        value={ date }
                        onChange={e => setDate(e.target.value)}
                        required
                    />
                    <input 
                        type='submit'
                        value='Confirm Changes'
                        className='cursor-pointer self-center bg-blue-600 text-slate-200 hover:text-white px-4 py-2 mt-2.5 rounded-md duration-150 ease-in-out'
                    />
                </form>
            </div>
        </Fragment>
    );
};

export default EditTodo;