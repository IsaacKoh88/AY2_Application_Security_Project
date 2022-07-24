import React, { Fragment, useState } from 'react';
import dayjs from 'dayjs';

const CreateExpense = ({ id, close }) => {
    const [name, setName] = useState('');
    const [amount, setAmount] = useState();
    
    const FormSubmitHandler = async () => {
        const response = await fetch('/api/'+id+'/expense/create', 
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(
                    {
                        accountID: id,
                        expenseName: name, 
                        amount: amount,
                        date: dayjs().format('YYYY-MM-DD')
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
                        placeholder='Expense Name'
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
                        type='button'
                        value='Confirm Changes'
                        className='cursor-pointer self-center bg-blue-600 text-slate-200 hover:text-white px-4 py-2 mt-2.5 rounded-md duration-150 ease-in-out'
                        onClick={() => FormSubmitHandler()}
                    />
                </form>
            </div>
        </Fragment>
    );
};

export default CreateExpense;