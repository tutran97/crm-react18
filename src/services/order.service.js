import axios from 'axios';

const API_URL = 'https://temafes.devboxgates.com/wp-json';
const USERNAME = 'ck_56e88e53c7378f4e3abb555ab55bf6d533e3a046';
const PASSWORD = 'cs_34a02e916fa3000305de1e0804ad7a24d892c20c';

const getList = async () => {
  const response = await axios.get(API_URL + '/wc/v3/orders', {
    auth: {
      username: USERNAME,
      password: PASSWORD
    }
  });
  return response.data;
};

export const orderService = {
  getList
};
