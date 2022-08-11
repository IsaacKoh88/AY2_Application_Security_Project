import React, { useState } from 'react';
import Link from 'next/link';
import { Fragment } from 'react';
import Image from 'next/image';

const NotesDisplay = ({ id, notes, EditNotes, success }) => {
    const [expand, setExpand] = useState(false);

    // /** toggle event description display */
    // const handleClickDetails = () => {
    //     setExpand(!expand);
    // };

    const DeleteHandler = async () => {
        const response = await fetch('/api/'+id+'/notes/delete', 
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body : JSON.stringify(
                    {
                        notesID: notes.ID,
                    }
                )
            }
        );

        if (response.status === 200) {
            success();
        };
    }

    // console.log(notes)
    return (

        <Fragment>
            <Image
                src = '/note.png'
                alt = 'note button'
                width = {500}
                height = {500}
            />
            <Link href={'/notesinfo/' + id + '/' + notes.ID}>
                <div className='group cursor-pointer flex flex-col justify-start items-center w-fit px-3 py-2 my-2 rounded-lg transition-max-h duration-300 ease-in-out overflow-hidden'>
                    <picture>
                        <source srcSet='/note.png' type='image/png' />
                        <img src = 'note.png' alt='note button' />
                    </picture>
                    <div className='flex flex-row justify-center items-center w-full'>
                        <p className='font-semibold duration-300 ease-linear'>{notes.Name}</p>
                    </div>
            {/* <p className={flex justify-start items-start text-white w-full mt-1}>{ notes['Description'] }</p> /}
            {/ <div className={flex flex-row justify-end items-center w-full mt-2 mb-1}>
                <div 
                    className='cursor-pointer bg-slate-200 px-3 py-2 mr-2 rounded-md'
                    onClick={() => editNotes(notes.ID)}
                >
                    <p className='text-blue-500 font-semibold duration-150 ease-in-out'>Edit Notes</p>
                </div>
                <div 
                    className='group cursor-pointer bg-slate-200 px-3 py-2 ml-2 rounded-md'
                    onClick={() => DeleteHandler()}
                >
                    <p className='text-red-500 font-semibold duration-150 ease-in-out'>Delete Notes</p>
                </div>
            </div> */}

                </div>
            </Link>
        </Fragment>
    );
};

export default NotesDisplay;