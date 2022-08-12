import type { NextPageWithLayout } from '../../_app';
import { useRouter } from 'next/router';
import React, { Fragment, ReactElement, useState, useEffect } from 'react'
import Head from 'next/head'
import Layout from '../../../components/layouts/authenticated-layout';
import executeQuery from '../../../utils/db';
import * as jose from 'jose';
import EditNotes from '../../../components/notes/edit-notes';
import NotesDisplay from '../../../components/notes/notes';


type NotesProps = {
    notes: NoteProps,
    accountID: string,
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
    const accountID = context.params.accountID

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
            values: [accountID],
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
                query: 'SELECT ID, Name, Description FROM notes WHERE AccountID=? and ID=?',
                values: [accountID, id],
            })));
            console.log(resultNotes)
            return{
                props: {
                    notes: resultNotes, accountID: accountID,
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

const Notes: NextPageWithLayout<NotesProps> = (props, success) => {
    const id = useRouter().query.id

    /** State to store events */
    const [notes, setNotes] = useState(props.notes);

    /** State to control edit event popup */
    const [editNotes, setEditNotes] = useState('')


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


    /** Opens edit category popup */
    const handleEditNotesPopupAppear = (index: string) => {
        setEditNotes(index);
    };
    /** Closes edit category popup */
    const handleEditNotesPopupDisappear = () => {
        setEditNotes('');
    };
    /** Delete Handler */
    const DeleteHandler = async () => {
        const response = await fetch('/api/'+props.accountID+'/notes/delete', 
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body : JSON.stringify(
                    {
                        notesID: props['notes'][0]['ID'],
                    }
                )
            }
        );
 
        if (response.status === 200) {
            window.location.replace('/notes');
        };
    }



    return (
        <Fragment>
            <Head>
                <title>Account Details</title> 
                <meta name="viewport" content="initial-scale=1.0, width=device-width" />
            </Head>

            <div className='flex flex-row grow h-full'>

                {/** Notes events */}
                <div className='flex flex-col justify-start items-start h-full w-full px-6'>
                    <div className='flex flex-row justify-center items-center w-full mt-4 mb-2'>
                        <div className='flex grow justify-center items-center ml-10'>
                            <p className='cursor-default text-xl text-slate-200 font-bold'>Notes</p>
                        </div>
                    </div>

                    <p>Note Description: </p>
                    <p className='flex justify-start items-start text-white w-full mt-1'>{ props['notes'][0]['Description'] }</p>
                        <div className='flex flex-row justify-end items-center w-full mt-2 mb-1'>

                            <div 
                                className='cursor-pointer bg-slate-200 px-3 py-2 mr-2 rounded-md'
                                onClick={() => EditNotes(props['notes'][0]['ID'])}
                            >
                                <p className='text-blue-500 font-semibold duration-150 ease-in-out'>Edit Notes</p>
                            </div>
                            <div 
                                className='group cursor-pointer bg-slate-200 px-3 py-2 ml-2 rounded-md'
                                onClick={() => DeleteHandler()}
                            >
                                <p className='text-red-500 font-semibold duration-150 ease-in-out'>Delete Notes</p>
                            </div>
                        </div>
                    <div className='flex flex-col justify-start items-center'></div>
                </div>  
            </div>  
            {/** edit event form */}
            {editNotes !== '' ? 
                <EditNotes id={id} notes={notes.find((e: { ID: string; }) => e.ID === editNotes)} success={handleEditNotesSuccess} close={handleEditNotesPopupDisappear} />
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

