import useAxios from 'axios-hooks';
import { useEffect, useState } from 'react';
import withReactContent from 'sweetalert2-react-content';
import Swal from 'sweetalert2';
import PropTypes from 'prop-types';
import { Input } from './Form';
import { Choice } from './Form/Choice';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';

const MySwal = withReactContent(Swal);

const UserSchema = Yup.object().shape({
  username: Yup.string().required('Username is required !'),
  fullName: Yup.string().required('FullName is required !'),
  email: Yup.string().required('Email is required !').email('Invalid email format !'),
  password: Yup.string().required('Password is required !'),
  status: Yup.string().required('Status is required !')
});

const STATUS = [
  {
    label: 'Active',
    value: 'ACTIVE'
  },
  {
    label: 'Suspended',
    value: 'SUSPENDED'
  },
  {
    label: 'Closed',
    value: 'CLOSED'
  }
];

const mutationCreateUser = `mutation ($input: CreateUserInput!){
            createUser(createUserInput: $input) {
                id
            }
        }`;

const mutationUpdateUser = `mutation ($input: UpdateUserInput!){
            updateUser(updateUserInput: $input) {
                username,
                fullName
            }
        }`;

const UserForm = ({ user, supplier, onSuccess, emitReFetch }) => {
  const [errors, setErrors] = useState({});
  const [form, setForm] = useState({
    supplierId: supplier?.id
  });
  const navigate = useNavigate();

  useEffect(() => {
    setForm({
      ...form,
      username: user?.username,
      fullName: user?.fullName,
      email: user?.email,
      password: user?.password,
      status: user?.status || STATUS[0].value
    });
  }, [user]);

  const [{ data, loading }, exec] = useAxios(
    {
      method: 'post',
      data: {
        query: user ? mutationUpdateUser : mutationCreateUser,
        variables: {
          input: {
            id: user?.id,
            ...form,
            username: supplier?.id ? `${form.username}@${supplier.code}` : form.username
          }
        }
      }
    },
    {
      manual: true
    }
  );

  useEffect(() => {
    if (loading) {
      void MySwal.fire({
        allowOutsideClick: false,
        didOpen: () => {
          MySwal.showLoading(null);
        }
      });
    } else {
      MySwal.close();
    }
  }, [loading]);

  useEffect(() => {
    if (data) {
      if (data.errors) {
        void MySwal.fire({
          icon: 'error',
          titleText: data.errors[0].message
        });
      } else {
        void MySwal.fire({
          icon: 'success',
          titleText: user ? 'Updated successfully!' : 'Created successfully!',
          didClose: () => {
            if (onSuccess) {
              onSuccess();
            } else {
              !user && navigate(`/users/${data.data.createUser.id}`);
            }
          }
        });
        emitReFetch();
      }
    }
  }, [data]);

  const handleSubmit = async (e) => {
    try {
      await UserSchema.validate(form, { abortEarly: false });
      e.preventDefault();
      void exec();
      setErrors({});
    } catch (err) {
      const errors = {};
      err.inner.forEach((e) => {
        errors[e.path] = e.message;
      });
      setErrors(errors);
    }
  };

  const handleChangeInput = (key, value) => {
    setForm({
      ...form,
      [key]: value
    });
  };

  return (
    <div className="relative flex flex-col min-w-0 mb-6 break-words bg-white border-0 dark:bg-gray-950 dark:shadow-soft-dark-xl shadow-soft-xl rounded-2xl bg-clip-border">
      <div className="border-black/12.5 rounded-t-2xl border-b-0 border-solid p-4 pb-0 ">
        <div className="flex items-center justify-between">
          <div>
            <h6 className="dark:text-white">User Details</h6>
            <p className="leading-normal text-sm">
              #<b>{user?.id}</b>
            </p>
          </div>
        </div>
      </div>
      <div className="flex flex-wrap sm:flex-nowrap">
        <div className="w-full ">
          <div className="relative flex flex-wrap items-stretch w-full transition-all rounded-lg ease-soft">
            <Input
              label="Username"
              name="username"
              value={form.username}
              onChange={(e) => handleChangeInput('username', e.target.value)}
              className="w-full max-w-full px-3"
            />
            {supplier && (
              <span className="flex items-end justify-end mr-auto">@{supplier.code}</span>
            )}
          </div>
          {errors.username && (
            <div className="text-red-500 text-xs px-3 sm:w-2/4 pr-4">{errors.username}</div>
          )}
          <Input
            label="Full Name"
            name="fullName"
            value={form.fullName}
            onChange={(e) => handleChangeInput('fullName', e.target.value)}
            className="w-full max-w-full px-3 "
          />
          {errors.fullName && (
            <div className="text-red-500 text-xs px-3 sm:w-2/4 pr-4">{errors.fullName}</div>
          )}
          <Input
            label="Email"
            name="email"
            value={form.email}
            onChange={(e) => handleChangeInput('email', e.target.value)}
            className="w-full max-w-full px-3 "
          />
          {errors.email && (
            <div className="text-red-500 text-xs px-3 sm:w-2/4 pr-4">{errors.email}</div>
          )}
          <Input
            type="password"
            label="Password"
            name="password"
            value={form.password}
            placeHolder="******"
            onChange={(e) => handleChangeInput('password', e.target.value)}
            className="w-full max-w-full px-3 "
          />
          {errors.password && (
            <div className="text-red-500 text-xs px-3 sm:w-2/4 pr-4">{errors.password}</div>
          )}
          <Choice
            id="status"
            name="status"
            label="Status"
            choices={STATUS}
            value={form.status}
            onChange={(e) => handleChangeInput('status', e.target.value)}
            className="w-full max-w-full px-3 "
          />
          {errors.status && (
            <div className="text-red-500 text-xs px-3 sm:w-2/4 pr-4">{errors.status}</div>
          )}
          <div className="flex my-3 px-3">
            <button
              type="button"
              aria-controls="address"
              onClick={handleSubmit}
              className="inline-block px-10 py-3 mb-0  font-bold text-right text-white uppercase align-middle transition-all border-0 rounded-lg cursor-pointer hover:scale-102 active:opacity-85 hover:shadow-soft-xs dark:bg-gradient-to-tl dark:from-slate-850 dark:to-gray-850 bg-gradient-to-tl from-gray-900 to-slate-800 leading-pro text-xs ease-soft-in tracking-tight-soft shadow-soft-md bg-150 bg-x-25">
              Save
            </button>
          </div>
        </div>
        <div className="w-full  mb-3 overflow-auto" style={{ height: `calc(100vh - 300px)` }}></div>
      </div>
    </div>
  );
};

UserForm.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.number,
    username: PropTypes.string,
    fullName: PropTypes.string,
    password: PropTypes.string,
    email: PropTypes.string,
    status: PropTypes.string
  }),
  supplier: PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
    code: PropTypes.string,
    status: PropTypes.string
  }),
  onSuccess: PropTypes.func,
  emitReFetch: PropTypes.func
};

export default UserForm;
