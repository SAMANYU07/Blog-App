import React, { useState } from 'react'
import { useSelector, useDispatch } from "react-redux";
import authService from '../appwrite/auth';
import LoadingScreen from './LoadingScreen';
import { toggleLoading, toggleUserLoggedIn, updateUserDetails } from '../features/authSlice';
import { useTransition, animated } from 'react-spring';
import { useForm } from 'react-hook-form';
import ErrorCard from './ErrorCard';

export default function LoginPage() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [haveAccount, setHaveAccount] = useState(false);
  const [showLoginError, setShowLoginError] = useState(false);
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

  const handleLogin = async (fdata) => {
    dispatch(toggleLoading(true));
    // await authService.loginAccount({ email, pass })
    await authService.loginAccount(fdata)
      .then(data => {
        if (data !== -1) {
          console.log("Login Data: ", data);
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
        else
        {
          dispatch(toggleLoading(false));
          setShowLoginError(true);
          console.log("Error data: ", data);
        }
      })
    // dispatch(toggleLoading(false));
  }

  const handleRegister = (fdata) => {
    authService.accountCreation(fdata)
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
    return <LoadingScreen />
  }

  return (
    <>
      {/* <span onClick={listSessions} className=' cursor-pointer'>list</span> */}
      {/* <button onClick={handleLogout}>logout</button> */}
      {transition((style, item) =>
        !item ? <animated.div style={style} className=' md:w-[500px] w-[360px] h-[400px] flex flex-col items-center absolute justify-center -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2 bg-slate-200 rounded-lg shadow-[0_0_10px_0px_gray]'>
          <h1 className='text-[30px] mt6'>Register</h1>
          <form onSubmit={handleSubmit(handleRegister)} className='flex flex-col items-center'>
            <input {...register("name", {
              required: "Name is required.",
            })} type="text" placeholder='Name' className=' mt-5 h-[40px] rounded-md md:pl-4 md:pr-4 pl-4 text-[20px] outline-none focus:border-b-violet-600 border-2 transition-[0.2s]' />
            <span className='text-[12px] text-red-500'>{errors?.name?.message}</span>
            <input {...register("email", {
              required: "Email is required.",
              pattern: { value: /^\S+@\S+$/i, message: "This is not a valid email" },
            })} type="text" placeholder='Email' className=' mt-5 h-[40px] rounded-md md:pl-4 md:pr-4 pl-4 text-[20px] outline-none focus:border-b-violet-600 border-2 transition-[0.2s]' />
            <span className='text-[12px] text-red-500'>{errors?.email?.message}</span>
            <input {...register("pass", {
              required: "Password is required.",
              minLength: { value: 8, message: "Password length must be between 8-14" },
              maxLength: { value: 14, message: "Password length must be between 8-14" },
            })} type="password" placeholder='Password' className=' mt-5 h-[40px] rounded-md md:pl-4 md:pr-4 pl-4 text-[20px] outline-none focus:border-b-violet-600 border-2 transition-[0.2s]' />
            <span className='text-[12px] text-red-500'>{errors?.pass?.message}</span>
            {/* <button className=' mt-6 h-[40px] w-[100px] rounded-lg bg-violet-600 text-white hover:scale-105 active:scale-95 transition-[0.2s]' onClick={handleRegister}>Register</button> */}
            <button type='submit' className=' mt-6 h-[40px] w-[100px] rounded-lg bg-violet-600 text-white hover:scale-105 active:scale-95 transition-[0.2s]'>Register</button>
            <div className='mt-6'>
              <span className=''>Don't have an account?</span> <span className=' cursor-pointer text-violet-800' onClick={() => setHaveAccount(true)}>Login</span>
            </div>
          </form>
        </animated.div> :
          <animated.div style={style} className=' md:w-[500px] w-[360px] h-[400px] flex flex-col items-center absolute -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2 bg-slate-200 rounded-lg shadow-[0_0_10px_0px_gray]'>
            <h1 className='text-[30px] mt-6'>Login</h1>
              {showLoginError ? <ErrorCard errorMessage="Please check email id and password."/> : null}
            <form onSubmit={handleSubmit(handleLogin)} className='flex flex-col items-center'>
              <input {...register("email", {
                required: "Email is required.",
                pattern: { value: /^\S+@\S+$/i, message: "This is not a valid email" },
              })} type="text" placeholder='Email' className=' mt-5 h-[40px] rounded-md md:pl-4 md:pr-4 pl-4 text-[20px] outline-none focus:border-b-violet-600 border-2 transition-[0.2s]' />
              <span className='text-[12px] text-red-500'>{errors?.email?.message}</span>
              <input {...register("pass", {
                required: "Password is required.",
              })} type="password" onClick={handleSubmit(handleLogin)} placeholder='Password' className=' mt-5 h-[40px] rounded-md md:pl-4 md:pr-4 pl-4 text-[20px] outline-none focus:border-b-violet-600 border-2 transition-[0.2s]' />
              <span className='text-[12px] text-red-500'>{errors?.pass?.message}</span>
              <button type='submit' className=' mt-6 h-[40px] w-[100px] rounded-lg bg-violet-600 text-white hover:scale-105 active:scale-95 transition-[0.2s]'>Login</button>
              <div className='mt-6'>
                <span className=''>Don't have an account?</span> <span className=' cursor-pointer text-violet-800' onClick={() => setHaveAccount(false)}>Register</span>
              </div>
            </form>

          </animated.div>
      )}
    </>
  )
}
