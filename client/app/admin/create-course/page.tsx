import React from 'react'
import AdminSidebar from "../../components/Admin/SideBar/AdminSideBar"
import Heading from '@/app/utils/Heading'
import DashBoardHeader from '@/app/components/Admin/DashBoardHeader'
import CreateCourse from '@/app/components/Admin/Course/CreateCourse'


// 1st file in create-course folder in admin folder
// 4:38:04

type Props = {}

const page = (props: Props) => {
    return (
        <div>

            <Heading
                title="KLearning"
                description="A multi platform"
                keywords="MERN, Redux"
            />

            <div className='flex h-[200vh]'>
                <div className='1500px:w-[16%] w-1/5'>
                    <AdminSidebar />
                </div>

                <div className='w-[85%'>
                    <DashBoardHeader />
                    <CreateCourse />
                </div>
            </div>




        </div>
    )
}

export default page