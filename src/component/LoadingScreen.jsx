import React from 'react'

export default function LoadingScreen({
  lwidth = "w-screen",
  lheight = "h-screen",
  awidth = "w-[200px]",
  aheight = "h-[200px]",
}) {
  return (
    <>
    <div className={` ${lheight} ${lwidth} flex items-center justify-center`}>
      <div className={`${aheight} ${awidth} border-4 rounded-full border-violet-200 border-t-violet-600 animate-spin`}></div>
    </div>
    </>
  )
}
