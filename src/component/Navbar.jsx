import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import authService from '../appwrite/auth';
import Button from './Button';
import { MdSearch } from "react-icons/md";
import { AiOutlineMenu } from "react-icons/ai";
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { toggleLoading, toggleUserLoggedIn } from '../features/authSlice';
import { useTransition, animated } from 'react-spring';
// https://dribbble.com/tags/mobile-nav

export default function Navbar() {
  const userName = useSelector(state => state.userName);
  const userLoggedIn = useSelector(state => state.userLoggedIn);
  const [creatingBlog, setCreatingBlog] = useState(false);
  const [showNavbar, setShowNavbar] = useState(false);
  const [searching, setSearching] = useState(true);
  const [searchPost, setSearchPost] = useState("");
  const dispatch = useDispatch();
  // console.log("env: ", import.meta.env.VITE_APPWRITE_URL);
  const navigate = useNavigate();
  const plusTransition = useTransition(userLoggedIn && !creatingBlog, {
    from: { bottom: "-20px" },
    enter: { bottom: "24px" },
    leave: { bottom: "-200px" },
  })
  const searchTransition = useTransition(searching, {
    from: { x: "400px" },
    enter: { x: "0px" },
    leave: { x: "400px" },
  })
  const navbarTransition = useTransition(showNavbar, {
    from: { x: "-400px" },
    enter: { x: "0px" },
    leave: { x: "-400px" },
  })
  const pcNavbarTransition = useTransition(userLoggedIn, {
    from: {top: "-100px"},
    enter: {top: "0"},
    leave: {top: "-100px"},
  })

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
  const handleSearch = () => {
    const serializedState = JSON.stringify({
      searchQuery: searchPost,
      tag: null,
    })
    setSearchPost("");
    navigate("/", { state: serializedState });
  }
  useEffect(() => {
    if (window.location.href.includes("newblog")) {
      setCreatingBlog(true);
    }
    else
      setCreatingBlog(false);
  }, [window.location.href])
  useEffect(() => {
    searchPost.length > 0 ? setSearching(true) : setSearching(false);
  }, [searchPost])
  // if (!userLoggedIn)
  //   return null;
  return (
    <>
    {pcNavbarTransition((style, show) =>
    show ?
      <animated.div style={style} className=' h-[60px] bg-slate-200 items-center fixed md:flex hidden top-0 w-full shadow-[0_0_10px_0_gray] z-50 gap-x-8 navbar'>
        <div className='flex items-center justify-center'>
          <span className=' mt-1 inline-block ml-1 font-bold text-[20px] cursor-pointer md:hidden'> <AiOutlineMenu /> </span>
          <span className=' mt-1 inline-block ml-1 font-bold text-[20px]'>{userName}</span>
        </div>
        <span className=' ml-auto mr8 cursor-pointer transition-[0.2s] navLink'><NavLink to='' className={({ isActive }) => isActive ? ` text-violet-600` : " transition-[0.2s]"}>Home</NavLink></span>
        <span className=' mr8 cursor-pointer transition-[0.2s] navLink'><NavLink to="/myposts" className={({ isActive }) => isActive ? ` text-violet-600` : " transition-[0.2s]"}>My Posts</NavLink></span>
        <span className=' mr8 cursor-pointer transition-[0.2s] navLink'><NavLink to={!window.location.href.includes("favorites") ? "/favorites" : null} className={({ isActive }) => isActive ? ` text-violet-600` : " transition-[0.2s]"}>Favorites</NavLink></span>
        <div className='flex'>
          <input value={searchPost} onChange={event => setSearchPost(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter")
                handleSearch();
            }}
            placeholder='Search blogs' type="text" className={`h-[30px] pl-1 pr-1 z-[5] outline-none focus:border-b-violet-600 border-2 transition-[0.2s]`} />
          {/* {searchTransition((style, srch) =>
       srch ?
       <animated.div style={style} className='mr8'>
       <button onClick={searchPost && handleSearch} className='absolute h-[27px] w-[20px] z-[6] bg-violet-600 flex items-center justify-center text-white hover:scale-110 active:scale-90 transition-[0.2s]'><MdSearch/></button>
       </animated.div>
       :null
      )} */}
        </div>
        <button onClick={handleLogout} className=' mr-4 bg-violet-600 w-[80px] h-[30px] rounded-lg text-white hover:scale-105 active:scale-90 transition-[0.2s]'>Logout</button>
        {/* <Button children="Logout" width='80px' className='mr-4 hover:scale-105'/> */}
        {/* <div className='fixed right-4 mt-auto bottom-6'> */}
        {/* <button onClick={handleNewBlog} className={` w-[40px] h-[40px] text-[26px] bg-violet-600 rounded-full outline-none text-white ${creatingBlog ? " hidden" : " block"} hover:scale-110 active:scale-90 transition-[0.2s]`}>+</button> */}
        {/* <Button children="+" className='' rounded='rounded-full'/> */}
        {/* </div> */}
      </animated.div>
      :null
    )}
      {plusTransition((style, item) =>
        item ?
          <animated.div style={style} className='fixed right-4 mt-auto bottom-6'>
            <button onClick={handleNewBlog} className={` w-[40px] h-[40px] text-[26px] bg-violet-600 rounded-full outline-none text-white hover:scale-110 active:scale-90 transition-[0.2s]`}>+</button>
            {/* <Button children="+" className='' rounded='rounded-full'/> */}
          </animated.div>
          :
          null)}
      {pcNavbarTransition((style, show) =>
      show ?
      <animated.div style={style} className=' h-[60px] bg-slate-200 flex md:hidden items-center fixed top-0 w-full shadow-[0_0_10px_0_gray] z-50 gap-x-8 navbar'>``
        <div className='flex items-center justify-center'>
          <span className=' mt-1 inline-block ml-1 font-bold text-[20px] cursor-pointer' onClick={() => setShowNavbar(n => !n)}> <AiOutlineMenu /> </span>
          <span className=' mt-1 inline-block ml-1 font-bold text-[20px]'>{userName}</span>
          {navbarTransition((style, show) =>
            show ?
              <animated.div style={style} className='fixed shadow-[0_0_10px_0_gray] flex flex-col gap-y-2 top-0 mt32 w-[50%] left-0 bg-slate-200 h-screen'>
                <div className='flex items-center h-[60px] border-2 border-b-gray-300'>
                  <span className=' mt-1 inline-block ml-1 font-bold text-[20px] cursor-pointer' onClick={() => setShowNavbar(n => !n)}> <AiOutlineMenu /> </span>
                  <span className=' mt-1 inline-block ml-1 font-bold text-[20px]'>{userName}</span>
                </div>
                <span className=' mr8 pl-4 cursor-pointer border-2 border-b-gray-300 hover:text-violet-600 transition-[0.2s]'><NavLink onClick={() => setShowNavbar(n => !n)} to='' className={({ isActive }) => isActive ? ` text-violet-600` : " transition-[0.2s]"}>Home</NavLink></span>
                <span className=' mr8 pl-4 cursor-pointer border-2 border-b-gray-300 hover:text-violet-600 transition-[0.2s]'><NavLink onClick={() => setShowNavbar(n => !n)} to="/myposts" className={({ isActive }) => isActive ? ` text-violet-600` : " transition-[0.2s]"}>My Posts</NavLink></span>
                <span className=' mr8 pl-4 cursor-pointer border-2 border-b-gray-300 hover:text-violet-600 transition-[0.2s]'><NavLink onClick={() => setShowNavbar(n => !n)} to={!window.location.href.includes("favorites") ? "/favorites" : null} className={({ isActive }) => isActive ? ` text-violet-600` : " transition-[0.2s]"}>Favorites</NavLink></span>
                <div className='mt-auto mb-[30%] justify-center items-center flex'>
                  <button onClick={() => {
                    setShowNavbar(n => !n);
                    handleLogout();
                  }
                  }
                    className=' mr4 bg-violet-600 w-[50%] h-[30px] rounded-lg text-white hover:scale-105 active:scale-90 transition-[0.2s]'>Logout</button>
                </div>
              </animated.div>
              : null
          )}
        </div>
        {searchTransition((style, srch) =>
          srch
            ?
            <animated.div style={style} className='flex ml-auto mr-4'>
              <input value={searchPost} onChange={event => setSearchPost(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Escape")
                    setSearching(false);
                  if (event.key === "Enter") {
                    setSearching(false);
                    handleSearch();
                  }
                }}
                placeholder='Search blogs' type="text" className={`h-[30px] pl-1 pr-1 z-[5] outline-none focus:border-b-violet-600 border-2 transition-[0.2s]`} />
            </animated.div>
            :
            <animated.div style={style} className='ml-auto mr-4 text-[20px] cursor-pointer' onClick={() => setSearching(true)}>
              <MdSearch />
            </animated.div>
        )}
      </animated.div>
      : null
      )}
    </>
  )
}
