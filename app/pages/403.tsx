import type { NextPage } from 'next'
import { Fragment } from 'react'
import Head from 'next/head'
import Navbar from '../components/navbar'
import Link from 'next/link'

const Error403: NextPage = () => {
    return (
        <Fragment>
            <Head>
                <title>403: Unauthorized Access</title>
                <meta name="viewport" content="initial-scale=1.0, width=device-width" />
            </Head>

            <div className='flex flex-col justify-start items-center h-screen w-screen text-slate-600 bg-slate-900'>
                <Navbar />
                <div className='container flex justify-center items-center flex-grow'>
                    <div className='flex flex-row justify-start items-start h-fit w-[80%] bg-white rounded-2xl p-5 mb-8'>
                        <div className='h-fit w-[40%]  p-5 mb-8'>
                            <img src='/403.png' />
                        </div>
                        <div>
                            <div className='w-fit p-5 text-5xl'>
                                <span>Unauthorized Access</span>
                            </div>
                            <div className='w-fit p-5'>
                                We are sorry, but your current account does not have access to this page
                                <br/>
                                Please&nbsp;
                                <Link href='/'>
                                    <a className='text-slate-500 underline'>switch account</a>
                                </Link> 
                                &nbsp;or go back to the&nbsp;
                                <Link href='/'>
                                    <a className='text-slate-500 underline'>home</a>
                                </Link>
                                &nbsp;page to continue.
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Fragment>
    );
};

export default Error403;