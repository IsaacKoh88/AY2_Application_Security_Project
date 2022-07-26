import type { NextPageWithLayout } from '../../_app';
import React, { Fragment, useState, ReactElement } from 'react'
import Head from 'next/head'
import Link from 'next/link';
import ExpenseHistory from '../../../components/budget/view-expenseHistory';
import Layout from '../../../components/layouts/authenticated-layout';
import dayjs from 'dayjs';
import executeQuery from '../../../utils/db';
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
            query: 'CALL selectSumExpense_AccountID(?)',
            values: [id],
        })));

        const resultExpense = JSON.parse(JSON.stringify(await executeQuery({
            query: 'CALL selectExpenseHistory(?)',
            values: [id],
        })));
        console.log(resultExpense)

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
    /** State to store expense */
    const [expenses, setExpenses] = useState(props.Expense);

    return (
        <Fragment>
            <Head>
                <title>Expense Tracker</title> 
                <meta name="viewport" content="initial-scale=1.0, width=device-width" />
            </Head>

            {/** Expenses list */}
            <div className='flex flex-col grow justify-start items-center h-full pt-8 px-8 mr-8'>
                <div className='flex flex-row justify-between items-center w-full mb-2'>
                    <div className='flex grow justify-center items-center ml-10'>
                        <p className='cursor-default text-3xl text-slate-200 font-bold pb-10'>Expense History</p>
                    </div>
                </div>
                
                {expenses.length === 0 ? 
                    <div className='flex flex-col grow justify-center items-center w-full mb-8'>
                        {/** display no expenses text if there are no category */}
                        <p className=''>No Expenses</p>
                    </div> 
                    :
                    <div className='flex flex-col grow justify-start items-center w-full'>                           
                        <table className='w-full table-fixed text-center'>
                            <tbody>
                                <tr className='h-10'>
                                    <th className='text-slate-200 text-lg font-bold text-left pl-3'>Name</th>
                                    <th className='text-slate-200 text-lg font-bold'>Date</th>
                                    <th className='text-slate-200 text-lg font-bold text-right pr-3'>Amount</th>
                                </tr>
                                {expenses.map((expense, index) => (
                                    <ExpenseHistory expense={expense} key={index} />
                                ))}
                            </tbody>
                        </table>
                        <div className='group cursor-pointer flex flex-row justify-between items-center px-3 py-2 my-2 w-full '>
                            <Link href={'/budget'}>
                                <div className='group cursor-pointer flex justify-center items-center bg-slate-800 hover:bg-slate-700 mt-auto w-fit px-5 py-2 rounded-lg duration-150 ease-in-out'>
                                    <p className='text-slate-200 group-hover:text-white duration-150 ease-in-out'>View Budget</p>
                                </div>
                            </Link>

                            <div className='text-slate-200 text-xl'>
                                Total Amount: $
                                <span className='underline text-2xl'>{ props.TotalExpense.toLocaleString(undefined, {minimumFractionDigits: 2}) } </span>
                            </div>
                        </div>                        
                    </div>
                }

            </div>
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