import type { NextPage } from 'next'
import { Fragment } from 'react'
import { useState, useEffect } from 'react'
import Head from 'next/head'
import Navbar from '../components/navbar'
import zxcvbn from 'zxcvbn';
import * as jose from 'jose';

export async function getServerSideProps(context:any) {
    try {
        const JWTtoken = context.req.cookies['token']

        /** check if JWT token is valid */
        const { payload, protectedHeader } = await jose.jwtVerify(
            JWTtoken, 
            new TextEncoder().encode(`qwertyuiop`), 
            {
                issuer: 'application-security-project'
            }
        );

        /** if JWT token is valid, redirect to authenticated route */
        return {
            redirect: {
                destination: '/account',
                permanent: false
            }
        }
    }
    catch (error) {
        /** if JWT token is not valid, delete token on client side */
        return {
            props: {}
        }
    }
}

const Login: NextPage = () => {

    //
    const [isButtonEnabled] = useState<boolean>(true);

    //styling
    const styles = {
        button: {
            padding: "15px 30px",
            cursor: "pointer",
            background: "#1E88E5",
            color: "#fff",
            fontWeight: "bold",
            border: "none",
            borderRadius: "30px",
        },
        loginButton: {
            cursor: "pointer",
            opacity: 1,
        },
    }


    return (
        <Fragment>
            <Head>
                <title>Login Page</title>
                <meta name="viewport" content="initial-scale=1.0, width=device-width" />
            </Head>

            <div className='flex flex-col justify-start items-center h-screen w-screen text-slate-400 bg-slate-900'>
                <Navbar />
                <div className='container flex justify-center items-center h-full'>
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
                            {/* <button className='text-white bg-blue-600 rounded-md p-2' type='submit'>Login</button> */}
                            <button
                                style={
                                    isButtonEnabled
                                        ? { ...styles.button, ...styles.loginButton }
                                        : styles.button
                                    }
                                >
                                    CONTINUE
                            </button>

                        </form>
                    </div>
                </div>
            </div>
        </Fragment>
    );
};



export default Login;