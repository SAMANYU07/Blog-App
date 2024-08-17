import React from 'react'
import BlogCard1 from './BlogCard1'
import NoPostsScreen from './NoPostsScreen'
import { useDispatch } from 'react-redux'
import { toggleLoading, toggleSearching } from '../features/authSlice';
import { useTrail, animated } from 'react-spring';

export default function SearchedPostSection({searchedPosts = []}) {
  const dispatch = useDispatch();
  if (searchedPosts.length === 0) {
    dispatch(toggleSearching(false));
    return <NoPostsScreen noResults={true}/>
  }
  const cardTrail = useTrail(searchedPosts.length, {
    from: {opacity: 0},
    to: {opacity: 1},
    config: {tension: 200, friction: 20},
  });
  return (
    <>
    <div className='flex flex-col gap-y-10 mt-4 md:flex-row md:flex-wrap md:gap-x-8 justify-center'>
      {
        cardTrail.map((style, index) =>
        <animated.div style={style} key={index}>
          <BlogCard1 key={searchedPosts[index].$id} blog={searchedPosts[index]}/>
        </animated.div>
        )
      }
      {/* {
        searchedPosts?.map(blog =>{
          return <BlogCard1 key={blog?.$id} blog={blog}/>
        })
      } */}
    </div>
    </>
  )
}
