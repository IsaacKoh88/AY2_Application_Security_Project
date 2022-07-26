import type { NextPageWithLayout } from '../_app';
import { useRouter } from 'next/router';
import React, { Fragment, ReactElement, useState, useEffect } from 'react'
import Head from 'next/head'
import SmallCalendar from '../../components/calendar/month'
import Event from '../../components/calendar/event';
import Todo from '../../components/calendar/todo';
import CreateTodo from '../../components/calendar/create-todo';
import EditTodo from '../../components/calendar/edit-todo';
import CreateCategory from '../../components/calendar/create-category';
import EditCategory from '../../components/calendar/edit-category';
import Layout from '../../components/layouts/authenticated-layout';
import dayjs, { Dayjs } from 'dayjs';
import executeQuery from '../../utils/db';
import * as jose from 'jose';
import CreateNotes from '../../components/notes/create-notes';
import EditNotes from '../../components/notes/edit-notes';
import createNotes from '../../components/notes/create-notes';
import NotesDisplay from '../../components/notes/notes';



type TodoProps = {
    ID: string,
    Name: string,
    Date: string,
    Checked: number,
}[]

type NotesProps = {
    // length: number;
    categories: CategoriesProps,
    todos: TodoProps,
    notes: NoteProps,
}

type NoteProps = {
    ID: string,
    Name: string,
    Date: string,
    StartTime: string,
    EndTime: string,
    Description: string,
    Category: string,
}[]



type CategoriesProps = {
    ID: string,
    Name: string,
    Color: string,
}[]

