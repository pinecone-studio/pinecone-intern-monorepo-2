"use client"

import Image from 'next/image'
// import { useRouter } from 'next/navigation'
import React from 'react'

const page = () => {
    // const router= useRouter()
  return (
    <div className='w-full h-screen bg-gray-200 '> 
     <div className='w-1/4 h-1/2 gap-5'>
      <div className='bg-white rounded-xl h-1/7'><Image src={"/images.Vector.png"} alt='' layout='' fill />  </div>
      <div className='bg-white rounded-xl h-1/8'></div>
    </div>
    </div>
  )
}

export default page
