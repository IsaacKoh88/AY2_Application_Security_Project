import React from 'react';

const Category = ({ category, changeStatus }) => {
    const getCategoryColor = Color => {
        if (Color === 'rose') {
            return 'checked:bg-rose-600';
        } else if (Color === 'pink') {
            return 'checked:bg-pink-600';
        } else if (Color === 'fuchsia') {
            return 'checked:bg-fuchsia-600';
        } else if (Color === 'purple') {
            return 'checked:bg-purple-600';
        } else if (Color === 'violet') {
            return 'checked:bg-violet-600';
        } else if (Color === 'indigo') {
            return 'checked:bg-indigo-600';
        } else if (Color === 'blue') {
            return 'checked:bg-blue-600';
        } else if (Color === 'sky') {
            return 'checked:bg-sky-600';
        } else if (Color === 'cyan') {
            return 'checked:bg-cyan-600';
        } else if (Color === 'teal') {
            return 'checked:bg-teal-600';
        } else if (Color === 'emerald') {
            return 'checked:bg-emerald-600';
        } else if (Color === 'green') {
            return 'checked:bg-green-600';
        } else if (Color === 'lime') {
            return 'checked:bg-lime-600';
        } else if (Color === 'yellow') {
            return 'checked:bg-yellow-600';
        } else if (Color === 'amber') {
            return 'checked:bg-amber-600';
        } else if (Color === 'orange') {
            return 'checked:bg-orange-600';
        } else if (Color === 'red') {
            return 'checked:bg-red-600';
        } else {
            return 'checked:bg-neutral-600';
        };
    };

    return (
        <form className='group cursor-pointer flex flex-row justify-start items-center w-full px-3 my-2'>
            <input 
                type="checkbox" 
                id={ category['Name'] } 
                name={ category['Name'] } 
                className={`appearance-none bg-slate-400 h-4 w-4 rounded ${getCategoryColor(category['Color'])}`} 
                onChange={e => changeStatus(e.target.id, e.target.checked)} checked={category['Activated']} 
            />
            <label htmlFor={ category['Name'] } className='group-hover:text-white ml-3 grow'>{category['Name']}</label>
        </form>
    )
};

export default Category;