"use client"

import React, { JSXElementConstructor, useEffect, useState } from 'react'



import avatarDefault from ""
import { useSelector, UseSelector } from 'react-redux'
import Link from 'next/link'
import Image from 'next/image'
import { useTheme } from 'next-themes'
import { Box, IconButton, Typography } from '@mui/material'
import { Menu, MenuItem, ProSidebar, } from 'react-pro-sidebar'
import {
ArrowBackIos, ArrowForwardIos,
BarChartOutlined, ExitToApp,
Groups, HomeOutlined,
ManageHistory, MapOutlined,
PeopleOutlined, Quiz,
ReceiptOutlined, Settings,
VideoCall, Web, Wysiwyg
} from '@mui/icons-material'
// first file in sidebar folder in admin folder used in admin folder, page.tsx


type itemProps = {
    title: string
    to: string
    icon: JSX.Element
    selected: string
    setSelected: any
}

// npm i react-pro-sidebar@^0.7.1

const Item: React.FC<itemProps> = ({ title, to, icon, selected, setSelected }) => {
    return (
        // menuitem, menu and prosidebar from "react-pro-sidebar"

        // box, iconbutton, typography from "@mui/material"


        <MenuItem
            active={selected === title}
            onClick={() => setSelected(title)}
            icon={icon}
        >
            <Typography className='text-[16px] font-Poppins'>{title}</Typography>
            <Link href={to} />
        </MenuItem>
    )
}


