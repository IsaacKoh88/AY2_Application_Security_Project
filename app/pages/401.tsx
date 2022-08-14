import type { NextPage } from 'next'
import { Fragment } from 'react'
import Head from 'next/head'
import Navbar from '../components/navbar'
import Link from 'next/link'

const Error401: NextPage = () => {
    return (
        <Fragment>
            <Head>
                <title>401: Unauthenticated Access</title>
                <meta name="viewport" content="initial-scale=1.0, width=device-width" />
            </Head>

            <div className='flex flex-col justify-start items-center h-screen w-screen text-slate-600 bg-slate-900'>
                <Navbar />
                <div className='container flex justify-center items-center flex-grow'>
                    <div className='flex flex-row justify-start items-start h-fit w-[80%] bg-white rounded-2xl p-5 mb-8'>
                        <div className='relative h-full w-[30%] p-5 mb-8'>
                            <picture>
                                <img src='/401.png' alt='401'></img>
                            </picture>
                        </div>
                        <div>
                            <div className='w-fit p-5 text-5xl'>
                                <span>Unauthenticated Access</span>
                            </div>
                            <div className='w-fit p-5'>
                                We are sorry, but you are currently not logged in to any account.
                                <br/>
                                Please&nbsp;
                                <Link href='/login'>
                                    <a className='text-slate-500 underline'>login</a>
                                </Link> 
                                &nbsp;to continue.
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Fragment>
    );
};

export default Error401;