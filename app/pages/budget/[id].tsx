import type { NextPageWithLayout } from '../_app';
import React, { Fragment, useState, ReactElement } from 'react'
import Head from 'next/head'
import Expense from '../../components/budget/expense';
import CreateExpense from '../../components/budget/create-expense';
import EditExpense from '../../components/budget/edit-expense';
import Layout from '../../components/layouts/authenticated-layout';
import dayjs from 'dayjs';
import executeQuery from '../../utils/db';
import * as jose from 'jose';

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
            query: 'SELECT email FROM account WHERE id=?',
            values: [id],
        });

        /** reject if user does not have permission to route */
        if (result[0].email !== email) {
            return {
                redirect: {
                    destination: '/401',
                    permanent: false,
                },
            };
        };

        try {
            return{
                props: {
                    id: id
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


const Budget: NextPageWithLayout = (id) => {
    /** State to store current budget */
    const [budget, setBudget] = useState(0);
    /** State to store expense */
    const [expenses, setExpenses] = useState([
        {
            ID : 'a953b8bb-c4d0-44cb-bfee-5538647f02b4',
            Name : 'Expense 1',
            Amount : 500
        },
    ]);
    /** State to control create expense popup */
    const [createExpense, setCreateExpense] = useState(false);
    /** State to control edit expense popup */
    const [editExpense, setEditExpense] = useState('');

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
                <title>Account Details</title> 
                <meta name="viewport" content="initial-scale=1.0, width=device-width" />
            </Head>

            {/** Budget overview */}
            <div className='flex flex-col justify-center items-center h-full'>
                <div className='flex flex-col grow justify-start items-center m-8'>
                    <div className='flex justify-center items-center bg-indigo-600 h-96 w-96 m-8 rounded-full'>
                        <div className='flex flex-col justify-center items-center bg-slate-900 h-72 w-72 rounded-full'>
                            <p className='cursor-default text-slate-200 text-2xl font-semibold'>You've spent:</p>
                            <p className='cursor-default text-slate-200 text-3xl font-normal'>$6,000</p>
                        </div>
                    </div>
                    <p className='cursor-default text-slate-200 text-2xl font-semibold mb-3'>This Month's Budget:</p>
                    <input 
                        type='number'
                        id='budget'
                        name='budget'
                        className='bg-slate-800 focus:bg-slate-900 text-lg text-slate-200 placeholder:text-slate-400 text-center border-2 border-slate-800 focus:border-blue-600 outline-none focus:outline-none w-72 px-3 py-2 rounded-lg duration-150 ease-in-out'
                        placeholder='Budget'
                        value={ budget }
                        onChange={e => setBudget(Number(e.target.value))}
                        required
                    />
                </div>
            </div>

            {/** Expenses list */}
            <div className='flex flex-col grow justify-start items-center h-full pt-8 px-8 mr-8'>
                <div className='flex flex-row justify-between items-center w-full mb-2'>
                    <div className='flex grow justify-center items-center ml-10'>
                        <p className='cursor-default text-xl text-slate-200 font-bold'>{ dayjs().format('MMMM') }'s Expenses</p>
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
                <CreateExpense close={handleCreateExpensePopupDisappear} id={id}/>
                :
                <></>
            }

            {/** edit expense form */}
            {editExpense !== '' ?
                <EditExpense expense={expenses.find(e => e['ID'] === editExpense)} close={handleEditExpensePopupDisappear} />
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