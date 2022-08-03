import React, { Fragment, useState } from 'react';

const EditEvent = ({ id, event, categories, success, close }) => {
    const [eventName, setEventName] = useState(event.Name);
    const [date, setDate] = useState(event.Date);
    const [startTime, setStartTime] = useState(event.StartTime);
    const [endTime, setEndTime] = useState(event.EndTime);
    const [description, setDescription] = useState(event.Description);
    const [categoryId, setCategoryId] = useState(event.CategoryID)

    const FormSubmitHandler = async () => {
        const response = await fetch('/api/'+id+'/event/edit', 
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(
                    {
                        eventID : event.ID,
                        eventName: eventName, 
                        date: date,
                        startTime : startTime,
                        endTime : endTime,
                        description : description,
                        categoryId: categoryId
                    }
                )
            }
        );

        if (response.status === 201) {
            success();
        } else if (response.status === 400) {
            alert('Error 400: Request body format error.');
        } else if (response.status === 404) {
            alert('Error 404: Category not found');
            success();
        }
    }

    return (
        <Fragment>
            <div 
                className='absolute h-full w-full bg-black/40 inset-0' 
                onClick={() => close()}
            />
            <div className='absolute bg-slate-900 h-96 w-2/5 inset-0 px-3 py-3 m-auto rounded-xl'>
                <form className='flex flex-col justify-start items-start w-full'>
                    <div className='flex flex-row w-full'>
                        <input 
                            type='text'
                            id='eventName'
                            name='eventName'
                            className='grow bg-slate-800 focus:bg-slate-900 text-white placeholder:text-slate-400 border-2 border-slate-800 focus:border-blue-600 outline-none focus:outline-none px-3 py-2 mr-2 rounded-md duration-150 ease-in-out'
                            placeholder='Event Name'
                            value={ eventName }
                            onChange={e => setEventName(e.target.value)}
                            required
                        />
                        <select
                            id='eventCategory'
                            name='eventCategory'
                            className='bg-slate-800 focus:bg-slate-900 text-white placeholder:text-slate-400 border-2 border-slate-800 focus:border-blue-600 outline-none focus:outline-none px-3 py-2 rounded-md duration-150 ease-in-out'
                            value={ categoryId }
                            onChange={e => {setCategoryId(e.target.value); console.log(e.target.value)}}
                        >
                            <option
                                value='None'
                            >
                                None
                            </option>
                            {categories.map((category, index) => (
                                <option
                                    value={ category.ID }
                                    key={ index }
                                >
                                    { category.Name }
                                </option>
                            ))}
                        </select>
                    </div>
                    <input 
                        type='date'
                        id='newEventDate'
                        name='newEventDate'
                        className='bg-slate-800 focus:bg-slate-900 text-white placeholder:text-slate-400 border-2 border-slate-800 focus:border-blue-600 outline-none focus:outline-none w-full px-3 py-2 my-2 rounded-md duration-150 ease-in-out'
                        value={ date }
                        onChange={e => setDate(e.target.value)}
                        required
                    />
                    <div className='flex flex-row justify-start items-center w-full'>
                        <input 
                            type='time'
                            id=''
                            name=''
                            className='bg-slate-800 focus:bg-slate-900 grow text-white border-2 border-slate-800 focus:border-blue-600 outline-none focus:outline-none px-3 py-2 rounded-md duration-150 ease-in-out'
                            value={ startTime }
                            onChange={e => setStartTime(e.target.value)}
                            required
                        />
                        <p className='px-3 text-white'>to</p>
                        <input 
                            type='time'
                            id=''
                            name=''
                            className='bg-slate-800 focus:bg-slate-900 grow text-white border-2 border-slate-800 focus:border-blue-600 outline-none focus:outline-none px-3 py-2 rounded-md duration-150 ease-in-out'
                            value={ endTime }
                            onChange={e => setEndTime(e.target.value)}
                            required
                        />
                    </div>
                    <textarea 
                        id=''
                        name=''
                        rows='5'
                        className='bg-slate-800 focus:bg-slate-900 text-white placeholder:text-slate-400 border-2 border-slate-800 focus:border-blue-600 outline-none focus:outline-none w-full px-3 py-2 mt-2 rounded-md duration-150 ease-in-out'
                        placeholder='Description'
                        value={ description }
                        onChange={e => setDescription(e.target.value)}
                    />
                    <input 
                        type='button'
                        value='Confirm Changes'
                        className='cursor-pointer self-end bg-blue-600 text-slate-200 hover:text-white px-4 py-2 mt-5 rounded-md duration-150 ease-in-out'
                        onClick={() => FormSubmitHandler()}
                    />
                </form>
            </div>
        </Fragment>
    );
};

export default EditEvent;