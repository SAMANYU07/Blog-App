import React from 'react';
import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import { Route, RouterProvider, createBrowserRouter, createRoutesFromElements } from 'react-router-dom';
import Layout from './Layout';
import Home from './component/Home';
import NewBlog from './component/NewBlog';
import BlogPage from './component/BlogPage';
// import MyPostsPage from './component/MyPostsPage';
// import FavoritesPage, { fetchFavorites } from './component/FavoritesPage';
import LoadingScreen from './component/LoadingScreen';
import { fetchMyPosts } from './loaders/MyPostsLoader';
import { fetchFavorites } from './loaders/FavoritesLoader';
const LazyMyPostsPage = React.lazy(() => import("./component/MyPostsPage"));
const LazyFavoritesPage = React.lazy(() => import("./component/FavoritesPage"));
// import './App.css'

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route element={<Layout />} path='/'>
      <Route element={<Home />} path='' />
      <Route element={<NewBlog />} path='/newblog'></Route>
      <Route element={<BlogPage />} path='/blog/:blog_id'></Route>
      {/* <Route element={<MyPostsPage/>} path='/myposts'></Route> */}
      <Route element={
        <React.Suspense fallback={<LoadingScreen lheight='h-full' lwidth='w-full' aheight='h-full' awidth='w-full' />}>
          <LazyMyPostsPage />
        </React.Suspense>
      }
        path='/myposts/:user_id'
        loader={fetchMyPosts}></Route>
      <Route element={
        <React.Suspense fallback={<LoadingScreen lheight='h-full' lwidth='w-full' aheight='h-full' awidth='w-full' />}>
          <LazyFavoritesPage />
        </React.Suspense>
      }
        path='/favorites/:user_id'
        loader={fetchFavorites}></Route>
    </Route>
  )
)

function App() {
  const [count, setCount] = useState(0)
  useEffect(() => {
    window.addEventListener("beforeunload", () => { authService.logoutAccount() });
  }, [])

  return (
    <>
      <RouterProvider router={router} />
    </>
  )
}

export default App
