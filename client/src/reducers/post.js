import {
  GET_POSTS,
  POST_ERROR,
  UPDATE_LIKES
} from '../actions/types';

const initialState = {
  posts: [],
  post: null,
  loading: true,
  error: {}
}

export default function(state = initialState, action) {
  const { type, payload } = action;
  switch(type) {
    case GET_POSTS:
      return {
        ...state,
        posts: payload,
        loading: false
      }
    case POST_ERROR: 
      return {
        ...state,
        error: payload,
        loading: false
      }
    case UPDATE_LIKES:
      return {
        ...state,
        // map thru posts, for each post check to see if its correct one, and if it is we want to return new state, and manipulate likes to likes that are returned, whether added or removed, return array of likes and if it doesnt match id then return the post, do nothing..
        posts: state.posts.map(post => post._id === payload.postId ? { ...post, likes: payload.likes } : post),
        loading: false
      }
    default: 
    return state
  }
}