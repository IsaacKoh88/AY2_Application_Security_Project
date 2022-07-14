import { NextPageWithLayout } from '../_app';
import React, { Fragment, ReactElement, useState } from 'react'
import Head from 'next/head'
import SmallCalendar from '../../components/calendar/month'
import Event from '../../components/calendar/event';
import Todo from '../../components/calendar/todo';
import Layout from '../../components/layouts/authenticated-layout';
import getMonth from '../../utils/calendar';
import dayjs, { Dayjs } from 'dayjs';

const Calendar: NextPageWithLayout = () => {
    /** State to store selected date */
    const [selectedDate, setSelectedDate] = useState(dayjs());

    /** Dummy data */
    const categories = [];
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
                <div className='flex flex-col grow overflow-y-scroll justify-start items-start'>
                    
                </div>
            </div>

            <div className='flex flex-row grow h-full'>

                {/** calendar date events */}
                <div className='flex flex-col justify-start items-center h-full w-3/5 px-6 mt-4'>
                    <p className='text-xl font-bold mb-2'>Events for {selectedDate.format('DD/MM/YYYY')}</p>
                    {(events.length === 0) ? 
                        <div className='flex grow justify-center items-center w-full'>
                            <p className=''>No Events</p>
                        </div> 
                        :
                        <div className='flex flex-col grow justify-start items-center w-full'>
                            {events.map((event, index) => (
                                <Event event={event} key={index} />
                            ))}
                        </div>
                    }
                    <div className='flex flex-col justify-start items-center'></div>
                </div>

                {/** to-do list */}
                <div className='flex flex-col justify-start items-center h-full w-2/5 px-6 mt-4'>
                    <p className='text-xl font-bold mb-2'>To-do list</p>
                    {(todos.length === 0) ? 
                        <div className='flex grow justify-center items-center w-full'>
                            <p className=''>No To-dos</p>
                        </div> 
                        :
                        <div className='flex flex-col grow justify-start items-center w-full'>
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