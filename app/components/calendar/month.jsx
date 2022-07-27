import React, { Fragment, useState, useEffect } from 'react';
import dayjs from 'dayjs';
import getMonth from '../../utils/calendar';

const SmallCalendar = ({ selectedDate, handleSelectDate }) => {
    /** State to store current month's index */
    const [currentMonthIdx, setCurrentMonthIdx] = useState(dayjs().month());
    /** State to store array of dates in current month */
    const [currentMonth, setCurrentMonth] = useState(getMonth());

    /** Changes currentMonth state everytime currentMonthIdx state changes */
    useEffect(() => {
        setCurrentMonth(getMonth(currentMonthIdx));
    }, [currentMonthIdx]);

    /** Changes months displayed */
    function handlePrevMonth() {
        setCurrentMonthIdx(currentMonthIdx - 1);
    };
    function handleNextMonth() {
        setCurrentMonthIdx(currentMonthIdx + 1);
    };

    /** Sets class for selected date to highlight */
    function getDayClass(day) {
        const format = "DD-MM-YY";
        const currentDay = dayjs().format(format);
        const indexDay = day.format(format);
        const selectedDay = selectedDate.format(format);
        if (indexDay === currentDay) {
            /** when date tile is the current date */
            return "bg-indigo-600 rounded-full text-white font-semibold";
        } else if (indexDay == selectedDay) {
            /** when date tile is the selected date */
            return "bg-rose-600 rounded-full text-white font-semibold";
        } else if (day.isBefore(dayjs())) {
            /** when the date tile is before current date */
            return "text-slate-600";
        } else {
            return "";
        };
    };

    return (
        <div className="mt-9">

            {/** Calendar header */}
            <header className="flex justify-between mb-2">
                <button onClick={handlePrevMonth}>
                    <span className="gg-chevron-left cursor-pointer hover:text-white mx-2 duration-150 ease-in-out"></span>
                </button>
                <p className="cursor-default text-lg text-slate-200 font-bold">
                    {dayjs(new Date(dayjs().year(), currentMonthIdx)).format(
                    "MMMM YYYY"
                    )}
                </p>
                <button onClick={handleNextMonth}>
                    <span className="gg-chevron-right cursor-pointer hover:text-white mx-2 duration-150 ease-in-out"></span>
                </button>
            </header>

            {/** Calendar dates */}
            <div className="grid grid-cols-7 grid-rows-6">

                {/** Days */}
                {currentMonth[0].map((day, i) => (
                    <span key={i} className="cursor-default flex justify-center items-center text-sm text-slate-200 font-semibold h-8 w-8 m-1 text-center">
                        {day.format("dd").charAt(0)}
                    </span>
                ))}

                {/** Dates */}
                {currentMonth.map((row, i) => (
                    <Fragment key={i}>
                        {row.map((day, idx) => (
                            <button
                                key={idx}
                                onClick={() => handleSelectDate(day)}
                                className={`flex justify-center items-center h-8 w-8 m-1 ${getDayClass(day)}`}
                            >
                                <span className="text-sm">{day.format("D")}</span>
                            </button>
                        ))}
                    </Fragment>
                ))}
            </div>
        </div>
    );
};

export default SmallCalendar;