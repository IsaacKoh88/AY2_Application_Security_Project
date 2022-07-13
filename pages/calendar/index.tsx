import { NextPageWithLayout } from '../_app';
import React, { Fragment, ReactElement, useState } from 'react'
import Head from 'next/head'
import Layout from '../../components/layouts/authenticated-layout';
import getMonth from '../../utils/calendar';

const Calendar: NextPageWithLayout = () => {
    const [month, setMonth] = useState(getMonth());

    return (
        <Fragment>
            <Head>
                <title>Account Details</title> 
                <meta name="viewport" content="initial-scale=1.0, width=device-width" />
            </Head>

            <div className='flex flex-col justify-center items-center h-full'>

                {/** calendar days grid */}
                <div className='flex-1 grid grid-cols-7 grid-rows-5'>

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
    )
}

export default Calendar;