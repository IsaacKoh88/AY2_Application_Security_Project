import { Fragment } from 'react'
import Head from 'next/head'
import Navbar from '../../../components/navbar'
import executeQuery from '../../../db/db'
import { useState } from 'react'

export const getStaticProps = async (context) => {
    {/** Returns user data */}
    return {
        props: {
            id: context.params.id
        }
    };
}

export const getStaticPaths = async () => {
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

const ChangePassword = ({ id }) => {
    const [password, setpassword] = useState('');

    {/** Calls API on form submit */}
    const FormSubmitHandler = async () => {
        const res = await fetch('/api/changepassword', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id: id, password: password})
        })
    }

    return (
        <Fragment>
            <Head>
                <title>Change Account Password</title>
                <meta name="viewport" content="initial-scale=1.0, width=device-width" />
            </Head>

            <div className='flex flex-col justify-start items-center h-screen w-screen text-slate-400 bg-slate-900'>
                <Navbar />

                <div className='container flex justify-center items-center flex-grow'>
                    <div className='flex flex-row justify-start items-start h-fit w-[500px] bg-white rounded-2xl p-5 mb-8'>

                        <form className='flex flex-col flex-grow'>
                            <label className='text-lg text-slate-900 ml-0.5 mb-1' htmlFor='password'>New Password:</label>
                            <input 
                                className='text-slate-900 border focus:border-blue-600 rounded-md p-2 mb-2' 
                                type='password' 
                                id='password' 
                                name='password' 
                                placeholder='Password' 
                                value={password}
                                onChange={e => setpassword(e.target.value)}
                                required
                            />
                            <label className='text-lg text-slate-900 ml-0.5 mb-1' htmlFor='confirmpassword'>Confirm New Password:</label>
                            <input 
                                className='text-slate-900 border focus:border-blue-600 rounded-md p-2 mb-4' 
                                type='password' 
                                id='confirmpassword' 
                                name='confirmpassword' 
                                placeholder='Confirm Password' 
                                required
                            />
                            <button className='text-white bg-blue-600 rounded-md p-2' type='submit' onClick={FormSubmitHandler}>Sign Up</button>
                        </form>

                    </div>
                </div>

            </div>
        </Fragment>
    );
};

export default ChangePassword;