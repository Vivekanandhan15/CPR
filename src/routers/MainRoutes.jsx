import Dashboard from '../pages/Dashboard';
import FillCpr from '../pages/FillCpr';
import MyCourses from '../pages/MyCourses';
import Reports from '../pages/Reports';
import MainLayout from '../layout/MainLayout';
import { Navigate } from 'react-router-dom';
import PrivateRoute from '../components/PrivateRoute';
import Student from '../pages/Student';

const MainRoutes = {
    path: '/',
    element: <PrivateRoute> <MainLayout /></PrivateRoute>,
    children: [
        { index: true, element: <Navigate to='/login' replace /> },
        { path: 'dashboard', element: <Dashboard /> },
        { path: 'fill-cpr', element: <FillCpr /> },
        { path: 'my-courses', element: <MyCourses /> },
        { path: 'reports', element: <Reports /> },
        {path : 'student',element: <Student /> }
    ]
}


export default MainRoutes;