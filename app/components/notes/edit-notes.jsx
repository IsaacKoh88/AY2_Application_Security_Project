import React, { Fragment, useState } from 'react';

const EditNotes = ({ notes, close, id }) => {
    const [name, setName] = useState(expense['Name']);
    const [amount, setAmount] = useState(expense['Amount']);
    const [date, setDate] = useState(expense['Date']);

    const FormSubmitHandler = async () => {
        const response = await fetch('/api/'+id+'/notes/edit', 
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(
                    {
                        accountID: id,
                        id: notes['ID'],
                        notesName: name,
                        date: date
                    }
                )
            }
        );
    }

    const FormSubmitHandler2 = async () => {
        const response = await fetch('/api/'+id+'/expense/delete', 
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(
                    {
                        accountID: id,
                        id: notes['ID'],
                    }
                )
            }
        );
    }


    return (
        <Fragment>
            <div 
                className='absolute h-full w-full bg-black/40 inset-0' 
                onClick={() => close()} 
            />
            <div className='absolute bg-slate-900 h-44 w-2/5 inset-0 px-3 py-3 m-auto rounded-xl'>
                <form className='flex flex-col justify-start items-start w-full'>
                    <input 
                        type='text'
                        id='expenseName'
                        name='expenseName'
                        className='bg-slate-800 w-full text-white text-xl font-semibold placeholder:text-slate-400 focus:outline-none px-3 py-2 rounded-md'
                        placeholder='To-do Name'
                        value={ name }
                        onChange={e => setName(e.target.value)}
                        required
                    />
                    <input 
                        type='number'
                        step="0.01"
                        id='expenseAmount'
                        name='expenseAmount'
                        className='bg-slate-800 w-full text-white focus:outline-none px-3 py-2 my-2 rounded-md'
                        placeholder='Amount ($)'
                        value={ amount }
                        onChange={e => setAmount(Number(e.target.value))}
                        required
                    />
                    <input 
                        type='submit'
                        value='Confirm Changes'
                        className='cursor-pointer self-left bg-blue-600 text-slate-200 hover:text-white px-4 py-2 mt-2.5 rounded-md duration-150 ease-in-out'
                        onClick={() => FormSubmitHandler()}
                    />
                    <input 
                        type='submit'
                        value='Delete Expense'
                        className='cursor-pointer self-right bg-blue-600 text-slate-200 hover:text-white px-4 py-2 mt-2.5 rounded-md duration-150 ease-in-out'
                        onClick={() => FormSubmitHandler2()}
                    />
                </form>
            </div>
        </Fragment>
    );
};

export default EditNotes;