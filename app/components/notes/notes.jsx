import React, { useState } from 'react';
import Link from 'next/link';
import { Fragment } from 'react';
import Image from 'next/image';

const NotesDisplay = ({ id, notes, EditNotes }) => {
    return (
        <Fragment>
            <div className='cursor-pointer group flex flex-col justify-center items-center bg-slate-800/50 hover:bg-slate-800/100 h-60 w-52 m-3 rounded-lg duration-150'>
                <Link href={`/notes/${id}/${notes.ID}`}>
                    <div className='flex flex-grow justify-center items-center w-full pt-2 px-2'>
                        <div className='relative h-3/4 w-3/4'>
                            <Image src='/note.png' layout='fill' alt='Create Note' />
                        </div>
                    </div>
                </Link>
                <div className='flex flex-row justify-between items-center w-full'>
                    <Link href={`/notes/${id}/${notes.ID}`}>
                        <p className='font-semibold group-hover:text-white pt-1 pl-3.5 pr-2 pb-2 duration-150'>{ notes.Name }</p>
                    </Link>
                    <div className='pt-1 pb-2 pr-2'>
                        <div 
                            className='flex justify-center items-center bg-transparent hover:bg-slate-700 h-7 w-7 rounded'
                            onClick={() => EditNotes(notes.ID)}
                        >
                            <i className='gg-more group-hover:text-white duration-150 ease-in-out'></i>
                        </div>
                    </div>
                </div>
            </div>
        </Fragment>
    );
};

export default NotesDisplay;