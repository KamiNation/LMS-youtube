"use client"

import React, { useState } from 'react'

import SideBarProfile from './SideBarProfile'
import { useLogOutQuery } from '@/redux/features/auth/authApi'
import { signOut } from "next-auth/react"
import { redirect } from 'next/navigation'
import ProfileInfo from './ProfileInfo'
import ChangePassword from './ChangePassword'


// first file in the Profile folder for user profile and used in
// page.tsx file in profile folder to give access to only auth users only

type Props = { user: any }

const Profile: React.FC<Props> = ({ user }) => {

    const [scroll, setScroll] = useState(false)

    const [avatar, setAvatar] = useState(null)

    const [active, setActive] = useState(1)

    const [logout, setLogout] = useState(false)


    const { } = useLogOutQuery(undefined, {
        skip: !logout ? true : false
    });

    const logOutHandler = async () => {
        // when the logout handler is clicked the 
        // signOut function from the next-auth cause the app to reload and logout the session but doesn't
        // call the setLogout() function and so we have to logout twice

        // amd that is fixed in the useeffect in 
        // the header
        setLogout(true);
        await signOut();
    }

    // Creating sticky header effect
    if (typeof window !== "undefined") { // Checking if running in the browser
        window.addEventListener("scroll", () => {
            if (window.scrollY > 85) { // If scrolled more than 80px
                setScroll(true); // Set header to active (sticky)
            } else {
                setScroll(false) // Remove active (sticky) state
            }
        })
    }




    return (
        <div className='w-[85%] flex mx-auto'>
            <div className={
                `w-[60px] 800px:w-[310px] h-[450px] dark:bg-slate-900 bg-opacity-90 border bg-white dark:border-[#ffffff1d] border-[#ffffff14]
                rounded-[5px] shadow-xl dark:shadow-sm mt-[80px] mb-[80px] sticky ${scroll ? "top-[120px]" : "top-[30px]"} left-[30px] 
                `
            }>
                <SideBarProfile
                    user={user}
                    active={active}
                    avatar={avatar}
                    setActive={setActive}
                    logOutHandler={logOutHandler}
                />
            </div>
            {
                active === 1 && (
                    <div className='w-full h-full bg-transparent mt-[80px]'>
                        <ProfileInfo
                            user={user}
                            avatar={avatar} />

                    </div>
                )
            }


            {
                active === 2 && (
                    <div className='w-full h-full bg-transparent mt-[80px]'>
                        <ChangePassword
                            user={user}
                            avatar={avatar} />

                    </div>
                )
            }
        </div>
    )
}

export default Profile