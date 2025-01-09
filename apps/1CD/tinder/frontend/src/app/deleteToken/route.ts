import { cookies } from "next/headers";

export const GET = async () => {
    const cookieStore = cookies();
    const token = cookieStore.get('authToken');

    if (token) {
        cookieStore.delete('authToken'); 
    }

    return new Response(JSON.stringify({ message: 'Deleted cookie' }));
};
