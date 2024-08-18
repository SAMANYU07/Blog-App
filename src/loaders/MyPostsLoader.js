import blogService from '../appwrite/PostConfig';
import { toggleGuestUser, toggleSearching, toggleUserLoggedIn } from '../features/authSlice';
import store from "../Store/store";

export const fetchMyPosts = async ({params}) => {
  store.dispatch(toggleSearching(true));
  const {user_id} = params;
  if (user_id === "0")
    return [];
  let tempBlogs =[];
  await blogService.getAllBlogs()
  .then(data => {
    tempBlogs = data.documents?.filter(blog => blog.userid === user_id);
  })
  .catch(error => {
    console.log("MyPosts fetching error: ", error.message);
  });
  return tempBlogs;
}