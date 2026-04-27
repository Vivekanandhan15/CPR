import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, useSearchParams } from 'react-router-dom'
import './attendance.css'

const BASE_URL = import.meta.env.VITE_BASE_URL

function StudentAttendanceDetail() {
    const { id } = useParams()
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()
    const month = searchParams.get('month') || new Date().toISOString().slice(0, 7)

    const [data, setData] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [selectedMonth, setSelectedMonth] = useState(month)

    useEffect(() => { fetchDetail() }, [id, selectedMonth])

    const fetchDetail = async () => {
        setLoading(true)
        setError(null)
        try {
            const token = localStorage.getItem('token')
            const res = await fetch(`${BASE_URL}/attendance/student/${id}/monthly?month=${selectedMonth}`, {
                headers: { Authorization: `Bearer ${token}` }
            })
            if (!res.ok) throw new Error('Failed to load student attendance')
            setData(await res.json())
        } catch (err) {
            setError('Could not load student attendance history.')
        } finally {
            setLoading(false)
        }
    }

    const changeMonth = (dir) => {
        const [y, m] = selectedMonth.split('-').map(Number)
        const d = new Date(y, m - 1 + dir, 1)
        setSelectedMonth(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`)
    }

    const monthLabel = () => {
        const [y, m] = selectedMonth.split('-').map(Number)
        return new Date(y, m - 1, 1).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })
    }

    // Helper to generate calendar days for the selected month
    const renderCalendar = () => {
        if (!data) return null

        const [year, monthNum] = selectedMonth.split('-').map(Number)
        const firstDay = new Date(year, monthNum - 1, 1).getDay()
        const daysInMonth = new Date(year, monthNum, 0).getDate()

        const days = []
        // Add empty cells for days before the first of the month
        for (let i = 0; i < firstDay; i++) {
            days.push(<div key={`empty-${i}`} className="calendar-cell empty"></div>)
        }

        // Create a map of records for quick lookup
        const recordMap = {}
        data.records.forEach(r => {
            const day = new Date(r.date).getDate()
            recordMap[day] = r.status
        })

        // Add cells for each day of the month
        for (let d = 1; d <= daysInMonth; d++) {
            const status = recordMap[d]
            days.push(
                <div key={d} className={`calendar-cell ${status ? 'has-data' : ''}`}>
                    <div className="day-num">{d}</div>
                    {status && (
                        <div className={`day-status ${status.toLowerCase()}`}>
                            {status}
                        </div>
                    )}
                </div>
            )
        }

        return days
    }

    if (error) return <div className="error-msg">{error}</div>

    const pct = data?.percentage || 0
    const pctColor = pct >= 75 ? '#10b981' : pct >= 50 ? '#f59e0b' : '#ef4444'

    const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

    return (
        <div>
            <button className="back-link" onClick={() => navigate(-1)}>
                ← Back to Overview
            </button>

            {loading ? (
                <div className="loading-spinner">⏳ Loading student record...</div>
            ) : data && (
                <div className="student-detail-container">
                    {/* Header */}
                    <div className="report-student-header">
                        <div className="big-avatar" style={{ background: pctColor }}>{data.student_name?.[0]?.toUpperCase()}</div>
                        <div>
                            <h2>{data.student_name}</h2>
                            <p style={{ color: 'rgba(255,255,255,0.7)', marginBottom: 4 }}>{data.email || '—'}</p>
                            <p>
                                <span className="batch-pill" style={{ background: 'rgba(255,255,255,0.15)', color: '#fff', padding: '1px 8px', borderRadius: 999, fontSize: '0.75rem', fontWeight: 700 }}>
                                    {data.batch || 'No Batch'}
                                </span>
                                &nbsp;·&nbsp; Section {data.section} &nbsp;·&nbsp; 
                                Student ID: {data.student_id?.slice(0, 8)}
                            </p>
                        </div>
                        <div className="report-header-right">
                            <div className="big-val">{pct}%</div>
                            <div className="sub-label">Attendance for {monthLabel()}</div>
                        </div>
                    </div>

                    {/* Summary Stats */}
                    <div className="stats-row" style={{ marginBottom: 24 }}>
                        <div className="stat-card accent-blue">
                            <div className="stat-label">Working Days</div>
                            <div className="stat-value">{data.working_days}</div>
                        </div>
                        <div className="stat-card accent-green">
                            <div className="stat-label">Present Days</div>
                            <div className="stat-value">{data.present_days}</div>
                        </div>
                        <div className="stat-card accent-red">
                            <div className="stat-label">Absent Days</div>
                            <div className="stat-value">{data.absent_days}</div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-label">Attendance %</div>
                            <div className="stat-value" style={{ color: pctColor }}>{pct}%</div>
                        </div>
                    </div>

                    {/* Calendar */}
                    <div className="month-calendar">
                        <div className="calendar-header">
                            <button className="calendar-nav-btn" onClick={() => changeMonth(-1)}>‹ Prev</button>
                            <h3>📅 {monthLabel()}</h3>
                            <button className="calendar-nav-btn" onClick={() => changeMonth(1)} disabled={selectedMonth >= new Date().toISOString().slice(0, 7)}>Next ›</button>
                        </div>

                        <div className="calendar-grid">
                            {dayLabels.map(label => (
                                <div key={label} className="calendar-day-label">{label}</div>
                            ))}
                            {renderCalendar()}
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default StudentAttendanceDetail
