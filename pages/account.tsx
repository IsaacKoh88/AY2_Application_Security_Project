import type { NextPage } from 'next'
import { Fragment } from 'react'
import Head from 'next/head'
import Navbar from '../components/navbar'

const Account: NextPage = () => {
    return (
        <Fragment>
            <Head>
                <title>Account Details</title>
                <meta name="viewport" content="initial-scale=1.0, width=device-width" />
            </Head>

            <div className='h-screen w-screen text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-900'>
                <Navbar />
                <div className='container h-full'>
                </div>
            </div>
        </Fragment>
    );
};

export default Account;