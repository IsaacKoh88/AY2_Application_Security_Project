import type { NextPageWithLayout } from '../../_app';
import React, { Fragment, ReactElement } from 'react'
import Head from 'next/head'
import Navbar from '../../../components/navbar'
import executeQuery from '../../../utils/db'
import Link from 'next/link'
import Layout from '../../../components/layouts/authenticated-layout';
import * as jose from 'jose'

type accountProps = {
    id: string,
    email: string
}

export async function getServerSideProps(context) {
    const JWTtoken = context.req.cookies['token'];
    const id = context.params.id

<<<<<<< HEAD:app/pages/account/[id]/index.jsx
    {/* if JWT does not exist */ }
    if (JWTtoken == undefined) {
=======
    /** if JWT does not exist */
    if (JWTtoken == undefined){
>>>>>>> 0d47162b7285273a3249b05e2d8006487966b3fc:app/pages/account/[id]/index.tsx
        return {
            redirect: {
                destination: '/login',
                permanent: false,
            },
        }
    }

    try {
<<<<<<< HEAD:app/pages/account/[id]/index.jsx
        {/* check if JWT token is valid */ }
=======
        /** check if JWT token is valid */
>>>>>>> 0d47162b7285273a3249b05e2d8006487966b3fc:app/pages/account/[id]/index.tsx
        const email = await jose.jwtVerify(JWTtoken, new TextEncoder()
            .encode(`qwertyuiop`))
            .then(value => { return (value['payload']['email']) });

<<<<<<< HEAD:app/pages/account/[id]/index.jsx
        {/* check if email is the same as the one in the id of URL */ }
        const result = JSON.parse(JSON.stringify(await executeQuery({
            query: 'SELECT email FROM account WHERE id=?',
=======
        /** check if email is the same as the one in the id of URL */
        const result = await executeQuery({
            query: 'CALL selectEmail_Id(?)',
>>>>>>> 0d47162b7285273a3249b05e2d8006487966b3fc:app/pages/account/[id]/index.tsx
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
<<<<<<< HEAD:app/pages/account/[id]/index.jsx
            {/* reject if email is not the same */ }
=======
            /** reject if email is not the same */
>>>>>>> 0d47162b7285273a3249b05e2d8006487966b3fc:app/pages/account/[id]/index.tsx
            return {
                redirect: {
                    destination: '/403',
                    permanent: false,
                },
            }
        }
    }

    catch (error) {
<<<<<<< HEAD:app/pages/account/[id]/index.jsx
        {/* reject if JWT token is invalid */ }
=======
        /** reject if JWT token is invalid */
>>>>>>> 0d47162b7285273a3249b05e2d8006487966b3fc:app/pages/account/[id]/index.tsx
        return {
            redirect: {
                destination: '/403',
                permanent: false,
            },
        }
    }
}

const Account: NextPageWithLayout<accountProps> = (props) => {
    return (
        <Fragment>
            <Head>
                <title>Account Details</title>
                <meta name="viewport" content="initial-scale=1.0, width=device-width" />
            </Head>
                <div className='flex justify-center items-center w-full h-full'>
                    <div className='flex flex-col justify-start items-start h-fit w-[500px] bg-white rounded-2xl p-5 mb-8'>

                        <p className='text-lg text-slate-900 pb-2'>Account details</p>
                        <p className='text-slate-700 pb-4'>Email: {props.email}</p>
                        <Link href={'/account/' + props.id + '/changepassword'}>
                            <div className='bg-blue-600 cursor-pointer px-3 py-2 rounded-md'>
                                <p className='text-white'>Change Password</p>
                            </div>
                        </Link>

                    </div>
                </div>
        </Fragment>
    );
};

Account.getLayout = function getLayout(Calendar: ReactElement) {
    return (
        <Layout>
            {Calendar}
        </Layout>
    );
};

export default Account;