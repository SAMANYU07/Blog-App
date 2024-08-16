import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import LoginPage from "./LoginPage";
import blogService from '../appwrite/PostConfig';
import BlogCard1 from './BlogCard1';
import LoadingScreen from './LoadingScreen';
import { toggleLoading } from '../features/authSlice';
import { useTransition, animated, useTrail } from 'react-spring';
import { useLocation } from 'react-router-dom';
import { MdArrowLeft, MdArrowRight } from "react-icons/md";

export default function Home() {
  const location = useLocation();
  const state = location.state && typeof (location.state) === "string" ? JSON.parse(location.state) : location.state;
  const { tag, searchQuery } = state || { tag: null, searchQuery: null };
  const userLoggedIn = useSelector(state => state.userLoggedIn);
  const loading = useSelector(state => state.loading);
  const [latestPosts, setLatestPosts] = useState([]);
  const [totalPosts, setTotalPosts] = useState(0);
  const [taggedPosts, setTaggedPosts] = useState([]);
  const [searchedPosts, setSearchedPosts] = useState([]);
  const [totalPostPages, setTotalPostPages] = useState(0);
  const [postPage, setPostPage] = useState(1);
  // const postPa
  const blogCardTrail = useTrail(latestPosts.length, {
    from: {opacity: 0},
    to: {opacity: 1},
    config: {tension: 200, friction: 20}
  });
  const taggedCardTransition = useTrail(taggedPosts.length, {
    from: {opacity: 0},
    to: {opacity: 1},
    config: {tension: 200, friction: 20}
  })
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
      if (!loading)
        dispatch(toggleLoading(true));
      setLatestPosts([]);
      setTaggedPosts([]);
      setSearchedPosts([]);
      setPostPage(1);
      if (tag === null && (searchQuery === null || searchQuery === undefined)) {
        blogService.getAllBlogs()
          .then(data => {
            setLatestPosts(data.documents.reverse().slice(0, 10));
            setTotalPosts(data.documents.length);
          });
      }
      else if (tag !== null) {
        blogService.getAllBlogs()
          .then(data => {
            data.documents.reverse().map(blog => {
              if (blog?.tags.includes(tag)) {
                setTaggedPosts(p => [...p, blog]);
                setTotalPosts(taggedPosts.length);
              }
            })
          })
      }
      else if (searchQuery !== null && searchQuery !== undefined) {
        blogService.getAllBlogs()
          .then(data => {
            data.documents.reverse().map(blog => {
              if (blog?.title.toLowerCase().includes(searchQuery.toLowerCase())) {
                setSearchedPosts(p => [...p, blog]);
                setTotalPosts(searchedPosts.length);
              }
            })
          })
      }
      if (totalPosts % 10 === 0)
        setTotalPostPages(totalPosts / 10);
      else
        setTotalPostPages(parseInt(totalPosts / 10) + 1);
      // console.log("TotalPostPages: ", data.documents.reverse());
      dispatch(toggleLoading(false));
    }
  }, [userLoggedIn, tag, searchQuery]);
  useEffect(() => {
    if (postPage !== "" && postPage !== " ") {

      blogService.getAllBlogs()
      .then(data => {
        // if (postPage !== 1)
        setLatestPosts(data.documents.reverse().slice((postPage - 1) * 10, postPage * 10));
        // setLatestPosts(data.documents.reverse().slice(2,  1));
        // if (postPage === 1)
        // setLatestPosts(data.documents.reverse().slice((postPage * 10) - 10, 10));
      })
    }
    console.log("Total POsts", totalPosts, " totalpostpages: ", totalPostPages);
  }, [postPage])
  const handleIncPostPage = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
    setPostPage(v => v + 1);
  }
  const handleDecPostPage = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
    if (postPage > 1)
      setPostPage(v => v - 1);
  }
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
      <div className={` mt-20 ${loading ? "hidden" : "block"}`}>
        <div className=' md:ml-10 md:mr-6 md:w-auto md:block flex flex-col items-center mb-10'>
          {loading && (searchQuery !== null && searchQuery !== undefined) ? <span className='font-bold text-[20px]'>Search Results:</span> :
            <span className='font-bold text-[20px]'>{tag !== null ? "Blogs tagged " + tag : "Latest Blogs"}</span>
          }
              {latestPosts.length === 0 && searchedPosts.length === 0 && taggedPosts.length === 0 ? <LoadingScreen lwidth='w-full' lheight='h-full'/> : null}
          {searchQuery !== null && searchQuery !== undefined ?
            <div className='flex flex-col gap-y-10 mt-4 md:flex-row md:flex-wrap md:gap-x-8 justify-center'>
              {
                searchedPosts?.map(blog => {
                  if (blog?.title.toLowerCase().includes(searchQuery.toLowerCase()))
                    return <BlogCard1 key={blog?.$id} blog={blog} />
                })
              }
            </div>
            :
            tag !== null ?
              <div className='flex flex-col gap-y-10 mt-4 md:flex-row md:flex-wrap md:gap-x-8 justify-center'>
                {
                  taggedCardTransition.map((style, index) =>
                  <animated.div style={style} key={index}>
                    <BlogCard1 blog={taggedPosts[index]}/>
                  </animated.div>
                  )
                }
                {/* {
                  taggedPosts?.map(blog => {
                      return <BlogCard1 key={blog?.$id} blog={blog} />
                  })
                } */}
              </div>
              :
              <div className='flex flex-col gap-y-10 mt-4 md:flex-row md:flex-wrap md:gap-x-8 justify-center'>
                {
                  blogCardTrail.map((style, index) => {
                    return (
                      <animated.div style={style} key={index}>
                        <BlogCard1 blog={latestPosts[index]}/>
                      </animated.div>
                    )
                  }
                  )
                }
                {/* {
                  latestPosts?.map(blog => {
                    return <BlogCard1 key={blog?.$id} blog={blog} />
                  })
                } */}
              </div>
          }
          <div className='flex items-center justify-center mt-8'>
            <span className='mr-1'>Page:</span>
            <button onClick={handleDecPostPage}> {
              postPage > 1 ?
              <MdArrowLeft className=' outline-none hover:scale-110 active:scale-90 hover:text-violet-600' /> : null
              } </button>
            <input type="text" value={postPage} className='w-[30px] text-center outline-none' />
            <button onClick={handleIncPostPage}> {
              postPage * 10 >= totalPosts ? null :
                <MdArrowRight className=' outline-none hover:scale-110 active:scale-90 hover:text-violet-600' />
            } </button>
          </div>
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