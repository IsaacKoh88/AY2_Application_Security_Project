import React from 'react';

const Todo = ({ todo, checked }) => {
    return (
        <div 
            onClick={() => checked(todo['ID'])}
            className='flex flex-row justify-between items-center w-full hover:bg-slate-800 px-3 py-2 my-2 rounded-lg duration-150 ease-in-out'
        >
            <p className=''>{todo['Name']}</p>
        </div>
    );
};

export default Todo;