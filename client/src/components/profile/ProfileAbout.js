import React from 'react'
import PropTypes from 'prop-types'

const ProfileAbout = ({ profile: {
  bio,
  skills,
  user: {
    name
  }
}}) => {
  return (
    <div class="profile-about bg-light p-2">
      {bio && (
        <>
          <h2 class="text-primary">{name}s Bio</h2>
          <p>
            {bio}
          </p>
          <div class="line"></div>
        </>
      )}
      <h2 class="text-primary">Skill Set</h2>
      <div class="skills">
        {
          skills.map((skill, i) => (<div key={i} class="p-1"><i class="fa fa-check"></i> {skill}</div>))
        }
      </div>
    </div>
  )
}

ProfileAbout.propTypes = {
  profile: PropTypes.object.isRequired
}

export default ProfileAbout