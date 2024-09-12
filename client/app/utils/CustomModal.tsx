import React from 'react'
import {Modal, Box} from "@mui/material"
// 5th file created and used in Header component

type Props = {
    open: boolean;
    setOpen: (open: boolean) => void
    activeItem: any
    component: any
    setRoute?: (route: string) => void
}

const CustomModal: React.FC<Props> = ({ component, setRoute, setOpen, activeItem, open }) => {
    return (
        <div>
            <Modal
                open={open}
                onClose={() => setOpen(false)}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box
    className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[450px] bg-white dark:bg-slate-900 rounded-[8px] shadow p-4 outline-none"
                >
                    {/* <Component setOpen={setOpen} setRoute={setRoute} /> */}
                </Box>

            </Modal>

        </div>
    )
}

export default CustomModal