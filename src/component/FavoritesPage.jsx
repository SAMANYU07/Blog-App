import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import blogService from '../appwrite/PostConfig';
import BlogCard1 from './BlogCard1';
import { toggleLoading } from '../features/authSlice';
import LoadingScreen from './LoadingScreen';
import { useTrail, animated } from 'react-spring';
import NoPostsScreen from './NoPostsScreen';

export default function FavoritesPage() {
  const [favBlogs, setFavBlogs] = useState([]);
  const [Blogs, setBlogs] = useState([]);
  const [noPosts, setNoPosts] = useState(false);
  const loading = useSelector(state => state.loading);
  const userID = useSelector(state => state.userID);
  const guestUser = useSelector(state => state.guestUser);
  const dispatch = useDispatch();
  var blogTrail = useTrail(Blogs.length, {
    from: {opacity: 0},
    to: {opacity: 1},
  });
  if (guestUser)
    return <NoPostsScreen/>
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
    favBlogs.length === 0 ? fetchfav() : null;
    favBlogs?.map(blogid => {
      fetchblog(blogid);
    })
    dispatch(toggleLoading(false));
  }, [userID, favBlogs])
  const remblog = (blogid) => {
    const temp = Blogs.filter(blog => blog.$id !== blogid);
    setBlogs(temp);
  }
  if (favBlogs?.length === 0)
    return <NoPostsScreen noFavoritesPosts={true}/>
  // useEffect(() => {
  //   if (!loading && favBlogs === null)
  //   setNoPosts(true);
  // }, [loading])
  // if (loading)
    // return <LoadingScreen/>
  // if (noPosts)
    // return <NoPostsScreen noFavoritesPosts={true}/>
  return (
    <>
    {/* {favBlogs?.length === 0 ? <NoPostsScreen noFavoritesPosts={true}/> : console.log("kamal hai", favBlogs)} */}
    <div className='mt-20 ml-10 mr-10 md:block flex flex-col items-center mb-10'>
      <span className=' font-bold text-[20px]'>Favorite Posts</span>
      {/* <div className='flex gap-x-8 gap-y-10 mt-4 md:flex-row md:flex-wrap flex-col'> */}
      <div className='flex flex-col gap-y-10 mt-4 md:flex-row md:flex-wrap md:gap-x-8 justify-center'>
      {/* {favBlogs?.length === 0 ? <LoadingScreen lheight='h-full' lwidth='w-full'/> :null} */}
    {/* {NoPostsScreen ? <NoPostsScreen noFavoritesPosts={true}/>: null} */}
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
