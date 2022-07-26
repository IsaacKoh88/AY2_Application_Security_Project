import type { NextPageWithLayout } from '../_app';
import { useRouter } from 'next/router';
import React, { Fragment, ReactElement, useState, useEffect } from 'react'
import Head from 'next/head'
import SmallCalendar from '../../components/calendar/month'
import Event from '../../components/calendar/event';
import Todo from '../../components/calendar/todo';
import Category from '../../components/calendar/category';
import CreateEvent from '../../components/calendar/create-event';
import EditEvent from '../../components/calendar/edit-event';
import CreateTodo from '../../components/calendar/create-todo';
import EditTodo from '../../components/calendar/edit-todo';
import CreateCategory from '../../components/calendar/create-category';
import EditCategory from '../../components/calendar/edit-category';
import Layout from '../../components/layouts/authenticated-layout';
import dayjs, { Dayjs } from 'dayjs';
import executeQuery from '../../utils/db';
import * as jose from 'jose';

type TodoProps = {
    ID: string,
    Name: string,
    Date: string,
    Checked: number,
}[]

type EventsProps = {
    ID: string,
    Name: string,
    Date: string,
    StartTime: string,
    EndTime: string,
    Description: string,
    CategoryID: string,
}[]

type CategoriesProps = {
    ID: string,
    Name: string,
    Color: string,
}[]

