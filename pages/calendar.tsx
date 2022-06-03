import type { NextPage } from 'next'
import { Fragment } from 'react'
import Head from 'next/head'
import Navbar from '../components/navbar';

const Calendar: NextPage = () => {
    return (
        <Fragment>
            <Head>
                <title>Account Details</title>
                <meta name="viewport" content="initial-scale=1.0, width=device-width" />
            </Head>

            <div className='h-screen w-screen text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-900'>
                <Navbar />
                <div className='w-full h-full'>
                    <div className='h-full w-80 bg-slate-800'>

                    </div>
                </div>
            </div>
        </Fragment>
    );
};

export default Calendar;