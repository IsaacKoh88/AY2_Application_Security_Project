import type { NextPage } from 'next'
import { Fragment } from 'react'
import Head from 'next/head'
import NavItem from '../../components/nav-items';

const Calendar: NextPage = () => {
    return (
        <Fragment>
            <Head>
                <title>Account Details</title>
                <meta name="viewport" content="initial-scale=1.0, width=device-width" />
            </Head>

            <div className='h-screen w-screen text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-900'>
                <div className='flex flex-col justify-start items-center h-full w-20 border-r-2 border-slate-800'>
                    <div className='relative flex justify-center items-center h-20 w-20 mb-4 before:absolute before:bottom-0 before:h-px before:w-1/2 before:border-b-2 before:border-slate-800'>
                        <div className='h-10 w-10 rounded-lg bg-slate-800'></div>
                    </div>
                    <NavItem href='/' img='gg-align-left' />
                    <NavItem href='/' img='gg-calendar-dates' />
                    <NavItem href='/' img='gg-album' />
                    <NavItem href='/' img='gg-credit-card' />
                </div>
            </div>
        </Fragment>
    );
};

export default Calendar;