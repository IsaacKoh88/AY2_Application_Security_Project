import type { NextPageWithLayout } from '../../_app';
import { useRouter } from 'next/router';
import React, { Fragment, ReactElement, useState, useEffect } from 'react'
import Head from 'next/head'
import Layout from '../../../components/layouts/authenticated-layout';
import executeQuery from '../../../utils/db';
import * as jose from 'jose';
import EditNotes from '../../../components/notes/edit-notes';
import NotesDisplay from '../../../components/notes/notes';
import Image from 'next/image';
import useSWR from 'swr';
import fetcher from '../../../utils/swr-fetcher';

type NotesProps = {
    ID: string,
    Name: string,
}[]

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

        /** query email of id in database */
        const result = JSON.parse(JSON.stringify(await executeQuery({
            query: 'CALL selectEmail_Id(?)',
            values: [id],
        })));

        /** return page if email claim is in database with correct uuid */
        if (result[0][0].email === payload['email']) {
            return {
                props: {}
            };
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

const Notes: NextPageWithLayout = () => {
    const id = useRouter().query.id

    /** State to store notes */
    const { data: notes, error: notesError, mutate: notesMutate } = useSWR<NotesProps>(`/api/${id}/notes`, fetcher);
    /** State to control edit note event */
    const [editNotes, setEditNotes] = useState('')

    /** Handles create new event success */
    const handleCreateNote = async () => {
        const response = await fetch('/api/'+id+'/notes/create', 
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(
                    {
                        Name: '',
                    }
                )
            }
        );

        if (response.status === 201) {
            notesMutate();
        }
    };

    /** Handles edit category success */
    const handleEditNotesSuccess = () => {
        notesMutate();

        handleEditNotesPopupDisappear();
    };

    /** Opens edit notes popup */
    const handleEditNotesPopupAppear = (index: string) => {
        setEditNotes(index);
    };
    /** Closes edit notes popup */
    const handleEditNotesPopupDisappear = () => {
        setEditNotes('');
    };

    return (
        <Fragment>
            <Head>
                <title>Notes</title> 
                <meta name="viewport" content="initial-scale=1.0, width=device-width" />
            </Head>

            <div className='flex flex-row grow h-full'>

                {/** Notes */}
                <div className='flex flex-col justify-start items-start h-full w-full px-6'>
                    <div className='flex flex-row justify-center items-center w-full mt-4 mb-3'>
                        <div className='flex grow justify-center items-center ml-10'>
                            <p className='cursor-default text-xl text-slate-200 font-bold'>Notes</p>
                        </div>
                    </div>

                    <div className='flex flex-row justify-start items-start flex-wrap'>
                        {notes?
                            <Fragment>
                                {(notes.length === 0) ? 
                                    null
                                    :
                                        /** display a card for each event */
                                        (notes.map((note, index) => 
                                            <NotesDisplay id={id} notes={note} EditNotes={handleEditNotesPopupAppear} key={index} />
                                        ))}
                                <div 
                                    className='cursor-pointer group flex flex-col justify-center items-center bg-slate-800/50 hover:bg-slate-800/100 h-60 w-52 m-3 rounded-lg duration-150'
                                    onClick={() => handleCreateNote()}
                                >
                                    <div className='flex flex-grow justify-center items-center w-full pt-2 px-2'>
                                        <div className='relative h-3/4 w-3/4'>
                                            <Image src='/add_note.png' layout='fill' alt='Create Note' />
                                        </div>
                                    </div>
                                    <div className='flex flex-row justify-center items-center mt-1 px-2 pb-2 w-full'>
                                        <p className='font-semibold group-hover:text-white duration-150'>Create Note</p>
                                    </div>
                                </div>
                            </Fragment>
                            :
                            <></>
                        }
                    </div>
                </div>

            </div>

            {/** edit event form */}
            {(editNotes !== '') && (notes) ? 
                <EditNotes id={id} notes={notes.find(e => e.ID === editNotes)} success={handleEditNotesSuccess} close={handleEditNotesPopupDisappear} />
                :
                <></>
            }
        </Fragment>
    );
};

Notes.getLayout = function getLayout(Notes: ReactElement) {
    return (
        <Layout>
            {Notes}
        </Layout>
    );
};

export default Notes;