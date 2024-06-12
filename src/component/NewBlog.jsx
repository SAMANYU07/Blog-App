import React, { useState, useRef, useMemo, useEffect } from 'react'
import JoditEditor from "jodit-react";
// import { FroalaEditor } from 'froala-editor';
import Button from './Button';
import blogService from '../appwrite/PostConfig';
import { useSelector } from 'react-redux';
import { ID } from 'appwrite';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTransition, animated } from 'react-spring';

export default function NewBlog() {
  const location = useLocation();
  const state = location.state && typeof (location.state) === "string" ? JSON.parse(location.state) : location.state;
  const { pContent, pTitle, pFimage, blog_id } = state || { pContent: '', pTitle: '', pFimage: null, blog_id: null };
  const editor = useRef(null);
  const [content, setContent] = useState(pContent.length > 0 ? pContent : "");
  const [title, setTitle] = useState(pTitle.length > 0 ? pTitle : "");
  const [author, setAuthor] = useState("");
  const [fImage, setFImage] = useState(null);
  const [updating, setUpdating] = useState(blog_id !== null ? true : false);
  const [updateImg, setUpdateImg] = useState(false);
  const userID = useSelector(state => state.userID);
  const userName = useSelector(state => state.userName);
  const navigate = useNavigate();
  const transition = useTransition(null, {
    from: { marginLeft: "-1000px"},
    enter: {  marginLeft: "0px"},
    leave: {},
  });
  const transition1 = useTransition(null, {
    from: { marginRight: "-1000px"},
    enter: {  marginRight: "0px"},
    leave: {},
  });
  useEffect(() => {
    if (pFimage !== null) {
      // console.log("pFimage recieved: ", pFimage);
      blogService.getFile(pFimage)
        .then(data => { setFImage(data);
          // console.log("pfimage data: ", data); 
        })
    }
  }, [])
  // const config = useMemo(
  //   {
  //     readonly: false,
  //     placeholder: placeholder || 'Start typing...'
  //   },
  //   [placeholder]
  // );
  const handleContentChange = newContent => {
    setContent(newContent);
    if (editor.current) {
      editor.current.focus();
    }
  }
  const handleFile = () => {

  }
  const handlePublish = async () => {
    const fileid = ID.unique();
    await blogService.createBlog({ title: title, content: content, userid: userID, fImage: fileid, author: userName });
    await blogService.uploadFile({ file: fImage, fileid: fileid, userid: userID });
    navigate("/");
  }
  const handleUpdate = async () => {
    if (!updateImg)
      await blogService.updateBlog(blog_id, { title: title, content: content });
    else {
      const fileid = ID.unique();
      await blogService.deleteFile(pFimage);
      await blogService.uploadFile({ fileid: fileid, file: fImage, userid: userID });
      await blogService.updateBlog(blog_id, { title: title, content: content, fImage: fileid });
    }
    // await blogService.updateBlog(blog_id, { title: title, content: content, fImage: fImage });
    navigate("/");
  }
  const showcontent = () => {
    // console.log(content);
  }
  const handleCancel = () => {
    // console.log("home..");
    navigate("/");
  }
  const config = useMemo(() => ({
    enableDragAndDropFileToEditor: true,
    height: 700,
    uploader: {
      insertImageAsBase64URI: true
    },
  }), [])
  return (
    <>
      <div className=''>
        <div className='w-full h-64 grid md:grid-cols-4 mt-20 '>
          {transition((style, item) =>
          <animated.div style={style} className=' md:col-span-3 col-span-1'>
            <JoditEditor
              ref={editor}
              value={content}
              onChange={handleContentChange}
              config={config}
            />
            {/* {content} */}
          </animated.div>
          )}
          {transition1((style, item) =>
          <animated.div style={style} className='flex flex-col items-center md:mt-0 mt-10'>
            {/* <span className=' mr-auto ml-16'>Title:</span> */}
            <input type="text" placeholder='Title' value={title} onChange={event => setTitle(event.target.value)} className='w-11/12 outline-none shadow-lg h-[40px] pl-2 focus:border-b-violet-600 border-2 transition-[0.2s]' />
            {/* <input type="text" placeholder='Author' value={author} onChange={event => setAuthor(event.target.value)} className='w-11/12 outline-none shadow-lg h-[40px] pl-2 mt-10'/> */}
            <input type="file" placeholder='Author' onChange={event => {
              // console.log(event.target.files[0]);
              setFImage(event.target.files[0]);
              if (pFimage !== null)
                setUpdateImg(true);
            }} className='w-11/12 outline-none shadow-lg h-[40px] pl-2 mt-10' />
            {fImage !== null && pFimage === null ?
              <>
                <span className='md:mt-8 mt-6'>Featured Image:</span>
                <img src={URL.createObjectURL(fImage)} alt="" className='w-[100px] h-[100px]' />
              </>
              :
              <>
                <span className='md:mt-8 mt-6'>Featured Image:</span>
                <img src={fImage} alt="" className='w-[100px] h-[100px]' />
              </>}
            <div className='grid grid-cols-2 md:mt-10 mt-4 w-11/12 gap-x-3 text-[20px] md:mb-0 mb-5'>
              {updating ?
                <button onClick={handleUpdate} className='cbtn h-[40px] outline-none hover:scale-105 active:scale-90 transition-[0.2s]'>Update</button>
                :
                <button onClick={handlePublish} className='cbtn h-[40px] outline-none hover:scale-105 active:scale-90 transition-[0.2s]'>Publish</button>
              }
              {/* <button onClick={handlePublish} className='cbtn h-[40px]'>Publish</button> */}
              <button onClick={handleCancel} className='h-[40px] bg-gray-500 rounded-lg text-white outline-none hover:scale-105 active:scale-90 transition-[0.2s]'>Cancel</button>
            </div>
          </animated.div>
          )}
        </div>
      </div>
    </>
  )
}
