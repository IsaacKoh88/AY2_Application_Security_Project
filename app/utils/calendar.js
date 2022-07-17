import dayjs from "dayjs";

function getMonth(month = dayjs().month()) {
    month = Math.floor(month);

    /** Get currrent year from dayjs API */
    const year = dayjs().year();

    /** Get the day of the first date of the month */
    /** 0-6 (Mon to Sun) */
    const firstDayOfTheMonth = dayjs(new Date(year, month, 1)).day();


    let currentMonthCount = 0 - firstDayOfTheMonth;

    /** Create an array for each week of the month */
    /** 1st week to 5th week */
    const daysMatrix = new Array(5).fill([]).map(() => {

        /** Create an array for each day of the month */
        /** Mon to Sun */
        return new Array(7).fill(null).map(() => {
            currentMonthCount++;
            return dayjs(new Date(year, month, currentMonthCount));
        });
    });
    return daysMatrix;
}

/** Function returns array of weeks in the month which are arrays of dates in the week */
export default getMonth