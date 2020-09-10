import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { getPosts } from '../../actions/post'
import Spinner from '../layout/Spinner'

const Post = ({ post: { posts, loading }, getPosts }) => {
  useEffect(() => {
    getPosts()
  }, [getPosts])
  return (
    <div>
      
    </div>
  )
}

Post.propTypes = {
  getPosts: PropTypes.func.isRequired,
  post: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
  post: state.post
})

export default connect(mapStateToProps, { getPosts })(Post)
