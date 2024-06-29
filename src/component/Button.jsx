import React from 'react'

export default function Button({
  children,
  type = "button",
  bgColor = "bg-violet-600",
  textColor = "text-white",
  className = "",
  rounded = "rounded-lg",
  width = "30px",
  height = "30px",
  ...props
}) {
  return (
    <>
    <button
    type={type}
    className={`${bgColor} ${textColor} ${rounded} ${className} w-[${width}] h-[${height}]`} {...props}>
      {children}
    </button>
    </>
    )
}
