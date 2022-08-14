import type { NextPage } from 'next'
import Link from 'next/link'

const Navbar: NextPage = () => {
    return (
        <div className='w-full h-20'>
            <div className='container flex justify-between content-center h-full'>
                <div className='flex justify-center content-center h-full'>
                    <Link href='/'>
                        <p className='text-white font-medium text-xl pb-0.5 m-auto cursor-pointer select-none'>Lifestyle Management</p>
                    </Link>
                </div>

                <div className='flex content-center h-full'>
                    <Link href='/login'>
                        <div className='group flex justify-center content-center rounded-xl h-12 px-5 m-auto cursor-pointer'>
                            <p className='text-white group-hover:text-sky-400 font-medium pb-0.5 m-auto transition'>Login</p>
                        </div>
                    </Link>
                    <Link href='/signup'>
                        <div className='group flex justify-center content-center rounded-xl h-12 px-5 m-auto cursor-pointer'>
                            <p className='text-white group-hover:text-sky-400 font-medium pb-0.5 m-auto trnasition'>Sign Up</p>
                        </div>
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default Navbar