const [startTime, setStartTime] = useState('');
const [endTime, setEndTime] = useState('');

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
            const currentDate = dayjs().format('YYYY-MM-DD')

            const resultTodo = JSON.parse(JSON.stringify(await executeQuery({
                query: 'SELECT ID, Name, DATE_FORMAT(Date, "%Y-%m-%d") Date, Checked FROM todo WHERE AccountID=?',
                values: [id],
            })));

            const resultNotes = JSON.parse(JSON.stringify(await executeQuery({
                query: 'SELECT ID, Name, DATE_FORMAT(Date, "%Y-%m-%d") Date, StartTime, EndTime, Description, CategoryID FROM events WHERE AccountID=? AND Date=?',
                values: [id, currentDate],
            })));

            const resultCategories = JSON.parse(JSON.stringify(await executeQuery({
                query: 'SELECT ID, Name, Color FROM category WHERE AccountID=?',
                values: [id],
            })));

            return{
                props: {
                    todo: resultTodo,
                    notes: resultNotes,
                    categories: resultCategories,
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

    const [selectedDate, setSelectedDate] = useState(dayjs());
    /** State to store categories */
    const [categories, setCategories] = useState(props.categories)
    /** State to store events */
    const [notes, setNotes] = useState(props.notes);
    /** State to store todos */
    const [todos, setTodos] = useState(props.todos)

    /** State to control create event popup */
    const [createNotes, setCreateNotes] = useState(false)
    /** State to control edit event popup */
    const [editNotes, setEditNotes] = useState('')
    /** State to control create todo popup */
    const [createTodo, setCreateTodo] = useState(false)
    /** State to control edit todo popup */
    const [editTodo, setEditTodo] = useState('')
    /** State to control create category popup */
    const [createCategory, setCreateCateogory] = useState(false)
    /** State to control edit category popup */
    const [editCategory, setEditCateogory] = useState('')

    /** Handles create new category success */
    const handleCreateCategorySuccess = async () => {
        fetch('/api/'+id+'/category')
        .then(response => response.json())
        .then(data => setCategories(data));

        handleCreateCategoryPopupDisappear();
    };

    /** Handles edit category success */
    const handleEditCategorySuccess = () => {
        fetch('/api/'+id+'/category')
        .then(response => response.json())
        .then(data => setCategories(data));
        fetch('/api/'+id+'/notes', 
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(
                    {
                        date: selectedDate.format('YYYY-MM-DD')
                    }
                )
            }
        )
        .then(response => response.json())
        .then(data => setNotes(data));

        handleEditCategoryPopupDisappear();
    };

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
                        date: selectedDate.format('YYYY-MM-DD')
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
                        date: selectedDate.format('YYYY-MM-DD')
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
                        date: selectedDate.format('YYYY-MM-DD')
                    }
                )
            }
        )
        .then(response => response.json())
        .then(data => setNotes(data));
    };

    /** Handles create new todo success */
    const handleCreateTodoSuccess = () => {
        fetch('/api/'+id+'/todo')
        .then(response => response.json())
        .then(data => setTodos(data));

        handleCreateTodoPopupDisappear();
    };

    /** Handles edit category success */
    const handleEditTodoSuccess = () => {
        fetch('/api/'+id+'/todo')
        .then(response => response.json())
        .then(data => setTodos(data));

        handleEditTodoPopupDisappear();
    };

    /** Handle to-do checked */
    const handleTodoCheck = async (todoID: string, checked: boolean) => {
        const checkedNumber = checked ? 1 : 0
        const response = await fetch('/api/'+id+'/todo/check', 
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body : JSON.stringify(
                    {
                        todoID: todoID,
                        checked: checkedNumber,
                    }
                )
            }
        );

        if (response.status === 201) {
            console.log('ok')
            fetch('/api/'+id+'/todo')
            .then(response => response.json())
            .then(data => setTodos(data));
        };
    };

    /** Handles date selection action */
    const handleSelectDate = (index: Dayjs) => {
        console.log(index.format('YYYY-MM-DD'))
        fetch('/api/'+id+'/notes', 
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(
                    {
                        date: index.format('YYYY-MM-DD')
                    }
                )
            }
        )
        .then(response => response.json())
        .then(data => setNotes(data));
        setSelectedDate(index);
    };

    /** Opens create new event popup */
    const handleCreateNotesPopupAppear = () => {
        setCreateNotes(true);
    };
    /** Closes create new event popup */
    const handleCreateNotesPopupDisappear = () => {
        setCreateNotes(false);
    };
    /** Opens edit category popup */
    const handleEditNotesPopupAppear = (index: string) => {
        setEditNotes(index);
    };
    /** Closes edit category popup */
    const handleEditNotesPopupDisappear = () => {
        setEditNotes('');
    };
    /** Opens create new todo popup */
    const handleCreateTodoPopupAppear = () => {
        setCreateTodo(true);
    };
    /** Closes create new todo popup */
    const handleCreateTodoPopupDisappear = () => {
        setCreateTodo(false);
    };
    /** Opens edit todo popup */
    const handleEditTodoPopupAppear = (index: string) => {
        setEditTodo(index);
    };
    /** Closes edit todo popup */
    const handleEditTodoPopupDisappear = () => {
        setEditTodo('');
    };
    /** Opens create new category popup */
    const handleCreateCategoryPopupAppear = () => {
        setCreateCateogory(true);
    };
    /** Closes create new category popup */
    const handleCreateCategoryPopupDisappear = () => {
        setCreateCateogory(false);
    };
    /** Opens edit category popup */
    const handleEditCategoryPopupAppear = (index: string) => {
        setEditCateogory(index);
    };
    /** Closes edit category popup */
    const handleEditCategoryPopupDisappear = () => {
        setEditCateogory('');
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

                {/** calendar date events */}
                <div className='flex flex-col justify-start items-center h-full w-3/5 px-6'>
                    <div className='flex flex-row justify-center items-center w-full mt-4 mb-2'>
                        <div className='flex grow justify-center items-center ml-10'>
                            {/* <p className='cursor-default text-xl text-slate-200 font-bold'>Notes for {selectedDate.format('DD/MM/YYYY')}</p> */}
                            <p className='cursor-default text-xl text-slate-200 font-bold'>Notes</p>
                        </div>
                        <div 
                            className='group cursor-pointer flex justify-center items-center hover:bg-slate-800 w-10 h-10 rounded-lg duration-150 ease-in-out'
                            onClick={() => handleCreateNotesPopupAppear()}
                        >
                            <i className='gg-plus group-hover:text-white'></i>
                        </div>
                    </div>
                    {(notes.length === 0) ? 
                        <div className='flex grow justify-center items-center w-full'>
                            {/** display no notes text if there are no notes */}
                            <p className=''>No Notes</p>
                        </div> 
                        :
                        <div className='flex flex-col grow justify-start items-center w-full overflow-y-scroll'>
                            {/** display a card for each event */}
                            {notes.map((Name, index) => 
                                <NotesDisplay id={id} notes={notes} categories={categories} editNotes={handleEditNotesPopupAppear} success={handleDeleteNotesSuccess} key={index} />
                            )}
                        </div>
                    }
                    <div className='flex flex-col justify-start items-center'></div>
                </div>

            </div>
            
    

            {/** create event form */}
            {CreateNotes ?
                <CreateNotes id={id} categories={categories} success={handleCreateNotesSuccess} close={handleCreateNotesPopupDisappear} />
                :
                <></>
            }

            {/** edit event form */}
            {editNotes !== '' ? 
                <EditNotes id={id} notes={notes.find((e: { ID: string; }) => e.ID === editNotes)} categories={categories} success={handleEditNotesSuccess} close={handleEditNotesPopupDisappear} />
                :
                <></>
            }

            {/** create todo form */}
            {createTodo ? 
                <CreateTodo id={id} success={handleCreateTodoSuccess} close={handleCreateTodoPopupDisappear} />
                :
                <></>
            }
            
            {/** edit todo form */}
            {editTodo !== '' ? 
                <EditTodo id={id} todo={todos.find((e: { ID: string; }) => e.ID === editTodo)} success={handleEditTodoSuccess} close={handleEditTodoPopupDisappear} />
                :
                <></>
            }

            {/** create category form */}
            {createCategory ? 
                <CreateCategory id={id} success={handleCreateCategorySuccess} close={handleCreateCategoryPopupDisappear} />
                :
                <></>
            }

            {/** edit category form */}
            {editCategory !== '' ? 
                <EditCategory id={id} category={categories.find((e: { ID: string; }) => e.ID === editCategory)} success={handleEditCategorySuccess} close={handleEditCategoryPopupDisappear} />
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