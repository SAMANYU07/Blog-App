import React, { useState } from 'react'
import dogImg from "../img/dog1.png";
import notpad1 from "../img/notepad1.png";
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toggleGuestUser, toggleUserLoggedIn } from '../features/authSlice';
import { useTransition, animated } from 'react-spring';

export default function NoPostsScreen({
  logInToView = false,
  noMyPosts = false,
  noFavoritesPosts = false,
  noResults = false,
}) {
  const [message, setMessage] = useState(() => {
    switch (true) {
      case logInToView:
        return "Login to view posts";
      case noFavoritesPosts:
        return "Your saved posts will appear here";
      case noMyPosts:
        return "Your posts will appear here";
      case noResults:
        return "No Results";
      default:
        return "Login to view posts";
    }
  })
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const guestUser = useSelector(state => state.guestUser);
  const imgTransition = useTransition(null, {
    from: {opacity: 0},
    enter: {opacity: 1},
    leave: {opacity: 0},
  });
  const handleRedirecttoLogin = () => {
    dispatch(toggleUserLoggedIn(false));
    dispatch(toggleGuestUser(false));
    navigate("/");
  }
  return (
    <>
    {imgTransition((style, show) =>
      <animated.div style={style} className=' h-screen w-screen flex flex-col justify-center items-center'>
        <img src={dogImg} alt="" className='h-96' />
        <span> {message} </span>
        <button onClick={handleRedirecttoLogin}
          className={`mt-2 h-10 w-24 text-violet-600 border-2 border-violet-600 rounded-lg loginbtn active:scale-90 transition-[0.2s] outline-none ${guestUser && !noResults ? "" : "hidden"}`}
        >Login</button>
      </animated.div>
    )}
    </>
  )
}
