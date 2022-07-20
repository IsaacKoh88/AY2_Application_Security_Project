import React, { Fragment, useState } from 'react';

const EditTodo = ({ id, todo, success, close }) => {
    const [todoName, setTodoName] = useState(todo['Name']);
    const [date, setDate] = useState(todo['Date']);

    const FormSubmitHandler = async () => {
        console.log('ok')
        const response = await fetch('/api/'+id+'/todo/edit', 
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(
                    {
                        todoID: todo.ID,
                        todoName: todoName, 
                        date: date
                    }
                )
            }
        );

        if (response.status === 201) {
            success();
        };
    };

    const DeleteHandler = async () => {
        console.log('ok')
        const response = await fetch('/api/'+id+'/todo/delete', 
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body : JSON.stringify(
                    {
                        todoID: todo.ID,
                    }
                )
            }
        );

        if (response.status === 200) {
            success();
        };
    };

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
                        id='todoName'
                        name='todoName'
                        className='bg-slate-800 w-full text-white text-xl font-semibold placeholder:text-slate-400 focus:outline-none px-3 py-2 rounded-md'
                        placeholder='To-do Name'
                        value={ todoName }
                        onChange={e => setTodoName(e.target.value)}
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
                    <div className='flex flex-row justify-center items-center w-full mt-2.5'>
                        <input 
                            type='button'
                            value='Confirm Changes'
                            className='cursor-pointer self-center bg-blue-600 text-slate-200 hover:text-white px-4 py-2 mr-2 rounded-md duration-150 ease-in-out'
                            onClick={() => FormSubmitHandler()}
                        />
                        <input 
                            type='button'
                            value='Delete'
                            className='cursor-pointer bg-red-600 text-slate-200 hover:text-white px-4 py-2 ml-2 rounded-md duration-150 ease-in-out'
                            onClick={() => DeleteHandler()}
                        />
                    </div>
                </form>
            </div>
        </Fragment>
    );
};

export default EditTodo;