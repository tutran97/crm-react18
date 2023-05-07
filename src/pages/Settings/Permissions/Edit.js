import React, { useEffect, useState } from 'react';
import { Input } from '../../../components/Form';
import JSONInput from 'react-json-editor-ajrm';
import locale from 'react-json-editor-ajrm/locale/en';
import useAxios from 'axios-hooks';
import withReactContent from 'sweetalert2-react-content';
import Swal from 'sweetalert2';
import { useParams } from 'react-router-dom';

const MySwal = withReactContent(Swal);

export default function PermissionEdit() {
  const [form, setForm] = useState({});
  const [valuejson, setValuejson] = useState(null);
  const { permissionId } = useParams();

  const [{ data: dataById, loading: loadingById }] = useAxios({
    method: 'post',
    data: {
      query: `query ($id: Int!) {
        permission(id: $id) {
            id,
            name,
            description,
            subject,
            action,
            conditions,
            updatedAt,
            createdAt
          }
      }`,
      variables: {
        id: parseInt(permissionId)
      }
    }
  });

  useEffect(() => {
    setForm({
      ...form,
      id: +permissionId,
      name: dataById?.data?.permission?.name,
      description: dataById?.data?.permission?.description,
      subject: dataById?.data?.permission?.subject,
      action: dataById?.data?.permission?.action,
      conditions: dataById?.data?.permission?.conditions
    });
    if (dataById?.data?.permission?.conditions) {
      const obj = JSON.parse(dataById.data.permission.conditions);
      setValuejson(obj);
    }
  }, [dataById]);

  const [{ data, loading, error }, exeUpdate] = useAxios(
    {
      method: 'post',
      data: {
        query: `mutation ($input: UpdatePermissionInput!){
          updatePermission(updatePermissionInput: $input){
            name,
            description,
            subject,
            action,
            conditions
          }
        }`,
        variables: {
          input: form
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
      if (error) {
        void MySwal.fire({
          icon: 'error',
          titleText: error.message
        });
      } else {
        void MySwal.fire({
          icon: 'success',
          titleText: 'Updated successfully!'
        });
        const newRes = data?.data?.updatePermission;
        setForm({
          ...form,
          ...newRes
        });
      }
    }
  }, [loading]);

  useEffect(() => {
    if (loadingById) {
      void MySwal.fire({
        allowOutsideClick: false,
        didOpen: () => {
          MySwal.showLoading(null);
        }
      });
    } else {
      MySwal.close();
    }
  }, [loadingById]);

  const handleChangeInput = (key, value) => {
    setForm({
      ...form,
      [key]: value
    });
  };

  function handleChangeJson(data) {
    const value = data.jsObject;
    setValuejson(value);
    setForm({ ...form, conditions: JSON.stringify(value) });
  }

  function handleSubmit(e) {
    e.preventDefault();
    void exeUpdate();
  }

  return (
    <div className="p-3 bg-white rounded-2xl">
      <div className="header">
        <h5 className="mb-0 font-bold dark:text-white">Detail Permission</h5>
      </div>
      <div className="form flex flex-wrap sm:flex-nowrap gap-4">
        <div className="w-full">
          <Input
            label="Permission name"
            name="name"
            value={form.name}
            onChange={(e) => handleChangeInput('name', e.target.value)}
            className="w-full max-w-full"
          />
          <Input
            label="Description"
            name="description"
            value={form.description}
            onChange={(e) => handleChangeInput('description', e.target.value)}
            className="w-full max-w-full"
          />
          <Input
            label="Subject"
            name="subject"
            value={form.subject}
            onChange={(e) => handleChangeInput('subject', e.target.value)}
            className="w-full max-w-full"
          />
          <Input
            label="Action"
            name="action"
            value={form.action}
            onChange={(e) => handleChangeInput('action', e.target.value)}
            className="w-full max-w-full"
          />
          <div className="actions my-3 text-right">
            <button
              onClick={handleSubmit}
              className="inline-block px-4 py-2 mb-0 font-bold text-right text-white uppercase align-middle transition-all border-0 rounded-lg cursor-pointer hover:scale-102 active:opacity-85 hover:shadow-soft-xs dark:bg-gradient-to-tl dark:from-slate-850 dark:to-gray-850 bg-gradient-to-tl from-gray-900 to-slate-800 leading-pro text-xs ease-soft-in tracking-tight-soft shadow-soft-md bg-150 bg-x-25">
              Update
            </button>
          </div>
        </div>
        <div className="w-full overflow-auto" style={{ height: `calc(100vh - 300px)` }}>
          <label className="mb-2 ml-1 font-bold text-xs text-slate-700 dark:text-white/80">
            Conditions
          </label>
          <JSONInput
            id="conditions"
            placeholder={valuejson}
            locale={locale}
            height="100%"
            width="100%"
            onBlur={handleChangeJson}
            confirmGood={true}
            waitAfterKeyPress={5000}
          />
        </div>
      </div>
    </div>
  );
}
