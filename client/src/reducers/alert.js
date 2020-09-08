import { SET_ALERT, REMOVE_ALERT } from '../actions/types.js'

const initialState = [];

export default function(state = initialState, action) {
  const { type, payload } = action;

  switch(type) {
    case SET_ALERT:
      // state is immutable so we are going to spread into it to include any other state that is there, copy and add alert.
      return [...state, payload];
    case REMOVE_ALERT:
      return state.filter(alert => alert.id !== payload);
    default:
      return state;
  }
}