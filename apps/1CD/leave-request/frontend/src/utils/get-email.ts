import jwt from "jsonwebtoken"
import { cookies } from "next/headers";

export const getEmail  = () => {
    const cookieStore = cookies()
    const token = cookieStore.get('authtoken')?.value || ""
    const {email} = jwt.decode(token)
    console.log(email)
}