import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import blogService from '../appwrite/PostConfig';
import BlogCard1 from './BlogCard1';
import { toggleLoading } from '../features/authSlice';
import LoadingScreen from './LoadingScreen';
import { useTrail, animated } from 'react-spring';

export default function FavoritesPage() {
  const [favBlogs, setFavBlogs] = useState(null);
  const [Blogs, setBlogs] = useState([]);
  const loading = useSelector(state => state.loading);
  const userID = useSelector(state => state.userID);
  const dispatch = useDispatch();
  var blogTrail = useTrail(Blogs.length, {
    from: {opacity: 0},
    to: {opacity: 1},
  });
  useEffect(() => {
    dispatch(toggleLoading(true));
    const fetchfav = async () => {
      await blogService.getAllFavorites()
      .then(data => {
        data.documents?.map(fav => {
          if (fav?.userid === userID) {
            setFavBlogs(fav?.fBlogs);
          }
        })
      })
    }
    const fetchblog = async (blogid) => {
        await blogService.getBlog(blogid)
        .then(blog => {
          setBlogs(b => [...b, blog]);
      })
    }
    favBlogs === null ? fetchfav() : null;
    favBlogs?.map(blogid => {
      fetchblog(blogid);
    })
  }, [userID, favBlogs])
  useEffect(() => {
    Blogs.length === favBlogs?.length || favBlogs?.length !== 0 || Blogs.length !== 0 ? dispatch(toggleLoading(false)) : null;
  }, [Blogs])
  const remblog = (blogid) => {
    const temp = Blogs.filter(blog => blog.$id !== blogid);
    setBlogs(temp);
  }
  return (
    <>
    <div className='mt-20 ml-10 mr-10 md:block flex flex-col items-center mb-10'>
      <span className=' font-bold text-[20px]'>Favorite Posts</span>
      {/* <div className='flex gap-x-8 gap-y-10 mt-4 md:flex-row md:flex-wrap flex-col'> */}
      <div className='flex flex-col gap-y-10 mt-4 md:flex-row md:flex-wrap md:gap-x-8 justify-center'>
    {loading ? <LoadingScreen lheight='h-full' lwidth='w-full'/> :null}
    {
      blogTrail.map((style, index) =>
      <animated.div style={style}  key={index}>
        <BlogCard1 blog={Blogs[index]} delblog={(blogid => remblog(blogid))}/>
      </animated.div>
      )
    }
        {/* {
          Blogs?.map(blog => {
              return <BlogCard1 key={blog.$id} blog={blog} delblog={(blogid => remblog(blogid))} />
          })
        } */}
      </div>
    </div>
    </>
  )
}
