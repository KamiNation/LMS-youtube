import { useSelector, } from "react-redux";

// second file created here 

export default function UserAuth() {
    const { user } = useSelector((state: any) => state.Auth)

    if (user) {
        return true
    } else {
        return false
    }
}