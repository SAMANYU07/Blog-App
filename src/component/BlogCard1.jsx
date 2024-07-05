import React, { useEffect, useState } from 'react'
import blogService from '../appwrite/PostConfig';
import { Link, useNavigate } from 'react-router-dom';
import { IoStar } from "react-icons/io5";
import { useSelector } from 'react-redux';
import { IconContext } from 'react-icons';
import LoadingScreen from './LoadingScreen';

export default function BlogCard1({ blog, delblog }) {
  const [imgFile, setImgFile] = useState(null);
  const [isFav, setIsFav] = useState(false);
  const [favLoading, setFavLoading] = useState(false);
  const [hovering, setHovering] = useState(false);
  const userid = useSelector(state => state.userID);
  const navigate = useNavigate();
  const handleSearchTag = (tag) => {
    const serializedState = JSON.stringify({
      tag: tag,
    });
    navigate("/", { state: serializedState });
  }
  const handleAddToFavorites = async () => {
    console.log("Adding...");
    blogService.getAllFavorites()
      .then(data => {
        setFavLoading(true);
        let f = false;
        data.documents?.map(fav => {
          if (fav?.userid === userid) {
            f = true;
            const favArr = [...fav?.fBlogs, blog.$id];
            blogService.updateFavorites(fav.$id, { userid: userid, fBlogs: favArr });
          }
        })
        if (f === false) {
          blogService.addToFavorites({ userid: userid, fBlogs: [blog.$id] });
        }
        setFavLoading(false);
      });
    setIsFav(true);
  }
  const handleRemFavorites = async () => {
    console.log("Removing..");
    await blogService.getAllFavorites()
    .then(data => {
      setFavLoading(true);
      data.documents?.map(fav => {
        if (fav?.userid === userid) {
          const favArr = fav?.fBlogs.filter(blogid => blogid !== blog.$id);
          blogService.updateFavorites(fav.$id, {userid: userid, fBlogs: favArr});
        }
      })
      if (window.location.href.includes("/favorites"))
        delblog(blog.$id);
      setFavLoading(false);
    })
    setIsFav(false);
  }
  useEffect(() => {
    blogService.getFilePreview(blog?.fImage)
      .then(data => setImgFile(data));
    const fetchFav = async () => {
      setFavLoading(true);
      await blogService.getAllFavorites()
        .then(data => {
          let f = false;
          data.documents?.map(fav => {
            if (fav?.userid === userid) {
              fav?.fBlogs?.map(fElem => {
                if (fElem === blog.$id)
                  setIsFav(true);
              })
            }
          })
        })
      setFavLoading(false);
    }
    fetchFav();
  }, [])
  return (
    <>
      <div className='w-[340px] h-[410px] rounded-lg bg-white pb-10 hover:shadow-[0_0_10px_gray] transition-[0.2s] animate-bounce blogcardanim'
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      >
        {favLoading ? <span className='absolute ml-2 mt-2'><LoadingScreen lheight='h-[20px]' lwidth='w-[20px]' aheight='h-[20px]' awidth='w-[20px]'/></span> :
        <IconContext.Provider value={isFav ? { color: 'gold', size: '20px' } : { color: 'rgb(51 65 85)', size: '20px' }}>
          <IoStar onClick={!isFav ? handleAddToFavorites : handleRemFavorites} className={`absolute ml-1 h-[28px] w-[28px]  mt-1 ${hovering ? "block" : "md:hidden"} ${favLoading ? " animate-pulse" : ""}`} />
        </IconContext.Provider>
        }
        <Link to={`/blog/` + blog.$id}><img src={imgFile} alt="" height="" className='h-[230px] w-[340px] rounded-t-lg' /></Link>
        <div className=' mt-4 ml-4'>
          <Link to={`/blog/` + blog.$id}>
            <span className='font-bold'>{blog?.title}</span> <br />
            <span className='inline-block mt-2 text-gray-700'>{blog?.author}</span> <br />
            <span className='inline-block text-gray-700'>{blog?.publishedOn}</span> <br />
          </Link>
          <div className='flex gap-x-2 w-full flex-wrap gap-y-1'>
            {
              blog?.tags?.map(tag => {
                return (<span onClick={() => handleSearchTag(tag)} className='border-2 border-gray-700 text-gray-700 rounded-md pl-1 pr-1 text-[13px] cursor-pointer'>{tag}</span>)
              })
            }
          </div>
        </div>
      </div>
    </>
  )
}
