import React from 'react'
import dayjs from 'dayjs';

const ExpenseHistory = ({ expense, editExpense }) => {
    return (
        <tr className='bg-slate-800 rounded-lg border-b-4 border-slate-900 h-11' onClick={() => editExpense(expense['ID'])}>
            <td className='text-slate-200 text-lg font-semibold text-left pl-5'>{ expense['Name'] }</td>
            <td className='text-slate-200 text-lg font-semibold'>{ dayjs(expense['Date']).format('DD MMMM YYYY') }</td>
            <td className='text-slate-200 text-lg font-semibold text-right pr-5'>${ expense['Amount'].toLocaleString(undefined, {minimumFractionDigits: 2}) }</td>
        </tr >
    );
};

export default ExpenseHistory