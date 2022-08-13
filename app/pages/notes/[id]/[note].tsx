import type { NextPageWithLayout } from '../../_app';
import { useRouter } from 'next/router';
import React, { Fragment, ReactElement, useState, useEffect } from 'react'
import Head from 'next/head'
import Layout from '../../../components/layouts/authenticated-layout';
import executeQuery from '../../../utils/connections/db';
import * as jose from 'jose';
import redisClient from '../../../utils/connections/redis';

type NoteProps = {
    Name: string,
    Description: string
}

export async function getServerSideProps(context:any) {
    try {
        const JWTtoken = context.req.cookies['token'];
        const id = context.params.id;

        /** check if JWT token is valid */
        const { payload } = await jose.jwtVerify(
            JWTtoken, 
            new TextEncoder().encode(`qwertyuiop`), 
            {
                issuer: 'application-security-project'
            }
        );

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

        /** query email of id in database */
        const result = JSON.parse(JSON.stringify(await executeQuery({
            query: 'CALL selectEmail_Id(?)',
            values: [id],
        })));

        /** return page if email claim is in database with correct uuid */
        if (result[0][0].email === payload['email']) {
            try {
                const noteID = context.params.note;

                const noteData = JSON.parse(JSON.stringify(await executeQuery({
                    query: 'CALL selectNoteNameDesription_AccountID_ID(? ,?)',
                    values: [id, noteID]
                })))

                if (noteData[0][0] !== undefined) {
                    return {
                        props: noteData[0][0]
                    };
                } else {
                    return {
                        redirect: {
                            destination: '/notes',
                            permanent: false,
                        },
                    };
                }
            }
            catch (error) {
                return {
                    redirect: {
                        destination: '/notes',
                        permanent: false,
                    },
                };
            }
        } else {
            return {
                redirect: {
                    destination: '/401',
                    permanent: false,
                },
            };
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
};

const Note: NextPageWithLayout<NoteProps> = (props) => {
    const router = useRouter()
    const id = router.query.id;
    const noteID = router.query.note;

    const [noteName, setNoteName] = useState(props.Name);
    const [noteDescription, setNoteDescription] = useState(props.Description);

    const FormSubmitHandler = async () => {
        const response = await fetch('/api/'+id+'/notes/edit', 
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(
                    {
                        notesID : noteID,
                        notesName: noteName,
                        description: noteDescription
                    }
                )
            }
        );
    }

    const DeleteHandler = async () => {
        const response = await fetch('/api/'+id+'/notes/delete', 
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body : JSON.stringify(
                    {
                        notesID: noteID,
                    }
                )
            }
        );

        if (response.status === 200) {
            router.push('/notes')
        } else if (response.status === 400) {
            alert('Error 400: Request body format error.');
        } else if (response.status === 404) {
            alert('Error 404: Category not found');
        }
    };

    return (
        <Fragment>
            <Head>
                <title>Notes</title> 
                <meta name="viewport" content="initial-scale=1.0, width=device-width" />
            </Head>

            <div className='flex flex-row grow h-full'>

                {/** Notes */}
                <div className='flex flex-col justify-start items-start h-full w-full px-6 py-4'>
                    <form className='flex flex-col w-full h-full'>
                        <input 
                            type='text'
                            id='notesName'
                            name='notesName'
                            className='bg-slate-800 focus:bg-slate-900 text-white text-xl font-medium placeholder:text-slate-400 border-2 border-slate-800 focus:border-blue-600 outline-none focus:outline-none w-full px-3 py-2 rounded-md duration-150 ease-in-out'
                            placeholder='Note Name'
                            value={ noteName }
                            onChange={e => setNoteName(e.target.value)}
                            required
                        />
                        <textarea 
                            id='notesDescription'
                            name='notesDescription'
                            className='flex-grow bg-slate-800 focus:bg-slate-900 text-white placeholder:text-slate-400 border-2 border-slate-800 focus:border-blue-600 outline-none focus:outline-none w-full px-3 py-2 mt-4 rounded-md duration-150 ease-in-out'
                            placeholder='Description'
                            value={ noteDescription }
                            onChange={e => setNoteDescription(e.target.value)}
                        />
                        <div className='flex flex-row justify-end items-center w-full mt-4 mb-1 '>
                            <input 
                                type='button'
                                value='Confim Changes'
                                className='cursor-pointer bg-blue-600 text-slate-200 hover:text-white px-4 py-2 mr-2 rounded-md duration-150 ease-in-out'
                                onClick={() => FormSubmitHandler()}
                            />
                            <input 
                                type='button'
                                value='Delete'
                                className='cursor-pointer bg-red-600 text-slate-200 hover:text-white px-4 py-2 ml-2 rounded-md duration-150 ease-in-out'
                                onClick={() => DeleteHandler()}
                            />
                        </div>
                    </form>
                </div>

            </div>
        </Fragment>
    );
};

Note.getLayout = function getLayout(Note: ReactElement) {
    return (
        <Layout>
            {Note}
        </Layout>
    );
};

export default Note;