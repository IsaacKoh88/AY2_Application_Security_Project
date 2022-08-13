import React, { Fragment, useState } from 'react';

const EditNotes = ({ id, notes, success, close }) => {
    const [noteName, setNoteName] = useState(notes.Name);
    
    const FormSubmitHandler = async () => {
        const response = await fetch('/api/'+id+'/notes/edit', 
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(
                    {
                        notesID : notes.ID,
                        notesName: notesName
                    }
                )
            }
        );

        if (response.status === 201) {
            success();
        }
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
                        notesID: notes.ID,
                    }
                )
            }
        );

        if (response.status === 200) {
            success();
        } else if (response.status === 400) {
            alert('Error 400: Request body format error.');
        } else if (response.status === 404) {
            alert('Error 404: Category not found');
            success();
        }
    };

    return (
        <Fragment>
            <div 
                className='absolute h-full w-full bg-black/40 inset-0' 
                onClick={() => close()}
            />
            <div className='absolute bg-slate-900 h-32 w-2/5 inset-0 px-3 py-3 m-auto rounded-xl'>
                <form className='flex flex-col justify-start items-start w-full'>
                    <input 
                        type='text'
                        id='notesName'
                        name='notesName'
                        className='grow bg-slate-800 focus:bg-slate-900 text-white placeholder:text-slate-400 border-2 border-slate-800 focus:border-blue-600 outline-none focus:outline-none px-3 py-2 w-full rounded-md duration-150 ease-in-out'
                        placeholder='Note Name'
                        value={ noteName }
                        onChange={e => setNoteName(e.target.value)}
                        required
                    />
                    <div className='flex flex-row justify-center items-center w-full mt-4 mb-1 '>
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
        </Fragment>
    );
};

export default EditNotes;