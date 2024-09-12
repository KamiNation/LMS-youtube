"use client"
import Link from "next/link" // Importing Link component for navigation
import React, { FC, useEffect, useState } from "react" // Importing React, functional component type, and hooks

import NavItems from "../utils/NavItems" // Importing navigation items component
import ThemeSwitcher from "../utils/ThemeSwitcher" // Importing theme switcher component
import CustomModal from "../utils/CustomModal" // Importing custom modal component

import Login from "../components/Auth/Login" // Importing Login component
import SignUp from "../components/Auth/SignUp" // Importing SignUp component
import Verification from "../components/Auth/Verification" // Importing Verification component
// Created component folder
// First file created and imported into page component

import { HiOutlineMenuAlt3, HiOutlineUserCircle } from "react-icons/hi" // Importing icons
import { useSelector } from "react-redux" // Importing useSelector to access Redux state
import Image from "next/image" // Importing Image component for optimized images

import avatar from "@/public/assets/photo.jpeg" // Default avatar image
import { useLogOutQuery, useSocialAuthMutation } from "@/redux/features/auth/authApi"
import toast from "react-hot-toast"
import { useSession } from "next-auth/react"

type Props = {
    open: boolean // State to control modal open/close
    setOpen: (open: boolean) => void // Function to set open state
    activeItem: number // Current active navigation item
    route: string // Current route
    setRoute: (route: string) => void // Function to change routes
}

