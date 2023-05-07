import { userConstants } from '../constants';
import { userService } from '../services';

const login = (username, password) => {
  return async (dispatch) => {
    dispatch({
      type: userConstants.LOGIN_REQUEST,
      username
    });
    userService
      .login(username, password)
      .then(({ data: { data, errors } }) => {
        // console.log(data);
        // console.log(errors);
        if (errors && errors.length > 0) {
          dispatch({
            type: userConstants.LOGIN_FAILURE,
            error: errors[0]
          });
        } else {
          dispatch({
            type: userConstants.LOGIN_SUCCESS,
            user: data.login
          });
        }
      })
      .catch((error) => {
        dispatch({
          type: userConstants.LOGIN_FAILURE,
          error: error?.response?.data
        });
      });
  };
};

const logout = () => {
  userService.logout();
  return { type: userConstants.LOGOUT };
};

const me = () => {
  return async (dispatch) => {
    dispatch({
      type: userConstants.ME_REQUEST
    });
    userService
      .me()
      .then(({ data: { data, errors } }) => {
        // console.log(data);
        // console.log(errors);
        if (errors && errors.length > 0) {
          if (errors.find((error) => error.extensions.code === 'UNAUTHENTICATED')) {
            dispatch(logout());
          }
          dispatch({
            type: userConstants.ME_FAILURE,
            error: errors[0]
          });
        } else {
          dispatch({
            type: userConstants.ME_SUCCESS,
            user: data.me
          });
        }
      })
      .catch((error) => {
        dispatch({
          type: userConstants.ME_FAILURE,
          error: error?.response?.data
        });
      });
  };
};

export const userActions = {
  login,
  logout,
  me
};
