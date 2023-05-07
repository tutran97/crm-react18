import { Navigate, Outlet } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { userActions } from '../actions';

export const PrivateRoute = ({ user }) => {
  const dispatch = useDispatch();
  if (!user?.token) {
    return <Navigate to="/login" replace />;
  }
  dispatch(userActions.me());

  return <Outlet />;
};

PrivateRoute.propTypes = {
  user: PropTypes.shape({
    token: PropTypes.string
  })
};