// Header component for the app
const Header: FC<Props> = ({ activeItem, open, setOpen, route, setRoute }) => {

    const [active, setActive] = useState(false) // State to control the sticky header
    const [openSidebar, setOpenSidebar] = useState(false) // State to control sidebar open/close

    // Adding user image from user
    const { user } = useSelector((state: any) => state.auth) // Extracting user data from Redux state

    const { data } = useSession()

    const [socialAuth, { isSuccess, error }] = useSocialAuthMutation()

    // fixing session logout issue here from
    // Profile component copying the below from
    // the Profile component 

    const [logout, setLogout] = useState(false)


    const { } = useLogOutQuery(undefined, {
        skip: !logout ? true : false
    });

    useEffect(() => {
        if (!user) {
            if (data) {
                socialAuth({
                    email: data?.user?.email,
                    name: data?.user?.name,
                    avatar: data?.user?.image
                })
            }
        }

        if (data === null) {
            if (isSuccess) {
                toast.success("Login Successfully")
            }
        }

        if (data === null) {
            setLogout(true);
        }
    }, [socialAuth, data, user, isSuccess])




    // Creating sticky header effect
    if (typeof window !== "undefined") { // Checking if running in the browser
        window.addEventListener("scroll", () => {
            if (window.scrollY > 80) { // If scrolled more than 80px
                setActive(true); // Set header to active (sticky)
            } else {
                setActive(false) // Remove active (sticky) state
            }
        })
    }

    // Function to handle sidebar close on click outside
    const handleClose = (e: any) => {
        if (e.target.id === "screen") { // Check if clicked outside the sidebar
            setOpenSidebar(false) // Close the sidebar
        }
    }

    return (
        <div className="w-full relative">
            <div className={ `${active ? "dark:bg-opacity-50 dark:bg-gradient-to-b dark:from-gray-900 dark:to-black fixed top-0 left-0 w-full h-[80px] z-[80] border-b dark:border-[#ffffff1c] shadow-xl transition duration-500" : "w-full border-b dark:border-[#ffffff1c] h-[80px] z-[80] dark:shadow"}` }>
                {/* Header container with conditional classes for sticky effect */}

                <div className="w-[95%] 800px:w-[92%] m-auto py-2 h-full">
                    <div className="w-full h-[80px] flex items-center justify-between p-3" >
                        {/* Flex container for logo and navigation items */}

                        <div>
                            <Link href={"/"} // Logo link
                                className={"text-[25px] font-Poppins font-[500] text-black dark:text-white "}
                            >
                                KLearning logo
                            </Link>
                        </div>

                        <div className="flex items-center">
                            <NavItems
                                activeItem={activeItem} // Passing active navigation item
                                isMobile={false} // Rendering for desktop
                            />

                            <ThemeSwitcher /> {/* Theme switcher button */}

                            {/* Mobile menu icon, only visible on smaller screens */}
                            <div className="800px:hidden">
                                <HiOutlineMenuAlt3
                                    size={25}
                                    className="cursor-pointer dark:text-white text-black"
                                    onClick={() => setOpenSidebar(true)} // Opens sidebar on click
                                />
                            </div>

                            {/* Conditional rendering based on user authentication */}
                            {
                                user ? (
                                    <Link href={"/profile"}>
                                        {/* Display user avatar if logged in */}
                                        <Image
                                            src={user.avatar ? user.avatar.url : avatar} // Display user avatar or default avatar
                                            alt=""
                                            width={30}
                                            height={30}
                                            className="w-[30px] h-[30px] rounded-full cursor-pointer"
                                            style={{border: activeItem === 6 ? "2px solid #ffc102": "none "}}
                                        />
                                    </Link>
                                ) : (
                                    // Display login icon if not logged in
                                    <HiOutlineUserCircle
                                        size={25}
                                        className="hidden 800px:block cursor-pointer ml-5 my-2 text-black dark:text-white"
                                        onClick={() => setOpen(true)} // Opens login modal on click
                                    />
                                )
                            }
                        </div>
                    </div>
                </div>

                {/* Mobile sidebar */}
                {
                    openSidebar && (
                        <div className="fixed w-full h-screen top-0 left-0 z-[99999] dark:bg-[unset] bg-[#00000024]"
                            onClick={handleClose} // Handle close on click outside
                            id="screen"
                        >
                            <div className="w-[70%] fixed z-[999999999] h-screen bg-white dark:bg-slate-900 dark:bg-opacity-90 top-0 right-0">
                                <NavItems activeItem={activeItem} isMobile={true} /> {/* Mobile navigation items */}

                                {/* User icon for login on mobile */}
                                <HiOutlineUserCircle
                                    size={25}
                                    className="cursor-pointer ml-5 my-2 text-black dark:text-white"
                                    onClick={() => setOpen(true)} // Opens login modal on click
                                />

                                <br />
                                <br />

                                {/* Footer text inside sidebar */}
                                <p className="text-[16px] px-2 pl-5 text-black dark:text-white">
                                    Copyright 2024 KLearning
                                </p>
                            </div>
                        </div>
                    )
                }
            </div>

            {/* Conditional rendering of modals based on current route */}
            {
                route === "Login" && (
                    <>
                        {
                            open && (
                                <CustomModal
                                    open={open} // Pass open state
                                    setOpen={setOpen} // Function to set open state
                                    setRoute={setRoute} // Function to change route
                                    activeItem={activeItem} // Active navigation item
                                    component={Login} // Component to render in the modal
                                />
                            )
                        }
                    </>
                )
            }

            {
                route === "Sign-Up" && (
                    <>
                        {
                            open && (
                                <CustomModal
                                    open={open} // Pass open state
                                    setOpen={setOpen} // Function to set open state
                                    setRoute={setRoute} // Function to change route
                                    activeItem={activeItem} // Active navigation item
                                    component={SignUp} // Component to render in the modal
                                />
                            )
                        }
                    </>
                )
            }

            {
                route === "Verification" && (
                    <>
                        {
                            open && (
                                <CustomModal
                                    open={open} // Pass open state
                                    setOpen={setOpen} // Function to set open state
                                    setRoute={setRoute} // Function to change route
                                    activeItem={activeItem} // Active navigation item
                                    component={Verification} // Component to render in the modal
                                />
                            )
                        }
                    </>
                )
            }
        </div>
    )
}

export default Header
