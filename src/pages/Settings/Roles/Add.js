import React, { useEffect, useState } from 'react';
import { Input, MultiChoice } from '../../../components/Form';
import useAxios from 'axios-hooks';
import withReactContent from 'sweetalert2-react-content';
import Swal from 'sweetalert2';

const MySwal = withReactContent(Swal);

export default function RoleAdd() {
  const [form, setForm] = useState({});
  const [optionPermissions, setOptionPermissions] = useState([]);

  const [{ data: dataPermissions }] = useAxios({
    method: 'post',
    data: {
      query: `query ($filter: PermissionsFilterArgs, $sort: PermissionsSortArgs, $limit: Int, $offset:Int){
      permissions(first: $limit,offset: $offset, filter: $filter, sort : $sort)  {
            edges {
                cursor,
                node {
                  id,
                  name,
                  description,
                  subject,
                  action,
                  conditions,
                  updatedAt,
                  createdAt
                }
            },
            pageInfo {
                startCursor,
                endCursor
            },
            totalCount,        
        }
    }`,
      variables: {}
    }
  });

  useEffect(() => {
    let option = dataPermissions?.data?.permissions?.edges.map((item) => ({
      label: item?.node?.name,
      value: item?.node?.id
    }));
    if (option?.length > 0) {
      setOptionPermissions(option);
    }
  }, [dataPermissions]);

  const [{ data, loading, error }, exeCreate] = useAxios(
    {
      method: 'post',
      data: {
        query: `mutation ($input: CreateRoleInput!){
          createRole(createRoleInput: $input){
            name,
           description,
           permissions {
            name,
            subject,
            action,
            conditions
            },
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
      }
      if (data) {
        void MySwal.fire({
          icon: 'success',
          titleText: 'Updated successfully!'
        });
      }
    }
  }, [loading]);

  const handleChangeInput = (key, value) => {
    if (key === 'permissionIds') {
      const arrValue = Array.from(value).map((option) => +option.value);
      setForm({
        ...form,
        [key]: arrValue
      });
    } else {
      setForm({
        ...form,
        [key]: value
      });
    }
  };

  function handleSubmit(e) {
    e.preventDefault();
    void exeCreate();
  }

  return (
    <div className="p-3 bg-white rounded-2xl">
      <div className="header">
        <h5 className="mb-0 font-bold dark:text-white">Add role</h5>
      </div>
      <div className="form flex flex-wrap sm:flex-nowrap gap-4">
        <div className="w-full">
          <Input
            label="Rolename"
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
          <MultiChoice
            id="permissionIds"
            name="permissionIds"
            label="Permissions"
            choices={optionPermissions}
            value={form.permissions}
            onChange={(e) => handleChangeInput('permissionIds', e.target.selectedOptions)}
            className="w-full max-w-full"
          />
          <div className="actions my-3 text-right">
            <button
              onClick={handleSubmit}
              className="inline-block px-4 py-2 mb-0 font-bold text-right text-white uppercase align-middle transition-all border-0 rounded-lg cursor-pointer hover:scale-102 active:opacity-85 hover:shadow-soft-xs dark:bg-gradient-to-tl dark:from-slate-850 dark:to-gray-850 bg-gradient-to-tl from-gray-900 to-slate-800 leading-pro text-xs ease-soft-in tracking-tight-soft shadow-soft-md bg-150 bg-x-25">
              Submit
            </button>
          </div>
        </div>
        <div className="w-full overflow-auto"></div>
      </div>
    </div>
  );
}
