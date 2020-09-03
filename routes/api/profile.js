const express = require('express');
const router = express.Router();
const request = require('request')
const config = require('config')
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
  if(youtube) profileFields.social.youtube = youtube;
  if(twitter) profileFields.social.twitter = twitter;
  if(facebook) profileFields.social.facebook = facebook;
  if(linkedin) profileFields.social.linkedin = linkedin;
  if(instagram) profileFields.social.instagram = instagram;

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


// @route  GET api/profile
// @desc   Get all profiles
// @access public
router.get('/', async (req, res) => {
  try {
    // use populate to get users names and avatars, which are part of the user model. Populate from the user collection.
    const profiles = await Profile.find().populate('user', ['name', 'avatar']);
    res.json(profiles)
  } catch(err) {
    console.error(err.message)
    res.status(500).send('Server Error')
  }
});

// @route  GET api/profile/user/:user_id
// @desc   Get profile by user ID
// @access public
// Put : because its a placeholder
router.get('/user/:user_id', async (req, res) => {
  try {
    // use populate to get users names and avatars, which are part of the user model. Populate from the user collection.
    const profile = await Profile.findOne({ user: req.params.user_id }).populate('user', ['name', 'avatar']);

    if(!profile) {
      return res.status(400).json({ msg: 'Profile not found'})
    }
    res.json(profile)
    
  } catch(err) {
    console.error(err.message)
    if(err.kind == 'ObjectId') {
      return res.status(400).json({ msg: 'Profile not found'})
    }
    res.status(500).send('Server Error')
  }
});

// @route  DELETE api/profile
// @desc   Delete profile, user and posts
// @access private
// add auth middleware since its private, we have access to the token

router.delete('/', auth, async (req, res) => {
  try {
    // @todo - remove users posts
    // use populate to get users names and avatars, which are part of the user model. Populate from the user collection.
    // Remove profile
    await Profile.findOneAndRemove({ user: req.user.id })
    // Remove user
    await User.findOneAndRemove({ _id: req.user.id })

    res.json({ msg: 'User has been removed' })
  } catch(err) {
    console.error(err.message)
    res.status(500).send('Server Error')
  }
});


// @route  PUT api/profile/experience
// @desc   Add profile experience
// @access private

// put used to update data, could consider it a post, aka adding a resource, but put because we are updating part of a profile
router.put('/experience', [auth, [
  check('title', 'Title is required').not().isEmpty(),
  check('company', 'Company is required').not().isEmpty(),
  check('from', 'From date is required').not().isEmpty()
]], async (req, res) => {
  const errors = validationResult(req);
  if(!errors.isEmpty()) {
    // Will get us that much needed sweet array of errors
    return res.status(400).json({ errors: errors.array() })
  }

  const { title, company, location, from, to, current, description } = req.body;

  // const newExperience = { 
  //   title: title,
  //   company: company,
  //   location: location,
  //   from: from,
  //   to: to,
  //   current: current,
  //   description: description 
  // }
  // create object with data user submits
  const newExperience = { title, company, location, from, to, current, description }
  try {
    const profile = await Profile.findOne({ user: req.user.id })
    profile.experience.unshift(newExperience)
    await profile.save()
    res.json(profile)
  } catch (err) {
    console.error(err.message)
    res.status(500).send('Server error')
  }
})


// @route  DELETE api/profile/experience/:exp_id
// could be a put because we are updating, but delete request because something is being removed.
// @desc   delete experience from profile
// @access private
router.delete('/experience/:exp_id', auth, async (req, res) => {
  try {
    // get profile by user id of logged in user
    const profile = await Profile.findOne({ user: req.user.id })
    // get correct experience to remove
    // get index of one we want to  remove
    const removeIndex = profile.experience.map(item => item.id).indexOf(req.params.exp_id);
    // want to take something out of the array and we want to take out 1 and we have the index
    profile.experience.splice(removeIndex, 1)
    // save it and send back response
    await profile.save()
    res.json(profile)
  } catch(err) {
    console.error(err.message)
    res.status(500).send('Server Error')
  }
})






// @route  PUT api/profile/education
// @desc   Add profile education
// @access private

// put used to update data, could consider it a post, aka adding a resource, but put because we are updating part of a profile
router.put('/education', [auth, [
  check('school', 'School is required').not().isEmpty(),
  check('degree', 'Degree is required').not().isEmpty(),
  check('fieldofstudy', 'Field of study is required').not().isEmpty(),
  check('from', 'From date is required').not().isEmpty()
]], async (req, res) => {
  const errors = validationResult(req);
  if(!errors.isEmpty()) {
    // Will get us that much needed sweet array of errors
    return res.status(400).json({ errors: errors.array() })
  }
// pull out of req.body, destructure
  const { school, degree, fieldofstudy, from, to, current, description } = req.body;
// add to newExperience object
  const newEducation = { school, degree, fieldofstudy, from, to, current, description }
  try {
    const profile = await Profile.findOne({ user: req.user.id })
    profile.education.unshift(newEducation)
    await profile.save()
    res.json(profile)
  } catch (err) {
    console.error(err.message)
    res.status(500).send('Server error')
  }
})


// @route  DELETE api/profile/education/:edu_id
// could be a put because we are updating, but delete request because something is being removed.
// @desc   delete education from profile
// @access private
router.delete('/education/:edu_id', auth, async (req, res) => {
  try {
    // get profile by user id of logged in user
    const profile = await Profile.findOne({ user: req.user.id })
    // get correct education to remove
    // get index of one we want to  remove
    const removeIndex = profile.education.map(item => item.id).indexOf(req.params.edu_id);
    // want to take something out of the array and we want to take out 1 and we have the index
    profile.education.splice(removeIndex, 1)
    // save it and send back response
    await profile.save()
    res.json(profile)
  } catch(err) {
    console.error(err.message)
    res.status(500).send('Server Error')
  }
})


// @route GET api/profile/github/:username
// @desc  get user repos from Github
// @access public
router.get('/github/:username', (req, res) => {
  try {
    const options = {
      uri: `https://api.github.com/users/${req.params.username}/repos?per_page=5&sort=created:asc&client_id=${config.get('githubClientID')}&client_secret=${config.get('githubSecret')}`,
      method: 'GET',
      headers: { 'user-agent': 'node.js' }
    };
    
    request(options, (error, response, body) => {
      if(error) console.error(error);
      if(response.statusCode !== 200) {
        res.status(404).json({ msg: 'No Github profile found'})
      }
      res.json(JSON.parse(body))

      
    })
  } catch (err) {
    console.error(err.message)
    res.status(500).send('Server Error')
  }
})




module.exports = router;