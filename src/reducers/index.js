import { combineReducers } from 'redux';
import { user } from './user.reducer';
import { auth } from './auth.reducer';
import { orders } from './order.reducer';
import { layout } from './layout.reducer';

export default combineReducers({
  user,
  auth,
  orders,
  layout
});
