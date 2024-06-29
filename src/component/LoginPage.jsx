import React, { useState } from 'react'
import { useSelector, useDispatch } from "react-redux";
import authService from '../appwrite/auth';
import LoadingScreen from './LoadingScreen';
import { toggleLoading, toggleUserLoggedIn, updateUserDetails } from '../features/authSlice';
import { useTransition, animated } from 'react-spring';

export default function LoginPage() {
  const [haveAccount, setHaveAccount] = useState(false);
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [name, setName] = useState("");
  const loading = useSelector(state => state.loading);
  const dispatch = useDispatch();
  const transition = useTransition(haveAccount, {
    from: { transform: "translate(-50%, -50%) scale(0%)" },
    enter: { transform: "translate(-50%, -50%) scale(100%)" },
    leave: { transform: "translate(-50%, -50%) scale(0%)" },
  });

  const getSession = async () => {
    await authService.activeUserSession()
      .then(data => {
        if (data !== -1) {
          dispatch(updateUserDetails({ id: data.$id, name: data.name }));
        }
      })
  }

  const handleLogin = async () => {
    dispatch(toggleLoading(true));
    await authService.loginAccount({ email, pass })
      .then(data => {
        if (data !== -1) {
          dispatch(toggleUserLoggedIn(true));
          setHaveAccount(true);
          getSession();
          // authService.activeUserSession()
          // .then(data => {
          //   if (data !== -1) {
          //     dispatch(updateUserDetails({id: data.$id, name: data.name}));
          //   }
          // })
        }
      })
    // dispatch(toggleLoading(false));
  }

  const handleRegister = () => {
    authService.accountCreation({ email, pass, name })
      .then(data => {
        if (data !== -1)
          setHaveAccount(true);
      });
  }
  const listSessions = () => {
    const p = authService.activeUserSession();
    // console.log(p);
    // authService.activeUserSession();
  }
  const handleLogout = () => {
    authService.logoutAccount();
    dispatch(toggleUserLoggedIn(false));
  }
  const handlelon = () => {
    dispatch(isloggedin());
  }
  const displayuser = () => {
    // console.log(authService.activeUserSession());
  }
  if (loading) {
    // console.log("Loading...");
    return <LoadingScreen/>
  }

  return (
    <>
      {/* <span onClick={listSessions} className=' cursor-pointer'>list</span> */}
      {/* <button onClick={handleLogout}>logout</button> */}
      {transition((style, item) =>
        !item ? <animated.div style={style} className=' md:w-[500px] w-[360px] h-[400px] flex flex-col items-center absolute -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2 bg-slate-200 rounded-lg shadow-[0_0_10px_0px_gray]'>
          <h1 className='text-[30px] mt-6'>Register</h1>
          <input type="text" placeholder='Name' value={name} onChange={(event) => setName(event.target.value)} className=' mt-5 h-[40px] rounded-md md:pl-4 md:pr-4 pl-4 text-[20px] outline-none focus:border-b-violet-600 border-2 transition-[0.2s]' />
          <input type="text" placeholder='Email' value={email} onChange={(event) => setEmail(event.target.value)} className=' mt-5 h-[40px] rounded-md md:pl-4 md:pr-4 pl-4 text-[20px] outline-none focus:border-b-violet-600 border-2 transition-[0.2s]' />
          <input type="password" placeholder='Password' value={pass} onChange={(event) => setPass(event.target.value)} className=' mt-5 h-[40px] rounded-md md:pl-4 md:pr-4 pl-4 text-[20px] outline-none focus:border-b-violet-600 border-2 transition-[0.2s]' />
          <button className=' mt-6 h-[40px] w-[100px] rounded-lg bg-violet-600 text-white hover:scale-105 active:scale-95 transition-[0.2s]' onClick={handleRegister}>Register</button>
          <div className='mt-6'>
            <span className=''>Don't have an account?</span> <span className=' cursor-pointer text-violet-800' onClick={() => setHaveAccount(true)}>Login</span>
          </div>
        </animated.div> :
          <animated.div style={style} className=' md:w-[500px] w-[360px] h-[400px] flex flex-col items-center absolute -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2 bg-slate-200 rounded-lg shadow-[0_0_10px_0px_gray]'>
            <h1 className='text-[30px] mt-6'>Login</h1>
            <input type="text" placeholder='Email' value={email} onChange={(event) => setEmail(event.target.value)} className=' mt-5 h-[40px] rounded-md md:pl-4 md:pr-4 pl-4 text-[20px] outline-none focus:border-b-violet-600 border-2 transition-[0.2s]' />
            <input type="password" placeholder='Password' value={pass} onChange={(event) => setPass(event.target.value)} className=' mt-5 h-[40px] rounded-md md:pl-4 md:pr-4 pl-4 text-[20px] outline-none focus:border-b-violet-600 border-2 transition-[0.2s]' />
            <button className=' mt-6 h-[40px] w-[100px] rounded-lg bg-violet-600 text-white hover:scale-105 active:scale-95 transition-[0.2s]' onClick={handleLogin}>Login</button>
            <div className='mt-6'>
              <span className=''>Don't have an account?</span> <span className=' cursor-pointer text-violet-800' onClick={() => setHaveAccount(false)}>Register</span>
            </div>
          </animated.div>
      )}
    </>
  )
}
