import React from 'react';

const Category = ({ category }) => {
    const getCategoryColor = () => {

    };

    return (
        <div className='cursor-pointer flex flex-row justify-between items-center w-full bg-slate-800 px-3 py-2 my-2 rounded-lg'>
            <p className=''>{category['Name']}</p>
        </div>
    )
};

export default Category;