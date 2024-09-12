
import Link from 'next/link';
import React, { useEffect } from 'react'

// third file created and imported in Header component

export const navItemsData = [
    {
        name: "Home",
        url: "/",
    },
    {
        name: "Courses",
        url: "/courses",
    },
    {
        name: "About",
        url: "/about",
    },
    {
        name: "Policy",
        url: "/policy",
    },
    {
        name: "FAQ",
        url: "/faq",
    },
];


type Props = {

    activeItem: number;
    isMobile: boolean
}


const NavItems: React.FC<Props> = ({ activeItem, isMobile }) => {

  
    return (
        <>
            <div className='hidden 800px:flex'>
                {
                    navItemsData && navItemsData.map((navElement, index) => (
                        <Link href={`${navElement.url}`} key={index} passHref>
                            <span
                                className={
                                    `${activeItem === index ?
                                        "dark:text-[#37a39a] text-[crimson]" : "dark:text-white text-black"} text-[18px] px-4 font-Poppins font-[400]
                    `}

                            >
                                {navElement.name}
                            </span>
                        </Link>
                    ))
                }
            </div>
            {
                isMobile && (
                    <div className='800px:hidden mt-5'>
                        {/* add logo */}

                        <div className='w-full text-center py-6'>
                            <Link href={"/"} passHref>
                                <span className={`text-[25px] font-Poppins font-[500] text-black dark:text-white`}>
                                    KLearning Logo
                                </span>
                            </Link>
                        </div>

                        {
                            navItemsData && navItemsData.map((navElement, index) => (
                                <Link href={`${navElement.url}`} key={index} passHref>
                                    <span
                                        className={
                                            `${activeItem === index ?
                                                "dark:text-[#37a39a] text-[crimson]" : "dark:text-white text-black"} 
                                                block py-5 text-[18px] px-4 font-Poppins font-[400]`}>
                                        {navElement.name}
                                    </span>
                                </Link>
                            ))
                        }
                    </div>
                )
            }
        </>
    )
}

export default NavItems