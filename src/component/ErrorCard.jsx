import React from 'react'

export default function ErrorCard({errorMessage}) {
  return (
    <>
    <div className=' text-red-500'>
        {errorMessage}
    </div>
    </>
  )
}
