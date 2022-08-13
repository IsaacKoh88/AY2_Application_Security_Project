import type { NextPageWithLayout } from '../../_app';
import React, { Fragment, ReactElement, useState } from 'react'
import Head from 'next/head'
import Navbar from '../../../components/navbar'
import executeQuery from '../../../utils/db'
import Link from 'next/link'
import Layout from '../../../components/layouts/authenticated-layout';
import * as jose from 'jose'
import { decrypt } from '../../../utils/encryption.js';
import Image from 'next/image';


type accountProps = {
    id: string,
    email: string,
    username: string,
    address: string,
    image: string
};

export async function getServerSideProps(context: any) {
    const JWTtoken = context.req.cookies['token'];
    const id = context.params.id

    /** if JWT does not exist */
    if (JWTtoken == undefined) {
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
            .then(value => { return (value['payload']['email']) });

        const result = JSON.parse(JSON.stringify(await executeQuery({
            query: 'CALL selectEmail_Id(?)',
            values: [id],
        })));

        if (result[0][0].email === email) {
            const accvalues = await executeQuery({
                query: 'CALL selectAccountData_ID(?)',
                values: [id]
            });
            var username = accvalues[0][0]['username']
            var address = accvalues[0][0]['address']
            var image = accvalues[0][0]['image']
            //console.log(address)
            console.log('imagename', image)

            if (!address) {
                /**if new user, set default values */
                if (!username && !address && !image) {
                    username = 'Username';
                    address = 'No address set yet';
                    image = 'defaultpfp.jpeg'

                }

            }

            else {
                /**decrypts address from database */
                address = decrypt(address)
                console.log(address)
            }


            return {
                props: {
                    id: id,
                    email: email,
                    username: username,
                    address: address,
                    image: image

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


const Account: NextPageWithLayout<accountProps> = (props) => {

    /**sets path of image based on profile information */
    const imagepath = '/uploads/' + props.image
    console.log(imagepath)


    return (
        <Fragment>
            <Head>
                <title>Account Details</title>
                <meta name="viewport" content="initial-scale=1.0, width=device-width" />
            </Head>
            <div className='flex justify-center items-center w-full h-full'>
                <div className='bg-slate-800 flex flex-col h-fit w-auto bg-white rounded-2xl p-5 mb-8'>
                    <p className='text-white text-3xl p-3 font-bold'>Account details</p>
                    <div className="inline-flex content-evenly p-5 ">
                        <Link href={'/account/' + props.id + '/editaccinfo'}>
                            <div className="relative text-center">
                                <div className='block h-[150px] w-[150px] rounded-full hover:opacity-50 relative'>
                                    <Image src={imagepath} layout="fill" alt="profilepic" />
                                </div>
                                <p className="text-white font-bold drop-shadow -translate-x-1/2 -translate-y-1/2 absolute top-1/2 left-1/2 opacity-0 hover:opacity-100">Edit</p>
                            </div>
                        </Link>
                        <div className="block">
                            <p className='text-white text-md self-center font-bold pl-7 pb-4 mb-2'>Username:  <span className="bg-slate-700 p-3 px-4 font-normal rounded-md">{props.username}</span></p>
                            <p className='text-white text-md self-center font-bold pl-7 pb-4 mb-2'>Email:  <span className="bg-slate-700 p-3 px-4 font-normal rounded-md">{props.email}</span></p>
                            <p className='text-white text-md self-center font-bold pl-7 pb-4'>Address: <span className='bg-slate-700 p-3 px-4 font-normal text-grey rounded-md'>{props.address}</span></p>
                        </div>
                    </div>
                    <div className='inline-flex self-end space-x-3'>
                        <Link href={'/account/' + props.id + '/editaccinfo'} ><p className='text-white bg-blue-600 self-end cursor-pointer px-3 py-2 rounded-md'>Edit</p></Link>
                        <Link href={'/account/' + props.id + '/changepassword'}>
                            <div className='bg-blue-600 self-end cursor-pointer px-3 py-2 rounded-md'>
                                <p className='text-white'>Change Password</p>
                            </div>
                        </Link>
                    </div>



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