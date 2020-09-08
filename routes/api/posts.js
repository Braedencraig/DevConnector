const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const { check, validationResult } = require('express-validator')

const Profile = require('../../models/Profile')
const User = require('../../models/User')
const Post = require('../../models/Post')


// @route  POST api/posts
// @desc   Create a post
// @access Private, must be logged in to create a post
router.post('/', [ auth, [
  check('text', 'Text is required').not().isEmpty()
  ] ], async (req, res) => {
  
    const errors = validationResult(req)
    if(!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() })
    }

    try {
      // we are doing this to get name, avatar and user itself
      // will give us the user minus the password e.g. .select
      const user = await User.findById(req.user.id).select('-password');

      const newPost = new Post({
        // comes from user input, e.g. model text
        text: req.body.text,
        name: user.name,
        avatar: user.avatar,
        // we just need the ObjectId here
        user: req.user.id
      })
      // save that in variable and send as response
      const post = await newPost.save();
      // send in response
      res.json(post)

    } catch (err) {
      console.error(err.message)
      res.status(500).send('Server error')
    }
});


// @route  GET api/posts
// @desc   Get all posts
// @access private, could be public
// profiles are public, posts are not, we want people to sign up to communicate with others

router.get('/', auth, async (req,res) => {
  try {
    // use populate to get users names and avatars, which are part of the user model. Populate from the user collection.
    const posts = await Post.find().sort({ date: -1 });
    res.json(posts)
  } catch(err) {
    console.error(err.message)
    res.status(500).send('Server Error')
  }
});

// @route  GET api/posts/:id
// @desc   Get post by ID
// @access private
// profiles are public, posts are not, we want people to sign up to communicate with others

router.get('/:id', auth, async (req,res) => {
  try {
    const post = await Post.findById(req.params.id)

    if(!post) {
      return res.status(404).json({ msg: 'Post not found' })
    }

    res.json(post)
  } catch(err) {
    console.error(err.message)
    if(err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Post not found' })
    }
    res.status(500).send('Server Error')
  }
});

// @route  DELETE api/posts/:id
// @desc   Delete a post
// @access private

router.delete('/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)

    if(!post) {
      return res.status(404).json({ msg: 'Post not found' })
    }

    // Check user to make sure they can delete their post
    // one is string, one is object id
    if(post.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' })
    }

    await post.remove()
    res.json({ msg: 'Post has been removed' })

  } catch(err) {
    console.error(err.message)
    if(err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Post not found' })
    }
    res.status(500).send('Server Error')
  }
});


// @route  PUT api/posts/like/:id
// @desc   Like a post
// @access private

router.put('/like/:id', auth, async(req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    // check if the post has already been liked by this user. already a like by this user
    if(post.likes.filter(like => like.user.toString() === req.user.id).length > 0) {
      return res.status(400).json({ msg: 'Post has already been liked' })
    }
    post.likes.unshift({ user: req.user.id })
    await post.save();
    res.json(post.likes)

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error')
  }
});

// @route  PUT api/posts/unlike/:id
// @desc   unlike a post
// @access private

router.put('/unlike/:id', auth, async(req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    // if equal to 0 means we havent liked it yet
    if(post.likes.filter(like => like.user.toString() === req.user.id).length === 0) {
      return res.status(400).json({ msg: 'Has not yet been liked' })
    }
    // get removed index
    const removeIndex = post.likes.map(like => like.user.toString()).indexOf(req.user.id)
    post.likes.splice(removeIndex, 1)
    await post.save()
    res.json(post.likes)

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error')
  }
});

// @route  POST api/posts/comment/:id
// @desc   Comment on a post
// @access Private, 
router.post('/comment/:id', [ auth, [
  check('text', 'Text is required').not().isEmpty()
  ] ], async (req, res) => {
  
    const errors = validationResult(req)
    if(!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() })
    }

    try {
      // we are doing this to get name, avatar and user itself
      // will give us the user minus the password e.g. .select
      const user = await User.findById(req.user.id).select('-password');

      const post = await Post.findById(req.params.id)

      const newComment = {
        text: req.body.text,
        name: user.name,
        avatar: user.avatar,
        user: req.user.id
      };

      post.comments.unshift(newComment)

      await post.save()
      res.json(post.comments)

    } catch (err) {
      console.error(err.message)
      res.status(500).send('Server error')
    }
});

// @route  DELETE api/posts/comment/:id/:comment_id
// @desc   Delete a comment
// @access Private, 

router.delete('/comment/:id/:comment_id', auth, async (req, res) => {
  
    const errors = validationResult(req)
    if(!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    try {
      const post = await Post.findById(req.params.id)
      // Pull out comment from post
      const comment = post.comments.find(comment => comment.id === req.params.comment_id)
      // Will either give us the comment if it exists or false
      // Make sure comment exists
      if(!comment) {
        return res.status(404).json({ msg: "Comment does not exists" })
      }
      // Check user to make sure they made the comment to delete
      // req.user.id, logged in user when using auth middelware in private route
      if(comment.user.toString() !== req.user.id) {
        return res.status(401).json({ msg: "User not authorized" })
      }

      const removeIndex = post.comments.map(comment => comment.user.toString()).indexOf(req.user.id)
      post.comments.splice(removeIndex, 1)
      await post.save()
      res.json(post.comments)


     

      
      
    } catch (err) {
      console.error(err.message)
      res.status(500).send('Server error')
    }
});

module.exports = router;