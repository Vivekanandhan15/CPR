import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import './attendance.css'

const BASE_URL = import.meta.env.VITE_BASE_URL

function getPctColor(pct) {
    if (pct >= 75) return 'good'
    if (pct >= 50) return 'warn'
    return 'bad'
}

function getBarColor(pct) {
    if (pct >= 75) return 'green'
    if (pct >= 50) return ''
    return 'red'
}

function AttendanceDashboard() {
    const navigate = useNavigate()
    const [data, setData] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [search, setSearch] = useState('')
    const [selectedSection, setSelectedSection] = useState('')
    const [selectedBatch, setSelectedBatch] = useState('')

    const currentMonth = new Date().toISOString().slice(0, 7)
    const [month, setMonth] = useState(currentMonth)

    useEffect(() => { fetchSummary() }, [month])

    const fetchSummary = async () => {
        setLoading(true)
        setError(null)
        try {
            const token = localStorage.getItem('token')
            const res = await fetch(`${BASE_URL}/attendance/monthly-summary?month=${month}`, {
                headers: { Authorization: `Bearer ${token}` }
            })
            if (!res.ok) throw new Error(`Server error ${res.status}`)
            const json = await res.json()
            setData(json)
        } catch (err) {
            setError('Failed to load attendance summary. Make sure the backend is running.')
        } finally {
            setLoading(false)
        }
    }

    const changeMonth = (direction) => {
        const [y, m] = month.split('-').map(Number)
        const d = new Date(y, m - 1 + direction, 1)
        setMonth(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`)
    }

    const monthLabel = () => {
        const [y, m] = month.split('-').map(Number)
        return new Date(y, m - 1, 1).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })
    }

    const students = data?.students || []
    const sections = data ? [...new Set(students.map(s => s.section).filter(Boolean))] : []
    const batches = data ? [...new Set(students.map(s => s.batch).filter(Boolean))] : []

    const filteredStudents = students
        .filter(s => selectedSection ? s.section === selectedSection : true)
        .filter(s => selectedBatch ? s.batch === selectedBatch : true)
        .filter(s => search ? s.student_name.toLowerCase().includes(search.toLowerCase()) : true)

    return (
        <div>
            <div className="page-header">
                <div>
                    <h1>Attendance Overview</h1>
                    <p>Monthly attendance statistics for the academy</p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <button className="calendar-nav-btn" onClick={() => changeMonth(-1)}>‹</button>
                    <span style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text-primary)', minWidth: 160, textAlign: 'center' }}>
                        {monthLabel()}
                    </span>
                    <button className="calendar-nav-btn" onClick={() => changeMonth(1)} disabled={month >= currentMonth}>›</button>
                </div>
            </div>

            {error && <div className="error-msg">{error}</div>}

            {loading ? (
                <div className="loading-spinner">⏳ Loading summary...</div>
            ) : data ? (
                <>
                    {/* Hero Banner */}
                    <div className="academy-hero">
                        <div>
                            <h2>Academy Attendance</h2>
                            <div className="big-pct">{data.overall_percentage}%</div>
                            <div className="hero-meta">{monthLabel()}</div>
                        </div>
                        <div className="hero-right-stats">
                            <div className="hero-stat">
                                <div className="h-val">{data.total_students}</div>
                                <div className="h-label">Students</div>
                            </div>
                            <div className="hero-stat">
                                <div className="h-val">{data.working_days}</div>
                                <div className="h-label">Working Days</div>
                            </div>
                            <div className="hero-stat">
                                <div className="h-val">{data.sections?.length || 0}</div>
                                <div className="h-label">Sections</div>
                            </div>
                        </div>
                    </div>

                    {/* Student Filtering */}
                    <div className="toolbar" style={{ marginBottom: 20 }}>
                        <input
                            type="text"
                            placeholder="🔍  Search student..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            style={{ flex: 1 }}
                        />
                        <select value={selectedSection} onChange={e => setSelectedSection(e.target.value)}>
                            <option value="">All Sections</option>
                            {sections.map(sec => <option key={sec} value={sec}>{sec}</option>)}
                        </select>
                        <select value={selectedBatch} onChange={e => setSelectedBatch(e.target.value)}>
                            <option value="">All Batches</option>
                            {batches.map(b => <option key={b} value={b}>{b}</option>)}
                        </select>
                    </div>

                    <p className="section-title">👥 Student Attendance — Click a card to view monthly detail</p>

                    {filteredStudents.length === 0 ? (
                        <div className="empty-state">
                            <div className="empty-icon">📭</div>
                            <p>No attendance data found for this month.</p>
                        </div>
                    ) : (
                        <div className="student-attendance-grid">
                            {filteredStudents.map(student => (
                                <div
                                    key={student.id}
                                    className="student-att-card"
                                    onClick={() => navigate(`/attendance/student/${student.id}?month=${month}&name=${encodeURIComponent(student.student_name)}`)}
                                >
                                    <div className="att-avatar">{student.student_name?.[0]?.toUpperCase() || '?'}</div>
                                    <div className="att-card-name">{student.student_name}</div>
                                    <div className="att-card-email" style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: 8, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                        {student.email || '—'}
                                    </div>
                                    <div style={{ display: 'flex', gap: 5, marginBottom: 12 }}>
                                        <div className="att-card-section" style={{ background: '#eef2ff', color: '#4f46e5' }}>{student.batch || 'No Batch'}</div>
                                        <div className="att-card-section" style={{ background: '#f1f5f9', color: '#64748b' }}>{student.section}</div>
                                    </div>
                                    <div className={`att-pct-ring ${getPctColor(student.percentage)}`}>
                                        {student.percentage}%
                                    </div>
                                    <div className="att-days-info">
                                        {student.present_days}/{student.working_days} days present
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </>
            ) : (
                <div className="empty-state">
                    <div className="empty-icon">📊</div>
                    <p>No data available for this month.</p>
                </div>
            )}
        </div>
    )
}

export default AttendanceDashboard
