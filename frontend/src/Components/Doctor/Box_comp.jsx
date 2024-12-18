import React from 'react'

const Box_comp = ({text,count,color}) => {
  return (
    <div className={`w-1/2 h-32 ${color ? "bg-[#ff5184]":"bg-[#ff856b]"}  rounded-lg px-10 flex items-center justify-between text-white`}>
        <div className='flex justify-between items-center w-full'>
            <h1 className='text-xl font-semibold'>{text}</h1>
            <h1 className='text-5xl font-bold'>{count}</h1>
        </div>
    </div>
  )
}

export default Box_comp
