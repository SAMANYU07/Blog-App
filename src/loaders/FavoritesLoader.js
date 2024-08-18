import blogService from '../appwrite/PostConfig';
import { toggleLoading, toggleSearching } from '../features/authSlice';
import store from '../Store/store';

export const fetchFavorites = async ({params}) => {
  store.dispatch(toggleSearching(true));
  const {user_id} = params;
  if (user_id === "0")
    return [];
  let tempBlogsID = [];
  await blogService.getAllFavorites()
  .then(data => {
    data.documents?.map(fav => {
      if (fav?.userid === user_id)
        tempBlogsID = fav?.fBlogs;
    })
  })
  .catch(error => {
    console.log("Favorites fetching error: ", error.message);
  });
  return tempBlogsID;
}