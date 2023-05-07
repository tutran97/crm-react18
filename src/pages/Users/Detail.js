import useAxios from 'axios-hooks';
import { useParams } from 'react-router-dom';
import { useEffect } from 'react';
import withReactContent from 'sweetalert2-react-content';
import Swal from 'sweetalert2';
import UserForm from '../../components/UserForm';

const MySwal = withReactContent(Swal);

const UserDetail = () => {
  const { userId } = useParams();

  const [{ data, loading }, reFetch] = useAxios({
    method: 'post',
    data: {
      query: `query ($id: Int!) {
          user(id: $id) {
              id,
              fullName,
              username,
              email,
              status,     
              sessions {
                token,
                platform
              },                 
              createdAt
          }
      }`,
      variables: {
        id: parseInt(userId)
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
        <UserForm user={data?.data?.user} emitReFetch={reFetch} />
      </div>
    </div>
  );
};

export default UserDetail;
