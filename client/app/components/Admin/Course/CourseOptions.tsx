import React from 'react'
import { IoMdCheckmark } from 'react-icons/io';

// third file created in course



type Props = {
    active: number;
    setActive: (active: number) => void
}

const CourseOptions: React.FC<Props> = ({ active, setActive }) => {


    const options = [
        "Course Information",
        "Course Options",
        "Course Content",
        "Course Preview"
    ]




    return (
        <div>

            {
                options.map((options: any, index: number) => (
                    <div key={index} className={`w-full flex py-5`}>

                        <div
                            className={`w-[35px] h-[35px] rounded-full flex items-center justify-center ${active + 1 > index ? "bg-blue-500" : "bg-[#384766]"
                                } relative `}
                        >

                            <IoMdCheckmark className='text-[25px]' />
                            {
                                index !== options.length && (
                                    <div
                                        className={`
                        absolute h-[30px] w-1 ${active + 1 > index ? "bg-blue-500" : "bg-[#384766]"
                                            } bottom-[-100%]
                        `}
                                    />
                                )
                            }

                        </div>

                    </div>
                ))
            }

        </div>
    )
}

export default CourseOptions