import { orderConstants } from '../constants';

export function orders(state = {}, action) {
  switch (action.type) {
    case orderConstants.GETALL_REQUEST:
      return {
        loading: true
      };
    case orderConstants.GETALL_SUCCESS:
      return {
        items: action.orders
      };
    case orderConstants.GETALL_FAILURE:
      return {
        error: action.error
      };
    default:
      return state;
  }
}
