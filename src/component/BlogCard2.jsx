import React, { useEffect, useState } from 'react'
import blogService from '../appwrite/PostConfig';
import { Link, useNavigate } from 'react-router-dom';
import { useTransition, animated, useSpring } from 'react-spring';

export default function BlogCard1({ blog }) {
  const [imgFile, setImgFile] = useState(null);
  const [hovering, setHovering] = useState(false);
  const navigate = useNavigate();
  const handleSearchTag = (tag) => {
    const serializedState = JSON.stringify({
      tag: tag,
    });
    navigate("/", { state: serializedState });
  }
  const similarTransition = useTransition(null, {
    from: { x: "300px", opacity: 0 },
    enter: { x: "0px", opacity: 1 },
    leave: { x: "300px", opacity: 0 },
  })
  // const hoverImgTransition = useTransition(null, {
  //   from: {},
  //   enter: {display: "absolute", right: "0", marginLeft: "auto"},
  //   leave: {},
  // })
  const hoverImgTransition = useSpring({
    to: { x: hovering ? "380px" : "0px" },
  })
  const hoverDtTransition = useSpring({
    to: { x: hovering ? "-190px" : "0px" },
  })
  useEffect(() => {
    blogService.getFilePreview(blog?.fImage)
      .then(data => setImgFile(data))
  }, [])
  return (
    <>
      <Link to={`/blog/` + blog.$id}>
        {similarTransition((style, item) =>
          <animated.div style={style} className='blogCard2 w[570px] h-[80%] rounded-lg pb-0 transtion-[0.2s] aniate-bounce blogcaranim' onMouseEnter={() => setHovering(true)} onMouseLeave={() => setHovering(false)}>
            <div className='grid grid-flow-col grid-cols-6 blogCard2_content'>
              <div className='w-[280x] h[130px] col-span-2'>
                <img src={imgFile} alt="" className='w[280x] w-full h[70%] h-full' />
              </div>
              <div className='ml-2 col-span-4'>
                <span className={`font-bold text-[18px] transition-[0.2s] ${hovering ? "text-white" : "text-black"}`}>{blog?.title.length > 18 ? blog?.title.slice(0, 18) + "..." : blog?.title}</span> <br />
                <span className={`${hovering ? "text-white" : "text-gray-700"}`}>{blog?.author}</span> <br />
                <span className={`${hovering ? "text-white" : "text-gray-700"}`}>{blog?.publishedOn}</span> <br />
                {/* <div className='flex gap-x-2 w-full flex-wrap gap-y-1'>
            {
              blog?.tags?.map(tag => {
                return (<span onClick={() => handleSearchTag(tag)}  className='border-2 border-gray-700 text-gray-700 rounded-md pl-1 pr-1 text-[13px] cursor-pointer'>{tag}</span>)
              })
            }
          </div> */}
              </div>
            </div>
          </animated.div>
        )}
      </Link>
    </>
  )
}