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

const SupplierSchema = Yup.object().shape({
  name: Yup.string().required('Name is required !'),
  code: Yup.string().required('Code is required !'),
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

const mutationCreateSupplier = `mutation ($input: CreateSupplierInput!){
            createSupplier(createSupplierInput: $input) {
                id
            }
        }`;

const mutationUpdateSupplier = `mutation ($input: UpdateSupplierInput!){
            updateSupplier(updateSupplierInput: $input) {
                name,
                code,
                status,
            }
        }`;

const SupplierForm = ({ supplier }) => {
  const [errors, setErrors] = useState({});
  const [form, setForm] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    setForm({
      ...form,
      name: supplier?.name,
      code: supplier?.code,
      status: supplier?.status || STATUS[0].value
    });
  }, [supplier]);

  const [{ data, loading }, exec] = useAxios(
    {
      method: 'post',
      data: {
        query: supplier ? mutationUpdateSupplier : mutationCreateSupplier,
        variables: {
          input: {
            id: supplier?.id,
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
          titleText: supplier ? 'Updated successfully!' : 'Created successfully!',
          didClose: () => {
            !supplier && navigate(`/suppliers/${data.data.createSupplier.id}`);
          }
        });
      }
    }
  }, [data]);

  const handleSubmit = async (e) => {
    try {
      await SupplierSchema.validate(form, { abortEarly: false });
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
      <div className="border-black/12.5 rounded-t-2xl border-b-0 border-solid p-4 pb-0">
        <div className="flex items-center justify-between">
          <div>
            <h6 className="dark:text-white">Supplier Details</h6>
            <p className="leading-normal text-sm">
              #<b>{supplier?.id}</b>
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
          label="Code"
          name="code"
          value={form.code}
          onChange={(e) => handleChangeInput('code', e.target.value)}
          className="w-full max-w-full px-3 sm:w-6/12"
        />
        {errors.code && (
          <div className="text-red-500 text-xs px-3 sm:w-6/12 pr-4">{errors.code}</div>
        )}
        <Choice
          id="status"
          name="status"
          label="Status"
          choices={STATUS}
          value={form.status}
          onChange={(e) => handleChangeInput('status', e.target.value)}
          className="w-full max-w-full px-3 sm:w-6/12"
        />
        {errors.status && (
          <div className="text-red-500 text-xs px-3 sm:w-6/12 pr-4">{errors.status}</div>
        )}
        <div className="flex mt-6 px-3">
          <button
            type="button"
            aria-controls="address"
            onClick={handleSubmit}
            className="inline-block px-10 py-3 mb-0  font-bold text-right text-white uppercase align-middle transition-all border-0 rounded-lg cursor-pointer hover:scale-102 active:opacity-85 hover:shadow-soft-xs dark:bg-gradient-to-tl dark:from-slate-850 dark:to-gray-850 bg-gradient-to-tl from-gray-900 to-slate-800 leading-pro text-xs ease-soft-in tracking-tight-soft shadow-soft-md bg-150 bg-x-25">
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

SupplierForm.propTypes = {
  supplier: PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
    code: PropTypes.string,
    status: PropTypes.string
  })
};

export default SupplierForm;
