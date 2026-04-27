import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import './Student.css'
import './attendance.css'

const BASE_URL = import.meta.env.VITE_BASE_URL

function Reports() {
    const navigate = useNavigate()
    const [students, setStudents] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [selectedSection, setSelectedSection] = useState('')
    const [selectedBatch, setSelectedBatch] = useState('')
    const [search, setSearch] = useState('')

    useEffect(() => {
        const fetchStudents = async () => {
            try {
                const token = localStorage.getItem('token')
                if (!token) { setError('No token found, please login'); setLoading(false); return }
                const res = await fetch(`${BASE_URL}/students/`, {
                    headers: { Authorization: `Bearer ${token}` }
                })
                if (!res.ok) throw new Error(`Server Error ${res.status}`)
                setStudents(await res.json())
            } catch (err) {
                setError('Failed to fetch students')
            } finally {
                setLoading(false)
            }
        }
        fetchStudents()
    }, [])

    const sections = [...new Set(students.map(s => s.section).filter(Boolean))]
    const batches = [...new Set(students.map(s => s.batch).filter(Boolean))]

    const filteredStudents = students
        .filter(s => selectedSection ? s.section === selectedSection : true)
        .filter(s => selectedBatch ? s.batch === selectedBatch : true)
        .filter(s => search ? s.student_name.toLowerCase().includes(search.toLowerCase()) : true)

    return (
        <div>
            <div className="page-header">
                <div>
                    <h1>Student Reports</h1>
                    <p>Click on a student card to view their full CPR report</p>
                </div>
            </div>

            {/* Toolbar */}
            <div className="toolbar">
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
            </div>

            {loading && <div className="loading-spinner">⏳ Loading students...</div>}
            {error && <div className="error-msg">⚠️ {error}</div>}

            <div className="student-attendance-grid">
                {filteredStudents.map(student => (
                    <div
                        key={student.id}
                        className="student-att-card"
                        onClick={() => navigate(`/student-report/${student.id}?name=${encodeURIComponent(student.student_name)}`)}
                    >
                        <div className="att-avatar">{student.student_name?.[0]?.toUpperCase() || '?'}</div>
                        <div className="att-card-name">{student.student_name}</div>
                        {/* ✅ Added Email */}
                        <div style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: 8, textAlign: 'center', width: '100%', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {student.email || '—'}
                        </div>
                        <div style={{ display: 'flex', gap: 6, marginBottom: 12 }}>
                            <span className="att-card-section" style={{ background: '#eef2ff', color: '#4f46e5' }}>{student.batch || 'No Batch'}</span>
                            <span className="att-card-section">Section {student.section}</span>
                        </div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 600 }}>
                            View CPR Reports →
                        </div>
                    </div>
                ))}
            </div>

            {!loading && filteredStudents.length === 0 && (
                <div className="empty-state">
                    <div className="empty-icon">👥</div>
                    <p>No students found.</p>
                </div>
            )}
        </div>
    )
}

export default Reports