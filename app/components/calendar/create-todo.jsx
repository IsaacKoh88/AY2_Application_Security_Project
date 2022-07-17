import React, { Fragment } from 'react';
import dayjs from 'dayjs';
import { useState } from 'react';

const CreateTodo = ({ close }) => {
    const [todoName, setTodoName] = useState('');
    const [todoDate, setTodoDate] = useState(dayjs().format('YYYY-MM-DD'));

    const FormSubmitHandler = async () => {
        const res = await fetch('/api/create-todo', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(
                {
                    todoName: todoName, 
                    date: date
                }
            )
        })
    }
    return (
        <Fragment>
            <div 
                className='absolute h-full w-full bg-black/40 inset-0' 
                onClick={() => close()} 
            />
            <div className='absolute bg-slate-900 h-44 w-2/5 inset-0 px-3 py-3 m-auto rounded-xl'>
                <form className='flex flex-col justify-start items-start w-full'>
                    <input 
                        type='text'
                        id='newTodo'
                        name='newTodo'
                        className='bg-slate-800 w-full text-white text-xl font-semibold placeholder:text-slate-400 focus:outline-none px-3 py-2 rounded-md'
                        placeholder='New To-do'
                        value={ todoName }
                        onChange={e => setTodoName(e.target.value)}
                        required
                    />
                    <input 
                        type='date'
                        id='newEventDate'
                        name='newEventDate'
                        className='bg-slate-800 w-full text-white focus:outline-none px-3 py-2 my-2 rounded-md'
                        value={ todoDate }
                        onChange={e => setTodoDate(e.target.value)}
                        required
                    />
                    <input 
                        type='submit'
                        value='Create To-do'
                        className='cursor-pointer self-center bg-blue-600 text-slate-200 hover:text-white px-4 py-2 mt-2.5 rounded-md duration-150 ease-in-out'
                        onClick={() => FormSubmitHandler()}
                    />
                </form>
            </div>
        </Fragment>
    );
};

export default CreateTodo;