"use client"

import React, { FC, useEffect, useState } from 'react'
import { useFormik } from 'formik'
import * as Yup from "yup"
import { AiOutlineEye, AiOutlineEyeInvisible, AiFillGithub } from 'react-icons/ai'
import { FcGoogle } from 'react-icons/fc'
import { styles } from '@/app/styles/styles'
import { useRegisterMutation } from '@/redux/features/auth/authApi'
import toast from 'react-hot-toast'


// second file created in auth folder and used in Header for customModal component

// export const { useRegisterMutation, useActivationMutation } = authApi, 
// the useRegisterMutation hook from authApi component is used here in Sign up
// component in useFormik hook inside onSubmit method



type Props = {
    setRoute: (route: string) => void
}

// use yup to create validation schema for formik
const schema = Yup.object().shape({
    name: Yup.string().required("Enter your name!"),
    email: Yup.string().email("Invalid Email!").required("Please enter your email"),
    password: Yup.string().required("Please enter your password!").min(6),
})


const SignUp: FC<Props> = ({ setRoute }) => {

    const [show, setShow] = useState(false);

    // used a mutation here from authApi component and then setup
    // the useEffect hook
    const [register, { isSuccess, data, error }] = useRegisterMutation();

    useEffect(() => {
        if (isSuccess) {
            const message = data?.message || "Reg Successful"
            toast.success(message);
            setRoute("Verification")
        }

        if (error) {
            if ("data" in error) {
                const errorData = error as any
                toast.error(errorData.data?.message)
            }
        }
    }, [isSuccess, error])


    // use formik customhook to manage login
    const formik = useFormik({
        initialValues: { name: "", email: "", password: "" },
        validationSchema: schema,
        onSubmit: async ({ name, email, password }) => {
            const data = {
                name, email, password
            };
            await register(data)
        }
    })

    const { errors, touched, values, handleChange, handleSubmit } = formik;

    return (
        <div className='w-full'>
            <h1 className={`${styles.title}`}>
                Join KLearning
            </h1>

            <form onSubmit={handleSubmit}>

                <div className='mb-3'>
                    {/* name input  */}
                    <label
                        htmlFor='name'
                        className={`${styles.label}`}>
                        Enter your Name
                    </label>
                    <input
                        type='email'
                        name=''
                        value={values.name}
                        onChange={handleChange}
                        id='name'
                        placeholder='kami tensai'
                        className={`${errors.name && touched.name && "border-red-500"} ${styles.input}`}
                    />
                    {/* shows name error to user */}
                    {
                        errors.email && touched.email && (
                            <span className='text-red-500 pt-2 block'>
                                {errors.email}
                            </span>
                        )
                    }
                </div>

                {/* email input */}
                <label
                    htmlFor='email'
                    className={`${styles.label}`}>
                    Enter your Email
                </label>
                <input
                    type='email'
                    name=''
                    value={values.email}
                    onChange={handleChange}
                    id='email'
                    placeholder='loginmail@gmail.com'
                    className={`${errors.email && touched.email && "border-red-500"} ${styles.input}`}
                />
                {/* shows email error to user */}
                {
                    errors.email && touched.email && (
                        <span className='text-red-500 pt-2 block'>
                            {errors.email}
                        </span>
                    )
                }

                <div className='w-full mt-5 relative mb-5'>
                    {/* password inout */}
                    <label
                        className={`${styles.label}`} htmlFor="password">Enter your password</label>
                    <input type={!show ? "password" : "text"}
                        name='password'
                        value={values.password}
                        onChange={handleChange}
                        id='password'
                        placeholder='password!@9'
                        className={`${errors.password && touched.password && "border-red-500"} ${styles.input}`}

                    />

                    {
                        !show ? (
                            <AiOutlineEyeInvisible
                                className='absolute bottom-3 right-2 z-1 cursor-pointer'
                                size={20}
                                onClick={() => setShow(true)} />
                        ) : (
                            <AiOutlineEye
                                className='absolute bottom-3 right-2 z-1 cursor-pointer'
                                size={20}
                                onClick={() => setShow(false)} />
                        )
                    }
                </div>
                {
                    errors.password && touched.password && (
                        <span className='text-red-500 pt-2 block'>{errors.password}</span>
                    )
                }

                {/* submit button */}
                <div
                    className='w-full mt-5'
                >
                    <input
                        type='submit'
                        value="SignUp"
                        className={`${styles.button}`}
                    />
                </div>

                <br />
                <h5 className='text-center pt-4 font-Poppins text-[14px] text-black dark:text-white'>Or join with</h5>
                <div className='flex items-center justify-center my-3'>
                    <FcGoogle size={30} className='cursor-pointer ml-2' />
                    <AiFillGithub size={30} className='cursor-pointer ml-2' />
                </div>
                <h5
                    className='text-center pt-4 font-Poppins text-[14px] text-black'
                >
                    Already  have an account{" "}
                    <span className='text-[#2290ff] pl-1 cursor-pointer'
                        onClick={() => setRoute("Login")}
                    >
                        Sign in
                    </span>
                </h5>
            </form>
            <br />
        </div>
    )
}

export default SignUp