import React, { useEffect, useState, useHistory } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import blogService from '../appwrite/PostConfig';
import parse from "html-react-parser";
import { MdModeEditOutline, MdDelete } from "react-icons/md";
import NewBlog from './NewBlog';
import { useSelector } from 'react-redux';

export default function BlogPage() {
  const { blog_id } = useParams();
  const [blog, setBlog] = useState(null);
  const [fImage, setFImage] = useState(null);
  const [content, setContent] = useState("");
  const userID = useSelector(state => state.userID);
  const navigate = useNavigate();
  useEffect(() => {
    blogService.getBlog(blog_id)
      .then(data => {
        setBlog(data);
        blogService.getFile(data.fImage)
          .then(data => setFImage(data));
        setContent(data?.content)
      });
  }, [])
  // console.log(blog.content);
  const handleEdit = () => {
    console.log("Edit...");
    console.log("BlogPage Sending: ", blog?.fImage);
    // return <NewBlog pContent={content} pTitle={blog?.title} pFimage={blog?.fImage}/>
    const serializedState = JSON.stringify({
      pContent: content,
      pTitle: blog?.title,
      pFimage: blog?.fImage,
      blog_id: blog_id,
    })
    navigate("/newblog", {state: serializedState})
  }
  const handleDelete = async () => {
    await blogService.deleteFile(blog?.fImage);
    await blogService.deleteBlog(blog.$id);
    navigate("/");
  }
  return (
    <>
    <div className='w-full h-full flex justify-center'>
      <div className='w-[1000px] mt-20 rounded-2xl bg-white mb-4 shadow-[0_0_10px_0_gray]'>
        <div className=' relative mt-0 z-[1]'>
          <img src={fImage} alt="" className='w-full h-[800px] rounded-t-2xl' />
          {/* <div className='fImageEff'> */}
          <div className='absolute inset-0 bg-gradient-to-t from-black'>
            <span className=' inline-block bottom-0 absolute text-white mb-20 text-[40px] font-bold ml-8'>{blog?.title}</span>
            <span className=' inline-block bottom-0 absolute text-white mb-10 text-[20px] font-bold ml-8'>{blog?.author}</span>
          </div>
        </div>
        <div className=' m-8'>
          {parse(content)}
        </div>
      </div>
    </div>
    {blog?.userid === userID?
    <>
        <div onClick={handleEdit} className='fixed mt-auto bottom-20 ml-auto right-4 h-[40px] w-[40px] bg-violet-600 rounded-full text-white flex items-center justify-center cursor-pointer hover:scale-110 transition-[0.2s]'>
       <MdModeEditOutline className=''/>
    </div>
    <div onClick={handleDelete} className='fixed mt-auto bottom-[138px] ml-auto right-4 h-[40px] w-[40px] bg-violet-600 rounded-full text-white flex items-center justify-center cursor-pointer hover:scale-110 transition-[0.2s]'>
       <MdDelete className=''/>
    </div>
    </>
    :
    null
    }
    </>
  )
}
