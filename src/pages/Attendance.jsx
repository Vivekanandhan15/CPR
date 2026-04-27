import React, { useState, useEffect } from 'react'
import './attendance.css'

const BASE_URL = import.meta.env.VITE_BASE_URL

function Attendance() {
    const [students, setStudents] = useState([])
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState(null)
    const [successMsg, setSuccessMsg] = useState(null)
    const [attendance, setAttendance] = useState({})
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
    const [selectedSection, setSelectedSection] = useState('')
    const [selectedBatch, setSelectedBatch] = useState('')
    const [search, setSearch] = useState('')

    useEffect(() => { fetchStudents() }, [])

    const fetchStudents = async () => {
        try {
            setLoading(true)
            const token = localStorage.getItem('token')
            if (!token) { setError('No token found, please login'); setLoading(false); return }
            const res = await fetch(`${BASE_URL}/students/`, { headers: { Authorization: `Bearer ${token}` } })
            if (!res.ok) throw new Error(`Server Error ${res.status}`)
            const data = await res.json()
            setStudents(data)
            const init = {}
            data.forEach(s => { init[s.id] = 'PRESENT' })
            setAttendance(init)
        } catch (err) {
            setError('Failed to fetch students')
        } finally {
            setLoading(false)
        }
    }

    const toggle = (id, status) => setAttendance(prev => ({ ...prev, [id]: status }))

    const markAllPresent = () => {
        const all = {}
        filteredStudents.forEach(s => { all[s.id] = 'PRESENT' })
        setAttendance(prev => ({ ...prev, ...all }))
    }

    const markAllAbsent = () => {
        const all = {}
        filteredStudents.forEach(s => { all[s.id] = 'ABSENT' })
        setAttendance(prev => ({ ...prev, ...all }))
    }

    const handleSave = async () => {
        setSaving(true)
        setError(null)
        setSuccessMsg(null)
        const token = localStorage.getItem('token')
        const payload = filteredStudents.map(s => ({
            batch_id: 1, // Defaulting to 1 for logic, but student record has batch string
            student_id: s.id,
            status: attendance[s.id] || 'PRESENT',
            date: selectedDate
        }))
        try {
            const res = await fetch(`${BASE_URL}/attendance/mark-bulk`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify(payload)
            })
            if (!res.ok) {
                const err = await res.json()
                throw new Error(err.detail || 'Failed to save attendance')
            }
            setSuccessMsg(`Attendance saved for ${payload.length} students on ${selectedDate}`)
            setTimeout(() => setSuccessMsg(null), 4000)
        } catch (err) {
            setError(err.message)
        } finally {
            setSaving(false)
        }
    }

    const sections = [...new Set(students.map(s => s.section).filter(Boolean))]
    const batches = [...new Set(students.map(s => s.batch).filter(Boolean))]

    const filteredStudents = students
        .filter(s => selectedSection ? s.section === selectedSection : true)
        .filter(s => selectedBatch ? s.batch === selectedBatch : true)
        .filter(s => search ? s.student_name.toLowerCase().includes(search.toLowerCase()) : true)

    const presentCount = filteredStudents.filter(s => attendance[s.id] === 'PRESENT').length
    const absentCount = filteredStudents.filter(s => attendance[s.id] === 'ABSENT').length

    return (
        <div>
            <div className="page-header">
                <div>
                    <h1>Mark Attendance</h1>
                    <p>Record daily attendance for students</p>
                </div>
            </div>

            {/* Toolbar */}
            <div className="toolbar">
                <input
                    type="date"
                    value={selectedDate}
                    onChange={e => setSelectedDate(e.target.value)}
                />
                <select value={selectedBatch} onChange={e => setSelectedBatch(e.target.value)}>
                    <option value="">All Batches</option>
                    {batches.map(b => <option key={b} value={b}>{b}</option>)}
                </select>
                <select value={selectedSection} onChange={e => setSelectedSection(e.target.value)}>
                    <option value="">All Sections</option>
                    {sections.map(sec => <option key={sec} value={sec}>{sec}</option>)}
                </select>
                <input
                    type="text"
                    placeholder="🔍  Search students..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    style={{ flex: 1 }}
                />
                <div className="toolbar-divider" />
                <div className="toolbar-actions">
                    <button className="btn btn-secondary btn-sm" onClick={markAllPresent}>✓ All Present</button>
                    <button className="btn btn-secondary btn-sm" onClick={markAllAbsent}>✗ All Absent</button>
                    <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
                        {saving ? '⏳ Saving...' : '💾 Save Attendance'}
                    </button>
                </div>
            </div>

            {/* Alerts */}
            {error && <div className="error-msg">⚠️ {error}</div>}
            {successMsg && (
                <div style={{ background: '#d1fae5', color: '#065f46', borderRadius: 8, padding: '12px 18px', marginBottom: 16, fontSize: '0.88rem' }}>
                    ✅ {successMsg}
                </div>
            )}

            {/* Summary bar */}
            {!loading && (
                <div className="stats-row" style={{ marginBottom: 20 }}>
                    <div className="stat-card">
                        <div className="stat-label">Total Students</div>
                        <div className="stat-value">{filteredStudents.length}</div>
                    </div>
                    <div className="stat-card accent-green">
                        <div className="stat-label">Present</div>
                        <div className="stat-value">{presentCount}</div>
                    </div>
                    <div className="stat-card accent-red">
                        <div className="stat-label">Absent</div>
                        <div className="stat-value">{absentCount}</div>
                    </div>
                    <div className="stat-card accent-blue">
                        <div className="stat-label">Attendance %</div>
                        <div className="stat-value">
                            {filteredStudents.length > 0 ? Math.round(presentCount / filteredStudents.length * 100) : 0}%
                        </div>
                    </div>
                </div>
            )}

            {/* Table */}
            {loading ? (
                <div className="loading-spinner">⏳ Loading students...</div>
            ) : (
                <div className="attendance-table-card">
                    {filteredStudents.length === 0 ? (
                        <div className="empty-state">
                            <div className="empty-icon">👥</div>
                            <p>No students found</p>
                        </div>
                    ) : (
                        <table className="att-table">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Student</th>
                                    <th>Batch / Section</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredStudents.map((student, idx) => (
                                    <tr key={student.id}>
                                        <td style={{ color: 'var(--text-muted)', width: 48 }}>{idx + 1}</td>
                                        <td>
                                            <div className="student-cell">
                                                <div className="mini-avatar">{student.student_name?.[0]?.toUpperCase() || '?'}</div>
                                                <span style={{ fontWeight: 500 }}>{student.student_name}</span>
                                            </div>
                                        </td>
                                        <td>
                                            <div style={{ display: 'flex', gap: 6 }}>
                                                <span className="section-badge" style={{ background: '#eef2ff', color: '#4f46e5' }}>{student.batch || 'No Batch'}</span>
                                                <span className="section-badge">Section {student.section}</span>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="toggle-group">
                                                <button
                                                    className={`toggle-btn ${attendance[student.id] === 'PRESENT' ? 'present-active' : ''}`}
                                                    onClick={() => toggle(student.id, 'PRESENT')}
                                                >P</button>
                                                <button
                                                    className={`toggle-btn ${attendance[student.id] === 'ABSENT' ? 'absent-active' : ''}`}
                                                    onClick={() => toggle(student.id, 'ABSENT')}
                                                >A</button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            )}
        </div>
    )
}

export default Attendance