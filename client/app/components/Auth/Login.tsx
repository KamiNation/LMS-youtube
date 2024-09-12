"use client"

// Import necessary modules and hooks from React and other libraries
import React, { FC, useEffect, useState } from 'react' // Import React, functional component type (FC), useEffect, and useState hooks from React
import { useFormik } from 'formik' // Import useFormik hook from Formik for form handling
import * as Yup from "yup" // Import Yup for validation schema creation
import { AiOutlineEye, AiOutlineEyeInvisible, AiFillGithub } from 'react-icons/ai' // Import eye icons for password visibility toggle and GitHub icon
import { FcGoogle } from 'react-icons/fc' // Import Google icon for Google login
import { styles } from '@/app/styles/styles' // Import custom styles from a specific path
import { useLoginMutation } from '@/redux/features/auth/authApi' // Import useLoginMutation hook for login mutation from Redux slice
import toast from 'react-hot-toast' // Import toast for showing notifications
import { signIn } from "next-auth/react"

// Comments indicating the purpose and history of the file:
// - This file was first created in the auth folder and used in the Header component for customModal component
// - After implementing verification, useLoginMutation was created and used here
// - After successfully implementing login, load user and refresh token functionalities were added in apiSlice


// Define the type for the Props expected by the Login component
type Props = {
    setRoute: (route: string) => void // Function to change the current route, accepts a string argument
    setOpen: (open: boolean) => void // Function to control the open state of the modal, accepts a boolean argument
}

// Define a Yup validation schema for Formik to validate the form inputs
const schema = Yup.object().shape({
    email: Yup.string().email("Invalid Email").required("Please enter your email"), // Validate email to be a valid email format and required
    password: Yup.string().required("Please enter your password").min(6), // Validate password to be required and minimum length of 6 characters
})

