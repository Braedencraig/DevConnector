import {
  GET_POSTS,
  POST_ERROR,
  UPDATE_LIKES,
  DELETE_POST,
  ADD_POST,
  GET_POST,
  ADD_COMMENT,
  REMOVE_COMMENT
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
    case GET_POST:
      return {
        ...state,
        post: payload,
        loading: false
      }
    case ADD_POST:
      return {
        ...state,
        // current array, make a copy of it, and add new post to it, which is in the payload
        posts: [payload, ...state.posts],
        loading: false
      }
    case POST_ERROR: 
      return {
        ...state,
        error: payload,
        loading: false
      }
    case DELETE_POST:
      return {
        ...state,
        loading: false,
        // returning all posts excpet for the one that matches here
        posts: state.posts.filter(post => post._id !== payload)
      }
    case UPDATE_LIKES:
      return {
        ...state,
        // map thru posts, for each post check to see if its correct one, and if it is we want to return new state, and manipulate likes to likes that are returned, whether added or removed, return array of likes and if it doesnt match id then return the post, do nothing..
        posts: state.posts.map(post => post._id === payload.postId ? { ...post, likes: payload.likes } : post),
        loading: false
      }
    case ADD_COMMENT:
      return {
        ...state,
        // single post, its an object, we want whats in it currently ...state.post, and we want to manipulate comments, comments: payload.
        post: { ...state.post, comments: payload },
        loading: false
      }
    case REMOVE_COMMENT:
      return {
        ...state,
        post: { 
          ...state, 
          // Bring in all comments excpet for the one with this id, because we want it gone
          comments: state.post.comments.filter(comment => comment._id !== payload)
        },
        loading: false
      }
    default: 
    return state
  }
}