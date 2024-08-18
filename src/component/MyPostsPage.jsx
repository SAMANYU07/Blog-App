import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import blogService from '../appwrite/PostConfig';
import BlogCard1 from './BlogCard1';
import { useTrail, animated } from 'react-spring';
import { toggleGuestUser, toggleSearching, toggleUserLoggedIn } from '../features/authSlice';
import NoPostsScreen from './NoPostsScreen';
import { useLoaderData } from 'react-router-dom';
import store from "../Store/store";

export default function MyPostsPage() {
  // const [myBlogs, setMyBlogs] = useState([]);
  const myBlogs= useLoaderData();
  const userID = useSelector(state => state.userID);
  const guestUser = useSelector(state => state.guestUser);
  let blogsTrail = useTrail(myBlogs?.length, {
    from: { opacity: 0 },
    to: { opacity: 1 },
  });
  if (guestUser) {
    store.dispatch(toggleSearching(false));
    return <NoPostsScreen/>
  }
    // useEffect(() => {
    //   if (!guestUser) {
    //     blogService.getAllBlogs()
    //     .then(data => {
    //       let tempBlogs = data.documents.filter(blog => blog.userid === userID)
    //       setMyBlogs(tempBlogs);
    //     })
    //   }
    // }, [])
    useEffect(() => {
      store.dispatch(toggleSearching(false));
    }, [])
    if (myBlogs.length === 0)
      return <NoPostsScreen noMyPosts={true}/>
  return (
    <>
        <div className='mt-20 ml-10 mr-10 md:block flex flex-col items-center mb-10'>
          <span className=' font-bold text-[20px]'>My Posts</span>
          {/* <div className='flex gap-x-8 gap-y-10 mt-4 md:flex-row md:flex-wrap flex-col'> */}
          <div className='flex flex-col gap-y-10 mt-4 md:flex-row md:flex-wrap md:gap-x-8 justify-center'>
            {
              blogsTrail.map((style, index) =>
                <animated.div style={style}>
                  <BlogCard1 blog={myBlogs[index]} />
                </animated.div>
              )
            }
            {/* {
          myBlogs?.reverse().map(blog => {
            return <BlogCard1 blog={blog}/>
          })
        } */}
          </div>
        </div>
    </>
  )
}
