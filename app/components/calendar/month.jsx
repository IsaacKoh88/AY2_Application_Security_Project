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
            return "bg-blue-500 rounded-full text-white";
        } else if (indexDay == selectedDay) {
            /** when date tile is the selected date */
            return "bg-blue-100 rounded-full text-blue-600 font-bold";
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
            <header className="flex justify-between">
                <p className="text-gray-500 font-bold">
                    {dayjs(new Date(dayjs().year(), currentMonthIdx)).format(
                    "MMMM YYYY"
                    )}
                </p>
                <div>
                    <button onClick={handlePrevMonth}>
                        <span className="material-icons-outlined cursor-pointer text-gray-600 mx-2">
                            chevron_left
                        </span>
                    </button>
                    <button onClick={handleNextMonth}>
                        <span className="material-icons-outlined cursor-pointer text-gray-600 mx-2">
                            chevron_right
                        </span>
                    </button>
                </div>
            </header>

            {/** Calendar dates */}
            <div className="grid grid-cols-7 grid-rows-6">

                {/** Days */}
                {currentMonth[0].map((day, i) => (
                    <span key={i} className="text-sm py-1 text-center">
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
                                className={`py-1 w-full ${getDayClass(day)}`}
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