import React, { useEffect, useState } from 'react'
import { Outlet, Link, useLocation } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import {
    FaHome, FaFileAlt, FaChartBar, FaSignOutAlt,
    FaUsers, FaCalendarCheck, FaCalendarAlt, FaCalendarDay
} from 'react-icons/fa'
import './MainLayout.css'

const BASE_URL = import.meta.env.VITE_BASE_URL

function MainLayout() {
    const navigate = useNavigate()
    const location = useLocation()
    const [profile, setProfile] = useState({
        username: localStorage.getItem('Username') || 'User',
        role: localStorage.getItem('UserRole') || 'Role'
    })
    
    const handleLogout = () => { 
        localStorage.removeItem('token')
        localStorage.removeItem('Username')
        localStorage.removeItem('UserRole')
        navigate('/login') 
    }

    useEffect(() => {
        const fetchProfile = async () => {
            const token = localStorage.getItem('token')
            if (!token) return

            try {
                const res = await fetch(`${BASE_URL}/auth/me`, {
                    headers: { Authorization: `Bearer ${token}` }
                })
                if (res.ok) {
                    const data = await res.json()
                    const newProfile = {
                        username: data.username || 'User',
                        role: data.role || 'Role'
                    }
                    setProfile(newProfile)
                    localStorage.setItem('Username', data.username)
                    localStorage.setItem('UserRole', data.role)
                }
            } catch (err) {
                console.error("Failed to sync profile", err)
            }
        }

        fetchProfile()
    }, [])

    // Safe formatting for display name
    const rawUsername = profile.username || 'User'
    const displayName = rawUsername.includes('@') 
        ? rawUsername.split('@')[0] 
        : rawUsername

    const isActive = (path) => location.pathname.includes(path)

    return (
        <div className="layout">
            <aside className="sidebar">
                <h2><Link className="logo" id='Cpr' to="dashboard">CPR Portal</Link></h2>

                <div className="user-profile">
                    <div className="avatar">
                        <span style={{ color: '#4f46e5', fontWeight: 700, fontSize: '1.1rem' }}>
                            {displayName?.[0]?.toUpperCase() || 'U'}
                        </span>
                    </div>
                    <div className="user-info">
                        <h3 className="user-name" title={rawUsername}>{displayName}</h3>
                        {/* <p className="user-role">{profile.role?.toUpperCase() || 'ROLE'}</p> */}
                    </div>
                </div>

                <nav>
                    <ul className="nav-list">
                        <li>
                            <Link to="dashboard" className={isActive('dashboard') ? 'nav-active' : ''}>
                                <FaHome className="icon" /> Dashboard
                            </Link>
                        </li>
                        <li>
                            <Link to="fill-cpr" className={isActive('fill-cpr') ? 'nav-active' : ''}>
                                <FaFileAlt className="icon" /> Fill CPR
                            </Link>
                        </li>
                        <li>
                            <Link to="reports" className={isActive('reports') ? 'nav-active' : ''}>
                                <FaChartBar className="icon" /> Reports
                            </Link>
                        </li>
                        <li>
                            <Link to="student" className={isActive('student') ? 'nav-active' : ''}>
                                <FaUsers className="icon" /> Students
                            </Link>
                        </li>

                        <li className="nav-group-label">Attendance</li>

                        <li>
                            <Link to="attendance" className={location.pathname === '/attendance' ? 'nav-active' : ''}>
                                <FaCalendarCheck className="icon" /> Mark Attendance
                            </Link>
                        </li>
                        <li>
                            <Link to="attendance-dashboard" className={isActive('attendance-dashboard') ? 'nav-active' : ''}>
                                <FaCalendarAlt className="icon" /> Overview
                            </Link>
                        </li>
                        <li>
                            <Link to="working-days" className={isActive('working-days') ? 'nav-active' : ''}>
                                <FaCalendarDay className="icon" /> Working Days
                            </Link>
                        </li>
                    </ul>

                    <button className='logout-btn' onClick={handleLogout}>
                        <FaSignOutAlt className='icon' /> Logout
                    </button>
                </nav>
            </aside>

            <main className="content">
                <Outlet />
            </main>
        </div>
    )
}

export default MainLayout