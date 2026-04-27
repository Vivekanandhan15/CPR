import React, { useState, useEffect } from 'react'
import './dashboard.css'
import { FaUsers, FaUserCheck, FaClock, FaClipboardList } from 'react-icons/fa'

const BASE_URL = import.meta.env.VITE_BASE_URL

function Dashboard() {
    const [stats, setStats] = useState(null)
    const [loading, setLoading] = useState(true)
    const [upcomingCPRs, setUpcomingCPRs] = useState([])
    const [error, setError] = useState(null)
    const username = localStorage.getItem('Username') || 'User'
    const displayName = username.includes('@') ? username.split('@')[0] : username

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true)
            const token = localStorage.getItem('token')
            try {
                // Fetch Stats
                const statsRes = await fetch(`${BASE_URL}/attendance/stats`, {
                    headers: { Authorization: `Bearer ${token}` }
                })
                if (statsRes.ok) {
                    setStats(await statsRes.json())
                } else {
                    console.error("Stats fetch failed", statsRes.status)
                }

                // Fetch Upcoming CPRs
                const upcomingRes = await fetch(`${BASE_URL}/students/upcoming/cpr`, {
                    headers: { Authorization: `Bearer ${token}` }
                })
                if (upcomingRes.ok) {
                    const data = await upcomingRes.json()
                    console.log("DEBUG: Upcoming CPRs data:", data)
                    setUpcomingCPRs(data)
                } else {
                    console.error("Upcoming CPRs fetch failed", upcomingRes.status)
                    if (upcomingRes.status === 401) setError("Session expired. Please login again.")
                    else setError("Failed to load upcoming reviews.")
                }

            } catch (err) {
                console.error('Failed to fetch dashboard data', err)
                setError("Network error. Is the backend running?")
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [])

    return (
        <div className="dashboard-container">
            {/* Header Section */}
            <div className="dashboard-welcome">
                <h1>Welcome back, {displayName}! 👋</h1>
                <p>Quick overview of the academy's current status.</p>
            </div>

            {/* Stats Cards - Simplified Dashboard */}
            <div className="stats-grid">
                <div className="stat-card-mini blue">
                    <div className="stat-icon"><FaUsers /></div>
                    <div className="stat-info">
                        <h3>{stats?.stats?.total_students || 0}</h3>
                        <p>Total Students</p>
                    </div>
                </div>
                <div className="stat-card-mini green">
                    <div className="stat-icon"><FaUserCheck /></div>
                    <div className="stat-info">
                        <h3>{stats?.stats?.present_today || 0}</h3>
                        <p>Present Today</p>
                    </div>
                </div>
                <div className="stat-card-mini purple">
                    <div className="stat-icon"><FaClipboardList /></div>
                    <div className="stat-info">
                        <h3>{stats?.stats?.overall_rate || 0}%</h3>
                        <p>Avg. Attendance</p>
                    </div>
                </div>
            </div>

            {/* Upcoming CPR Section */}
            <div className="upcoming-cpr-section">
                <div className="section-header">
                    <h2>📅 Upcoming CPR Reviews</h2>
                    <p>Scheduled for the next 3 days</p>
                </div>

                {error && <div className="error-msg" style={{ color: '#ef4444', marginBottom: 16, fontSize: '0.875rem' }}>⚠️ {error}</div>}

                {upcomingCPRs.length === 0 ? (
                    <div className="empty-cpr-state">
                        <div className="empty-icon">✅</div>
                        <p>No CPR reviews scheduled for the next 3 days.</p>
                    </div>
                ) : (
                    <div className="upcoming-cpr-grid">
                        {upcomingCPRs.map(student => (
                            <div key={student.id} className="upcoming-cpr-card">
                                <div className="student-main">
                                    <div className="mini-avatar">{student.student_name?.[0]}</div>
                                    <div className="student-info">
                                        <h4>{student.student_name}</h4>
                                        <p>{student.batch} • {student.section}</p>
                                    </div>
                                </div>
                                <div className="cpr-date-info">
                                    <span className="date-tag">
                                        {new Date(student.next_cpr_date).toLocaleDateString('en-IN', {
                                            day: 'numeric', month: 'short'
                                        })}
                                    </span>
                                    <button 
                                        className="btn-fill-cpr"
                                        onClick={() => window.location.href = `/fill-cpr?studentId=${student.id}`}
                                    >
                                        Fill CPR
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {loading && <div className="loading-spinner">⏳ Refreshing dashboard data...</div>}
        </div>
    )
}

export default Dashboard
