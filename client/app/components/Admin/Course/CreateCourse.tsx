"use client"

import React, { useState } from 'react'
import CourseInformation from './CourseInformation'

// first file in course folder



type Props = {}

const CreateCourse = (props: Props) => {

    // we need active  ans course state

    const [active, setActive] = useState(0)

    const [courseInfo, setCourseInfo] = useState({
        name: "",
        description: "",
        price: "",
        estimatedPrice: "",
        tags: "",
        level: "",
        demoUrl: "",
        thumbnail: ""
    })

    const [benefits, setBenefits] = useState([{ title: "" }])

    const [prerequisites, serPrerequisites] = useState([{ title: "" }])

    const [courseContentData, setCourseContentData] = useState([
        {
            videoUrl: "",
            title: "",
            description: "",
            videoSection: "Untitled Section",
            links: [{
                title: "",
                url: "",
            }],
            suggestion: "",
        },
    ])


    const [courseData, setCourseData] = useState({})

    return (
        <div className='w-full flex min-h-screen'>
            <div className='w-[80%]'>
                {
                    active === 0 && (
                        <CourseInformation />
                    )
                }
            </div>
            <div className='w-[20%] mt-[100px] h-screen fixed z-[-1] top-18 right-0'>
                
            </div>
        </div>
    )
}

export default CreateCourse