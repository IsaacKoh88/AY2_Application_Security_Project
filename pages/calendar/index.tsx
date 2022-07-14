import { NextPageWithLayout } from '../_app';
import React, { Fragment, ReactElement, useState } from 'react'
import Head from 'next/head'
import SmallCalendar from '../../components/calendar/month'
import Event from '../../components/calendar/event';
import Todo from '../../components/calendar/todo';
import Category from '../../components/calendar/category';
import Layout from '../../components/layouts/authenticated-layout';
import dayjs, { Dayjs } from 'dayjs';

const Calendar: NextPageWithLayout = () => {
    /** State to store selected date */
    const [selectedDate, setSelectedDate] = useState(dayjs());

    /** Dummy data */
    const categories = [
        {
            'Name' : 'Category 1'
        },
    ];
    const events = [
        {
            'Name' : 'Event 1',
            'StartTime' : '0800',
            'EndTime' : '0900',
            'Description' : 'Blah Blah Blah',
        },
    ];
    const todos = [
        {
            'ID' : 'd6f7cdaf-d9f3-42b0-ab1a-a9bf42ee1585',
            'Name' : 'Todo 1',
        },
    ];

    /** Handles date selection action */
    const handleSelectDate = (index: Dayjs) => {
        setSelectedDate(index);
        /** Call API to get user calendar events, categories and to-do */
    };

    /** Handle to-do checked */
    const handleTodoCheck = (id: number) => {
        /** Calls API to check to-do item as completed */
    };

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
                            <p className='text-lg font-bold'>Categories</p>
                        </div>
                        <div className='cursor-pointer flex justify-center items-center hover:bg-slate-800 w-10 h-10 rounded-lg duration-150 ease-in-out'>
                            <i className='gg-plus'></i>
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
                                <Category category={category} key={index} />
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
                            <p className='text-xl font-bold'>Events for {selectedDate.format('DD/MM/YYYY')}</p>
                        </div>
                        <div className='cursor-pointer flex justify-center items-center hover:bg-slate-800 w-10 h-10 rounded-lg duration-150 ease-in-out'>
                            <i className='gg-plus'></i>
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
                            {events.map((event, index) => (
                                <Event event={event} key={index} />
                            ))}
                        </div>
                    }
                    <div className='flex flex-col justify-start items-center'></div>
                </div>

                {/** to-do list */}
                <div className='flex flex-col justify-start items-center h-full w-2/5 px-6 mt-4'>
                    <div className='flex flex-row justify-center items-center w-full mb-2'>
                        <div className='flex grow justify-center items-center ml-10'>
                            <p className='text-xl font-bold'>To-do list</p>
                        </div>
                        <div className='cursor-pointer flex justify-center items-center hover:bg-slate-800 w-10 h-10 rounded-lg duration-150 ease-in-out'>
                            <i className='gg-plus'></i>
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
                                <Todo todo={todo} checked={handleTodoCheck} key={index} />
                            ))}
                        </div>
                    }
                    <div className='flex flex-col justify-start items-center'></div>
                </div>
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