import { cookies } from "next/headers";

export const GET = (req: Request) => {
    const url = new URL(req.url);
    const token = url.searchParams.get('token');
    const cookieStore = cookies();
    if(token){
        cookieStore.set('authtoken', token, { httpOnly: true, path: '/', maxAge: 60 * 60 * 24 * 7 }); 
    }
    
    return Response.json({msg: 'hello'}) 
}

export const DELETE = () => {
    const cookieStore = cookies()
    cookieStore.delete("authtoken")
    return Response.json({msg: "deleted"})
} 