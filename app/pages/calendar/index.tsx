import type { NextPage } from "next";
import executeQuery from "../../utils/connections/db";
import * as jose from 'jose';
import redisClient from "../../utils/connections/redis";

export async function getServerSideProps(context:any) {
    const JWTtoken = context.req.cookies['token'];

    /** if JWT does not exist */
    if (JWTtoken == undefined){
        return {
            redirect: {
                destination: '/login',
                permanent: false,
            },
        }
    }

    try {
        /** check if JWT token is valid */
        const email = await jose.jwtVerify(JWTtoken, new TextEncoder()
                    .encode(`qwertyuiop`))
                    .then(value => {return(value['payload']['email'])});

        /** check if JWT token is blacklisted */
        await redisClient.connect();
        const keyBlacklisted = await redisClient.exists('bl_'+context.req.cookies['token']);
        await redisClient.disconnect();

        if (keyBlacklisted) {
            return {
                redirect: {
                    destination: '/login',
                    permanent: false,
                },
            };
        }

        /** check if email is the same as the one in the id of URL */
        const result = JSON.parse(JSON.stringify(await executeQuery({
            query: 'CALL selectId_Email(?)',
            values: [email],
        })));

        if (result[0][0] !== undefined) {
            /** redirect user to their calendar page if credentials are correct */
            return {
                redirect: {
                    destination: ('/calendar/' + result[0][0].id),
                    permanent: false,
                },
            };
        } else {
            /** redirect user to login if their JWT credentials do not exist */
            return {
                redirect: {
                    destination: '/login',
                    permanant: false,
                }
            }
        };
    } catch (error) {
        /** redirect user to login if their JWT is invalid */
        return {
            redirect: {
                destination: '/login',
                permanent: false,
            },
        }
    };  
};

const CalendarRedirect: NextPage = () => {
    return <></>
}

export default CalendarRedirect;
