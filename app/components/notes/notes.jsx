import React, { useState } from 'react';
import Link from 'next/link';
import { Fragment } from 'react';
import Image from 'next/image';

const NotesDisplay = ({ id, notes, EditNotes, success }) => {
    // const [expand, setExpand] = useState(false);

    // /** toggle event description display */
    // const handleClickDetails = () => {
    //     setExpand(!expand);
    // };

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
                <div className='group cursor-pointer flex flex-col justify-start items-center w-fit mb-1 px-3 py-0 my-0 rounded-lg transition-max-h duration-300 ease-in-out overflow-hidden'>
                    <picture>
                        <source srcSet='/note.png' type='image/png' />
                        <img src = 'note.png' alt='note button' />
                    </picture>
                    <div className='flex flex-row justify-center items-center w-full'>
                        <p className='font-semibold duration-300 ease-linear'>{notes.Name}</p>
                    </div>

                </div>
            </Link>
        </Fragment>
    );
};

export default NotesDisplay;