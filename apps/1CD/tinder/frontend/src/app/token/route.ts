import {cookies} from "next/headers";
export const GET=async(req:Request)=>{
    const url= await new URL(req.url);
    const token= await url.searchParams.get('token');
    if(token){
        await cookies().set('authToken', token, { httpOnly: true, path: '/', maxAge: 60 * 60 * 24 * 7 }); 
    }
    return Response.json('set cookie');
}