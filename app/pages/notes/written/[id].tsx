import type { NextPageWithLayout } from '../_app';
import { useRouter } from 'next/router';
import React, { Fragment, ReactElement, useState, useEffect } from 'react'
import Head from 'next/head'
import Layout from '../../components/layouts/authenticated-layout';
import dayjs, { Dayjs } from 'dayjs';
import executeQuery from '../../utils/db';
import * as jose from 'jose';
import CreateNotes from '../../components/notes/create-notes';
import EditNotes from '../../components/notes/edit-notes';
import NotesDisplay from '../../components/notes/notes';


type NotesProps = {
    notes: NoteProps,
}

type NoteProps = {
    ID: string,
    Name: string,
    Date: string,
    Description: string,
}[]


export async function getServerSideProps(context:any) {
    const JWTtoken = context.req.cookies['token'];
    const id = context.params.id

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

        /** check if email is the same as the one in the id of URL */
        const result = await executeQuery({
            query: 'SELECT email FROM account WHERE id=?',
            values: [id],
        });

        /** reject if user does not have permission to route */
        if (result[0].email !== email) {
            return {
                redirect: {
                    destination: '/401',
                    permanent: false,
                },
            };
        };

        try {
            const resultNotes = JSON.parse(JSON.stringify(await executeQuery({
                query: 'SELECT ID, Name, Description FROM notes WHERE AccountID=?',
                values: [id],
            })));

            return{
                props: {
                    notes: resultNotes,
                }
            }
        } 
        catch (error) {
            console.log(error)
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
    };  
};


const Notes: NextPageWithLayout<NotesProps> = (props) => {
    const id = useRouter().query.id

    /** State to store events */
    const [notes, setNotes] = useState(props.notes);

    /** State to control create event popup */
    const [createNotees, setCreateNotees] = useState(false)
    /** State to control edit event popup */
    const [editNotes, setEditNotes] = useState('')


    /** Handles create new event success */
    const handleCreateNotesSuccess = () => {
        fetch('/api/'+id+'/notes', 
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
        )
        .then(response => response.json())
        .then(data => setNotes(data));

        handleCreateNotesPopupDisappear();
    };

    /** Handles edit category success */
    const handleEditNotesSuccess = () => {
        fetch('/api/'+id+'/notes', 
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
        )
        .then(response => response.json())
        .then(data => setNotes(data));

        handleEditNotesPopupDisappear();
    };

    /** Handles edit category success */
    const handleDeleteNotesSuccess = () => {
        fetch('/api/'+id+'/notes', 
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
        )
        .then(response => response.json())
        .then(data => setNotes(data));
    };

    /** Opens create new event popup */
    const handleCreateNotesPopupAppear = () => {
        setCreateNotees(true);
    };
    /** Closes create new event popup */
    const handleCreateNotesPopupDisappear = () => {
        setCreateNotees(false);
    };
    /** Opens edit category popup */
    const handleEditNotesPopupAppear = (index: string) => {
        setEditNotes(index);
    };
    /** Closes edit category popup */
    const handleEditNotesPopupDisappear = () => {
        setEditNotes('');
    };

    /** Call API to get user calendar events, categories */

    /** Calls API to check to-do item as completed */


    return (
        <Fragment>
            <Head>
                <title>Account Details</title> 
                <meta name="viewport" content="initial-scale=1.0, width=device-width" />
            </Head>

            <div className='flex flex-row grow h-full'>

                {/** Notes events */}
                <div className='flex flex-col justify-start items-center h-full w-full px-6'>
                    <div className='flex flex-row justify-center items-center w-full mt-4 mb-2'>
                        <div className='flex grow justify-center items-center ml-10'>
                            <p className='cursor-default text-xl text-slate-200 font-bold'>Notes</p>
                        </div>
                        <div 
                            className='group cursor-pointer flex justify-center items-center hover:bg-slate-800 w-30 h-30 rounded-lg duration-150 ease-in-out'
                            onClick={() => handleCreateNotesPopupAppear()}
                        >
                            <img src= '/add_note.png' />
                        </div>
                    </div>
                    {(notes.length === 0) ? 
                        <div className='flex grow justify-center items-center w-full'>
                            {/** display no notes text if there are no notes */}
                            <p className=''>No Notes</p>
                        </div> 
                        :
                        <div className='flex flex-col grow justify-start items-center w-full'>
                            {/** display a card for each event */}
                            {notes.map((notes, index) => 
                                <NotesDisplay id={id} notes={notes} editNotes={handleEditNotesPopupAppear} success={handleDeleteNotesSuccess} key={index} />
                            )}
                        </div>
                    }
                    <div className='flex flex-col justify-start items-center'></div>
                </div>

            </div>
            
    

            {/** create event form */}
            {createNotees ?
                <CreateNotes id={id} success={handleCreateNotesSuccess} close={handleCreateNotesPopupDisappear} />
                :
                <></>
            }

            {/** edit event form */}
            {editNotes !== '' ? 
                <EditNotes id={id} notes={notes.find((e: { ID: string; }) => e.ID === editNotes)} success={handleEditNotesSuccess} close={handleEditNotesPopupDisappear} />
                :
                <></>
            }
        </Fragment>
    );
};