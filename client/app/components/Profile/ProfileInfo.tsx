import Image from 'next/image'
import React, { useEffect, useState } from 'react'

import avatarIcon from ""
import { AiOutlineCamera } from 'react-icons/ai'
import { useEditProfileMutation, useUpdateAvatarMutation } from '@/redux/features/user/userApi'
import { useLoadUserQuery } from '@/redux/features/api/apiSlice'
import toast from 'react-hot-toast'

type Props = {
    avatar: string | null
    user: any
}


// we need to make this dynamic that when the user
// uploads the picture and update the name,
// it actually does that and we do that by creating 
// a userAPi in redux folder

const ProfileInfo: React.FC<Props> = ({ avatar, user }) => {


    const [name, setName] = useState(user && user.name)

    const [updateAvatar, { isSuccess, error }] = useUpdateAvatarMutation()

    const [loadUser, setLoadUser] = useState(false)

    const { } = useLoadUserQuery(undefined, {
        skip: loadUser ? false : true
    })


    const [editProfile, { isSuccess: profileMutationSuccess, error: profileMutationError }] = useEditProfileMutation();

    const imageHandler = async (e: any) => {


        const fileReader = new FileReader();

        fileReader.onload = () => {
            if (fileReader.readyState === 2) {

                const avatar = fileReader.result;
                updateAvatar({
                    avatar
                })
            }
        }

        fileReader.readAsDataURL(e.target.files[0])

        console.log(
            "Image handler here"
        );

    }


    useEffect(() => {
        if (isSuccess || profileMutationSuccess) {
            setLoadUser(true)
        }

        if (error || profileMutationError) {
            console.log("error in use effect in profile-info");

        }

        if(profileMutationSuccess){
            toast.success("Profile updated successfully")
        }
    }, [isSuccess, error, profileMutationSuccess, profileMutationError])

    const handleSubmit = async (e: any) => {
        // we are handling user submitting new info
        // but first we go to redux => userApi and 
        // make our edit name mutation
        console.log("profile info submit handler");

        e.preventDefault();
        if (name !== "") {
            await editProfile({
                name: name,
            })
        }

    }

    return (
        <>
            <div className='w-full flex justify-center'>
                <div className='relative'>
                    <Image
                        src={user.avatar || avatar ? user.avatar.url || avatar : avatarIcon}
                        alt=''
                        width={120}
                        height={120}
                        className='w-[120px] h-[120px] cursor-pointer border-[3px] border-[#37a39a] rounded-full'
                    />

                    <input
                        type='file'
                        name=''
                        id='avatar'
                        className='hidden'
                        onChange={imageHandler}
                        accept='image/png, image/jpg, image/jpeg, image/webp'
                    />

                    <label htmlFor="avatar">
                        <div className='w-[30px] h-[30px] bg-slate-900 rounded-full absolute bottom-2 right-2 flex items-center justify-center cursor-pointer'>
                            <AiOutlineCamera size={20} className='z-1' />

                        </div>
                    </label>
                </div>
            </div>
            <br /><br />
            <div className='w-full pl-6 800px:pl-10'>
                <form onSubmit={handleSubmit}>
                    <div className='800px:w-[50%] m-auto block pb-4'>
                        <div className='w-[100%]'>
                            <label className="block pb-2">Full Name</label>

                            <input
                                type='text'
                                className={`${styles.input} !w-[95%] mb-4 800px:mb-0 `}
                                required
                                value={name}
                                onChange={(e) => e.target.value}
                            />
                        </div>

                        <div className='w-[100%] pt-2'>
                            <label className="block pb-2">Email Address</label>

                            <input
                                type='text'
                                readOnly
                                className={`${styles.input} !w-[95%] mb-1 800px:mb-0`}
                                required
                                value={user?.email}
                            />

                        </div>
                        <input
                            required
                            value="update"
                            type='submit'
                            className={`w-full 800px:w-[250px] h-[40px] border border-[#371391] text-center dark:text-[#fff] text-black rounded-[3px] mt-8 cursor-pointer`}
                        />


                    </div>

                </form>
                <br />
            </div>
        </>
    )
}

export default ProfileInfo
