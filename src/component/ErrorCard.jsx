import React, { useState } from 'react'
import { useTransition, animated } from 'react-spring'

export default function ErrorCard({
  errorMessage,
  textColor = "text-white",
}) {
  const [active, setActive] = useState(true);
  const errorCardTransition = useTransition(active, {
    from: {top: "-4vh"},
    enter: {top: "4vh"},
    leave: {top: "-4vh"},
  })
  useState(() => {
    setTimeout(() => {
      setActive(false);
    }, 6000);
  }, [active])
  return (
    <>
    {errorCardTransition((style, item) =>
    item ?
    <animated.div style={style} className= {`${textColor} fixed bg-red-500 -translate-x-[50%] -translate-y-[50%] left-1/2 p-2 rounded-lg shadow-lg`}>
        {errorMessage}
    </animated.div>
    : null
    )}
    </>
  )
}
