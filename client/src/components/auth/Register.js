import React, { useState } from 'react';
// import axios from 'axios';
import { connect } from 'react-redux';
import { Link, Redirect } from 'react-router-dom';
import { setAlert } from '../../actions/alert';
import { register } from '../../actions/auth';
import PropTypes from 'prop-types';


const Register = ({ setAlert, register, isAuthenticated }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password2: ''
  });

  const { name, email, password, password2 } = formData;
  // copy of formData with ..., change only name to value of the input. Tasty way to update all inputs state
  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value })
  const onSubmit = async e => {
    e.preventDefault();
    if(password !== password2) {
      // Destructured from props
      setAlert('Your passwords arent matching!', 'danger')
    } else {
      // can access these because we are pulling them out from the component state, the form data
      register({ name, email, password });
      // TO DO HANDLE THIS BY A REDUX ACTION, but example of how it could be done otherwise for my reference
      // // again, same as name: name, etc...
      // const newUser = {name, email, password, password2 };
      // try {
      //   const config = {
      //     headers: {
      //       'Content-Type': 'application/json'
      //     }
      //   }
      //   // Body to send
      //   const body = JSON.stringify(newUser);
      //   // axios returns a promise, making post request, route we are hitting is api/users, sending name email and password and should add to database and return a token to us! can do /api/users because we added the proxy, so hitting 5000 from 3000 and second parameter is the data, e.g. body, third is the config that has the header value and the content type, console.log res.data which should be the token
      //   const res = await axios.post('/api/users', body, config)
      //   console.log(res.data)
      // } catch (err) {
      //   console.error(err.response.data)
      // }

    }
  }

  if(isAuthenticated) {
    return <Redirect to="/dashboard" />
  }

  return (
    <>
      <h1 className="large text-primary">Sign Up</h1>
      <p className="lead"><i className="fas fa-user"></i> Create Your Account</p>
      <form className="form" onSubmit={e => onSubmit(e)}>
        <div className="form-group">
          <input 
            type="text"
            placeholder="Name"
            name="name"
            value={name}
            // onChange={e => setFormData({ name: e.target.value })}
            onChange={ e => onChange(e)}
          />
        </div>
        <div className="form-group">
          <input 
            type="email"
            placeholder="Email Address"
            name="email"
            value={email}
            onChange={ e => onChange(e)}
          />
          <small className="form-text"
            >This site uses Gravatar so if you want a profile image, use a
            Gravatar email</small
          >
        </div>
        <div className="form-group">
          <input
            type="password"
            placeholder="Password"
            name="password"
            minLength="6"
            value={password}
            onChange={ e => onChange(e)}
          />
        </div>
        <div className="form-group">
          <input
            type="password"
            placeholder="Confirm Password"
            name="password2"
            minLength="6"
            value={password2}
            onChange={ e => onChange(e)}
          />
        </div>
        <input type="submit" className="btn btn-primary" value="Register" />
      </form>
      <p className="my-1">
      Already have an account? <Link to="/login">Sign In</Link>
      </p>
    </>
  )
};
Register.propTypes = {
  setAlert: PropTypes.func.isRequired,
  register: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool
}

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated
});

export default connect(mapStateToProps, { setAlert, register })(Register)