// Define the Login component as a Functional Component with Props
const Login: FC<Props> = ({ setRoute, setOpen }) => {

    // State to toggle password visibility
    const [show, setShow] = useState(false); // useState hook to manage the visibility of the password (initially hidden)

    // Destructuring login function and its state from useLoginMutation hook
    const [login, { isSuccess, error, data }] = useLoginMutation() // useLoginMutation hook returns a tuple with the login function and an object containing its state

    // Use Formik hook to handle form state and submission
    const formik = useFormik({
        initialValues: { email: "", password: "" }, // Initial values for form inputs, both email and password are empty strings
        validationSchema: schema, // Attach the Yup validation schema defined above
        onSubmit: async ({ email, password }) => { // Function to handle form submission
            await login({ email, password }) // Call the login function with email and password from form inputs
        }
    });

    // useEffect hook to handle side effects based on the success or error of the login mutation
    useEffect(() => {
        if (isSuccess) { // If login is successful
            toast.success("Login Successfully") // Show a success toast notification
            setOpen(false) // Close the modal by setting open state to false
        }

        if (error) { // If there is an error during login
            if ("data" in error) { // Check if the error object has a 'data' property
                const errorData = error as any // Cast the error to any type to access its properties
                toast.error(errorData.data?.message) // Show an error toast with the message from the error object
            }
        }
    }, [isSuccess, error]) // Dependency array to trigger the effect when isSuccess or error changes

    // Destructure necessary properties from formik object for easier access
    const { errors, touched, values, handleChange, handleSubmit } = formik;

    // Return JSX for the Login component
    return (
        <div className='w-full'> {/* Wrapper div with full width */}
            <h1 className={`${styles.title}`}> {/* Header for the form with custom styles */}
                Login with learning
            </h1>

            <form onSubmit={handleSubmit}> {/* Form element with onSubmit handler from Formik */}
                <label
                    htmlFor='email'
                    className={`${styles.label}`}> {/* Label for email input with custom styles */}
                    Enter your Email
                </label>
                <input
                    type='email' // Input type is email
                    name='email' // Name attribute to link it to Formik state
                    value={values.email} // Value linked to Formik's state
                    onChange={handleChange} // Change handler from Formik to update the state
                    id='email' // ID to associate with the label
                    placeholder='loginmail@gmail.com' // Placeholder text
                    className={`${errors.email && touched.email && "border-red-500"} ${styles.input}`} // Conditional class to show red border if there is an error and the input is touched, plus additional custom styles
                />
                {/* Display email error message if validation fails */}
                {
                    errors.email && touched.email && ( // Check if there is an error and the input is touched
                        <span className='text-red-500 pt-2 block'> {/* Error message with red text and some padding */}
                            {errors.email} {/* Display the email error message */}
                        </span>
                    )
                }
                <div className='w-full mt-5 relative mb-5'> {/* Wrapper div for password input with margins and relative positioning for icon placement */}
                    <label
                        className={`${styles.label}`} htmlFor="password"> {/* Label for password input */}
                        Enter your password
                    </label>
                    <input
                        type={!show ? "password" : "text"} // Toggle input type between password and text based on show state
                        name='password' // Name attribute for Formik state management
                        value={values.password} // Value linked to Formik's state
                        onChange={handleChange} // Change handler from Formik to update the state
                        id='password' // ID to associate with the label
                        placeholder='password!@9' // Placeholder text
                        className={`${errors.password && touched.password && "border-red-500"} ${styles.input}`} // Conditional class to show red border if there is an error and the input is touched, plus additional custom styles
                    />

                    {/* Password visibility toggle icons */}
                    {
                        !show ? ( // If show is false, show the eye invisible icon
                            <AiOutlineEyeInvisible
                                className='absolute bottom-3 right-2 z-1 cursor-pointer' // Position the icon inside the input and make it clickable
                                size={20} // Set the icon size
                                onClick={() => setShow(true)} /> // Toggle the show state to true on click
                        ) : ( // If show is true, show the eye icon
                            <AiOutlineEye
                                className='absolute bottom-3 right-2 z-1 cursor-pointer' // Position the icon inside the input and make it clickable
                                size={20} // Set the icon size
                                onClick={() => setShow(false)} /> // Toggle the show state to false on click
                        )
                    }
                    {/* Display password error message if validation fails */}
                    {
                        errors.password && touched.password && ( // Check if there is an error and the input is touched
                            <span className='text-red-500 pt-2 block'> {/* Error message with red text and some padding */}
                                {errors.password} {/* Display the password error message */}
                            </span>
                        )
                    }
                </div>

                {/* Submit button */}
                <div
                    className='w-full mt-5' // Full width and margin top for spacing
                >
                    <input
                        type='submit' // Input type is submit
                        value="Login" // Button text
                        className={`${styles.button}`} // Custom styles for the button
                    />
                </div>

                <br /> {/* Line break for spacing */}
                <h5 className='text-center pt-4 font-Poppins text-[14px] text-black dark:text-white'>Or join with</h5> {/* Text prompting alternative login methods */}
                <div className='flex items-center justify-center my-3'> {/* Flex container for login icons */}
                    {/* Then wrap the SessionProvider from next-auth/react in the main  layout component*/}
                    <FcGoogle size={30} className='cursor-pointer ml-2'
                        onProgress={() => signIn("google")}
                    /> {/* Google login icon, clickable */}
                    <AiFillGithub size={30} className='cursor-pointer ml-2'
                        onProgress={() => signIn("github")}
                    /> {/* GitHub login icon, clickable */}
                </div>
                <h5
                    className='text-center pt-4 font-Poppins text-[14px] text-black'> {/* Text for sign-up prompt */}
                    Do not have an account{" "} {/* Text content */}
                    <span className='text-[#2290ff] pl-1 cursor-pointer'
                        onClick={() => setRoute("Sign-Up")}> {/* Span element for Sign Up link, changes route on click */}
                        Sign up
                    </span>
                </h5>
            </form>
            <br /> {/* Line break for spacing */}
        </div>
    )
}

export default Login // Export the Login component as the default export
