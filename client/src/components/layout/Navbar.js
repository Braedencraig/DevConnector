import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { logout } from '../../actions/auth';
// import { AUTH_ERROR } from '../../actions/types';
// destructuring all from props given by redux
const Navbar = ({ auth: { isAuthenticated, loading }, logout }) => {

  const authLinks = (
    <ul>
      {/* should make to a with href */}
      <li>
        <Link onClick={logout} to='/'>
          <i className="fas fa-sign-out-alt"></i>{' '}
          <span className="hide-sm">Logout</span>
        </Link>
      </li>
    </ul>
  );

  const guestLinks = (
    <ul>
      <li><Link to='/'>Developers</Link></li>
      <li><Link to='/register'>Register</Link></li>
      <li><Link to='/login'>Login</Link></li>
    </ul>
  );
    return (
        <nav className="navbar bg-dark">
        <h1>
          <Link to='/'>
            <i className="fas fa-code" /> DevConnector
          </Link>
        </h1>
    { !loading && (<>{isAuthenticated ? authLinks : guestLinks}</>)}
      </nav>
    )
}

Navbar.propTypes = {
  logout: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
  auth: state.auth
})

export default connect(mapStateToProps, { logout })(Navbar);