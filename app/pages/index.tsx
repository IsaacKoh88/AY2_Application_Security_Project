import type { NextPage } from 'next';
import { Fragment } from 'react';
import Head from 'next/head';
import Navbar from '../components/navbar';
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

const Home: NextPage = (props) => {
    return (
        <Fragment>
            <Head>
                <title>Lifestyle Management Application</title>
                <meta name="viewport" content="initial-scale=1.0, width=device-width" />
            </Head>

            <div className='flex flex-col justify-start items-center h-screen w-screen text-slate-400 bg-slate-900'>
                <Navbar />
                <div className='container flex flex-col justify-center items-center h-full'>
                    <p className='text-white text-7xl font-semibold tracking-wide pb-4'>Lifestyle <span className='text-rose-600'>Management</span></p>
                    <p className='text-2xl font-medium tracking-wide pb-8'>Your one stop shop for managing your schedule, finances and thoughts</p>
                </div>
            </div>
        </Fragment>
    );
};

export default Home;


