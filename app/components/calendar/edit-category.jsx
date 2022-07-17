import React, { Fragment, useState } from 'react';
import colors from '../../utils/colors';

const EditCategory = ({ category, close }) => {
    const [name, setName] = useState(category['Name'])

    return (
        <Fragment>
            <div 
                className='absolute h-full w-full bg-black/40 inset-0'
                onClick={() => close()}
            />
            <div className='absolute bg-slate-900 h-32 w-2/5 inset-0 px-3 py-3 m-auto rounded-xl'>
                <form className='flex flex-col justify-start items-start w-full'>
                    <div className='flex flex-row w-full'>
                        <input 
                            type='text'
                            id='categoryName'
                            name='categoryName'
                            className='grow bg-slate-800 focus:bg-slate-900 text-white placeholder:text-slate-400 border-2 border-slate-800 focus:border-blue-600 outline-none focus:outline-none px-3 py-2 mr-2 rounded-md duration-150 ease-in-out'
                            placeholder='Category Name'
                            value={ name }
                            onChange={e => setName(e.target.value)}
                            required
                        />
                        <select
                            id='eventCategory'
                            name='eventCategory'
                            className='bg-slate-800 focus:bg-slate-900 text-white placeholder:text-slate-400 border-2 border-slate-800 focus:border-blue-600 outline-none focus:outline-none px-3 py-2 rounded-md duration-150 ease-in-out'
                        >
                            {colors.map((color, index) => (
                                <option
                                    value={ color }
                                    key={ index }
                                >
                                    { color['Name'] }
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className='flex flex-row justify-center items-center w-full mt-4 mb-1 '>
                        <input 
                            type='submit'
                            value='Confim Changes'
                            className='cursor-pointer bg-blue-600 text-slate-200 hover:text-white px-4 py-2 mr-2 rounded-md duration-150 ease-in-out'
                        />
                        <input 
                            type='button'
                            value='Delete'
                            className='cursor-pointer bg-red-600 text-slate-200 hover:text-white px-4 py-2 ml-2 rounded-md duration-150 ease-in-out'
                        />
                    </div>
                </form>
            </div>
        </Fragment>
    );
};

export default EditCategory;