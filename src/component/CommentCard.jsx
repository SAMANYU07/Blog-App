import React, { useEffect, useState } from 'react'

export default function CommentCard({comment}) {
  const [c, setC] = useState(JSON.parse(comment));
  // useEffect(() => {
    // console.log(JSON.parse(comment));
  // }, [])
  return (
    <>
    <div className='flex flex-col mt-4 md:mt-6'>
      <div className='flex'>
      <span className='font-bold text-[22px]'>{c.uname}</span>
      <span className=' text-slate-500 text-[14px] inline-block mt-2 ml-4'>{c.date}</span>

      </div>
      <span className='mt-2'>{c.comment}</span>
    </div>
    </>
  )
}
