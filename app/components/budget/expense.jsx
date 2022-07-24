import React from 'react'

const Expense = ({ expense, editExpense }) => {
    return (
        <div 
            className='group cursor-pointer flex flex-row justify-between items-center bg-slate-800 px-3 py-2 my-2 w-full rounded-lg'
            onClick={() => editExpense(expense['ID'])}
        >
            <p className='text-slate-200 group-hover:text-white text-lg font-semibold'>{ expense['Name'] }</p>
            <p className='text-slate-200 group-hover:text-white text-lg font-semibold'>${ expense['Amount'].toLocaleString(undefined, {minimumFractionDigits: 2}) }</p>
        </div>
    );
};

export default Expense