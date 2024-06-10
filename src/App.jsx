import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import { Route, RouterProvider, createBrowserRouter, createRoutesFromElements } from 'react-router-dom';
import Layout from './Layout';
import Home from './component/Home';
import NewBlog from './component/NewBlog';
import BlogPage from './component/BlogPage';
import MyPostsPage from './component/MyPostsPage';
// import './App.css'

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route element={<Layout/>} path='/'>
      <Route element={<Home/>} path=''/>
      <Route element={<NewBlog/>} path='/newblog'></Route>
      <Route element={<BlogPage/>} path='/blog/:blog_id'></Route>
      <Route element={<MyPostsPage/>} path='/myposts'></Route>
    </Route>
  )
)

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <RouterProvider router={router}/>
    </>
  )
}

export default App
