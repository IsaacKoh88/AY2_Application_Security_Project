import NavItem from "../nav-items";
import Link from "next/link";
import Userfront from "@userfront/core";
import image from '/../../AY2_Application_Security_Project/app/public/defaultpfp.jpeg';


Userfront.init("demo1234");

{/**Define logout button component */ }
const Layout = ({ children }) => {
    return (
        <div className='flex flex-row h-screen w-screen text-slate-400 bg-slate-900'>

            {/** left navigation column */}
            <div className='flex flex-col justify-start items-center h-full w-20 border-r-2 border-slate-800'>
                <div className='relative flex justify-center items-center h-20 w-20 mb-4 before:absolute before:bottom-0 before:h-px before:w-1/2 before:border-b-2 before:border-slate-800'>
                    <Link href='/' >
                        <div className='cursor-pointer h-10 w-10 rounded-lg bg-slate-800'></div>
                    </Link>
                </div>
                <NavItem href='/dashboard' img='gg-align-left' />
                <NavItem href='/calendar' img='gg-calendar-dates' />
                <NavItem href='/notes' img='gg-album' />
                <NavItem href='/budget' img='gg-credit-card' />
            </div>
            <div className='flex flex-col grow'>

                {/** top utility bar */}
                <div className='relative flex flex-row justify-end items-center h-20 w-full px-10 before:absolute before:bottom-0 before:left-5 before:right-5 before:h-px before:border-b-2 before:border-slate-800'>
                    {/**<div className='flex justify-center items-center grow h-full'>
                        <div className='cursor-pointer flex flex-row justify-start items-center px-5 h-12 w-1/2 rounded-xl hover:text-slate-200 duration-150 ease-in-out bg-slate-800'>
                            <i className='gg-search'></i>
                            <p className='ml-4'>Search...</p>
                        </div>
                    </div>*/}
                    {/*<div className='cursor-pointer flex justify-center items-center h-10 w-10 rounded-lg bg-indigo-600 mr-10 hover:shadow-md hover:shadow-indigo-600 duration-150 ease-in-out'>
                        <i className='text-slate-200 gg-notification'></i>
                    </div>*/}
                    <Link href='/account'>
                        <div className='cursor-pointer flex flex-row justify-center items-center h-12 mr-3 hover:text-slate-200 duration-150 ease-in-out'>
                            <img src={image.src} className='h-12 w-12 mx-3 rounded-full' />
                            <p className='mx-3'>Username</p>
                        </div>
                    </Link>
                    <Link href='/login'>
                        <div className='cursor-pointer flex flex-row justify-center items-center h-12 mr-3 hover:text-slate-200 duration-150 ease-in-out'>
                            <p className='mx-3'>Sign Out</p>
                        </div>
                    </Link>
                </div>

                {/** page contents */}
                <div className='flex flex-row safe justify-start items-center'>
                    {children}
                </div>
            </div>
        </div>
    )
}

export default Layout;