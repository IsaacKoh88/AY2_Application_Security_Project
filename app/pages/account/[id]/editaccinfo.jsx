import { Fragment } from 'react'
import Head from 'next/head'
import Navbar from '../../../components/navbar'
import executeQuery from '../../../utils/db'
import { useState } from 'react'
import * as jose from 'jose'
import React, { Component } from 'react'
import axios from 'axios';
import { UiFileInputButton } from '../../../components/UiFileInputButton';
import { uploadFileRequest } from '../../../components/upload.services';
export async function getServerSideProps(context) {
    const JWTtoken = context.req.cookies['token'];
    const id = context.params.id

    {/* if JWT does not exist */ }
    if (JWTtoken == undefined) {
        return {
            redirect: {
                destination: '/401',
                permanent: false,
            },
        }
    }

    try {
        {/* check if JWT token is valid */ }
        const email = await jose.jwtVerify(JWTtoken, new TextEncoder()
            .encode(`qwertyuiop`))
            .then(value => { return (value['payload']['email']) });

        {/* check if email is the same as the one in the id of URL */ }
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
            {/* reject if email is not the same */ }
            return {
                redirect: {
                    destination: '/401',
                    permanent: false,
                },
            }
        }
    }
    catch (error) {
        {/* reject if JWT token is invalid */ }
        return {
            redirect: {
                destination: '/401',
                permanent: false,
            },
        }
    }
}

// class App extends Component {
//     // Initially, no file is selected
//     state = { selectedFile: null };

//     // On file select (from the pop up)
//     // Update the state 
//     onFileChange = event => { this.setState({ selectedFile: event.target.files[0] }); };

//     // On file upload (click the upload button)
//     onFileUpload = () => {
//         // Create an object of formData
//         const formData = new FormData();
//         // Update the formData object
//         formData.append("myFile", this.state.selectedFile, this.state.selectedFile.name);

//         // Details of the uploaded file
//         console.log(this.state.selectedFile);
//         console.log(formData);
//         // Request made to the backend api
//         // Send formData object
//         axios.post("api/uploadfile", formData);
//     };

//     // File content to be displayed after
//     // file upload is complete
//     fileData = () => {
//         if (this.state.selectedFile) {
//             return (
//                 <div>
//                     <h2>File Details:</h2>
//                     <p>File Name: {this.state.selectedFile.name}</p>
//                     <p>File Type: {this.state.selectedFile.type}</p>
//                     <p> Last Modified:{" "} {this.state.selectedFile.lastModifiedDate.toDateString()} </p>
//                 </div>
//             );
//         } else {
//             return (
//                 <div>
//                     <br />
//                     <h4>Choose before Pressing the Upload button</h4>
//                 </div>
//             );
//         }
//     };

//     render() {
//         return (
//             <div>
//                 <h1>GeeksforGeeks</h1>
//                 <h3>File Upload using React!</h3>
//                 <div><input type="file" onChange={this.onFileChange} /><button onClick={this.onFileUpload}> Upload!</button>
//                 </div>
//                 {this.fileData()}
//             </div>
//         );
//     }
// }

// export default App;

const ChangePFP = ({ id }) => {

    {/** Calls API on form submit */ }
    const FormSubmitHandler = async () => {
        const res = await fetch('/api/' + id + '/account/edit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id: id, username: username, address: address, image: Image })
        })
    }
    const [Image, setImage] = useState('')

    const [username, SetUsername] = useState('')
    const [address, SetAddress] = useState('')

    // On file upload (click the upload button)
    const onChange = async (formData, imagename) => {
        const response = await uploadFileRequest(formData, (event) => {
            console.log(`Current progress:`, Math.round((event.loaded * 100) / event.total));
        });

        setImage(imagename)
        console.log(imagename)

        console.log('response', response);
    };


    return (
        <Fragment>
            <Head>
                <title>Change Profile Picture</title>
                <meta name="viewport" content="initial-scale=1.0, width=device-width" />
            </Head>

            <div className='flex flex-col justify-start items-center h-screen w-screen text-slate-400 bg-slate-900'>
                <Navbar />

                <div className='container flex justify-center items-center flex-grow'>
                    <div className='flex flex-col justify-start bg-slate-800 items-start h-fit w-[500px] bg-white rounded-2xl p-5 mb-8'>
                        <UiFileInputButton label="Upload Single File" onChange={onChange} />

                        <form className='flex flex-col flex-grow w-full'>
                            {/* <label className='text-lg text-slate-900 ml-0.5 mb-1 font-bold text-white' htmlFor="profilepic">New Profile Picture:</label>
                            <input
                                className='text-white hover:text-slate-800 bg-slate-700 text-opacity-50 focus:border-blue-600 rounded-lg p-2 mb-2'
                                type='file'
                                id='profilepic'
                                name='profilepic'
                                accept="image/*"
                                onChange={e => onFileUpload(e)}
                            //required
                            /> */}
                            <label className='text-lg text-slate-900 ml-0.5 mb-1 font-bold text-white' htmlFor="newuser">New Username:</label>
                            <input
                                type='text'
                                id='newuser'
                                name='newuser'
                                className='bg-slate-700 w-full text-white font-semibold placeholder:text-slate-400 focus:outline-none px-3 py-2 mb-3 rounded-md'
                                placeholder='New Username'
                                value={username}
                                onChange={e => SetUsername(e.target.value)}
                            //required
                            />
                            <label className='text-lg text-slate-900 ml-0.5 mb-1 font-bold text-white' htmlFor="newaddress">Set Address:</label>
                            <input
                                type='text'
                                id='newaddress'
                                name='newaddress'
                                className='bg-slate-700 w-full text-white focus:outline-none font-semibold placeholder:text-slate-400 px-3 py-2 mb-5 rounded-md'
                                placeholder='New Address'
                                value={address}
                                onChange={e => SetAddress(e.target.value)}
                            //required
                            />
                            <button className='text-white bg-blue-600 rounded-md p-2' type='submit' onClick={FormSubmitHandler}>Submit</button>
                            {/* <img src={this.state.image} /> */}
                        </form>

                    </div>
                </div>

            </div>
        </Fragment>
    );
};

export default ChangePFP;