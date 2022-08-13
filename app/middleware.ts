import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server';
import executeQuery from './utils/connections/db';
import * as jose from 'jose';;

// This function can be marked `async` if using `await` inside
export async function middleware(req: NextRequest) {
    /**const JWTtoken = req.cookies.get('token');

    if (((req.nextUrl.pathname === '/') || (req.nextUrl.pathname === '/login') || (req.nextUrl.pathname === '/signup')) && (JWTtoken !== undefined)) {
        try {
            /** check if JWT token is valid 
            const { payload, protectedHeader } = await jose.jwtVerify(
                JWTtoken, 
                new TextEncoder().encode(`qwertyuiop`), 
                {
                    issuer: 'application-security-projet'
                }
            );

            /** if JWT token is valid, redirect to authenticated route 
            return NextResponse.redirect(new URL('/calendar', req.url));
        }
        catch (error) {
            /** if JWT token is not valid, delete token on client side 
            const response = NextResponse.next();
            response.cookies.delete('token')
        }
        return NextResponse.next()
    };

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
    matcher: '/:path*',
    api: {
        bodyParser: {
            sizeLimit: '1mb',
        },
    },
};