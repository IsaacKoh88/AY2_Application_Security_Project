import React, { Fragment, useState } from 'react';

const EditExpense = ({ expense, close, id, success }) => {
    const [name, setName] = useState(expense.Name);
    const [amount, setAmount] = useState(expense.Amount);
    const [date, setDate] = useState(expense.Date);

    const FormSubmitHandler = async () => {
        const response = await fetch('/api/'+id+'/expense/edit', 
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(
                    {
                        accountID: id,
                        id: expense.ID,
                        expenseName: name,
                        amount: amount, 
                        date: date
                    }
                )
            }
        );

        if (response.status === 201) {
            success();
        } else if (response.status === 400) {
            alert('Error 400: Request body format error.');
        } else if (response.status === 500) {
            alert('Error 500: Internal server error.');
        } else if (response.status === 409) {
            alert('Error 409: Too many expenses for that month.');
        } else if (response.status === 401) {
            router.push('/login');
        } else if (response.status === 403) {
            alert('Error 403: Unauthorised.')
            router.reload();
        } else if (response.status === 429) {
            alert('Error 429: Rate limited.')
        }
    }

    const DeleteHandler = async () => {
        const response = await fetch('/api/'+id+'/expense/delete', 
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(
                    {
                        accountID: id,
                        id: expense.ID,
                    }
                )
            }
        );

        if (response.status === 201) {
            success();
        };
    }


    return (
        <Fragment>
            <div 
                className='absolute h-full w-full bg-black/40 inset-0' 
                onClick={() => close()} 
            />
            <div className='absolute bg-slate-900 h-56 w-2/5 inset-0 px-3 py-3 m-auto rounded-xl'>
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
                        type='date'
                        id='newEventDate'
                        name='newEventDate'
                        className='bg-slate-800 focus:bg-slate-900 text-white placeholder:text-slate-400 border-2 border-slate-800 focus:border-blue-600 outline-none focus:outline-none w-full px-3 py-2 my-2 rounded-md duration-150 ease-in-out'
                        defaultValue={ date }
                        onChange={e => setDate(e.target.value)}
                        required
                    />
                    <input 
                        type='number'
                        step="0.01"
                        id='expenseAmount'
                        name='expenseAmount'
                        className='bg-slate-800 w-full text-white focus:outline-none px-3 py-2 rounded-md'
                        placeholder='Amount ($)'
                        defaultValue={ amount }
                        onChange={e => setAmount(Number(e.target.value))}
                        required
                    />
                    <div className='flex flex-row justify-center items-center mt-3.5 w-full'>
                        <input 
                            type='button'
                            value='Confirm Changes'
                            className='cursor-pointer self-left bg-blue-600 text-slate-200 hover:text-white px-4 py-2 mr-2 rounded-md duration-150 ease-in-out'
                            onClick={() => FormSubmitHandler()}
                        />
                        <input 
                            type='button'
                            value='Delete Expense'
                            className='cursor-pointer self-right bg-red-600 text-slate-200 hover:text-white px-4 py-2 ml-2 rounded-md duration-150 ease-in-out'
                            onClick={() => DeleteHandler()}
                        />
                    </div>
                </form>
            </div>
        </Fragment>
    );
};

export default EditExpense;