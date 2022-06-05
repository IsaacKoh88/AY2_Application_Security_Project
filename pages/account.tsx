import type { GetStaticProps, GetStaticPaths, NextPage } from 'next'
import { Fragment } from 'react'
import Head from 'next/head'
import Navbar from '../components/navbar'

type AccountProps = {
    email: string
}

{/*const getStaticProps: GetStaticProps = async () => {

}

const getStaticPaths: GetStaticPaths = async () => {
    return {
        paths: [
            {params: {...}}
        ]
    }
}*/}

const Account = ({ email }: AccountProps) => {
    return (
        <Fragment>
            <Head>
                <title>Account Details</title>
                <meta name="viewport" content="initial-scale=1.0, width=device-width" />
            </Head>

            <div className='flex flex-col justify-start items-center h-screen w-screen text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-900'>
                <Navbar />
                <div className='container flex justify-center items-center flex-grow'>
                    <div className='flex flex-row justify-start items-start h-fit w-[500px] bg-slate-400 dark:bg-white rounded-2xl p-5 mb-8'>
                        <p className='text-lg text-black'>Account details</p>
                        <p className=''>Email: {email}</p>
                    </div>
                </div>
            </div>
        </Fragment>
    );
};

export default Account;