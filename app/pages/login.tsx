import type { NextPage } from 'next'
import { Fragment } from 'react'
import { useState, useEffect } from 'react'
import Head from 'next/head'
import Navbar from '../components/navbar'
import zxcvbn from 'zxcvbn';




const Login: NextPage = () => {



    return (
        <Fragment>
            <Head>
                <title>Login Page</title>
                <meta name="viewport" content="initial-scale=1.0, width=device-width" />
            </Head>

            <div className='flex flex-col justify-start items-center h-screen w-screen text-slate-400 bg-slate-900'>
                <Navbar />
                <div className='container flex justify-center items-center flex-grow'>
                    <div className='flex flex-row justify-start items-start h-fit w-[500px] bg-white rounded-2xl p-5 mb-8'>
                        <form className='flex flex-col flex-grow' action='/api/login' method='post'>
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
                                className='text-slate-900 border focus:border-blue-600 rounded-md p-2 mb-4' 
                                type='password'
                                id='password' 
                                name='password' 
                                placeholder='Password'
                                required

                            />
                            <button className='text-white bg-blue-600 rounded-md p-2' type='submit'>Login</button>
                        </form>
                    </div>
                </div>
            </div>
        </Fragment>
    );


    
};

// const Login: NextPage = () => {
    //   // The password
    // const [password, setPassword] = useState<string>("");
    // const [passwordStrength, setPasswordStrength] =
    //     useState<PasswordStrength>("Very Weak");
    // const [isButtonDisabled, setIsButtonDisabled] = useState<boolean>(true);

    // // This function will be triggered when the password input field changes
    // const inputHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    //     const enteredValue = event.target.value.trim();
    //     setPassword(enteredValue);
    // };

    // useEffect(() => {
    //     if (password.length <= 4) {
    //     setPasswordStrength("Very Weak");
    //     setIsButtonDisabled(true);
    //     } else if (password.length <= 6) {
    //     setPasswordStrength("Weak");
    //     setIsButtonDisabled(true);
    //     } else if (password.length <= 8) {
    //     setPasswordStrength("Medium");
    //     } else if (password.length <= 12) {
    //     setPasswordStrength("Strong");
    //     setIsButtonDisabled(false);
    //     } else {
    //     setPasswordStrength("Very Strong");
    //     setIsButtonDisabled(false);
    //     }
    // }, [password]);

    // // Button handler function
    // const buttonHandler = () => {
    //     alert("You have entered a strong enough password");
    //     // Do otehr things here
    // };

//     return (
//         <div style={styles.container}>
//         <h3>KindaCode.com</h3>

//         {/* The input field */}
//         <input
            // type="password"
            // value={password}
            // onChange={inputHandler}
            // placeholder="Enter you password"
            // style={styles.password}
//         />

        // {/* This bar indicated the strength of the entered password */}
        // <div style={styles.statusBar}>
        //     <div
        //     style={{
        //         ...styles.strength,
        //         width: `${(password.length / 16) * 100}%`,
        //     }}
        //     ></div>
        // </div>

        // {/* Password strength message */}
        // <div style={styles.message}>{passwordStrength}</div>

//         {/* This button is only clickable when the entered password is strong enough */}
//         <button
//             style={
//             isButtonDisabled
//                 ? { ...styles.button, ...styles.disabledButton }
//                 : styles.button
//             }
//             disabled={isButtonDisabled}
//             onClick={buttonHandler}
//         >
//             CONTINUE
//         </button>
//         </div>
//     );
// };



export default Login;