const SideBar = () => {
    const { user } = useSelector((state: any) => state.auth)

    const [logout, setLogout] = useState(false)

    const [isCollapsed, setIsCollapsed] = useState(false)

    const [selected, setSelected] = useState("Dashboard")

    const [mounted, setMounted] = useState(false)

    const { theme, setTheme } = useTheme()


    useEffect(() => setMounted(true), [])

    if (!mounted) {
        return null
    }

    const logoutHandler = () => {
        setLogout(true)
    }

    return (
        <Box
            sx={{
                "& .pro-sidebar-inner": {
                    background: `${theme === "dark" ? "#111C43 important" : "#fff important"

                        }`,
                },
                "& .pro-icon-wrapper": {
                    backgroundColor: "transparent !important",
                },
                "& .pro-inner-item:hover": {
                    color: "#B68dfb !important",
                },
                "& .pro-menu-item.active": {
                    color: "#6870fa !important",
                },
                "& .pro-inner-item": {
                    padding: "5px 35px 5px 20px !important",
                    opacity: 1,
                },
                "& .pro-menu-item": {
                    color: `${theme !== "dark" && "#000"}`,
                },

            }}
            className="bg-white dark:bg-[#111C43]"
        >



            <ProSidebar
                collapsed={isCollapsed}
                style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    height: "100vh",
                    width: isCollapsed ? "0px" : "10%"
                }}
            >


                <Menu iconShape="square">
                    {/* logo and menu item */}

                    <MenuItem
                        onClick={() => setIsCollapsed(!isCollapsed)}

                        icon={isCollapsed ? <ArrowForwardIos /> : undefined}

                        style={{
                            margin: "10px 0 20px 0"
                        }}
                    >

                        {
                            !isCollapsed && (
                                <Box
                                    display="flex"
                                    justifyContent="space-between"
                                    alignItems="center"
                                    ml="15px"
                                >
                                    <Link href="/">
                                        <h3
                                            className='text-[25px] font-Poppins uppercase dark:text-white text-black '>
                                            KLearning
                                        </h3>
                                    </Link>
                                    <IconButton onClick={() => setIsCollapsed(!isCollapsed)} className='inline-block'>
                                        <ArrowBackIos className="text-black dark:text-[#ffffffc1]" />
                                    </IconButton>
                                </Box>
                            )}
                    </MenuItem>

                    {
                        !isCollapsed && (
                            <Box mb="25px">
                                <Box display="flex"
                                    justifyContent="center"
                                    alignItems="center"
                                >
                                    <Image
                                        alt="user-profile"
                                        width={100}
                                        height={100}
                                        src={
                                            user.avatar ? user.avatar.url : avatarDefault
                                        }
                                        style={{
                                            cursor: "pointer",
                                            borderRadius: "50%",
                                            border: "3px solid #5b6fe6"
                                        }}
                                    />
                                </Box>

                                <Box textAlign="center">
                                    <Typography
                                        variant='h4'
                                        className='text-[20px] text-black dark:text-[#ffffffc1]'
                                        sx={{ m: "10px 0 0 0 " }}
                                    >
                                        {user?.name}
                                    </Typography>

                                    <Typography
                                        variant='h6'
                                        className='text-[20px] text-black dark:text-[#ffffffc1]'
                                        sx={{ m: "10px 0 0 0 " }}
                                    >
                                        {user?.role}
                                    </Typography>
                                </Box>
                            </Box>
                        )}

                    <Box paddingLeft={isCollapsed ? undefined : "10%"}>
                        <Item
                            title='Dashboard'
                            to='/admin'
                            icon={<HomeOutlined />}
                            selected={selected}
                            setSelected={setSelected}
                        />

                        <Typography
                            variant="h5"
                            sx={{ m: "15px 0 5px 25px" }}
                            className='text-[18px] text-black dark:text-[#fffffc1] capitalize font-[400]'
                        >
                            {!isCollapsed && "Data"}
                        </Typography>
                        {/* dashboard ends here */}

                        <Item
                            title='Users'
                            to='/admin/users'
                            icon={<Groups />}
                            selected={selected}
                            setSelected={setSelected}
                        />

                        <Item
                            title='Invoices'
                            to='/admin/invoices'
                            icon={<ReceiptOutlined />}
                            selected={selected}
                            setSelected={setSelected}
                        />




                        <Typography
                            variant="h5"
                            sx={{ m: "15px 0 5px 25px" }}
                            className='text-[18px] text-black dark:text-[#fffffc1] capitalize font-[400]'
                        >
                            {!isCollapsed && "Content"}
                        </Typography>
                        {/* content ends here */}


                        <Item
                            title='Create Course'
                            to='/admin/create-course'
                            icon={<VideoCall />}
                            selected={selected}
                            setSelected={setSelected}
                        />

                        <Item
                            title='Live Course'
                            to='/admin/courses'
                            icon={<ReceiptOutlined />}
                            selected={selected}
                            setSelected={setSelected}
                        />

                        <Typography
                            variant="h5"
                            sx={{ m: "15px 0 5px 25px" }}
                            className='text-[18px] text-black dark:text-[#fffffc1] capitalize font-[400]'
                        >
                            {!isCollapsed && "Customization"}
                        </Typography>
                        {/* customization ends here */}


                        <Item
                            title='Hero'
                            to='/admin/hero'
                            icon={<Web />}
                            selected={selected}
                            setSelected={setSelected}
                        />

                        <Item
                            title='FAQ'
                            to='/faq'
                            icon={<Quiz />}
                            selected={selected}
                            setSelected={setSelected}
                        />

                        <Item
                            title='CATEGORIES'
                            to='/admin/categories'
                            icon={<Wysiwyg />}
                            selected={selected}
                            setSelected={setSelected}
                        />

                        <Typography
                            variant="h5"
                            sx={{ m: "15px 0 5px 25px" }}
                            className='text-[18px] text-black dark:text-[#fffffc1] capitalize font-[400]'
                        >
                            {!isCollapsed && "Controllers"}
                        </Typography>
                        {/* controllers end here */}



                        <Item
                            title='Manage Team'
                            to='/admin/team'
                            icon={<PeopleOutlined />}
                            selected={selected}
                            setSelected={setSelected}
                        />


                        <Typography
                            variant="h5"
                            sx={{ m: "15px 0 5px 25px" }}
                            className='text-[18px] text-black dark:text-[#fffffc1] capitalize font-[400]'
                        >
                            {!isCollapsed && "Analytics"}
                        </Typography>
                        {/* analytics end here */}



                        <Item
                            title='Courses Analytics'
                            to='/admin/course-analytics'
                            icon={<BarChartOutlined />}
                            selected={selected}
                            setSelected={setSelected}
                        />

                        <Item
                            title='Orders Analytics'
                            to='/admin/orders-analytics'
                            icon={<MapOutlined />}
                            selected={selected}
                            setSelected={setSelected}
                        />

                        <Item
                            title='Users Analytics'
                            to='/admin/users-analytics'
                            icon={<ManageHistory />}
                            selected={selected}
                            setSelected={setSelected}
                        />


                        <Typography
                            variant="h5"
                            sx={{ m: "15px 0 5px 25px" }}
                            className='text-[18px] text-black dark:text-[#fffffc1] capitalize font-[400]'
                        >
                            {!isCollapsed && "Extras"}
                        </Typography>
                        {/* extra end here */}

                        <Item
                            title='Settings'
                            to='/admin/settings'
                            icon={<Settings />}
                            selected={selected}
                            setSelected={setSelected}
                        />

                        <div
                            onClick={logoutHandler}
                        >
                            <Item
                                title='Logout'
                                to='/'
                                icon={<ExitToApp />}
                                selected={selected}
                                setSelected={setSelected}
                            />
                        </div>
                    </Box>
                </Menu>
            </ProSidebar>
        </Box>
    )


}


export default SideBar