import React from 'react';

const Todo = ({ todo, changeStatus, editTodo }) => {
    const getTodoTextColor = checked => {
        if (checked === true) {
            return 'text-slate-600';
        } else if (checked === false) {
            return 'text-slate-200';
        };
    };

    return (
        <div className='cursor-pointer flex flex-row justify-between items-center w-full px-2.5 my-2'>
            <div className='cursor-pointer group flex flex-row justify-start items-center h-full mr-3 grow'>
                <input 
                    type="checkbox" 
                    id={ todo['ID'] } 
                    name={ todo['Name'] } 
                    className='appearance-none cursor-pointer bg-slate-400 group-hover:bg-indigo-300 checked:bg-indigo-600 group-hover:checked:bg-indigo-600 h-4 w-4 rounded duration-150 ease-in-out' 
                    onChange={e => changeStatus(e.target.id, e.target.checked)} 
                    checked={ todo['Checked'] }
                />
                <label 
                    htmlFor={ todo['ID'] } 
                    className={`cursor-pointer grow group-hover:text-white ml-3 duration-150 ease-in-out ${getTodoTextColor(todo['Checked'])}`}
                >
                    <div className='flex flex-row grow justify-between items-center'>
                        <p>{ todo['Name'] }</p>
                        <p>{ todo['Date'] }</p>
                    </div>
                </label>
            </div>
            <div 
                className='group flex justify-center items-center h-6 w-6'
                onClick={() => editTodo(todo['ID'])}
            >
                <i className='gg-more group-hover:text-white duration-150 ease-in-out'></i>
            </div>
        </div>
    );
};

export default Todo;