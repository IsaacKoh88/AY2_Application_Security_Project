import type { NextPage } from 'next'
import { Fragment, SetStateAction } from 'react'
import Head from 'next/head'
import { useState, useEffect } from 'react'
import Navbar from '../components/navbar'
import zxcvbn from 'zxcvbn';

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

    const handleCPassword = (e: { target: { value: SetStateAction<string> } }) => {
        setCPassword(e.target.value);
        setIsCPasswordDirty(true);
    }
    
    const strength = Object.values(validate).reduce((a, item) => a + item, 0)
    // // This function will be triggered when the password input field changes
    // const inputHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    //     const enteredValue = event.target.value.trim();
    //     setPassword(enteredValue);
    // };



    useEffect(() => {
        if (cPassword.length <= 4) {
        setPasswordStrength("Very Weak");
        setIsButtonDisabled(true);
        } else if (password.length <= 6) {
        setPasswordStrength("Weak");
        setIsButtonDisabled(true);
        } else if (password.length <= 8) {
        setPasswordStrength("Medium");
        setIsButtonDisabled(true);
        } else if (password.length <= 11) {
        setPasswordStrength("Strong");
        setIsButtonDisabled(false);
        } else{
        setPasswordStrength("Very Strong");
        setIsButtonDisabled(false);
        }
    }, [cPassword]);


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


    useEffect(() => {
        if (isCPasswordDirty) {
            if (password === cPassword) {
                setShowErrorMessage(false);
                setCPasswordClass('form-control is-valid')
            } else {
                setShowErrorMessage(true)
                setCPasswordClass('form-control is-invalid')
            }
        }
    }, [cPassword])


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

                <div className='container flex justify-center items-center flex-grow'>
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
                            
                            <div style={styles.statusBar}>
                                <div
                                style={{
                                    ...styles.changePasswordColor,
                                    width: `${(password.length / 13) * 100}%`,
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