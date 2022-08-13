import type { NextPageWithLayout } from '../../_app';
import React, { Fragment, useState, ReactElement } from 'react'
import Head from 'next/head'
import Link from 'next/link';
import ExpenseHistory from '../../../components/budget/view-expenseHistory';
import CreateExpense from '../../../components/budget/create-expense';
import EditExpense from '../../../components/budget/edit-expense';
import Layout from '../../../components/layouts/authenticated-layout';
import executeQuery from '../../../utils/connections/db';
import * as jose from 'jose';
import dayjs from 'dayjs';
import redisClient from '../../../utils/connections/redis';

type ExpenseProps = {
    ID: string;
    Name: string;
    Amount: number;
    Date: string;
}[]

type BudgetProps = {
    ID: number;
    Budget: number;
    TotalExpense: number;
    Expense: ExpenseProps;
}

export async function getServerSideProps(context:any) {
    
    const JWTtoken = context.req.cookies['token'];
    const id = context.params.id

    /** if JWT does not exist */
    if (JWTtoken == undefined){
        return {
            redirect: {
                destination: '/401',
                permanent: false,
            },
        }
    }

    try {
        /** check if JWT token is valid */
        const email = await jose.jwtVerify(JWTtoken, new TextEncoder()
                    .encode(`qwertyuiop`))
                    .then(value => {return(value['payload']['email'])});

        /** check if JWT token is blacklisted */
        await redisClient.connect();
        const keyBlacklisted = await redisClient.exists('bl_'+context.req.cookies['token']);
        await redisClient.disconnect();

        if (keyBlacklisted) {
            return {
                redirect: {
                    destination: '/login',
                    permanent: false,
                },
            };
        }

        /** check if email is the same as the one in the id of URL */
        const result = JSON.parse(JSON.stringify(await executeQuery({
            query: 'CALL selectEmail_Id(?)',
            values: [id],
        })));

        /** reject if user does not have permission to route */
        if (result[0][0].email !== email) {
            return {
                redirect: {
                    destination: '/403',
                    permanent: false,
                },
            };
        };

        const resultTotalExpense = JSON.parse(JSON.stringify(await executeQuery({
            query: 'CALL selectSumExpense_AccountID_Month(?, ?)',
            values: [id, dayjs().format('YYYY-MM-DD')],
        })));      

        const resultExpense = JSON.parse(JSON.stringify(await executeQuery({
            query: 'CALL selectExpenseData_DateDesc(?, ?)',
            values: [id, dayjs().format('YYYY-MM-DD')],
        })));

        const resultBudget = JSON.parse(JSON.stringify(await executeQuery({
            query: 'CALL selectBudget_AccountID(?)',
            values: [id],
        })));
        
        var totalExpense = 0
        if (resultTotalExpense[0][0]['TotalExpense'] !== null) {
            totalExpense = resultTotalExpense[0][0]['TotalExpense']
        }

        try {
            return{
                props: {
                    ID: id,
                    Budget: resultBudget[0][0]['Budget'],
                    TotalExpense: totalExpense,
                    Expense: resultExpense[0]
                }
            }
        } 
        catch (error) {
            console.log(error)
        }  
    } 
    
    catch (error) {
        /** reject if JWT token is invalid */
        return {
            redirect: {
                destination: '/403',
                permanent: false,
            },
        }
    };  
};


