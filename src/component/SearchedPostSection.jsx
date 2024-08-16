import React from 'react'
import BlogCard1 from './BlogCard1'
import NoPostsScreen from './NoPostsScreen'
import { useDispatch } from 'react-redux'
import { toggleLoading } from '../features/authSlice';

export default function SearchedPostSection({searchedPosts = []}) {
  const dispatch = useDispatch();
  if (searchedPosts[0] == "null") {
    return <NoPostsScreen noResults={true}/>
  }
  return (
    <>
    <div className='flex flex-col gap-y-10 mt-4 md:flex-row md:flex-wrap md:gap-x-8 justify-center'>
      {
        searchedPosts?.map(blog =>{
          return <BlogCard1 key={blog?.$id} blog={blog}/>
        })
      }
    </div>
    </>
  )
}
