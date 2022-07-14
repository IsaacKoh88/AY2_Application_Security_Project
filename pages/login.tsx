import type { NextPage } from 'next'
import { Fragment } from 'react'
import Head from 'next/head'
import Navbar from '../components/navbar'


const Login: NextPage = () => {
    return (
        <Fragment>
            <Head>
                <title>Login Page</title>
                <meta name="viewport" content="initial-scale=1.0, width=device-width" />
            </Head>

            <div className='flex flex-col justify-start items-center h-screen w-screen text-slate-400 bg-slate-900'>
                <Navbar />
                <div className='container flex justify-center items-center flex-grow'>
                    <div className='flex flex-row justify-start items-start h-fit w-[500px] bg-white rounded-2xl p-5 mb-8'>
                        <form className='flex flex-col flex-grow' action='/api/login' method='post'>
                            <label className='text-lg text-slate-900 ml-0.5 mb-1' htmlFor='email'>Email:</label>
                            <input 
                                className='text-slate-900 border focus:border-blue-600 rounded-md p-2 mb-2' 
                                type='text' 
                                id='email' 
                                name='email' 
                                placeholder='Email' 
                                required 
                            />
                            <label className='text-lg text-slate-900 ml-0.5 mb-1' htmlFor='password'>Password:</label>
                            <input 
                                className='text-slate-900 border focus:border-blue-600 rounded-md p-2 mb-4' 
                                type='password' 
                                id='password' 
                                name='password' 
                                placeholder='Password' 
                                required
                            />
                            <button className='text-white bg-blue-600 rounded-md p-2' type='submit'>Login</button>
                        </form>
                    </div>
                </div>
            </div>
        </Fragment>
    );
};

export default Login;