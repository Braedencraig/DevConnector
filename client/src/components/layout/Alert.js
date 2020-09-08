import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';


const Alert = ({ alerts }) => alerts !== null && alerts.length > 0 && alerts.map(alert => (
  <div className={`alert alert-${alert.alertType}`} key={alert.id}>
    { alert.msg }
  </div>
));

Alert.propTypes = {
  alerts: PropTypes.array.isRequired,
}

const mapStateToProps = state => ({
  // alert is coming from the root reducer
  alerts: state.alert
})

// no action we want to call here, so it is not passed in in the connect, like null in register

export default connect(mapStateToProps)(Alert)
