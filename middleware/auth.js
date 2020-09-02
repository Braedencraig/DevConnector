// register user and get json webtoken back that has user id payload, so now we need to send that token back to authenticate an access protected route by creating own custom middleware PASSPORT DOES THIS, but its heavy....
const jwt = require('jsonwebtoken');
const config = require('config');
// we are exporting a middleware function, it will take request, response and next
// middleware function basically has access to the request/response cycle, next is callback we have to run once we are done so we move on to next piece of middleware

// Exporting a middleware function that has the request response object available to it*********
module.exports = function(req, res, next) {
// Get token from the header
  const token = req.header('x-auth-token');

  // Check if no token
  if(!token) {
    // not authorized
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  // Verify token if there is one
  try {
    // need to decode the token
    // takes token, sent in header, and the secret from our config, decodes it with nwt.verify
    const decoded = jwt.verify(token, config.get('jwtSecret'));
    // take the request object and assign a value to user, set req.user, with user from the payload.
    req.user = decoded.user
    // then call next like you would with any middleware
    next();

  } catch(err) {
    // runs if token is not valid
    res.status(401).json({ msg: 'Token is not valid' })
  }
}
// now need to implement this into a protected route