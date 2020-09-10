import axios from 'axios';
import { setAlert } from './alert';
import { 
  GET_POSTS,
  POST_ERROR,
  UPDATE_LIKES,
  DELETE_POST,
  ADD_POST,
  GET_POST,
  ADD_COMMENT,
  REMOVE_COMMENT
} from './types';

// Get posts
export const getPosts = () => async dispatch => {
  try {
    const res = await axios.get('/api/posts');
    // This will get the posts and put it into the state
    dispatch({
      type: GET_POSTS,
      payload: res.data
    })
  } catch (err) {
    dispatch({
      type: POST_ERROR,
      payload: {
        msg: err.response.statusText, 
        status: err.response.status
      }
    })
  }
}

// Get post
export const getPost = (id) => async dispatch => {
  try {
    const res = await axios.get(`/api/posts/${id}`);
    // This will get the posts and put it into the state
    dispatch({
      type: GET_POST,
      payload: res.data
    })
  } catch (err) {
    dispatch({
      type: POST_ERROR,
      payload: {
        msg: err.response.statusText, 
        status: err.response.status
      }
    })
  }
}


// add like
export const addLike = (postId) => async dispatch => {
  try {
    const res = await axios.put(`/api/posts/like/${postId}`);
    // This will get the posts and put it into the state
    dispatch({
      type: UPDATE_LIKES,
      payload: { postId, likes: res.data  }
    })
  } catch (err) {
    dispatch({
      type: POST_ERROR,
      payload: {
        msg: err.response.statusText, 
        status: err.response.status
      }
    })
  }
}

// remove like
export const removeLike = (postId) => async dispatch => {
  try {
    const res = await axios.put(`/api/posts/unlike/${postId}`);
    // This will get the posts and put it into the state
    dispatch({
      type: UPDATE_LIKES,
      payload: { postId, likes: res.data  }
    })
  } catch (err) {
    dispatch({
      type: POST_ERROR,
      payload: {
        msg: err.response.statusText, 
        status: err.response.status
      }
    })
  }
}

// delete post
export const deletePost = (postId) => async dispatch => {
  try {
    await axios.delete(`/api/posts/${postId}`);
    
    dispatch({
      type: DELETE_POST,
      payload: postId
    })
    dispatch(setAlert('Post has been removed', 'success'))
  } catch (err) {
    dispatch({
      type: POST_ERROR,
      payload: {
        msg: err.response.statusText, 
        status: err.response.status
      }
    })
  }
}

// add post
export const addPost = (formData) => async dispatch => {
  // need config because we are sending data
  const config = {
    headers: {
      'Content-Type': 'application/json'
    }
  }

  try {
    const res = await axios.post(`/api/posts`, formData, config);
    
    dispatch({
      type: ADD_POST,
      // this will be the post
      payload: res.data
    })
    dispatch(setAlert('Post created', 'success'))
  } catch (err) {
    dispatch({
      type: POST_ERROR,
      payload: {
        msg: err.response.statusText, 
        status: err.response.status
      }
    })
  }
}

// add comment
export const addComment = (postId, formData) => async dispatch => {
  // need config because we are sending data
  const config = {
    headers: {
      'Content-Type': 'application/json'
    }
  }

  try {
    const res = await axios.post(`/api/posts/comment/${postId}`, formData, config);
    
    dispatch({
      type: ADD_COMMENT,
      // this will be the post
      payload: res.data
    })
    dispatch(setAlert('Comment added', 'success'))
  } catch (err) {
    dispatch({
      type: POST_ERROR,
      payload: {
        msg: err.response.statusText, 
        status: err.response.status
      }
    })
  }
}

// delete comment
export const deleteComment = (postId, commentId) => async dispatch => {
  try {
    await axios.delete(`/api/posts/comment/${postId}/${commentId}`);
    
    dispatch({
      type: REMOVE_COMMENT,
      payload: commentId
    })
    dispatch(setAlert('Comment removed', 'success'))
  } catch (err) {
    dispatch({
      type: POST_ERROR,
      payload: {
        msg: err.response.statusText, 
        status: err.response.status
      }
    })
  }
}