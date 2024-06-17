import React, { useEffect, useState } from 'react'
import blogService from '../appwrite/PostConfig';
import { Link, useNavigate } from 'react-router-dom';

export default function BlogCard1({ blog }) {
  const [imgFile, setImgFile] = useState(null);
  const navigate = useNavigate();
  const handleSearchTag = (tag) => {
    const serializedState = JSON.stringify({
      tag: tag,
    });
    navigate("/", { state: serializedState });
  }
  useEffect(() => {
    blogService.getFilePreview(blog?.fImage)
      .then(data => setImgFile(data))
  }, [])
  return (
    <>
        <div className='w-[340px] h-[410px] rounded-lg bg-white pb-10 hover:shadow-[0_0_10px_gray] transition-[0.2s] animate-bounce blogcardanim'>
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
                return (<span onClick={() => handleSearchTag(tag)}  className='border-2 border-gray-700 text-gray-700 rounded-md pl-1 pr-1 text-[13px] cursor-pointer'>{tag}</span>)
              })
            }
            </div>
          </div>
        </div>
    </>
  )
}
