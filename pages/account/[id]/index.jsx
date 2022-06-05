import { Fragment } from 'react'
import Head from 'next/head'
import Navbar from '../../../components/navbar'
import executeQuery from '../../../db/db'
import Link from 'next/link'
import ChangePassword from './changepassword'

export const getStaticProps = async (context) => {
    try {
        {/** Query database for user data by user id in parameter */}
        const result = JSON.parse(JSON.stringify(await executeQuery({
            query: 'SELECT id, email FROM account WHERE id=?',
            values: [context.params.id],
        })));

        {/** Returns user data */}
        return {
            props: result[0]
        };
    } 
    catch ( error ) {
        console.log( error );
    }
}

export const getStaticPaths = async () => {
    try {
        {/** Query database for all user ids and convert to JSON */}
        const result = JSON.parse(JSON.stringify(await executeQuery({
            query: 'SELECT id FROM account',
            values: [],
        })));

        {/** Generates path parameters from query result */}
        const paths = result.map((result) => {
            return {
                params: {id: result.id.toString()},
            }
        })

        {/** Returns static paths */}
        return {
            paths,
            fallback: true,
        };
    } 
    catch ( error ) {
        console.log( error );
    }
}

const Account = ({ id, email }) => {
    return (
        <Fragment>
            <Head>
                <title>Account Details</title>
                <meta name="viewport" content="initial-scale=1.0, width=device-width" />
            </Head>

            <div className='flex flex-col justify-start items-center h-screen w-screen text-slate-400 bg-slate-900'>
                <Navbar />

                <div className='container flex justify-center items-center flex-grow'>
                    <div className='flex flex-col justify-start items-start h-fit w-[500px] bg-white rounded-2xl p-5 mb-8'>

                        <p className='text-lg text-slate-900 pb-2'>Account details</p>
                        <p className='text-slate-700 pb-4'>Email: {email}</p>
                        <Link href={'/account/' + id + '/changepassword'}>
                            <div className='bg-blue-600 cursor-pointer px-3 py-2 rounded-md'>
                                <p className='text-white'>Change Password</p>
                            </div>
                        </Link>

                    </div>
                </div>

            </div>
        </Fragment>
    );
};

export default Account;