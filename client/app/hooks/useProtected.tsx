import { redirect } from "next/navigation";
import UserAuth from "./userAuth";

// first file created in hooks folder

interface ProtectedProps {
    children: React.ReactNode
}


export default function Protected({ children }: ProtectedProps) {

    const isAuthenticated = UserAuth()

    return isAuthenticated ? children : redirect("/")

}