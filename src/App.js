import './App.scss';
import 'choices.js/public/assets/styles/choices.min.css';
import 'flatpickr/dist/themes/light.css';
import { useSelector } from 'react-redux';
import { Routes, Route } from 'react-router-dom';
import { configure } from 'axios-hooks';

import axios from './helpers/axios';
import Home from './pages/Home';
import Login from './pages/Login';
import Orders from './pages/Orders/List';
import OrderDetail from './pages/Orders/Detail';
import Customers from './pages/Customers/List';
import CustomerDetail from './pages/Customers/Detail';
import Users from './pages/Users/List';
import UserDetail from './pages/Users/Detail';
import UserAdd from './pages/Users/Add';
import Suppliers from './pages/Suppliers/List';
import SupplierDetail from './pages/Suppliers/Detail';
import SupplierAdd from './pages/Suppliers/Add';
import Sites from './pages/Sites/List';
import SiteDetail from './pages/Sites/Detail';

import { PrivateRoute } from './components';
import { LayoutDefault } from './components/Layout/Default';
import CustomerActionLogs from './pages/Settings/CustomerActionLogs';
import KlaviyoLogs from './pages/Settings/KlaviyoLogs';
import RolesList from './pages/Settings/Roles/List';
import RoleAdd from './pages/Settings/Roles/Add';
import RoleEdit from './pages/Settings/Roles/Edit';
import PermissionList from './pages/Settings/Permissions/List';
import PermissionAdd from './pages/Settings/Permissions/Add';
import PermissionEdit from './pages/Settings/Permissions/Edit';

configure({ axios: axios() });

function App() {
  const user = useSelector((state) => state.auth.user);
  return (
    <Routes>
      <Route element={<PrivateRoute user={user} />}>
        <Route element={<LayoutDefault />}>
          <Route path="/" element={<Home />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/orders/:orderId" element={<OrderDetail />} />
          <Route path="/customers" element={<Customers />} />
          <Route path="/customers/:customerId" element={<CustomerDetail />} />
          <Route path="/users" element={<Users />} />
          <Route path="/users/add" element={<UserAdd />} />
          <Route path="/users/:userId" element={<UserDetail />} />
          <Route path="/suppliers" element={<Suppliers />} />
          <Route path="/suppliers/add" element={<SupplierAdd />} />
          <Route path="/suppliers/:supplierId" element={<SupplierDetail />} />
          <Route path="/sites" element={<Sites />} />
          <Route path="/sites/:siteId" element={<SiteDetail />} />
          <Route path="/customer-action-logs" element={<CustomerActionLogs />} />
          <Route path="/klaviyo-logs" element={<KlaviyoLogs />} />
          <Route path="/roles" element={<RolesList />} />
          <Route path="/roles/add" element={<RoleAdd />} />
          <Route path="/roles/:roleId" element={<RoleEdit />} />
          <Route path="/permission" element={<PermissionList />} />
          <Route path="/permission/add" element={<PermissionAdd />} />
          <Route path="/permission/:permissionId" element={<PermissionEdit />} />
        </Route>
      </Route>
      <Route exact path="/login" element={<Login />} />
    </Routes>
  );
}

export default App;