type CalendarProps = {
    todo: TodoProps,
    events: EventsProps,
    categories: CategoriesProps,
}

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

            const resultEvents = JSON.parse(JSON.stringify(await executeQuery({
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
                    events: resultEvents,
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

const Calendar: NextPageWithLayout<CalendarProps> = (props) => {
    const id = useRouter().query.id

    const [selectedDate, setSelectedDate] = useState(dayjs());
    /** State to store categories */
    const [categories, setCategories] = useState(props.categories)
    /** State to store events */
    const [events, setEvents] = useState(props.events);
    /** State to store todos */
    const [todos, setTodos] = useState(props.todo)

    /** State to control create event popup */
    const [createEvent, setCreateEvent] = useState(false)
    /** State to control edit event popup */
    const [editEvent, setEditEvent] = useState('')
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
        fetch('/api/'+id+'/event', 
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
        .then(data => setEvents(data));

        handleEditCategoryPopupDisappear();
    };

    /** Handles create new event success */
    const handleCreateEventSuccess = () => {
        fetch('/api/'+id+'/event', 
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
        .then(data => setEvents(data));

        handleCreateEventPopupDisappear();
    };

    /** Handles edit category success */
    const handleEditEventSuccess = () => {
        fetch('/api/'+id+'/event', 
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
        .then(data => setEvents(data));

        handleEditEventPopupDisappear();
    };

    /** Handles edit category success */
    const handleDeleteEventSuccess = () => {
        fetch('/api/'+id+'/event', 
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
        .then(data => setEvents(data));
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
        fetch('/api/'+id+'/event', 
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
        .then(data => setEvents(data));
        setSelectedDate(index);
    };

    /** Opens create new event popup */
    const handleCreateEventPopupAppear = () => {
        setCreateEvent(true);
    };
    /** Closes create new event popup */
    const handleCreateEventPopupDisappear = () => {
        setCreateEvent(false);
    };
    /** Opens edit category popup */
    const handleEditEventPopupAppear = (index: string) => {
        setEditEvent(index);
    };
    /** Closes edit category popup */
    const handleEditEventPopupDisappear = () => {
        setEditEvent('');
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

            <div className='flex flex-col justify-start items-center h-full mx-6'>

                {/** calendar days grid */}
                <SmallCalendar selectedDate={selectedDate} handleSelectDate={handleSelectDate} />

                {/** calendar category checkboxes */}
                <div className='flex flex-col grow justify-start items-start w-full mt-6'>
                    <div className='flex flex-row justify-center items-center w-full mb-2'>
                        <div className='flex grow justify-center items-center ml-10'>
                            <p className='cursor-default text-lg text-slate-200 font-bold'>Categories</p>
                        </div>
                        <div 
                            className='group cursor-pointer flex justify-center items-center hover:bg-slate-800 w-10 h-10 rounded-lg duration-150 ease-in-out'
                            onClick={() => handleCreateCategoryPopupAppear()}
                        >
                            <i className='gg-plus group-hover:text-white duration-150 ease-in-out'></i>
                        </div>
                    </div>
                    {(categories.length === 0) ? 
                        <div className='flex grow justify-center items-center w-full'>
                            {/** display no category text if there are no category */}
                            <p className=''>No Categories</p>
                        </div> 
                        :
                        <div className='flex flex-col grow justify-start items-center w-full overflow-y-scroll'>
                            {/** display a card for each category */}
                            {categories.map((category, index) => (
                                <Category category={category} editCategory={handleEditCategoryPopupAppear} key={index} />
                            ))}
                        </div>
                    }
                </div>
            </div>

            <div className='flex flex-row grow h-full'>

                {/** calendar date events */}
                <div className='flex flex-col justify-start items-center h-full w-3/5 px-6'>
                    <div className='flex flex-row justify-center items-center w-full mt-4 mb-2'>
                        <div className='flex grow justify-center items-center ml-10'>
                            <p className='cursor-default text-xl text-slate-200 font-bold'>Events for {selectedDate.format('DD/MM/YYYY')}</p>
                        </div>
                        <div 
                            className='group cursor-pointer flex justify-center items-center hover:bg-slate-800 w-10 h-10 rounded-lg duration-150 ease-in-out'
                            onClick={() => handleCreateEventPopupAppear()}
                        >
                            <i className='gg-plus group-hover:text-white'></i>
                        </div>
                    </div>
                    {(events.length === 0) ? 
                        <div className='flex grow justify-center items-center w-full'>
                            {/** display no events text if there are no events */}
                            <p className=''>No Events</p>
                        </div> 
                        :
                        <div className='flex flex-col grow justify-start items-center w-full overflow-y-scroll'>
                            {/** display a card for each event */}
                            {events.map((event, index) => 
                                <Event id={id} event={event} categories={categories} editEvent={handleEditEventPopupAppear} success={handleDeleteEventSuccess} key={index} />
                            )}
                        </div>
                    }
                    <div className='flex flex-col justify-start items-center'></div>
                </div>

                {/** to-do list */}
                <div className='flex flex-col justify-start items-center h-full w-2/5 px-6'>
                    <div className='flex flex-row justify-center items-center w-full mt-4 mb-2'>
                        <div className='flex grow justify-center items-center ml-10'>
                            <p className='cursor-default text-xl text-slate-200 font-bold'>To-do list</p>
                        </div>
                        <div 
                            className='group cursor-pointer flex justify-center items-center hover:bg-slate-800 w-10 h-10 rounded-lg duration-150 ease-in-out'
                            onClick={() => handleCreateTodoPopupAppear()}
                        >
                            <i className='gg-plus group-hover:text-white'></i>
                        </div>
                    </div>
                    {(todos.length === 0) ? 
                        <div className='flex grow justify-center items-center w-full'>
                            {/** display no to-dos text if there are no to-dos */}
                            <p className=''>No To-dos</p>
                        </div> 
                        :
                        <div className='flex flex-col grow justify-start items-center w-full overflow-y-scroll'>
                            {/** display a card for each to-do */}


                            {todos.map((todo, index) => (
                                <Todo todo={todo} changeStatus={handleTodoCheck} editTodo={handleEditTodoPopupAppear} key={index} />
                            ))}
                        </div>
                    }
                    <div className='flex flex-col justify-start items-center'></div>
                </div>
            </div>

            {/** create event form */}
            {createEvent ?
                <CreateEvent id={id} categories={categories} success={handleCreateEventSuccess} close={handleCreateEventPopupDisappear} />
                :
                <></>
            }

            {/** edit event form */}
            {editEvent !== '' ? 
                <EditEvent id={id} event={events.find(e => e.ID === editEvent)} categories={categories} success={handleEditEventSuccess} close={handleEditEventPopupDisappear} />
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
                <EditTodo id={id} todo={todos.find(e => e.ID === editTodo)} success={handleEditTodoSuccess} close={handleEditTodoPopupDisappear} />
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
                <EditCategory id={id} category={categories.find(e => e.ID === editCategory)} success={handleEditCategorySuccess} close={handleEditCategoryPopupDisappear} />
                :
                <></>
            }
        </Fragment>
    );
};

Calendar.getLayout = function getLayout(Calendar: ReactElement) {
    return (
        <Layout>
            {Calendar}
        </Layout>
    );
};

export default Calendar;