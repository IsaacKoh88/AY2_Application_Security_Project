import type { NextPage } from 'next'
import { Fragment, SetStateAction } from 'react'
import Head from 'next/head'
import { useState, useEffect } from 'react'
import Navbar from '../components/navbar'
import zxcvbn from 'zxcvbn';
import * as jose from 'jose';
import redisClient from '../utils/connections/redis'

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

        /** check if JWT token is blacklisted */
        await redisClient.connect();
        const keyBlacklisted = await redisClient.exists('bl_'+context.req.cookies['token']);
        await redisClient.disconnect();

        if (keyBlacklisted) {
            throw 401
        }

        /** if JWT token is valid, redirect to authenticated route */
        return {
            redirect: {
                destination: '/account',
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
    const [buttonStyle, setButtonStyle] = useState('y');
    const [buttonOpacity, setButtonOpacity] = useState('opacity-30');
    const [passwordColor, setPasswordColor] = useState('bg-lime-100');
    const [passwordLength, setPasswordLength] = useState('w-0');
    const [cPassword, setCPassword] = useState('');
    const [showErrorMessage, setShowErrorMessage] = useState(false);
    const [cPasswordClass, setCPasswordClass] = useState('form-control');
    const [isCPasswordDirty, setIsCPasswordDirty] = useState(false);
    const [validate, setValidate] = useState({
        hasLow: false,
        hasCap: false,
        hasNumber: false,
        has8digit: false
    });

    
    // const testResult  = zxcvbn(password);
    //     const num = testResult.score * 100/4;
    //     console.log('t',testResult.score)
    // const funcProgressColor = () => {
    //     switch(testResult.score) {
    //         case 0:
    //             return '#FF0000';
    //         case 1:
    //             return '#F33A6A';
    //         case 2:
    //             return '#EA11111';
    //         case 3:
    //             return '#FFAD00';
    //         case 4:
    //             return '#00B500';
    //         default:
    //             return 'none';
    //     }
    // }

    const handleCPassword = (e: { target: { value: SetStateAction<string> } }) => {
        setCPassword(e.target.value);
        setIsCPasswordDirty(true);
    }
    // // This function will be triggered when the password input field changes
    // const inputHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    //     const enteredValue = event.target.value.trim();
    //     setPassword(enteredValue);
    // };


    useEffect(() => {
        var length = password.length
        console.log(length === 0)
        if (length === 0)  {
            setPasswordLength('w-0')
        }
        else{
            setPasswordLength('w-'+length+'/12')
        }

        const testResult  = zxcvbn(password);
        const num = testResult.score * 100/4;

        if (testResult.score === 0) {
            setPasswordColor('bg-red-600')

        }
        else if (testResult.score === 1 || testResult.score === 2) {
            setPasswordColor('bg-red-400')

        }
        else if (testResult.score === 3) {
            setPasswordColor('bg-amber-400')

        }
        else if (testResult.score === 4) {
            setPasswordColor('bg-lime-400')

        }

        if (password.length <= 4) {
        setPasswordStrength("Very Weak");
        setIsButtonDisabled(true);
        setButtonOpacity('opacity-30')
        } else if (password.length <= 6) {
        setPasswordStrength("Weak");
        setIsButtonDisabled(true);
        setButtonOpacity('opacity-30')
        } else if (password.length <= 8) {
        setPasswordStrength("Medium");
        setIsButtonDisabled(true);
        setButtonOpacity('opacity-30')
        } else if (password.length <= 11) {
        setPasswordStrength("Strong");
        setIsButtonDisabled(false);
        setButtonOpacity('0')
        } else{
        setPasswordStrength("Very Strong");
        setIsButtonDisabled(false);
        setButtonOpacity('0')
        }
    }, [password]);

    useEffect(() => {
        if (password.match(/\d+/g)) {
            setValidate((o) => ({ ...o, hasNumber: true }));
        } else{
            setValidate((o) => ({ ...o, hasNumber: false }));
        }

        if (password.match(/[A-Z]+/g)) {
            setValidate((o) => ({ ...o, hasCap: true }));
        } else{
            setValidate((o) => ({ ...o, hasCap: false }));
        }

        if (password.match(/[a-z]+/g)) {
            setValidate((o) => ({ ...o, hasLow: true }));
        } else {
            setValidate((o) => ({ ...o, hasLow: false }));
        }

        if (password.length > 8) {
            setValidate((o) => ({ ...o, has8digit: true }));
        } else{
            setValidate((o) => ({ ...o, has8digit: false }));
        } 
    }, [password]);


    // useEffect(() => {
    //     if (isCPasswordDirty) {
    //         if (password === cPassword) {
    //             setShowErrorMessage(false);
    //             setCPasswordClass('form-control is-valid')
    //         } else {
    //             setShowErrorMessage(true)
    //             setCPasswordClass('form-control is-invalid')
    //         }
    //     }
    // }, [cPassword])

    
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
                            <label className='text-lg text-slate-900 ml-0.5 mb-1' htmlFor='username'>Username:</label>
                            <input 
                                className='text-slate-900 border focus:border-blue-600 rounded-md p-2 mb-2' 
                                type='text' 
                                id='username' 
                                name='username' 
                                placeholder='Username' 
                                required 
                            />
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
                                className='text-slate-900 border focus:border-blue-600 rounded-md p-2 mb-2 form-control' 
                                type='password' 
                                id='password' 
                                name='password' 
                                placeholder='Password' 
                                value={password}
                                // onChange={inputHandler}
                                onChange={(e) => { setPassword(e.target.value) }}
                                required
                            />
                            
                        
                            <label className='text-lg text-slate-900 ml-0.5 mb-1' htmlFor='confirmpassword'>Confirm Password:</label>
                            <input 
                                className='text-slate-900 border focus:border-blue-600 rounded-md p-2 mb-4' 
                                type='password' 
                                id='confirmpassword' 
                                // name='confirmpassword' 
                                name= {cPasswordClass}
                                placeholder='Confirm Password' 
                                value={cPassword}
                                onChange={handleCPassword}
                                required
                            />
                            {showErrorMessage && isCPasswordDirty? <div> Passwords do not match </div> : ''}

                            {/* {strength > 0 ? (
                                <progress
                                    hidden={password.length === 0}
                                    className={`password strength-${strength}`}
                                    value={strength}
                                    max='4'
                                />
                            ) : null} */}

                            <div className='w-460 h-13 border border-stone-700 rounded mt-3'>
                                <div className={`max-w-100% h-2.5 ${passwordLength} ${passwordColor}`}></div>
                            </div>
                            <div className='py-5'>{passwordStrength}</div>
                            <button
                                className={`cursor-pointer bg-blue-600 py-4 px-7 rounded-3xl text-white font-bold ${buttonOpacity}`}
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