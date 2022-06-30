import Link from 'next/link'
import Image from 'next/image'

const NavItem = ({ href, img }) => {
    return (
        <Link href={href} passHref>
            <div className='group cursor-pointer flex flex-row justify-between items-center h-16 w-20'>
                <div className='flex justify-center items-center relative h-8 w-8 ml-6 group-hover:text-red-500 duration-200 ease-in-out'>
                    <i className={img}></i>
                </div>
                <div className='float-right h-16 w-0 group-hover:w-1 rounded-none group-hover:rounded-l bg-red-500 duration-200 ease-in-out'/>
            </div>
        </Link>
    )
}

export default NavItem