import { NextPageWithLayout } from '../_app';
import React, { Fragment, ReactElement, useState, useEffect } from 'react'
import Head from 'next/head'
import SmallCalendar from '../../components/calendar/month'
import Event from '../../components/calendar/event';
import Todo from '../../components/calendar/todo';
import Category from '../../components/calendar/category';
import CreateEvent from '../../components/calendar/create-event';
import CreateTodo from '../../components/calendar/create-todo';
import Layout from '../../components/layouts/authenticated-layout';
import dayjs, { Dayjs } from 'dayjs';

const Calendar: NextPageWithLayout = () => {
    /** State to store selected date */
    const [selectedDate, setSelectedDate] = useState(dayjs());
    /** State to store categories */
    const [categories, setCategories] = useState([
        {
            ID : 'a953b8bb-c4d0-44cb-bfee-5538647f02b4',
            Name : 'Category 1',
            Color : 'indigo',
            Activated : true,
        },
        {
            ID : 'debc60a8-4c34-4131-bb30-bba07da0a2a5',
            Name : 'Category 2',
            Color : 'violet',
            Activated : true,
        },
        {
            ID : '16c19385-29ef-4bb0-b88d-d6f88216f159',
            Name : 'Category 3',
            Color : 'red',
            Activated : true,
        },
    ])
    /** State to store events */
    const [events, setEvents] = useState([
        {
            ID : 'd0baf99a-62f8-41a0-818f-d997ab10a2d3',
            Name : 'Event 1',
            StartTime : '0800',
            EndTime : '0900',
            Description : 'Blah Blah Blah',
            Category : 'Category 1'
        },
    ]);
    /** State to store todos */
    const [todos, setTodos] = useState([
        {
            ID : 'd6f7cdaf-d9f3-42b0-ab1a-a9bf42ee1585',
            Name : 'Todo 1',
            Date : '17/07/2022',
            Checked : false,
        },
    ])
    /** State to control create event popup */
    const [createEvent, setCreateEvent] = useState(false)
    /** State to control create todo popup */
    const [createTodo, setCreateTodo] = useState(false)
    /** State to control create category popup */
    const [createCategory, setCreateCateogory] = useState(false)
    /** State to control create category popup */
    const [editCategory, setEditCateogory] = useState(false)

    /** Handles category status check change */
    const handleCategoryStatus = (id: string, checked: boolean) => {
        setCategories(prevState => {
            const newState = prevState.map(category => {
                if (category['ID'] === id) {
                    /** if category id in state is id of changed category return category with changed Activiated property */
                    return {...category, Activated: checked};
                } else {
                    /** else return category unchanged */
                    return category;
                };
            });

            return newState;
        });
    };

    /** Handle to-do checked */
    const handleTodoCheck = (id: string, checked: boolean) => {
        setTodos(prevState => {
            const newState = prevState.map(todo => {
                if (todo['ID'] === id) {
                    /** if todo id in state is id of changed todo return category with changed Checked property */
                    return {...todo, Checked: checked};
                } else {
                    /** else return todo unchanged */
                    return todo;
                };
            });

            return newState;
        });
    };

    /** Handles date selection action */
    const handleSelectDate = (index: Dayjs) => {
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
    /** Opens create new todo popup */
    const handleCreateTodoPopupAppear = () => {
        setCreateTodo(true);
    };
    /** Closes create new todo popup */
    const handleCreateTodoPopupDisappear = () => {
        setCreateTodo(false);
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
    const handleEditCategoryPopupAppear = () => {
        setEditCateogory(true);
    };
    /** Closes edit category popup */
    const handleEditCategoryPopupDisappear = () => {
        setEditCateogory(false);
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
                            <p className='text-lg text-slate-200 font-bold'>Categories</p>
                        </div>
                        <div className='group cursor-pointer flex justify-center items-center hover:bg-slate-800 w-10 h-10 rounded-lg duration-150 ease-in-out'>
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
                                <Category category={category} changeStatus={handleCategoryStatus} editCategory={handleEditCategoryPopupAppear} key={index} />
                            ))}
                        </div>
                    }
                </div>
            </div>

            <div className='flex flex-row grow h-full'>

                {/** calendar date events */}
                <div className='flex flex-col justify-start items-center h-full w-3/5 px-6 mt-4'>
                    <div className='flex flex-row justify-center items-center w-full mb-2'>
                        <div className='flex grow justify-center items-center ml-10'>
                            <p className='text-xl text-slate-200 font-bold'>Events for {selectedDate.format('DD/MM/YYYY')}</p>
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
                                categories.find(e => e['Name'] === event['Category'])?.['Activated'] === true ?
                                <Event event={event} categories={categories} key={index} />
                                :
                                <></>
                            )}
                        </div>
                    }
                    <div className='flex flex-col justify-start items-center'></div>
                </div>

                {/** to-do list */}
                <div className='flex flex-col justify-start items-center h-full w-2/5 px-6 mt-4'>
                    <div className='flex flex-row justify-center items-center w-full mb-2'>
                        <div className='flex grow justify-center items-center ml-10'>
                            <p className='text-xl text-slate-200 font-bold'>To-do list</p>
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
                                <Todo todo={todo} changeStatus={handleTodoCheck} key={index} />
                            ))}
                        </div>
                    }
                    <div className='flex flex-col justify-start items-center'></div>
                </div>
            </div>

            {/** create event form */}
            <div className={`fixed z-10 inset-0 ${createEvent ? '' : 'hidden'}`}>
                <CreateEvent close={handleCreateEventPopupDisappear} />
            </div>

            {/** create todo form */}
            <div className={`fixed z-10 inset-0 ${createTodo ? '' : 'hidden'}`}>
                <CreateTodo close={handleCreateTodoPopupDisappear} />
            </div>
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