import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import LoginPage from "./LoginPage";
import blogService from '../appwrite/PostConfig';
import BlogCard1 from './BlogCard1';
import LoadingScreen from './LoadingScreen';
import { toggleLoading } from '../features/authSlice';
import { useTransition, animated } from 'react-spring';
import { useLocation } from 'react-router-dom';

export default function Home() {
  const location = useLocation();
  const state = location.state && typeof(location.state) === "string" ? JSON.parse(location.state) : location.state;
  const { tag } = state || { tag: null };
  const userLoggedIn = useSelector(state => state.userLoggedIn);
  const loading = useSelector(state => state.loading);
  const [latestPosts, setLatestPosts] = useState();
  const loadingTransition = useTransition(loading, {
    // config: {duration: 100},
    from: { opacity: 0 },
    enter: { opacity: 1 },
    // leave: {opacity: 0},
  });
  const dispatch = useDispatch();
  useEffect(() => {
    if (tag !== null)
      console.log("tag: ", tag);
  }, [])
  useEffect(() => {
    if (userLoggedIn) {
      blogService.getAllBlogs()
        .then(data => setLatestPosts(data.documents));
      dispatch(toggleLoading(false));
    }
  }, [userLoggedIn])
  // if (loading)
  // return <LoadingScreen/>
  if (!userLoggedIn)
    return <LoginPage />
  // latestPosts?.map(blog => console.log(blog));
  return (
    <>
      {loadingTransition((style, showLoading) =>
        showLoading ?
          <animated.div style={style}>
            <LoadingScreen />
          </animated.div>
          :
          null
      )}
      {/* {userLoggedIn ? null : <LoginPage/>} */}
      <div className=' mt-20'>
        <div className=' md:ml-10 md:mr-6 md:w-auto md:block flex flex-col items-center mb-10'>
          <span className='font-bold text-[20px]'>{tag !== null ? "Blogs tagged " + tag : "Latest Blogs"}</span>
          {tag !== null ?
          <div className='flex md:grid flex-col gap-y-10 mt-4 md:grid-cols-5 md:justify-start justify-center'>
          {
            latestPosts?.reverse().map(blog => {
              if (blog?.tags.includes(tag))
                return <BlogCard1 key={blog?.$id} blog={blog} />
            })
          }
        </div>
          :
          <div className='flex flex-col gap-y-10 mt-4 md:flex-row md:flex-wrap md:gap-x-10 justify-center'>
          {
            latestPosts?.reverse().map(blog => {
              return <BlogCard1 key={blog?.$id} blog={blog} />
            })
          }
        </div>
          }
          {/* <div className='flex md:flex-row flex-col gap-x-8 gap-y-10 mt-4 md:flex-wrap md:justify-start justify-center'> */}
          {/* <div className='flex md:grid flex-col gap-y-10 mt-4 md:grid-cols-5 md:justify-start justify-center'>
            {
              latestPosts?.reverse().map(blog => {
                return <BlogCard1 blog={blog} />
              })
            }
          </div> */}
        </div>
      </div>
    </>
  )
}