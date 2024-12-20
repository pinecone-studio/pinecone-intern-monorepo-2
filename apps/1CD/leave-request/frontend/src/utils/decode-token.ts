"use server"

import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

const WhoAmI = async () => {
    const cookieStore = await cookies()
    const token = cookieStore.get('authtoken')?.value || ''
    const decoded = await jwt.decode(token)
    return decoded
  }

export default WhoAmI