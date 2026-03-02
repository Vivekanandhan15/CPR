import { createBrowserRouter } from 'react-router-dom';

import MainRoutes from './MainRoutes';
import Login from '../pages/Login'
import Signup from '../pages/Signup'
import ResetPassword from '../pages/ResetPassword'

const Router = createBrowserRouter([ {path: '/login', element: <Login /> }, {path: '/signup',element:<Signup/>},{ path: '/reset-password',element:<ResetPassword/>}, MainRoutes])

export default Router;