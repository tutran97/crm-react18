import useAxios from 'axios-hooks';
import PropTypes from 'prop-types';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import withReactContent from 'sweetalert2-react-content';
import Swal from 'sweetalert2';
import { Input } from '../../components/Form';
import * as Yup from 'yup';

const MySwal = withReactContent(Swal);

const SiteSchema = Yup.object().shape({
  name: Yup.string().required('Name is required !'),
  domain: Yup.string().required('Domain is required !'),
  path: Yup.string().required('Path is required !')
});

const SiteForm = ({ site }) => {
  const [errors, setErrors] = useState({});
  const [form, setForm] = useState({});
  // const navigate = useNavigate();

  useEffect(() => {
    setForm({
      ...form,
      name: site?.name,
      domain: site?.domain,
      path: site?.path
    });
  }, [site]);

  const [{ data, loading }, exec] = useAxios(
    {
      method: 'post',
      data: {
        query: `mutation ($input: UpdateSiteInput!){
            updateSite(updateSiteInput: $input) {
                name,
                domain,
                path
            }
        }`,
        variables: {
          input: {
            id: site?.id,
            ...form
          }
        }
      }
    },
    {
      manual: true
    }
  );

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
          titleText: 'Updated successfully!'
        });
      }
    }
  }, [data]);

  useEffect(() => {
    if (loading) {
      void MySwal.fire({
        allowOutsideClick: false,
        didOpen: () => {
          MySwal.showLoading(null);
        }
      });
    } else {
      // MySwal.close();
    }
  }, [loading]);

  const handleChangeInput = (key, value) => {
    setForm({
      ...form,
      [key]: value
    });
  };
  const handleSubmit = async (e) => {
    try {
      await SiteSchema.validate(form, { abortEarly: false });
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

  return (
    <div className="relative flex flex-col min-w-0 mb-6 break-words bg-white border-0 dark:bg-gray-950 dark:shadow-soft-dark-xl shadow-soft-xl rounded-2xl bg-clip-border">
      <div className="border-black/12.5 rounded-t-2xl border-b-0 border-solid p-4 pb-0">
        <div className="flex items-center justify-between">
          <div>
            <h6 className="dark:text-white">Site Details</h6>
            <p className="leading-normal text-sm">
              #<b>{site?.id}</b>
            </p>
          </div>
        </div>
      </div>
      <div className="flex-auto p-4 pt-0">
        <hr className="h-px mt-0 mb-6 bg-gradient-to-r from-transparent via-black/40 to-transparent" />

        <Input
          label="Name"
          name="name"
          value={form.name}
          onChange={(e) => handleChangeInput('name', e.target.value)}
          className="w-full max-w-full px-3 sm:w-6/12"
        />
        {errors.name && (
          <div className="text-red-500 text-xs px-3 sm:w-6/12 pr-4">{errors.name}</div>
        )}
        <Input
          label="Domain"
          name="domain"
          value={form.domain}
          onChange={(e) => handleChangeInput('domain', e.target.value)}
          className="w-full max-w-full px-3 sm:w-6/12"
        />
        {errors.domain && (
          <div className="text-red-500 text-xs px-3 sm:w-6/12 pr-4">{errors.domain}</div>
        )}
        <Input
          label="Path"
          name="path"
          value={form.path}
          onChange={(e) => handleChangeInput('path', e.target.value)}
          className="w-full max-w-full px-3 sm:w-6/12"
        />
        {errors.path && (
          <div className="text-red-500 text-xs px-3 sm:w-6/12 pr-4">{errors.path}</div>
        )}
        <div className="flex mt-6 px-3">
          <button
            type="button"
            onClick={handleSubmit}
            className="inline-block px-10 py-3 mb-0  font-bold text-right text-white uppercase align-middle transition-all border-0 rounded-lg cursor-pointer hover:scale-102 active:opacity-85 hover:shadow-soft-xs dark:bg-gradient-to-tl dark:from-slate-850 dark:to-gray-850 bg-gradient-to-tl from-gray-900 to-slate-800 leading-pro text-xs ease-soft-in tracking-tight-soft shadow-soft-md bg-150 bg-x-25">
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

SiteForm.propTypes = {
  site: PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
    domain: PropTypes.string,
    path: PropTypes.string
  })
};

const SiteDetail = () => {
  const { siteId } = useParams();

  const [{ data, loading }] = useAxios({
    method: 'post',
    data: {
      query: `query ($id: Int!) {
          site(id: $id) {
              id,
              name,
              domain,
              path,                      
              createdAt
          }
      }`,
      variables: {
        id: parseInt(siteId)
      }
    }
  });
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

  return (
    <div className="flex flex-wrap -mx-3">
      <div className="w-full max-w-full px-3 mx-auto lg:flex-0 shrink-0">
        <SiteForm site={data?.data?.site} />
      </div>
    </div>
  );
};

export default SiteDetail;
