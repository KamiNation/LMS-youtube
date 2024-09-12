import React from 'react'
import Heading from '../utils/Heading'
import AdminProtected from '../hooks/adminProtected'
import AdminSideBar from '../components/Admin/SideBar/AdminSideBar'
import DashBoardHero from '../components/Admin/DashBoardHero'

// first file in admin folder


type Props = {}

const page = (props: Props) => {
    return (
        <div>
            <AdminProtected>
                <Heading
                    title="KLearning"
                    description="A multi platform"
                    keywords="MERN, Redux"
                />

                <div className='flex h-[200vh]'>
                    <div className='1500px:w-[16%] w-1/5'>
                        <AdminSideBar />
                    </div>

                    <div className='w-[85%'>
                        <DashBoardHero />
                    </div>
                </div>

            </AdminProtected>
        </div>
    )
}

export default page