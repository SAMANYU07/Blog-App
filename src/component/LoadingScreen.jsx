import React from 'react'

export default function LoadingScreen() {
  return (
    <>
    <div className=' h-screen w-full flex items-center justify-center'>
      <div className='h-[200px] w-[200px] border-4 rounded-full border-violet-200 border-t-violet-600 animate-spin'></div>
    </div>
    </>
  )
}
