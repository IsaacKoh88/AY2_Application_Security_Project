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

            <div className='flex flex-row h-screen w-screen text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-900'>
                <div className='flex flex-col justify-start items-center h-full w-20 border-r-2 border-slate-800'>
                    <div className='relative flex justify-center items-center h-20 w-20 mb-4 before:absolute before:bottom-0 before:h-px before:w-1/2 before:border-b-2 before:border-slate-800'>
                        <div className='h-10 w-10 rounded-lg bg-slate-800'></div>
                    </div>
                    <NavItem href='/' img='gg-align-left' />
                    <NavItem href='/' img='gg-calendar-dates' />
                    <NavItem href='/' img='gg-album' />
                    <NavItem href='/' img='gg-credit-card' />
                </div>
                <div className='flex flex-col grow'>
                    <div className='relative flex flex-row items-center h-20 w-full px-10 before:absolute before:bottom-0 before:left-5 before:right-5 before:h-px before:border-b-2 before:border-slate-800'>
                        <div className='flex justify-center items-center grow h-full'>
                            <div className='cursor-pointer flex flex-row justify-start items-center px-5 h-12 w-1/2 rounded-xl hover:text-slate-200 duration-150 bg-slate-800'>
                                <i className='gg-search'></i>
                                <p className='ml-4'>Search...</p>
                            </div>
                        </div>
                        <div className='cursor-pointer flex justify-center items-center h-10 w-10 rounded-lg bg-indigo-600 mr-10'>
                            <i className='text-slate-200 gg-notification'></i>
                        </div>
                        <div className='cursor-pointer flex flex-row justify-center items-center h-12 mr-3 hover:text-slate-200 duration-150'>
                            <div className='h-12 w-12 rounded-full bg-slate-800'></div>
                            <p className='mx-3'>Username</p>
                            <i className='gg-chevron-down'></i>
                        </div>
                    </div>
                </div>
            </div>
        </Fragment>
    );
};

export default Calendar;