const express = require('express');
const router = express.Router();
const gravatar = require('gravatar')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const config = require('config')
const { check, validationResult } = require('express-validator');

const User = require('../../models/User')


// @route  POST api/users
// @desc   Register user 
// @access Public, no token needed

// api/users in server app.use pertains to this slash below
// if we wanted api/users/register for example, we would add /register here

// want to send user data to this route.
// We need a username and password to register a user
router.post(
  '/',
  [
  check('name', 'Name is required').not().isEmpty(),
  check('email', 'Please include a valid email').isEmail(),
  check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 })
  ],
  async (req, res) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()) {
      // if information above is not given correctly, we have a bad request
      // errors.array is a method on errors, comes from validationRequest() with the req
      return res.status(400).json({ errors: errors.array() })
    }

    const { name, email, password } = req.body;

    try {
      // See if user exists
      // let user = await User.findOne({ email: email})
      let user = await User.findOne({ email })
      if(user) {
        // If user exists, send back error, can only have 1 email
        return res.status(400).json({ errors: [{msg: 'User already exists'}] });
      }
      // If user not found/new user
      // Get users gravatar based on email, to be part of user registration, s size 200, r rating pg, d default mm default image user icon
      const avatar = gravatar.url(email, {
        s: '200',
        r: 'pg',
        d: 'mm'
      })

      // user = new User({
      //   name: name,
      //   email: email,
      //   avatar: avatar,
      //   password: password
      // })
      // Create the new User********
      user = new User({
        name,
        email,
        avatar,
        password
      })

      // Encrypt password using bCrypt
      // Hash the password*******
      // create a salt, to do the hashing with...genSalt, pass 10 "rounds", more you have the more secure it is
      const salt = await bcrypt.genSalt(10);
      // takes plain text password, and the salt, makes a hash and puts it into the user password
      user.password = await bcrypt.hash(password, salt);
      // anything that returns a promise, you make sure you put await in front of
      // Save user into the database*********
      await user.save();

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