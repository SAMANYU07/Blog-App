import React, { useEffect, useState, useHistory } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import blogService from '../appwrite/PostConfig';
import parse from "html-react-parser";
import { MdModeEditOutline, MdDelete } from "react-icons/md";
import NewBlog from './NewBlog';
import { useDispatch, useSelector } from 'react-redux';
import LoadingScreen from './LoadingScreen';
import { addcommentsArr, toggleLoading, updatecommentsArr } from '../features/authSlice';
import { useTransition, animated } from 'react-spring';
import CommentCard from './CommentCard';
import { ID } from 'appwrite';
import CommentSection from './CommentSection';

export default function BlogPage() {
  const { blog_id } = useParams();
  const [blog, setBlog] = useState(null);
  const [fImage, setFImage] = useState(null);
  const [content, setContent] = useState("");
  // const [commentsArr, setCommentsArr] = useState([]);
  const [commentV, setCommentV] = useState("");
  const userID = useSelector(state => state.userID);
  const userName = useSelector(state => state.userName);
  const loading = useSelector(state => state.loading);
  const commentsArr = useSelector(state => state.commentsArr);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const transition = useTransition(loading, {
    from: { width: window.innerWidth > 768 ? "0px" : "0px" },
    enter: { width: window.innerWidth > 768 ? "1000px" : window.innerWidth.toString() + "px"},
    // leave: {width: "0px"},
  });
  useEffect(() => {
    dispatch(toggleLoading(true));
    const loadBlogContent = async () => {
      await blogService.getBlog(blog_id)
        .then(data => {
          // setCommentsArr(data.comments);
          dispatch(updatecommentsArr(data.comments));
          // console.log(commentsArr);
          setBlog(data);
          blogService.getFile(data.fImage)
            .then(data => setFImage(data));
          setContent(data?.content)
        });
      dispatch(toggleLoading(false));
    }
    loadBlogContent();
  }, [])
  useEffect(() => {
    blogService.addComment(blog_id, commentsArr);
  }, [commentsArr])
  // console.log(blog.content);
  const handleEdit = () => {
    // console.log("Edit...");
    // console.log("BlogPage Sending: ", blog?.fImage);
    // return <NewBlog pContent={content} pTitle={blog?.title} pFimage={blog?.fImage}/>
    const serializedState = JSON.stringify({
      pContent: content,
      pTitle: blog?.title,
      pFimage: blog?.fImage,
      blog_id: blog_id,
      pTags: blog?.tags,
    })
    navigate("/newblog", { state: serializedState })
  }
  const handleDelete = async () => {
    await blogService.deleteFile(blog?.fImage);
    await blogService.deleteBlog(blog.$id);
    navigate("/");
  }
  const handleComment = async () => {
    const monthNames = ["January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
    const dt = new Date();
    let date = dt.getDate() + " " + monthNames[dt.getMonth()] + " " + dt.getFullYear();
    const newComment = JSON.stringify({
      uname: userName,
      userid: userID,
      commID: ID.unique(),
      date: date,
      comment: commentV,
    });
    // console.log("new Comment", newComment);
    // console.log("commentArr", commentsArr);
    console.log("New Comment:", newComment);
    dispatch(addcommentsArr(newComment));
    console.log("commentsArr", commentsArr);
    // const updatedCommentsArr = [...commentsArr, newComment];
    // setCommentsArr(updatedCommentsArr);
    // dispatch(updatecommentsArr(updatedCommentsArr));
    // await blogService.addComment(blog_id, commentsArr);
    setCommentV("");
    setTimeout(() => {
      window.scrollTo({
        top: document.documentElement.scrollHeight,
        behavior: 'smooth'  // Optional: smooth scrolling animation
      });

    }, 400)
  }
  if (loading)
    return <LoadingScreen />
  return (
    <>
      <div className='w-full h-full flex flex-col justify-center items-center'>
        {transition((style, item) =>
          item ? null :
            <>
              <animated.div style={style} className='md:w-[1000px] md:mt-20 mt-[60px] md:rounded-2xl bg-white md:mb-4 shadow-[0_0_10px_0_gray]'>
                <div className=' relative mt-0 z-[1]'>
                  <img src={fImage} alt="" className='w-full md:h-[800px] h-[300px] md:rounded-t-2xl' />
                  {/* <div className='fImageEff'> */}
                  <div className='absolute inset-0 bg-gradient-to-t from-black'>
                    <span className=' inline-block bottom-0 absolute text-white md:mb-20 mb-12 md:text-[40px] text-[16px] font-bold ml-8'>{blog?.title}</span>
                    <span className=' inline-block bottom-0 absolute text-white md:mb-10 mb-6 md:text-[20px] text-[] font-bold ml-8'>{blog?.author}</span>
                    <span className=' inline-block bottom-0 absolute text-white md:mb-2 mb-1 md:text-[16px] text-[] font-bold ml-8'>{blog?.publishedOn}</span>
                  </div>
                </div>
                <div className=' m-8'>
                  {parse(content)}
                </div>
              </animated.div>
              <animated.div style={style} className='md:w-[1000px] w-full md:mt-20 mt-[60px] md:rounded-2xl bg-white md:mb-4 shadow-[0_0_10px_0_gray] flex flex-col items-center'>
                <span className='font-bold text-[30px]'>Comments</span>
                <textarea value={commentV} onChange={event => setCommentV(event.target.value)} type="text" className='w-11/12 m-8 mb-2 mt-2 p-1 bg-[#e9e9e9] outline-none focus:border-b-violet-600 border-2 transition-[0.2s]' placeholder='Your comment...' />
                <button onClick={handleComment} className='cbtn md:w-[100px] w-1/4 outline-none hover:scale-105 active:scale-90 transition-[0.2s] h-[40px] ml-auto md:mr-10 mr-4'>Post</button> <hr className='h-[6px] w-11/12 mt-4 bg-[#e9e9e9]' />
                <div className=' md:w-[920px] w-11/12 ml-20 mr-20 mb-4 flex flex-col items-start'>
                  <CommentSection/>
                {/* {
                  commentsArr.map(c => {
                    // console.log(JSON.parse(c));
                    // c = JSON.parse(c);
                    return (
                      <CommentCard comment={c}/>
                    )
                  })
                } */}

                </div>
              </animated.div>
            </>
        )}
      </div>
      {blog?.userid === userID ?
        <>
          <div onClick={handleEdit} className='fixed mt-auto bottom-20 btnedit ml-auto right-4 h-[40px] w-[40px] bg-violet-600 rounded-full text-white flex items-center justify-center cursor-pointer hover:scale-110 transition-[0.2s]'>
            <MdModeEditOutline className='' />
          </div>
          <div onClick={handleDelete} className='fixed mt-auto bottom-[138px] btndel ml-auto right-4 h-[40px] w-[40px] bg-violet-600 rounded-full text-white flex items-center justify-center cursor-pointer hover:scale-110 transition-[0.2s]'>
            <MdDelete className='' />
          </div>
        </>
        :
        null
      }
    </>
  )
}
