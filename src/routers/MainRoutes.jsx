import Dashboard from '../pages/Dashboard';
import FillCpr from '../pages/FillCpr';
import MyCourses from '../pages/MyCourses';
import Reports from '../pages/Reports';
import MainLayout from '../layout/MainLayout';
import { Navigate } from 'react-router-dom';
import PrivateRoute from '../components/PrivateRoute';
import Student from '../pages/Student';
import StudentCprPage from '../pages/StudentCprPage';
import Attendance from '../pages/Attendance';
import AttendanceDashboard from '../pages/AttendanceDashboard';
import StudentAttendanceDetail from '../pages/StudentAttendanceDetail';
import WorkingDays from '../pages/WorkingDays';
import StudentReportPage from '../pages/StudentReportPage';


const MainRoutes = {
    path: '/',
    element: <PrivateRoute> <MainLayout /></PrivateRoute>,
    children: [
        { path: 'dashboard', element: <Dashboard /> },
        { path: 'fill-cpr', element: <FillCpr /> },
        { path: 'my-courses', element: <MyCourses /> },
        { path: 'reports', element: <Reports /> },
        { path: 'student', element: <Student /> },
        // { path: 'attendance', element: <Attendance /> },
        // { path: 'attendance-dashboard', element: <AttendanceDashboard /> },
        // { path: 'attendance/student/:id', element: <StudentAttendanceDetail /> },
        // { path: 'working-days', element: <WorkingDays /> },
        // { path: 'student-report/:id', element: <StudentReportPage /> },
        // { path: 'fill-cpr/:id', element: <StudentCprPage /> },
    ]
}


export default MainRoutes;