import React, { Fragment } from 'react';
import { useState } from 'react'

const CreateCategory = ({ close }) => {
    const [categoryName, setCategoryName] = useState('');
    const [color, setColor] = useState('rose');

    const FormSubmitHandler = async () => {
        const res = await fetch('/api/create-category', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(
                {
                    categoryName: categoryName, 
                    color: color
                }
            )
        })
    }

    return (
        <Fragment>
            <div className='absolute h-full w-full bg-black/40 inset-0'></div>
            <div className='absolute flex justify-center items-center inset-0'>
                <div className='relative bg-slate-900 w-1/4 px-4 py-3 rounded-xl'>
                    <div 
                        className='group cursor-pointer absolute flex justify-center items-center h-6 w-6 top-3 right-3'
                        onClick={() => close()}
                    >
                        <i className='gg-close group-hover:text-white duration-150 ease-in-out'></i>
                    </div>
                    <form className='flex flex-col justify-start items-start w-full'>
                        <input 
                            type='text'
                            id='newCategoryName'
                            name='newCategoryName'
                            className='bg-transparent w-2/3 text-white text-xl font-semibold placeholder:text-slate-400 focus:outline-none'
                            placeholder='New Category'
                            onChange={e => setCategoryName(e.target.value)}
                            required
                        />
                        <input 
                            type='submit'
                            value='Create Category'
                            className='cursor-pointer self-center bg-blue-600 text-slate-200 hover:text-white px-4 py-2 mt-4 mb-1 rounded-md duration-150 ease-in-out'
                            onClick={FormSubmitHandler}
                        />
                    </form>
                </div>
            </div>
        </Fragment>
    );
};

export default CreateCategory;