import type { NextPageWithLayout } from '../_app';
import React, { Fragment, useState, ReactElement } from 'react'
import Head from 'next/head'
import Link from 'next/link';
import Expense from '../../components/budget/expense';
import CreateExpense from '../../components/budget/create-expense';
import EditExpense from '../../components/budget/edit-expense';
import Layout from '../../components/layouts/authenticated-layout';
import dayjs from 'dayjs';
import executeQuery from '../../utils/db';
import * as jose from 'jose';

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

        /** check if email is the same as the one in the id of URL */
        const result = await executeQuery({
            query: 'CALL selectEmail_Id(?)',
            values: [id],
        });

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
            query: 'CALL selectExpenseData_Month(?, ?)',
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
    const id = props.ID;    

    /** State to store current budget */
    const [budget, setBudget] = useState(props.Budget);
    /** State to store expense */
    const [expenses, setExpenses] = useState(props.Expense);
    /** State to control create expense popup */
    const [createExpense, setCreateExpense] = useState(false);
    /** State to control edit expense popup */
    const [editExpense, setEditExpense] = useState('');
    /** State to store expense */
    const [totalexpense, setTotalExpenses] = useState(props.TotalExpense);

    /* Used to set the color of the outer circle */
    var budgetDifference = budget - totalexpense
    var BudgetColor = 0
    if (budgetDifference > 0) {
        BudgetColor = 1
    }
    else if (budgetDifference < 0) {
        BudgetColor = 2
    };

    const funcProgressColor = () => {
        switch(BudgetColor) {
            case 0:
                return 'blue';
            case 1:
                return 'green';
            case 2:
                return 'red';
        }
    }

    const styles = {
        circleColor: {
            display: 'flex',
            width: `384px`,
            background: funcProgressColor(),
            padding: '32px',
            marginBottom: '25px',
            height: '384px',
            alignItems: "center",
            justifyContent: 'center',
            borderRadius: '9999px'
        }
    } as const; 

 

    const FormSubmitHandler = async () => {
        const response = await fetch('/api/'+id+'/budget/edit', 
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(
                    {
                        accountID: id,
                        budget: budget
                    }
                )
            }
        );

        if (response.status === 201) {
            fetch('/api/'+id+'/budget', 
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(
                    {
                        date: dayjs().format('YYYY-MM-DD')
                    }
                )
            }
        )
        .then(response => response.json())
        .then(data => setBudget(data.Budget));
        }
    };

    const handleCreateExpenseSuccess = () => {
        fetch('/api/'+id+'/expense', 
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(
                    {
                        date: dayjs().format('YYYY-MM-DD')
                    }
                )
            }
        )
        .then(response => response.json())
        .then(data => setExpenses(data));

        fetch('/api/'+id+'/expense/totalExpense', 
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(
                    {
                        date: dayjs().format('YYYY-MM-DD')
                    }
                )
            }
        )
        .then(response => response.json())
        .then(data => setTotalExpenses(data));


        handleCreateExpensePopupDisappear()
    }

    const handleEditExpenseSuccess = () => {
        fetch('/api/'+id+'/expense', 
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(
                    {
                        date: dayjs().format('YYYY-MM-DD')
                    }
                )
            }
        )
        .then(response => response.json())
        .then(data => {setExpenses(data)});

        fetch('/api/'+id+'/expense/totalExpense', 
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(
                    {
                        date: dayjs().format('YYYY-MM-DD')
                    }
                )
            }
        )
        .then(response => response.json())
        .then(data => setTotalExpenses(data));


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
                <title>Expense Tracker</title> 
                <meta name="viewport" content="initial-scale=1.0, width=device-width" />
            </Head>

            {/** Budget overview */}
            <div className='flex flex-col justify-center items-center h-full'>
                <div className='flex flex-col grow justify-start items-center m-8'>
                    <div style={styles.circleColor}>
                        <div className='flex flex-col justify-center items-center bg-slate-900 h-72 w-72 rounded-full'>
                            <p className='cursor-default text-slate-200 text-2xl font-semibold'>You've spent:</p>
                            <p className='cursor-default text-slate-200 text-3xl font-normal'>${totalexpense.toLocaleString(undefined, {minimumFractionDigits: 2})}</p>
                        </div>
                    </div>
                    <p className='cursor-default text-slate-200 text-2xl font-semibold mb-3'>This Month's Budget:</p>
                    <form>
                        <input 
                            type='number'
                            id='budget'
                            name='budget'
                            className='bg-slate-800 focus:bg-slate-900 text-lg text-slate-200 placeholder:text-slate-400 text-center border-2 border-slate-800 focus:border-blue-600 outline-none focus:outline-none w-72 px-3 py-2 rounded-t-lg duration-150 ease-in-out'
                            placeholder={JSON.stringify(props.Budget)}
                            defaultValue={props.Budget}
                            onChange={e => setBudget(Number(e.target.value))}
                            required
                        />
                        <br />
                        <input 
                            type='button'
                            value='Submit'
                            className='cursor-pointer self-center bg-blue-600 text-slate-200 hover:text-white w-72 rounded-b-lg duration-150 ease-in-out'
                            onClick={() => FormSubmitHandler()}
                        />
                    </form>
                </div>
            </div>

            {/** Expenses list */}
            <div className='flex flex-col grow justify-start items-center h-full pt-8 px-8 mr-8'>
                <div className='flex flex-row justify-between items-center w-full mb-2'>
                    <Link href={'/budget/history/' + id}>
                        <div className='group cursor-pointer flex justify-center items-center bg-slate-800 hover:bg-slate-700 mt-auto w-fit px-5 py-2 rounded-lg duration-150 ease-in-out'>
                            <p className='text-slate-200 group-hover:text-white duration-150 ease-in-out'>View History</p>
                        </div>
                    </Link>
                    <div className='flex grow justify-center items-center ml-10'>
                        <p className='cursor-default text-xl text-slate-200 font-bold'>{ dayjs().format('MMMM YYYY') }'s Expenses</p>
                    </div>
                    <div 
                        className='group cursor-pointer flex justify-center items-center hover:bg-slate-800 w-10 h-10 rounded-lg duration-150 ease-in-out'
                        onClick={() => handleCreateExpensePopupAppear()}
                    >
                        <i className='gg-plus group-hover:text-white duration-150 ease-in-out'></i>
                    </div>
                </div>
                {expenses.length === 0 ? 
                    <div className='flex flex-col grow justify-center items-center w-full mb-8'>
                        {/** display no expenses text if there are no category */}
                        <p className=''>No Expenses</p>
                    </div> 
                    :
                    <div className='flex flex-col grow justify-start items-center w-full'>
                        {expenses.map((expense, index) => (
                            <Expense expense={expense} editExpense={handleEditExpensePopupAppear} key={index} />
                        ))}
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