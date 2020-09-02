const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const { check, validationResult } = require('express-validator')

const Profile = require('../../models/Profile')
const User = require('../../models/User')


// @route  GET api/profile/me
// @desc   Get current users profile 
// @access Private, we are getting profile by userId thats in the token so we need auth middleware/ what would be passport.

// Route to get/fetch our profile
// add auth as a second parameter to keep that route protected.
// we add async because we are using mongoose here which returns a promise.
router.get('/me', auth, async (req, res) => {
  try {
    // we have access here to the request, so req.user.id
    // this user will pertain to our Profile model user field which will be the objectId of the user. Set it to user id that comes in with the token.
    // we also want to populate with the name of the user and the avatar but they are in the user model not the profile model
    // use .populate to add that stuff to this query
    const profile = await Profile.findOne({ user: req.user.id }).populate('user', ['name', 'avatar']);

    if(!profile) {
      return res.status(400).json({ msg: 'There is no profile for this user' })
    }
    res.json(profile)
  } catch(err) {
    console.error(err.message)
    res.status(500).send('Server error')
  }
});

// @route  POST api/profile
// @desc   Create or Update user profile
// @access Private
// use auth middleware and validation middleware
router.post('/', [ auth, [
  check('status', 'Status is required').not().isEmpty(),
  check('skills', 'Skills is required').not().isEmpty()
] ], async (req, res) => {
  // check for body errors
  const errors = validationResult(req);
  if(!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() })
  }

  // we want to pull the fields out
  const { 
    company,
    website,
    location,
    bio,
    status,
    githubusername,
    skills,
    youtube,
    facebook,
    twitter,
    instagram,
    linkedin
  } = req.body;
  // need to check if added before we add to database
  // Build profile object

  const profileFields = {};
  // build up profile fields object to inject into database
  // need to see if stuff is actually coming in before we set it
  // will know this already because of token sent
  profileFields.user = req.user.id
  if(company) profileFields.company = company;
  if(website) profileFields.website = website;
  if(location) profileFields.location = location;
  if(bio) profileFields.bio = bio;
  if(status) profileFields.status = status;
  if(githubusername) profileFields.githubusername = githubusername;

  if(skills) {
    profileFields.skills = skills.split(',').map(skill => skill.trim());
  }

  // Build social object
  profileFields.social = {};
  if(youtube) profileFields.youtube = youtube;
  if(twitter) profileFields.twitter = twitter;
  if(facebook) profileFields.facebook = facebook;
  if(linkedin) profileFields.linkedin = linkedin;
  if(instagram) profileFields.instagram = instagram;

  try {
    // user field is the object id that comes from the token!
    // when we use a mongoose method we need to add await to it, since it returns a promise 
    // Look for profile by the user
    let profile = await Profile.findOne({ user: req.user.id })
    // if its found we are gonna update it and send back the profile
    if(profile) {
      // update the profile
      // $set, second parameter is what we want to update
      profile = await Profile.findOneAndUpdate({ user: req.user.id }, { $set: profileFields }, { new: true })
      return res.json(profile)
    }
    // Create a new profile, if no profile is found
    // if not found we are going to create it 
    profile = new Profile(profileFields);
    // save it
    await profile.save();
    // return the profile, send back the profile
    res.json(profile);



  } catch(err) {
    console.error(err.message);
    res.status(500).send('Server error');
  };
});




module.exports = router;