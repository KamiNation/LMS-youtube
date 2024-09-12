"use client"

import React, { useState } from 'react'
import Protected from '../hooks/useProtected'
import Heading from '../utils/Heading'
import Header from '../components/Header'
import Profile from '../components/Profile/Profile'
import { useSelector } from 'react-redux'

type Props = {}

// first file in profile folder
// we need to check that the user is logged in before
// they can access this page so we created a custom hook


// this page allows on loggedIn users

const Page: React.FC<Props> = (props) => {


    const [open, setOpen] = useState(false);

    const [activeItem, setActiveItem] = useState(5)

    // after hero component, created a state for route
    const [route, setRoute] = useState("Login");


    const {user} = useSelector((state: any) => state.auth)


    return (
        <div>
            <Protected>
                <Heading
                    title={`${user?.name} profile`}
                    description="A multi platform"
                    keywords="MERN, Redux"
                />

                <Header
                    open={open}
                    activeItem={activeItem}
                    setOpen={setOpen}
                    setRoute={setRoute}
                    route={route}
                />
                <Profile user={user}/>
            </Protected>
        </div>
    )
}

export default Page