const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const jwt = require('jsonwebtoken');
const config = require('config');
const bcrypt = require('bcryptjs')
const { check, validationResult } = require('express-validator');
const User = require('../../models/User');

// @route  GET api/auth
// @desc   Test route 
// @access Public, no token needed
// router.get('/', (req, res) => res.send('Auth Route'));
// whenever we want to use this middleware we add it as a second parameter like this. Just doing this makes this route protected
router.get('/', auth, async (req, res) => {
    try {
        // we do findbyid from mongoose, since protected route, and we use the token which has the id, and in the middleware we set req.user to the user in the token, we can simple pass req.user, can access it from anywhere in a protected route, but dont want to return the password so we do .select()
        const user = await User.findById(req.user.id).select('-password');
        res.json(user)
    } catch(err) {
      console.error(err.message);
      res.status(500).send('Server error')
    }
});

// @route POST api/auth
// @desc  Authenticate User and Get Token
// @access Public

router.post(
  '/',
  [
  check('email', 'Please include a valid email').isEmail(),
  check('password', 'Password is required').exists()
  ],
  async (req, res) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()) {
      // if information above is not given correctly, we have a bad request
      // errors.array is a method on errors, comes from validationRequest() with the req
      return res.status(400).json({ errors: errors.array() })
    }

    const { email, password } = req.body;

    try {
      // See if user exists
      // let user = await User.findOne({ email: email})
      let user = await User.findOne({ email })
      // if no user we want to send back an error
      if(!user) {
        // If user exists, send back error, can only have 1 email
        return res.status(400).json({ errors: [{ msg: 'Invalid credentials' }] });
      }

      // bcrypt compare method, plaintext and encrypted password and compares to match
      // plain text password, and users password if there is a user
      const isMatch = await bcrypt.compare(password, user.password);

      if(!isMatch) {
        return res.status(400).json({ errors: [{ msg: 'Invalid credentials' }] });
      }

      // Return jsonwebtoken JWT, when user registers we want them to be logged in right away and they need this token for that.
      // get the payload which includes the new user id **********
      const payload = {
        user: {
          // getting id from mongoDB instantiated on save
          id: user.id
        }
      }

      
      // Sign the token, passin the payload, pass in the secret, set expiry and then in callback either get error or get the token
      jwt.sign(
        payload,
        config.get('jwtSecret'),
        { expiresIn: 360000 },
        (err, token) => {
          if (err) throw err;
          res.json({ token })
        });

      // all res require return unless its the last and final one
      // res.send('User registered');
    } catch(err) {
      console.error(err.message);
      res.status(500).send('Server error')
    }
});


module.exports = router;