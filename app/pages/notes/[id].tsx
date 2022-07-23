import type { NextPageWithLayout } from '../_app';
import React, { Fragment, useState, ReactElement } from 'react'
import Head from 'next/head'
import Layout from '../../components/layouts/authenticated-layout';

const Notes: NextPageWithLayout = () => {
    return (
        <Fragment>
            <Head>
                <title>Account Details</title> 
                <meta name="viewport" content="initial-scale=1.0, width=device-width" />
            </Head>

            {/*<notes list>*/}
            {/* <div className="notes-list"> */}
            
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