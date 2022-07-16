import React, { Fragment, useState } from 'react';

const EditCategory = ({ category, close }) => {
    const [name, setName] = useState(category['Name'])

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
                            id='categoryName'
                            name='categoryName'
                            className='bg-transparent w-2/3 text-white text-xl font-semibold placeholder:text-slate-400 focus:outline-none'
                            placeholder='Category Name'
                            value={ name }
                            onChange={e => setName(e.target.value)}
                            required
                        />
                        <div className='flex flex-row justify-center items-center w-full mt-4 mb-1 '>
                            <input 
                                type='submit'
                                value='Edit Category'
                                className='cursor-pointer bg-blue-600 text-slate-200 hover:text-white px-4 py-2 mr-2 rounded-md duration-150 ease-in-out'
                            />
                            <input 
                                type='button'
                                value='Delete Category'
                                className='cursor-pointer bg-red-600 text-slate-200 hover:text-white px-4 py-2 ml-2 rounded-md duration-150 ease-in-out'
                            />
                        </div>
                    </form>
                </div>
            </div>
        </Fragment>
    );
};

export default EditCategory;