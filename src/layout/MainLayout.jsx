import React from 'react'
import { Outlet, Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import { FaHome, FaFileAlt, FaBook, FaChartBar, FaSignOutAlt , FaUsers } from 'react-icons/fa'
import './MainLayout.css'

function MainLayout() {
    const navigate = useNavigate()
    const handleLogout = () => { localStorage.removeItem('token'); navigate('/login') };
    return (
        <div className="layout">
            <aside className="sidebar">
                <h2><Link className="logo" id='Cpr' to="dashboard">CPR Portal</Link></h2>
                <div className="user-profile">
                    <div className="avatar"></div>
                    <div className="user-info">
                        <h3 className="user-name">Anisha fathima</h3>
                        <p className="user-role">Tech Coach</p>
                    </div>
                </div>
                <nav>
                    <ul className="nav-list">
                        <li><Link to="dashboard"><FaHome className="icon" /> Dashboard</Link></li>
                        <li><Link to="fill-cpr"><FaFileAlt className="icon" /> Fill CPR</Link></li>
                        <li><Link to="my-courses"><FaBook className="icon" /> My Courses</Link></li>
                        <li><Link to="reports"><FaChartBar className="icon" /> Reports</Link></li>
                        <li> <Link to="student"><FaUsers className="icon" /> Student</Link></li>
                    </ul>
                    <button className='logout-btn' onClick={handleLogout}><FaSignOutAlt className='icon' /> Logout</button>

                </nav>
            </aside>
            <main className="content">
                <Outlet />
            </main>
        </div>
    )
}

export default MainLayout