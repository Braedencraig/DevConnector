import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom';
import { getCurrentProfile } from '../../actions/profile'
import Spinner from '../layout/Spinner';
import DashboardActions from './DashboardActions';
import Experience from './Experience';
import Education from './Education';
import { deleteAccount } from '../../actions/profile';


// destructuring from props, then pulling out further from profile, loading etc, destructuring user from auth, after pulling in auth as props from redux.

const Dashboard = ({ getCurrentProfile, auth: { user }, profile: { profile, loading }, deleteAccount }) => {
  useEffect(() => {
    getCurrentProfile();
  }, [getCurrentProfile])

  return loading && profile === null ?
    <Spinner />
    : 
    <>
      <h1 className="large text-primary">Dashboard</h1>
      <p className="lead">
        <i className="fas fa-user"> Welcome { user && user.name }</i>
      </p>
      {
      profile !== null ? 
       <>
        <DashboardActions />
        <Experience experience={profile.experience} />
        <Education education={profile.education} />

        <div className="my-2">
          <button onClick={() => deleteAccount()} className="btn btn-danger">
            <i className="fas fa-user-minus">
              Delete My Account
            </i>
          </button>
        </div>
       </> :
       <>
        <p>You have not yet setup a profile, please add some info</p>
        <Link to='/create-profile' className="btn btn-primary my-1">
          Create profile
        </Link> 
      </>
      }
    </>
}

Dashboard.propTypes = {
  getCurrentProfile: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  profile: PropTypes.object.isRequired,
  deleteAccount: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  auth: state.auth,
  profile: state.profile
})

export default connect(mapStateToProps, { getCurrentProfile, deleteAccount })(Dashboard);
