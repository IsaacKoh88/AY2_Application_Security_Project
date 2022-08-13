import { Fragment } from 'react'
import Head from 'next/head'
import Navbar from '../../../components/navbar'
import executeQuery from '../../../utils/connections/db'
import { useState } from 'react'
import * as jose from 'jose'

export async function getServerSideProps(context) {
    const JWTtoken = context.req.cookies['token'];
    const id = context.params.id

    {/* if JWT does not exist */}
    if (JWTtoken == undefined){
        return {
            redirect: {
                destination: '/login',
                permanent: false,
            },
        }
    }

    try {
        {/* check if JWT token is valid */}
        const email = await jose.jwtVerify(JWTtoken, new TextEncoder()
                    .encode(`qwertyuiop`))
                    .then(value => {return(value['payload']['email'])});

        {/* check if email is the same as the one in the id of URL */}
        const result = JSON.parse(JSON.stringify(await executeQuery({
            query: 'CAll selectEmail_Id(?)',
            values: [id],
        })));

        if (result[0][0]['email'] === email) {
            return {
                props: {
                        id: id,
                }
            }
        }
        
        else {
            {/* reject if email is not the same */}
            return {
                redirect: {
                    destination: '/login',
                    permanent: false,
                },
            }
        }
    } 
    
    catch (error) {
        {/* reject if JWT token is invalid */}
        return {
            redirect: {
                destination: '/login',
                permanent: false,
            },
        }
    }    
}

const Logout = ({ id }) => {
    const [password] = useState('');

    return (
        <Fragment>
            <div className='flex flex-col justify-start items-center h-screen w-screen text-slate-400 bg-slate-900'>
                <Navbar />

            </div>
        </Fragment>
    );
};

export default Logout;