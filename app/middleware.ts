import type { NextRequest } from 'next/server'
import executeQuery from './utils/db';
import * as jose from 'jose';;

// This function can be marked `async` if using `await` inside
export async function middleware(req: NextRequest) {
    /** const JWTtoken = req.cookies['token'];
    console.log('running')

    /** if JWT does not exist 
    if (JWTtoken === undefined){
        return {
            redirect: {
                destination: '/login',
                permanent: false,
            },
        };
    } else {
        try {
            /** check if JWT token is valid 
            const { payload, protectedHeader } = await jose.jwtVerify(
                JWTtoken, 
                new TextEncoder().encode(`qwertyuiop`), 
                {
                    issuer: 'application-security-projet'
                }
            );
            console.log(payload);
            console.log(protectedHeader);
        } 
        
        catch (error) {
            /** reject if JWT token is invalid 
            console.log(error);
            return {
                redirect: {
                    destination: '/login',
                    permanent: false,
                },
            };
        };
    };*/
};
/** Protected routes */
export const config = {
    matcher: ['/calendar/:path*', '/account', '/account/:path*', '/budget/:path*', '/notes/:path*'],
    api: {
        bodyParser: {
            sizeLimit: '1mb',
        },
    },
};