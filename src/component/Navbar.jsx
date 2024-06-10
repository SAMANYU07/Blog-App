import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import authService from '../appwrite/auth';
import Button from './Button';
import { Link, useNavigate } from 'react-router-dom';
import { toggleLoading, toggleUserLoggedIn } from '../features/authSlice';

export default function Navbar() {
  const userName = useSelector(state => state.userName);
  const userLoggedIn = useSelector(state => state.userLoggedIn);
  const [creatingBlog, setCreatingBlog] = useState(false);
  const dispatch = useDispatch();
  // console.log("env: ", import.meta.env.VITE_APPWRITE_URL);
  const navigate = useNavigate();
  
  const handleNewBlog = () => {
    navigate("/newblog/");
  }
  const handleLogout = async () => {
    dispatch(toggleLoading(true));
    await authService.logoutAccount();
    dispatch(toggleUserLoggedIn(false));
    dispatch(toggleLoading(false));
    navigate("/");
  }
  useEffect(() => {
    if (window.location.href.includes("newblog")) {
      setCreatingBlog(true);
    }
    else
      setCreatingBlog(false);
  }, [window.location.href])
  if (!userLoggedIn)
    return null
  return (
    <>
    <div className=' h-[60px] bg-slate-200 flex items-center fixed top-0 w-full shadow-[0_0_10px_0_gray] z-50'>
      <span className=' mt-1 inline-block ml-1 font-bold text-[20px]'>{userName}</span>
       <span className=' ml-auto mr-8 cursor-pointer'><Link>Home</Link></span>
      <span className=' mr-8 cursor-pointer'><Link to="/myposts">My Posts</Link></span>
      <button onClick={handleLogout} className=' mr-4 bg-violet-600 w-[80px] h-[30px] rounded-lg text-white hover:scale-105 active:scale-90 transition-[0.2s]'>Logout</button>
      {/* <Button children="Logout" width='80px' className='mr-4 hover:scale-105'/> */}
      <div className='fixed right-4 mt-auto bottom-6'>
        <button onClick={handleNewBlog} className={` w-[40px] h-[40px] text-[26px] bg-violet-600 rounded-full outline-none text-white ${creatingBlog ? " hidden" : " block"} hover:scale-110 active:scale-90 transition-[0.2s]`}>+</button>
        {/* <Button children="+" className='' rounded='rounded-full'/> */}
      </div>
    </div>
    </>
  )
}
