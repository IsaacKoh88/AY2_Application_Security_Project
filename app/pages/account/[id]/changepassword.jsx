import { Fragment } from 'react'
import Head from 'next/head'
import Navbar from '../../../components/navbar'
import executeQuery from '../../../utils/connections/db'
import redisClient from '../../../utils/connections/redis'
import { useState } from 'react'
import * as jose from 'jose'

export async function getServerSideProps(context) {
    const JWTtoken = context.req.cookies['token'];
    const id = context.params.id

    {/* if JWT does not exist */}
    if (JWTtoken == undefined){
        return {
            redirect: {
                destination: '/401',
                permanent: false,
            },
        }
    }

    try {
        {/* check if JWT token is valid */}
        const email = await jose.jwtVerify(JWTtoken, new TextEncoder()
                    .encode(`qwertyuiop`))
                    .then(value => {return(value['payload']['email'])});

                    /** check if JWT token is blacklisted */
        await redisClient.connect();
        const keyBlacklisted = await redisClient.exists('bl_'+context.req.cookies['token']);
        await redisClient.disconnect();

        if (keyBlacklisted) {
            return {
                redirect: {
                    destination: '/login',
                    permanent: false,
                },
            };
        }

        {/* check if email is the same as the one in the id of URL */}
        const result = JSON.parse(JSON.stringify(await executeQuery({
            query: 'CAll selectEmail_Id(?)',
            values: [id],
        })));

        if (result[0][0]['email'] === email) {
            return {
                props: {
                        id: id,
                }
            }
        }
        
        else {
            {/* reject if email is not the same */}
            return {
                redirect: {
                    destination: '/401',
                    permanent: false,
                },
            }
        }
    } 
    
    catch (error) {
        {/* reject if JWT token is invalid */}
        return {
            redirect: {
                destination: '/401',
                permanent: false,
            },
        }
    }    
}

const ChangePassword = ({ id }) => {
    const [password, setpassword] = useState('');

    {/** Calls API on form submit */}
    const FormSubmitHandler = async () => {
        const res = await fetch('/api/' +id+ '/account/change-password', {
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