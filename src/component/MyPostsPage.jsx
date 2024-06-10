import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import blogService from '../appwrite/PostConfig';
import BlogCard1 from './BlogCard1';

export default function MyPostsPage() {
  const [myBlogs, setMyBlogs] = useState(null);
  const userID = useSelector(state => state.userID);
  useEffect(() => {
    blogService.getAllBlogs()
    .then(data => {
      let tempBlogs = data.documents.filter(blog => blog.userid === userID)
      setMyBlogs(tempBlogs);
    })
  }, [])
  return (
    <>
    <div className='mt-20 ml-10 mr-10'>
      <span className=' font-bold text-[20px]'>My Posts</span>
      <div className='flex gap-x-8 gap-y-10 mt-4 flex-wrap'>
        {
          myBlogs?.toReversed().map(blog => {
            return <BlogCard1 blog={blog}/>
          })
        }
      </div>
    </div>
    </>
  )
}
