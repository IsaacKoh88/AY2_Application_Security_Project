import { Fragment } from 'react'
import Head from 'next/head'
import Navbar from '../../../components/navbar'
import executeQuery from '../../../utils/db'
import Link from 'next/link'
import * as jose from 'jose'


export async function getServerSideProps(context) {
    const JWTtoken = context.req.cookies['token'];
    const id = context.params.id

    /** if JWT does not exist */
    if (JWTtoken == undefined){
        return {
            redirect: {
                destination: '/login',
                permanent: false,
            },
        }
    }

    try {
        /** check if JWT token is valid */
        const email = await jose.jwtVerify(JWTtoken, new TextEncoder()
                    .encode(`qwertyuiop`))
                    .then(value => {return(value['payload']['email'])});

        /** check if email is the same as the one in the id of URL */
        const result = await executeQuery({
            query: 'CALL selectEmail_Id(?)',
            values: [id],
        });

        if (result[0][0].email === email) {
            return {
                props: {
                        id: id,
                        email: email
                }
            }
        }
        
        else {
            /** reject if email is not the same */
            return {
                redirect: {
                    destination: '/403',
                    permanent: false,
                },
            }
        }
    } 
    
    catch (error) {
        /** reject if JWT token is invalid */
        return {
            redirect: {
                destination: '/403',
                permanent: false,
            },
        }
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