import axios from '../helpers/axios';

// const register = (username, email, password) => {
//   return axios.post(API_URL + "signup", {
//     username,
//     email,
//     password,
//   });
// };

const login = async (username, password) => {
  return axios().post('', {
    query: `mutation ($input: LoginInput!){
        login(loginInput: $input) {
            token
        }
    }`,
    variables: {
      input: {
        username,
        password
      }
    }
  });
};

const logout = () => {
  localStorage.removeItem('user');
  axios().post('', {
    query: `mutation{
        logout
    }`
  });
};

const me = async () => {
  return axios().post('', {
    query: `query {
        me {
            id,
            fullName,
            email,
            username,
            sessions {
                token,
                platform
            },
            status,                
            createdAt,
        }
    }`
  });
};

export const userService = {
  login,
  logout,
  me
};
