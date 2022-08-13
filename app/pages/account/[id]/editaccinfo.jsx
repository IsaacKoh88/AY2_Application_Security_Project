import { Fragment } from 'react'
import Head from 'next/head'
import Navbar from '../../../components/navbar'
import executeQuery from '../../../utils/connections/db'
import tokenBlacklistCheck from '../../../utils/check-blacklist-token'
import { useState } from 'react'
import * as jose from 'jose'
import React, { Component } from 'react'
import { UiFileInputButton } from '../../../components/UiFileInputButton';
import { uploadFileRequest } from '../../../components/upload.services';
export async function getServerSideProps(context) {
    const JWTtoken = context.req.cookies['token'];
    const id = context.params.id

    {/* if JWT does not exist */ }
    if (JWTtoken == undefined) {
        return {
            redirect: {
                destination: '/401',
                permanent: false,
            },
        }
    }

    try {
        {/* check if JWT token is valid */ }
        const email = await jose.jwtVerify(JWTtoken, new TextEncoder()
            .encode(`qwertyuiop`))
            .then(value => { return (value['payload']['email']) });

        /** check if JWT token is blacklisted */
        if (await tokenBlacklistCheck(context.req.cookies['token'])) {
            return {
                redirect: {
                    destination: '/login',
                    permanent: false,
                },
            };
        }

        {/* check if email is the same as the one in the id of URL */ }
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
            {/* reject if email is not the same */ }
            return {
                redirect: {
                    destination: '/401',
                    permanent: false,
                },
            }
        }
    }
    catch (error) {
        {/* reject if JWT token is invalid */ }
        return {
            redirect: {
                destination: '/401',
                permanent: false,
            },
        }
    }
}

const ChangePFP = ({ id }) => {

    {/** Calls API on form submit */ }
    const FormSubmitHandler = async () => {
        const res = await fetch('/api/' + id + '/account/edit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id: id, username: username, address: address, image: Image })
        })
    }
    const [Image, setImage] = useState('')
    const [username, SetUsername] = useState('')
    const [address, SetAddress] = useState('')

    // On file upload (click the upload button)
    const onChange = async (formData, imagename) => {
        const response = await uploadFileRequest(formData, (event) => {
            console.log(`Current progress:`, Math.round((event.loaded * 100) / event.total));
        });

        setImage(response.data[0])
        console.log("magename", imagename)
        console.log("image", Image)

        console.log('response', response);
    };


    return (
        <Fragment>
            <Head>
                <title>Change Profile Picture</title>
                <meta name="viewport" content="initial-scale=1.0, width=device-width" />
            </Head>

            <div className='flex flex-col justify-start items-center h-screen w-screen text-slate-400 bg-slate-900'>
                <Navbar />

                <div className='container flex justify-center items-center flex-grow'>
                    <div className='flex flex-col justify-start bg-slate-800 items-start h-fit w-[500px] bg-white rounded-2xl p-5 mb-8'>
                        <p className='text-lg text-slate-900 ml-0.5 mb-1 font-bold text-white'>New Profile Picture: </p>
                        <UiFileInputButton label="Upload Image" uploadFileName="theFiles" onChange={onChange} />

                        <form className='flex flex-col flex-grow w-full'>
                            <label className='text-lg text-slate-900 ml-0.5 mb-1 font-bold text-white' htmlFor="newuser">New Username:</label>
                            <input
                                type='text'
                                id='newuser'
                                name='newuser'
                                className='bg-slate-700 w-full text-white font-semibold placeholder:text-slate-400 focus:outline-none px-3 py-2 mb-3 rounded-md'
                                placeholder='New Username'
                                value={username}
                                onChange={e => SetUsername(e.target.value)}
                                required
                            />
                            <label className='text-lg text-slate-900 ml-0.5 mb-1 font-bold text-white' htmlFor="newaddress">Set Address:</label>
                            <input
                                type='text'
                                id='newaddress'
                                name='newaddress'
                                className='bg-slate-700 w-full text-white focus:outline-none font-semibold placeholder:text-slate-400 px-3 py-2 mb-5 rounded-md'
                                placeholder='New Address'
                                value={address}
                                onChange={e => SetAddress(e.target.value)}
                                required
                            />
                            <button className='text-white bg-blue-600 rounded-md p-2' type='submit' onClick={FormSubmitHandler}>Submit</button>
                        </form>

                    </div>
                </div>

            </div>
        </Fragment>
    );
};

export default ChangePFP;