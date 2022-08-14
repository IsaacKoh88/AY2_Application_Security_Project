import type { NextPage } from 'next'
import { Fragment } from 'react'
import Head from 'next/head'
import Navbar from '../components/navbar'
import Link from 'next/link'
import executeQuery from '../utils/connections/db';
import * as jose from 'jose';

type ErrorProps = {
    id: string;
}

export async function getServerSideProps(context:any) {
    
    const JWTtoken = context.req.cookies['token'];

    /** if JWT does not exist */
    if (JWTtoken == undefined){
        return {
            redirect: {
                destination: '/401',
                permanent: false,
            },
        }
    }

    try {
        /** check if JWT token is valid */
        const email = await jose.jwtVerify(JWTtoken, new TextEncoder()
                    .encode(`qwertyuiop`))
                    .then(value => {return(value['payload']['email'])});

        /** get the id using email in JWT */
        const result = JSON.parse(JSON.stringify(await executeQuery({
            query: 'CALL selectId_Email(?)',
            values: [email],
        })));

        try {
            return{
                props: {
                    id: result[0][0].id,
                }
            }
        } 
        catch (error) {
            return {
                redirect: {
                    destination: '/401',
                    permanent: false,
                },
            }
        }  
    } 
    
    catch (error) {
        /** reject if JWT token is invalid */
        return {
            redirect: {
                destination: '/401',
                permanent: false,
            },
        }
    };  
};

const Error403: NextPage<ErrorProps> = (props) => {
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
                        <div className='block h-fit w-[40%]  p-5 mb-8'>
                            <picture>
                                <img src='/403.png' alt='403'></img>
                            </picture>
                        </div>
                        <div>
                            <div className='w-fit p-5 text-5xl'>
                                <span>Unauthorized Access</span>
                            </div>
                            <div className='w-fit p-5'>
                                We are sorry, but your current account does not have access to this page
                                <br/>
                                Please&nbsp;
                                <Link href={'/account/' + props.id + '/logout'}>
                                    <a className='text-slate-500 underline'>switch account</a>
                                </Link> 
                                &nbsp;or go back to the&nbsp;
                                <Link href={'/account/' + props.id}>
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