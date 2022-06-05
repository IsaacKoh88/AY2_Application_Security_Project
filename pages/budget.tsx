import type { NextPage } from 'next'
import { Fragment } from 'react'
import Head from 'next/head'
import Navbar from '../components/navbar'

const Signup: NextPage = () => {
    return (
        <Fragment>
            <Head>
                <title>Login Page</title>
                <meta name="viewport" content="initial-scale=1.0, width=device-width" />
            </Head>

            <div className='flex flex-row justify-start items-center h-screen w-screen text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-900'>
                <div className='container flex flex-col justify-start items-center flex-grow h-full'>
                    <Navbar />
                </div>
                <div className='flex flex-col justify-start items-center bg-slate-100 dark:bg-slate-800 h-full w-[550px]'>
                    
                </div>
            </div>
        </Fragment>
    );
};

export default Signup;