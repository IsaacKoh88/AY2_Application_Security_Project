import type { NextPage } from "next";
import executeQuery from "../../utils/db";
import * as jose from 'jose';

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

        /** check if email is the same as the one in the id of URL */
        const result = await executeQuery({
            query: 'CALL selectId_Email(?)',
            values: [email],
        });

        if (result[0][0] !== undefined) {
            /** redirect user to their calendar page if credentials are correct */
            return {
                redirect: {
                    destination: ('/budget/' + result[0][0].id),
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

const BudgetRedirect: NextPage = () => {
    return <></>
}

export default BudgetRedirect;