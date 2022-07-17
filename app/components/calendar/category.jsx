import React from 'react';

const Category = ({ category, changeStatus, editCategory }) => {
    const getCategoryColor = color => {
        if (color === 'rose') {
            return 'checked:bg-rose-600';
        } else if (color === 'pink') {
            return 'checked:bg-pink-600';
        } else if (color === 'fuchsia') {
            return 'checked:bg-fuchsia-600';
        } else if (color === 'purple') {
            return 'checked:bg-purple-600';
        } else if (color === 'violet') {
            return 'checked:bg-violet-600';
        } else if (color === 'indigo') {
            return 'checked:bg-indigo-600';
        } else if (color === 'blue') {
            return 'checked:bg-blue-600';
        } else if (color === 'sky') {
            return 'checked:bg-sky-600';
        } else if (color === 'cyan') {
            return 'checked:bg-cyan-600';
        } else if (color === 'teal') {
            return 'checked:bg-teal-600';
        } else if (color === 'emerald') {
            return 'checked:bg-emerald-600';
        } else if (color === 'green') {
            return 'checked:bg-green-600';
        } else if (color === 'lime') {
            return 'checked:bg-lime-600';
        } else if (color === 'yellow') {
            return 'checked:bg-yellow-600';
        } else if (color === 'amber') {
            return 'checked:bg-amber-600';
        } else if (color === 'orange') {
            return 'checked:bg-orange-600';
        } else if (color === 'red') {
            return 'checked:bg-red-600';
        } else {
            return 'checked:bg-neutral-600';
        };
    };

    return (
        <div className='cursor-pointer flex flex-row justify-between items-center w-full px-2 my-2'>
            <div className='cursor-pointer group flex flex-row justify-start items-center h-full grow'>
                <input 
                    type="checkbox" 
                    id={ category['ID'] } 
                    name={ category['Name'] } 
                    className={`appearance-none cursor-pointer bg-slate-400 h-4 w-4 rounded ${getCategoryColor(category['Color'])}`} 
                    onChange={e => changeStatus(e.target.id, e.target.checked)} 
                    checked={ category['Activated'] } 
                />
                <label 
                    htmlFor={ category['ID'] } 
                    className='cursor-pointer group-hover:text-white ml-3 grow'
                >
                    { category['Name'] }
                </label>
            </div>
            <div 
                className='group flex justify-center items-center h-6 w-6'
                onClick={() => editCategory(category['ID'])}
            >
                <i className='gg-more group-hover:text-white duration-150 ease-in-out'></i>
            </div>
        </div>
    )
};

export default Category;