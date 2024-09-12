import { styles } from '@/app/styles/styles' // Importing custom styles
import { useActivationMutation } from '@/redux/features/auth/authApi' // Importing the activation mutation hook
import React, { useEffect, useRef, useState } from 'react' // Core React functionality and hooks
import toast from 'react-hot-toast' // Importing toast for showing notifications
import { VscWorkspaceTrusted } from 'react-icons/vsc' // Importing an icon for visual feedback
import { useSelector } from 'react-redux' // Importing useSelector to access Redux state

// Third file created in auth folder and used in Header for customModal component
// This component handles the activation code sent to the user's email
// after using useRegisterMutation in sign-up component. The next screen the user sees is this component

// After successful testing with backend. Login and Social auth implementation
// went to authAPi to create useLoginMutation


type Props = {
    setRoute: (route: string) => void // Function to change routes
}

type verifyfNumber = {
    "0": string
    "1": string
    "2": string
    "3": string
}

// Verification component handles the OTP verification process
const Verification: React.FC<Props> = ({ setRoute }) => {

    // Extracting the token from the Redux state
    const { token } = useSelector((state: any) => state.auth)

    // Using the useActivationMutation hook to handle activation API calls
    // activation: function to call the API
    // isSuccess: boolean, true if the API call was successful
    // error: object, contains error details if the API call failed
    const [activation, { isSuccess, error }] = useActivationMutation();

    // Effect to handle activation success or errors
    useEffect(() => {
        if (isSuccess) {
            toast.success("Account activated successfully"); // Show success message
            setRoute("Login") // Redirect to the Login route
        }

        if (error) {
            if ("data" in error) { // Check if error has data (API error)
                const errorData = error as any
                toast.error(errorData.data.message); // Show error message from API
                setInvalidError(true) // Set invalid input error state
            } else {
                console.log("An error occurred:", error); // Log any unexpected errors
            }
        }
    }, [isSuccess, error]) // Runs the effect when isSuccess or error changes

    // State to track if there's an invalid input error
    const [invalidError, setInvalidError] = useState<boolean>(false)

    // Refs for input fields to handle focus and navigation between them
    const inputRefs = [
        useRef<HTMLInputElement>(null), // Ref for the first input field
        useRef<HTMLInputElement>(null), // Ref for the second input field
        useRef<HTMLInputElement>(null), // Ref for the third input field
        useRef<HTMLInputElement>(null), // Ref for the fourth input field
    ]

    // State to store the verification code entered by the user
    const [verifyNumber, setVerifyNumber] = useState<verifyfNumber>({
        0: "", // First digit of the OTP
        1: "", // Second digit of the OTP
        2: "", // Third digit of the OTP
        3: ""  // Fourth digit of the OTP
    })

    // Function to handle the OTP verification process
    const verificationHandler = async () => {
        const verificationNumber = Object.values(verifyNumber).join(""); // Combine all input values into one string
        if (verificationNumber.length !== 4) { // Check if the OTP is 4 digits
            setInvalidError(true) // Set error if OTP is not complete
            return
        }
        // Call the activation mutation with the token and verification code
        await activation({
            activation_token: token, // Token from the Redux state
            activation_code: verificationNumber, // The combined OTP code
        })
    }

    // Handle changes in input fields and auto-focus to next or previous field
    const handleInputChange = (index: number, value: string) => {
        setInvalidError(false); // Reset invalid error state on input change

        // Update the verification number state
        const newVerifyNumber = { ...verifyNumber, [index]: value };
        setVerifyNumber(newVerifyNumber)

        // Navigate focus to the next or previous input based on value length
        if (value === "" && index > 0) {
            inputRefs[index - 1].current?.focus(); // Focus on the previous input if value is cleared
        } else if (value.length === 1 && index < 3) {
            inputRefs[index + 1].current?.focus(); // Focus on the next input if a value is entered
        }
    }

    return (
        <div>
            <h1 className={`${styles.title}`}>
                Verify Your Account
            </h1>
            <br />
            <div className='w-full flex items-center justify-center mt-2'>
                <div className='w-[80px] h-[80px] bg-[#497DF2] flex items-center justify-center'>
                    <VscWorkspaceTrusted size={40} /> {/* Trusted icon for visual indication */}
                </div>
            </div>
            <br /><br />
            <div className='m-auto flex items-center justify-around'>
                {
                    // Rendering input fields for the verification code
                    Object.keys(verifyNumber).map((key, index) => (
                        <input type="text"
                            key={key}
                            ref={inputRefs[index]} // Assigning refs for navigation
                            className={`w-[65px] h-[65px] bg-transparent border-[3px] rounded-[10px] flex items-center text-black dark:text-white justify-center text-[18px] font-Poppins outline-none text-center ${invalidError ? "shake border-red-500" : "dark:border-white border-[#0000004a]"
                                }`}
                            placeholder='' // No placeholder to keep inputs clean
                            maxLength={1} // Limit input to 1 character
                            value={verifyNumber[key as keyof verifyfNumber]} // Bind input value to state
                            onChange={(e) => handleInputChange(index, e.target.value)} // Handle input change
                        />
                    ))
                }
            </div>
            <br /><br />
            <div className='w-full flex justify-center'>
                <button
                    className={`${styles.button}`} // Styled button for OTP verification
                    onClick={verificationHandler} // Call verification handler on click
                >
                    Verify OTP
                </button>
            </div>
            <br />
            <h5 className='text-center pt-4 font-Poppins text-[14px] text-black dark:text-white'>
                Go back to sign in? <span
                    className='text-[#2190ff] pl-1 cursor-pointer'
                    onClick={() => setRoute("Login")} // Route back to login if clicked
                > Sign in</span>
            </h5>
        </div>
    )
}

export default Verification
