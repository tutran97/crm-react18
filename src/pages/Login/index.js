import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { userActions } from '../../actions';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';

const MySwal = withReactContent(Swal);

const LoginSchema = Yup.object().shape({
  username: Yup.string().required('Username is required !'),
  pass: Yup.string().required('Password is required !')
});

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(LoginSchema)
  });
  const [inputs, setInputs] = useState({
    username: '',
    pass: '',
    remember: false
  });
  const dispatch = useDispatch();
  const location = useLocation();

  const auth = useSelector((state) => state.auth);

  let navigate = useNavigate();
  useEffect(() => {
    if (auth?.loggingIn) {
      void MySwal.fire({
        allowOutsideClick: false,
        didOpen: () => {
          MySwal.showLoading();
        }
      });
    } else {
      MySwal.close();
    }
    if (auth?.user?.token) {
      localStorage.setItem('user', JSON.stringify(auth?.user));
      navigate('/', { replace: true });
    }
    if (auth?.error && auth?.error?.message) {
      void MySwal.fire({
        icon: 'error',
        title: 'Oops...',
        text: auth?.error?.message
      });
    }
  }, [auth]);

  function handleChange(e) {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      setInputs((inputs) => ({ ...inputs, [name]: e.target.checked }));
    } else {
      setInputs((inputs) => ({ ...inputs, [name]: value }));
    }
  }

  function onSubmit(values) {
    try {
      if (values?.username && values?.pass) {
        // get return url from location state or default to home page
        const { from } = location.state || { from: { pathname: '/' } };
        dispatch(userActions.login(values['username'], values['pass'], from));
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <main className="mt-0 transition-all duration-200 ease-soft-in-out">
      <section>
        <div className="relative flex items-center p-0 overflow-hidden bg-center bg-cover min-h-75-screen">
          <div className="container z-10">
            <div className="flex flex-wrap mt-0 -mx-3">
              <div className="flex flex-col w-full max-w-full px-3 mx-auto md:flex-0 shrink-0 md:w-6/12 lg:w-5/12 xl:w-4/12">
                <div className="relative flex flex-col min-w-0 mt-32 break-words bg-transparent border-0 shadow-none rounded-2xl bg-clip-border">
                  <div className="p-6 pb-0 mb-0 bg-transparent border-b-0 rounded-t-2xl">
                    <h3 className="relative z-10 font-bold text-transparent bg-gradient-to-tl from-blue-600 to-cyan-400 bg-clip-text">
                      Welcome back
                    </h3>
                    <p className="mb-0">Enter your email and password to sign in</p>
                  </div>
                  <div className="flex-auto p-6">
                    <form onSubmit={handleSubmit(onSubmit)}>
                      <label className="mb-1 ml-1 font-bold text-xs text-slate-700">Username</label>
                      <div className="mb-2">
                        <input
                          type="text"
                          className="focus:shadow-soft-primary-outline text-sm leading-5.6 ease-soft block w-full appearance-none rounded-lg border border-solid border-gray-300 bg-white bg-clip-padding px-3 py-2 font-normal text-gray-700 transition-all focus:border-fuchsia-300 focus:outline-none focus:transition-shadow"
                          placeholder="Username"
                          aria-label="Username"
                          name="username"
                          onChange={handleChange}
                          {...register('username')}
                        />
                        {errors.username && (
                          <div className="text-red-500 text-xs">{errors.username?.message}</div>
                        )}
                      </div>
                      <label className="mb-1 ml-1 font-bold text-xs text-slate-700">Password</label>
                      <div className="mb-2">
                        <input
                          type="password"
                          className="focus:shadow-soft-primary-outline text-sm leading-5.6 ease-soft block w-full appearance-none rounded-lg border border-solid border-gray-300 bg-white bg-clip-padding px-3 py-2 font-normal text-gray-700 transition-all focus:border-fuchsia-300 focus:outline-none focus:transition-shadow"
                          placeholder="Password"
                          aria-label="Password"
                          aria-describedby="password-addon"
                          name="pass"
                          onChange={handleChange}
                          {...register('pass')}
                        />
                        {errors.pass && (
                          <div className="text-red-500 text-xs">{errors.pass?.message}</div>
                        )}
                      </div>
                      <div className="min-h-6 mb-0.5 block pl-12">
                        <input
                          id="rememberMe"
                          className="mt-0.54 rounded-10 duration-250 ease-soft-in-out after:rounded-circle after:shadow-soft-2xl after:duration-250 checked:after:translate-x-5.25 h-5 relative float-left -ml-12 w-10 cursor-pointer appearance-none border border-solid border-gray-200 bg-slate-800/10 bg-none bg-contain bg-left bg-no-repeat align-top transition-all after:absolute after:top-px after:h-4 after:w-4 after:translate-x-px after:bg-white after:content-[''] checked:border-slate-800/95 checked:bg-slate-800/95 checked:bg-none checked:bg-right"
                          name="remember"
                          type="checkbox"
                          checked={inputs.remember ?? 'checked'}
                          onChange={handleChange}
                        />
                        <label
                          className="mb-2 ml-1 font-normal cursor-pointer select-none text-sm text-slate-700"
                          htmlFor="rememberMe">
                          Remember me
                        </label>
                      </div>
                      <div className="text-center">
                        <button
                          type="submit"
                          className="inline-block w-full px-6 py-3 mt-6 mb-0 font-bold text-center text-white uppercase align-middle transition-all bg-transparent border-0 rounded-lg cursor-pointer shadow-soft-md bg-x-25 bg-150 leading-pro text-xs ease-soft-in tracking-tight-soft bg-gradient-to-tl from-blue-600 to-cyan-400 hover:scale-102 hover:shadow-soft-xs active:opacity-85">
                          Sign in
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
              <div className="w-full max-w-full px-3 lg:flex-0 shrink-0 md:w-6/12">
                <div className="absolute top-0 hidden w-3/5 h-full -mr-32 overflow-hidden -skew-x-10 -right-40 rounded-bl-xl md:block">
                  <div className="absolute inset-x-0 top-0 z-0 h-full -ml-16 bg-cover skew-x-10 login-r-cover"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};
export default Login;
