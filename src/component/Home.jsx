import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import LoginPage from "./LoginPage";
import blogService from '../appwrite/PostConfig';
import BlogCard1 from './BlogCard1';
import LoadingScreen from './LoadingScreen';
import { toggleLoading } from '../features/authSlice';

export default function Home() {
  const userLoggedIn = useSelector(state => state.userLoggedIn);
  const loading = useSelector(state => state.loading);
  const [latestPosts, setLatestPosts] = useState(null);
  const dispatch = useDispatch();
  useEffect(() => {
    if (userLoggedIn) {
      blogService.getAllBlogs()
      .then(data => setLatestPosts(data.documents));
      dispatch(toggleLoading(false));
    }
  }, [userLoggedIn])
  if (loading)
    return <LoadingScreen/>
  if (!userLoggedIn)
    return <LoginPage/>
  // latestPosts?.map(blog => console.log(blog));
  return (
    <>
    {/* {userLoggedIn ? null : <LoginPage/>} */}
    <div className=' mt-20'>
      <div className=' md:ml-10 md:mr-10 md:w-auto md:block flex flex-col items-center mb-10'>
        <span className='font-bold text-[20px]'>Latest Blogs</span>
        <div className='flex md:flex-row flex-col gap-x-8 gap-y-10 mt-4 md:flex-wrap md:justify-start justify-center'>
        {
          latestPosts?.map(blog => {
            return <BlogCard1 blog={blog}/>
          })
        }
        </div>
      </div>
    </div>
    </>
  )
}
