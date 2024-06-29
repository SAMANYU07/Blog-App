import React, { useEffect, useRef, useState } from 'react'
import { MdClose } from "react-icons/md";
import { useDispatch, useSelector } from 'react-redux';
import { useTransition, animated } from 'react-spring';
import { updatecommentsArr } from '../features/authSlice';
import Draggable from 'react-draggable';

export default function CommentCard({comment}) {
  const userID = useSelector(state => state.userID);
  const [c, setC] = useState(JSON.parse(comment));
  const [userComm, setUserComm] = useState(c?.userid === userID ? true : false);
  const [showDel, setShowDel] = useState(false);
  const [resetPos, setResetPos] = useState(false);
  const commentsArr = useSelector(state => state.commentsArr);
  const dispatch = useDispatch();
  const timeRef = useRef(null);
  const transition = useTransition(showDel, {
    config: {duration: 100},
    from: {opacity: 0},
    enter: {opacity: 1},
    leave: {opacity: 0},
  });
  // useEffect(() => {
    // console.log(JSON.parse(comment));
  // }, [])
  const handleDeleteCom = () => {
    let tempArr = commentsArr.filter(comm => JSON.parse(comm).commID !== c.commID);
    dispatch(updatecommentsArr(tempArr));
    console.log(tempArr);
  }
  const handleStart = () => {
    if (timeRef.current) {
      clearTimeout(timeRef.current);
      setResetPos(false);
    }
  }
  const handleStop = () => {
    timeRef.current = setTimeout(() => {
      setResetPos(true);
      console.log("reset...");
      timeRef.current = null;
    }, 3000);
  }
  return (
    <>
    <Draggable axis='x'
    onStart={handleStart}
    onStop={handleStop}
    position={resetPos ? {x: 0, y: 0} : null}
    >
    <div onMouseEnter={() => setShowDel(true)} onMouseLeave={() => setShowDel(false)} className={`flex flex-col mt-4 md:mt-6 w-11/12`}>
      <div className='flex'>
      <span className={`font-bold text-[22px] ${userComm ? " text-violet-600" : null} `}>{c.uname}</span>
      <span className=' text-slate-500 text-[14px] inline-block mt-2 ml-4'>{c.date}</span>
      {userComm && 
      <div onClick={handleDeleteCom} className=' md:hidden absolute ml-[-50px] mt-2 h-[28px] w-[28px] bg-violet-600 rounded-full text-white flex items-center justify-center cursor-pointer hover:scale-110 transition-[0.2s]'>
        <MdClose/>
      </div>
      }
      {userComm && transition((style, showD) => 
      showD ?
      <animated.div style={style} className=' absolute ml-[-34px] mt-2 h-[28px] w-[28px] bg-violet-600 rounded-full text-white flex items-center justify-center cursor-pointer hover:scale-110 transition-[0.2s]'>
        <MdClose onClick={handleDeleteCom} className='' />
      </animated.div>
      :null
      )}
      {/* {userComm && showDel ? */}
      {/* :null} */}
      </div>
      <span className='mt-2 break-words'>{c.comment}</span>
    </div>
    </Draggable>
    </>
  )
}