const Budget: NextPageWithLayout<BudgetProps> = (props) => {
    const id = props.ID
    /** State to store expense */
    const [expenses, setExpenses] = useState(props.Expense);
    const [totalExpense, setTotalExpenses] = useState(props.TotalExpense);
    const [date, setDate] = useState(dayjs().format('YYYY-MM-DD'))
    const [dateButton, setDateButton] = useState('triangle-down')
    const [nameButton, setNameButton] = useState('single-line')
    const [amountButton, setAmountButton] = useState('single-line')
    const [createExpense, setCreateExpense] = useState(false);
    const [editExpense, setEditExpense] = useState('');

    const previousMonth = async () => {
        var newMonth = dayjs(date).month()-1
        var d = new Date(dayjs(date).year(), newMonth, dayjs(date).date())
        setDate(dayjs(d).format('YYYY-MM-DD'))

        setDateButton('triangle-down') 
        setNameButton('single-line')
        setAmountButton('single-line')

        await fetch('/api/'+id+'/expense/historyOrder', 
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(
                    {
                        OrderBy: 'Date Descending',
                        ID: id,
                        Month: dayjs(d).format('YYYY-MM-DD')
                    }
                )
            }
        )
        .then(response => response.json())  
        .then(data => {setExpenses(data.Result), setTotalExpenses(data.totalExpense)});   
    };

    const nextMonth = async () => {
        var newMonth = dayjs(date).month()+1
        var d = new Date(dayjs(date).year(), newMonth, dayjs(date).date())
        setDate(dayjs(d).format('YYYY-MM-DD'))

        setDateButton('triangle-down') 
        setNameButton('single-line')
        setAmountButton('single-line')

        await fetch('/api/'+id+'/expense/historyOrder', 
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(
                        {
                            OrderBy: 'Date Descending',
                            ID: id,
                            Month: dayjs(d).format('YYYY-MM-DD')
                        }
                    )
                }
            )
            .then(response => response.json())  
            .then(data => {setExpenses(data.Result), setTotalExpenses(data.totalExpense)});   
    };

    const orderByDate = async () => {
        if (dateButton == 'triangle-down'){
            setDateButton('triangle-up') 
            setNameButton('single-line')
            setAmountButton('single-line')

            await fetch('/api/'+id+'/expense/historyOrder', 
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(
                        {
                            OrderBy: 'Date Ascending',
                            ID: id,
                            Month: date
                        }
                    )
                }
            )
            .then(response => response.json())  
            .then(data => {setExpenses(data.Result)});   
        }
        else if (dateButton == 'triangle-up' || dateButton == 'single-line'){
            setDateButton('triangle-down')
            setNameButton('single-line')
            setAmountButton('single-line')
            
            await fetch('/api/'+id+'/expense/historyOrder', 
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(
                        {
                            OrderBy: 'Date Descending',
                            ID: id,
                            Month: date
                        }
                    )
                }
            )
            .then(response => response.json())  
            .then(data => {setExpenses(data.Result)});   
        }
    }

    const orderByName = async () => {
        if (nameButton == 'triangle-down'){
            setDateButton('single-line') 
            setNameButton('triangle-up')
            setAmountButton('single-line')
            
            await fetch('/api/'+id+'/expense/historyOrder', 
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(
                        {
                            OrderBy: 'Name Ascending',
                            ID: id,
                            Month: date
                        }
                    )
                }
            )
            .then(response => response.json())  
            .then(data => {setExpenses(data.Result)});   
        }
        else if (nameButton == 'triangle-up' || nameButton == 'single-line'){
            setDateButton('single-line')
            setNameButton('triangle-down')
            setAmountButton('single-line')
            
            await fetch('/api/'+id+'/expense/historyOrder', 
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(
                        {
                            OrderBy: 'Name Descending',
                            ID: id,
                            Month: date
                        }
                    )
                }
            )
            .then(response => response.json())  
            .then(data => {setExpenses(data.Result)});   
        }
    }

    const orderByAmount = async () => {
        if (amountButton == 'triangle-down'){
            setDateButton('single-line') 
            setNameButton('single-line')
            setAmountButton('triangle-up')
            
            await fetch('/api/'+id+'/expense/historyOrder', 
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(
                        {
                            OrderBy: 'Amount Ascending',
                            ID: id,
                            Month: date
                        }
                    )
                }
            )
            .then(response => response.json())  
            .then(data => {setExpenses(data.Result)});   
        }
        else if (amountButton == 'triangle-up' || amountButton == 'single-line'){
            setDateButton('single-line')
            setNameButton('single-line')
            setAmountButton('triangle-down')
            
            await fetch('/api/'+id+'/expense/historyOrder', 
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(
                        {
                            OrderBy: 'Amount Descending',
                            ID: id,
                            Month: date
                        }
                    )
                }
            )
            .then(response => response.json())  
            .then(data => {setExpenses(data.Result)});   
        }
    }
    
    const handleCreateExpenseSuccess = () => {
        fetch('/api/'+id+'/expense/historyOrder', 
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(
                    {
                        OrderBy: 'Date Descending',
                        ID: id,
                        Month: date
                    }
                )
            }
        )
        .then(response => response.json())
        .then(data => {setExpenses(data.Result), setTotalExpenses(data.totalExpense)});

        handleCreateExpensePopupDisappear()
    }

    const handleEditExpenseSuccess = () => {
        fetch('/api/'+id+'/expense/historyOrder', 
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(
                    {
                        OrderBy: 'Date Descending',
                        ID: id,
                        Month: date
                    }
                )
            }
        )
        .then(response => response.json())
        .then(data => {setExpenses(data.Result), setTotalExpenses(data.totalExpense)});

        handleEditExpensePopupDisappear()
    }

    /** Opens create expense popup */
    const handleCreateExpensePopupAppear = () => {
        setCreateExpense(true);
    };
    /** Closes create expense popup */
    const handleCreateExpensePopupDisappear = () => {
        setCreateExpense(false);
    };
    /** Opens edit expense popup */
    const handleEditExpensePopupAppear = (index: string) => {
        setEditExpense(index);
    };
    /** Closes edit expense popup */
    const handleEditExpensePopupDisappear = () => {
        setEditExpense('');
    };

    return (
        <Fragment>
            <Head>
                <title>Expense History</title> 
                <meta name="viewport" content="initial-scale=1.0, width=device-width" />
            </Head>

            {/** Expenses list */}
            <div className='flex flex-col grow justify-start items-center h-full pt-8 px-8 mr-8'>
                <div className='flex flex-row justify-evenly items-center w-full pb-10'>
                    <button onClick={previousMonth}>
                        <span className="text-3xl text-slate-200 font-bold">&lt;</span>
                    </button>
                    <p className='text-3xl text-slate-200 font-bold'>{dayjs(date).format('MMMM YYYY')} History</p>
                    <button onClick={nextMonth}>
                        <span className="text-3xl text-slate-200 font-bold">&gt;</span>
                    </button>
                </div>
                
                {expenses.length === 0 ? 
                    <div>
                        <div className='flex flex-col grow justify-center items-center w-full mb-8'>
                            <p className=''>No Expenses</p>
                        </div> 
                        <div className='group flex flex-row justify-start items-center px-3 py-2 my-2 w-full'>
                            <Link href={'/budget'}>
                                <div className='group cursor-pointer flex justify-center items-center bg-slate-800 hover:bg-slate-700 mt-auto w-fit px-5 py-2 rounded-lg duration-150 ease-in-out mr-5'>
                                    <p className='text-slate-200 group-hover:text-white duration-150 ease-in-out'>View Budget</p>
                                </div>
                            </Link>
                            <button onClick={() => handleCreateExpensePopupAppear()}>
                                <div className='group cursor-pointer flex justify-center items-center bg-slate-800 hover:bg-slate-700 mt-auto w-fit px-5 py-2 rounded-lg duration-150 ease-in-out'>
                                    <p className='text-slate-200 group-hover:text-white duration-150 ease-in-out'>Add Expense</p>
                                </div>
                            </button>
                            </div>
                    </div>
                    :
                    <div className='flex flex-col grow justify-start items-center w-full'>                           
                        <table className='w-full table-fixed text-center'>
                            <tbody>
                                <tr className='h-10'>
                                    <th className='text-slate-200 text-lg font-bold text-left pl-3'>
                                        <div className='group cursor-pointer flex justify-start items-center text-left' onClick={() => orderByName()}>
                                            Name &nbsp; 
                                            <span>
                                                <i className={nameButton}/>
                                            </span>
                                        </div>
                                    </th>
                                    <th className='text-slate-200 text-lg font-bold text-center'>
                                        <div className='group cursor-pointer flex justify-center items-center text-center' onClick={() => orderByDate()}>
                                            Date &nbsp; 
                                            <span>
                                                <i className={dateButton}/>
                                            </span>
                                        </div>
                                    </th>
                                    <th className='text-slate-200 text-lg font-bold text-right pr-8'>
                                    <div className='group cursor-pointer flex justify-end items-center text-center' onClick={() => orderByAmount()}>
                                            Amount &nbsp; 
                                            <span>
                                                <i className={amountButton}/>
                                            </span>
                                        </div>
                                    </th>
                                </tr>
                                {expenses.map((expense, index) => (
                                    <ExpenseHistory expense={expense} editExpense={handleEditExpensePopupAppear} key={index} />
                                ))}
                            </tbody>
                        </table>
                        <div className='group flex flex-row justify-between items-center px-3 py-2 my-2 w-full'>
                            <div className='group flex flex-row justify-start items-center px-3 py-2 my-2 w-fit'>
                                <Link href={'/budget'}>
                                    <div className='group cursor-pointer flex justify-center items-center bg-slate-800 hover:bg-slate-700 mt-auto w-fit px-5 py-2 rounded-lg duration-150 ease-in-out mr-5'>
                                        <p className='text-slate-200 group-hover:text-white duration-150 ease-in-out'>View Budget</p>
                                    </div>
                                </Link>
                                <button onClick={() => handleCreateExpensePopupAppear()}>
                                    <div className='group cursor-pointer flex justify-center items-center bg-slate-800 hover:bg-slate-700 mt-auto w-fit px-5 py-2 rounded-lg duration-150 ease-in-out'>
                                        <p className='text-slate-200 group-hover:text-white duration-150 ease-in-out'>Add Expense</p>
                                    </div>
                                </button>
                            </div>

                            <div className='text-slate-200 text-xl'>
                                Total Amount: $
                                <span className='underline text-2xl'>{ totalExpense.toLocaleString(undefined, {minimumFractionDigits: 2}) } </span>
                            </div>
                        </div>  
                    </div>
                }
            </div>

            {/** create expense form */}
            {createExpense ?
                <CreateExpense close={handleCreateExpensePopupDisappear} id={id} success={handleCreateExpenseSuccess} />
                :
                <></>
            }

            {/** edit expense form */}
            {editExpense !== '' ?
                <EditExpense expense={expenses.find(e => e['ID'] === editExpense)} close={handleEditExpensePopupDisappear} id={id} success={handleEditExpenseSuccess} />
                :
                <></>
            }
        </Fragment>
    );
};

Budget.getLayout = function getLayout(Budget: ReactElement) {
    return (
        <Layout>
            {Budget}
        </Layout>
    );
};

export default Budget;