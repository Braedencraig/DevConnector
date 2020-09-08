import axios from 'axios';

// Adding a global header
// when we have a token , we are going to send it with every request
const setAuthToken = token => {
  if(token) {
    axios.defaults.headers.common['x-auth-token'] = token;
  } else {
    delete axios.defaults.headers.common['x-auth-token'];
  }
}

export default setAuthToken;