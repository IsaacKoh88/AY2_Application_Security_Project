import React from 'react';

const Todo = ({ todo, changeStatus }) => {
    const getTodoTextColor = checked => {
        if (checked === true) {
            return 'text-slate-600';
        } else if (checked === false) {
            return 'text-slate-200';
        };
    };

    return (
        <div className='group cursor-pointer flex flex-row justify-start items-center w-full hover:bg-slate-800 px-3 py-2 my-2 rounded-lg duration-150 ease-in-out'>
            <input 
                type="checkbox" 
                id={ todo['ID'] } 
                name={ todo['Name'] } 
                className='appearance-none bg-slate-400 group-hover:bg-indigo-300 checked:bg-indigo-600 group-hover:checked:bg-indigo-600 h-4 w-4 rounded duration-150 ease-in-out' 
                onChange={e => changeStatus(e.target.id, e.target.checked)} 
                checked={ todo['Checked'] }
            />
            <label 
                htmlFor={ todo['ID'] } 
                className={`grow group-hover:text-white ml-3 duration-150 ease-in-out ${getTodoTextColor(todo['Checked'])}`}
            >
                { todo['Name'] }
            </label>
        </div>
    );
};

export default Todo;