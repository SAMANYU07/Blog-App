import React from 'react'
import { useSelector } from 'react-redux'
import CommentCard from './CommentCard';

export default function CommentSection() {
  const commentsArr = useSelector(state => state.commentsArr);
  return (
    <>
      {
        commentsArr.map(c => {
          return (
            <CommentCard key={JSON.parse(c).commID} comment={c} />
          )
        })
      }
    </>
  )
}
