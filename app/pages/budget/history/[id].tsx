import type { NextPageWithLayout } from '../../_app';
import React, { Fragment, useState, ReactElement } from 'react'
import Head from 'next/head'
import Expense from '../../../components/budget/expense';
import CreateExpense from '../../../components/budget/create-expense';
import EditExpense from '../../../components/budget/edit-expense';
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

        const resultTotalExpense = JSON.parse(JSON.stringify(await executeQuery({
            query: 'select sum(amount) TotalExpense from expense where AccountId = ?',
            values: [id],
        })));

        const resultExpense = JSON.parse(JSON.stringify(await executeQuery({
            query: 'select ID, Name, Amount, DATE_FORMAT(Date, "%Y-%m-%d") Date from expense where AccountId = ?',
            values: [id],
        })));

        const resultBudget = JSON.parse(JSON.stringify(await executeQuery({
            query: 'select Budget from budget where AccountId = ?',
            values: [id],
        })));
        
        var totalExpense = 0
        if (resultTotalExpense[0]['TotalExpense'] !== null) {
            totalExpense = resultTotalExpense[0]['TotalExpense']
        }

        try {
            return{
                props: {
                    ID: id,
                    Budget: resultBudget[0]['Budget'],
                    TotalExpense: totalExpense,
                    Expense: resultExpense
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
    const [budget, setBudget] = useState(0);
    /** State to store expense */
    const [expenses, setExpenses] = useState(props.Expense);
    /** State to control create expense popup */
    const [createExpense, setCreateExpense] = useState(false);
    /** State to control edit expense popup */
    const [editExpense, setEditExpense] = useState('');

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
        .then(data => setExpenses(data));

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