import { orderConstants } from '../constants';
import { orderService } from '../services';

const getList = () => {
  return async (dispatch) => {
    dispatch({
      type: orderConstants.GETALL_REQUEST
    });
    const data = await orderService.getList();
    console.log(data);
    dispatch({
      type: orderConstants.GETALL_SUCCESS,
      orders: data
    });
  };
};

export const orderActions = {
  getList
};
