import type { NextPage } from 'next'
import { Fragment } from 'react'
import Head from 'next/head'
import { useState, useEffect } from 'react'
import Navbar from '../components/navbar'
import zxcvbn from 'zxcvbn';
import * as jose from 'jose';

export async function getServerSideProps(context:any) {
    try {
        const JWTtoken = context.req.cookies['token']

        /** check if JWT token is valid */
        const { payload, protectedHeader } = await jose.jwtVerify(
            JWTtoken, 
            new TextEncoder().encode(`qwertyuiop`), 
            {
                issuer: 'application-security-project'
            }
        );

        /** if JWT token is valid, redirect to authenticated route */
        return {
            redirect: {
                destination: '/calendar',
                permanent: false
            }
        }
    }
    catch (error) {
        /** if JWT token is not valid, delete token on client side */
        return {
            props: {}
        }
    }
}

// Declare Password strength type
type PasswordStrength = 
    | "Very Weak"
    | "Weak"
    | "Medium"
    | "Strong"
    | "Very Strong";



const Signup: NextPage = () => {
    
    // The password
    const [password, setPassword] = useState<string>("");
    const [passwordStrength, setPasswordStrength] =
        useState<PasswordStrength>("Very Weak");
    const [isButtonDisabled, setIsButtonDisabled] = useState<boolean>(true);

    const testResult  = zxcvbn(password);
    const num = testResult.score * 100/4;
    const funcProgressColor = () => {
        switch(testResult.score) {
            case 0:
                return '#FF0000';
            case 1:
                return '#F33A6A';
            case 2:
                return '#EA11111';
            case 3:
                return '#FFAD00';
            case 4:
                return '#00B500';
            default:
                return 'none';
        }
    }
    console.log(num)

    // This function will be triggered when the password input field changes
    const inputHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        const enteredValue = event.target.value.trim();
        setPassword(enteredValue);
    };



    useEffect(() => {
        if (password.length <= 4) {
        setPasswordStrength("Very Weak");
        setIsButtonDisabled(true);
        } else if (password.length <= 6) {
        setPasswordStrength("Weak");
        setIsButtonDisabled(true);
        } else if (password.length <= 8) {
        setPasswordStrength("Medium");
        setIsButtonDisabled(true);
        } else if (password.length <= 12) {
        setPasswordStrength("Strong");
        setIsButtonDisabled(false);
        } else{
        setPasswordStrength("Very Strong");
        setIsButtonDisabled(false);
        }
    }, [password]);


        //styling
        const styles = {
            container: {
                width: 400,
                padding: "30px 90px",
                margin: "50px auto",
                backgroundColor: "#f4ff81",
                borderRadius: "10px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
            },
            password: {
                width: 300,
                padding: "8px 10px",
                border: "1px solid #444",
                borderRadius: "10px",
                outline: "none",
            },
            statusBar: {
                width: 460,
                height: 13,
                marginTop: 10,
                background: "#fff",
                border: "1px solid #444",
                borderRadius: "5px",
            },
            message: {
                padding: "20px 0",
            },
            button: {
                padding: "15px 30px",
                cursor: "pointer",
                background: "#1E88E5",
                color: "#fff",
                fontWeight: "bold",
                border: "none",
                borderRadius: "30px",
            },
            disabledButton: {
                cursor: "not-allowed",
                opacity: 0.3,
            },
            changePasswordColor: {
                width: `${num}%`,
                background: funcProgressColor(),
                height: '10px',
                maxWidth: "100%",
            }
        } as const; 

    
    return (
        <Fragment>
            <Head>
                <title>Signup Page</title>
                <meta name="viewport" content="initial-scale=1.0, width=device-width" />
            </Head>

            <div className='flex flex-col justify-start items-center h-screen w-screen text-slate-400 bg-slate-900'>
                <Navbar />

                <div className='container flex justify-center items-center h-full'>
                    <div className='flex flex-row justify-start items-start h-fit w-[500px] bg-white rounded-2xl p-5 mb-8'>

                        <form className='flex flex-col flex-grow' action='/api/signup' method='post'>
                            <label className='text-lg text-slate-900 ml-0.5 mb-1' htmlFor='email'>Email:</label>
                            <input 
                                className='text-slate-900 border focus:border-blue-600 rounded-md p-2 mb-2' 
                                type='text' 
                                id='email' 
                                name='email' 
                                placeholder='Email' 
                                required 
                            />
                            <label className='text-lg text-slate-900 ml-0.5 mb-1' htmlFor='password'>Password:</label>
                            <input 
                                className='text-slate-900 border focus:border-blue-600 rounded-md p-2 mb-2' 
                                type='password' 
                                id='password' 
                                name='password' 
                                placeholder='Password' 
                                value={password}
                                onChange={inputHandler}
                                required
                            />
                            <label className='text-lg text-slate-900 ml-0.5 mb-1' htmlFor='confirmpassword'>Confirm Password:</label>
                            <input 
                                className='text-slate-900 border focus:border-blue-600 rounded-md p-2 mb-4' 
                                type='password' 
                                id='confirmpassword' 
                                name='confirmpassword' 
                                placeholder='Confirm Password' 
                                required
                            />
                            <div style={styles.statusBar}>
                                <div
                                style={{
                                    ...styles.changePasswordColor,
                                    width: `${(password.length / 12) * 100}%`,
                                }}
                                ></div>
                            </div>
                            <div style={styles.message}>{passwordStrength}</div>
                            <button
                                style={
                                    isButtonDisabled
                                        ? { ...styles.button, ...styles.disabledButton }
                                        : styles.button
                                    }
                                    disabled={isButtonDisabled}
                                >
                                    CONTINUE
                            </button>
                        </form>

                    </div>
                </div>

            </div>
        </Fragment>
    );
};

export default Signup;