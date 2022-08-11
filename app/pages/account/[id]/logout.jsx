import { Fragment } from 'react'
import Head from 'next/head'
import Navbar from '../../../components/navbar'
import executeQuery from '../../../utils/db'
import { useState } from 'react'
import * as jose from 'jose'

export async function getServerSideProps(context) {
    const JWTtoken = context.req.cookies['token'];
    const id = context.params.id

    {/* if JWT does not exist */}
    if (JWTtoken == undefined){
        return {
            redirect: {
                destination: '/login',
                permanent: false,
            },
        }
    }

    try {
        {/* check if JWT token is valid */}
        const email = await jose.jwtVerify(JWTtoken, new TextEncoder()
                    .encode(`qwertyuiop`))
                    .then(value => {return(value['payload']['email'])});

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
                    destination: '/login',
                    permanent: false,
                },
            }
        }
    } 
    
    catch (error) {
        {/* reject if JWT token is invalid */}
        return {
            redirect: {
                destination: '/login',
                permanent: false,
            },
        }
    }    
}

const Logout = ({ id }) => {
    const [password] = useState('');

    return (
        <Fragment>
            <div className='flex flex-col justify-start items-center h-screen w-screen text-slate-400 bg-slate-900'>
                <Navbar />

                {/* <div className='container flex justify-center items-center flex-grow'>
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
                            <button className='text-white bg-blue-600 rounded-md p-2' type='submit' onClick={FormSubmitHandler}>Sign Up</button>
                        </form>

                    </div>
                </div> */}

            </div>
        </Fragment>
    );
};

export default Logout;