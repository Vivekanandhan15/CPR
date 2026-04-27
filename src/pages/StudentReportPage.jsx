import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, useSearchParams } from 'react-router-dom'
import './attendance.css'

const BASE_URL = import.meta.env.VITE_BASE_URL

const COLOR_MAP = {
    GREEN: '#10b981',
    YELLOW: '#f59e0b',
    RED: '#ef4444',
    ORANGE: '#f97316',
    BLUE: '#3b82f6',
}

function StudentReportPage() {
    const { id } = useParams()
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()
    const studentName = searchParams.get('name') || 'Student'

    const [student, setStudent] = useState(null)
    const [cprs, setCprs] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [selectedCpr, setSelectedCpr] = useState(null)

    useEffect(() => { fetchReport() }, [id])

    const fetchReport = async () => {
        setLoading(true)
        setError(null)
        try {
            const token = localStorage.getItem('token')

            // Fetch student info
            const sRes = await fetch(`${BASE_URL}/students/`, {
                headers: { Authorization: `Bearer ${token}` }
            })
            if (sRes.ok) {
                const students = await sRes.json()
                setStudent(students.find(s => String(s.id) === String(id)))
            }

            // Fetch CPRs
            const cRes = await fetch(`${BASE_URL}/cpr/student/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            })
            if (!cRes.ok) throw new Error('Failed to load CPR reports')
            setCprs(await cRes.json())
        } catch (err) {
            setError('Failed to load report data.')
        } finally {
            setLoading(false)
        }
    }

    const info = student || { student_name: studentName, section: '', batch: '' }

    return (
        <div>
            <button className="back-link" onClick={() => navigate(-1)}>
                ← Back to Reports
            </button>

            {loading ? (
                <div className="loading-spinner">⏳ Loading reports...</div>
            ) : error ? (
                <div className="error-msg">{error}</div>
            ) : (
                <>
                    {/* Student Header */}
                    <div className="report-student-header">
                        <div className="big-avatar">{info.student_name?.[0]?.toUpperCase()}</div>
                        <div>
                            <h2>{info.student_name}</h2>
                            <p>
                                {info.batch ? <strong>{info.batch}</strong> : ''}
                                {info.section ? ` · Section ${info.section}` : ''}
                                &nbsp;·&nbsp; {cprs.length} CPR Report{cprs.length !== 1 ? 's' : ''}
                            </p>
                        </div>
                    </div>

                    {/* CPR Cards */}
                    {cprs.length === 0 ? (
                        <div className="empty-state">
                            <div className="empty-icon">📝</div>
                            <p>No CPR reports found for this student.</p>
                        </div>
                    ) : (
                        <>
                            <h3 className="section-title">📋 CPR History</h3>
                            <div className="cpr-history-grid">
                                {cprs.map(cpr => (
                                    <div 
                                        key={cpr.id} 
                                        className="cpr-card" 
                                        onClick={() => setSelectedCpr(cpr)}
                                    >
                                        <div className="cpr-card-top">
                                            <span 
                                                className="color-badge"
                                                style={{ background: COLOR_MAP[cpr.color_code?.toUpperCase()] || '#94a3b8' }}
                                            >
                                                {cpr.color_code?.toUpperCase() || 'CPR'}
                                            </span>
                                            <span className="cpr-date">
                                                {cpr.created_at ? new Date(cpr.created_at).toLocaleDateString('en-IN', {
                                                    day: 'numeric', month: 'short', year: 'numeric'
                                                }) : '—'}
                                            </span>
                                        </div>
                                        <div className="cpr-field">
                                            <span>👤</span> By: {cpr.staff_name}
                                        </div>
                                        <div className="cpr-preview">
                                            "{cpr.staff_comments || 'No comments'}"
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                </>
            )}

            {/* CPR Detail Overlay */}
            {selectedCpr && (
                <div className="modal-overlay" onClick={() => setSelectedCpr(null)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>CPR Detailed Report</h2>
                            <button className="close-btn" onClick={() => setSelectedCpr(null)}>×</button>
                        </div>
                        
                        <div className="modal-body">
                            <div className="detail-grid">
                                <div className="detail-item">
                                    <label>Report Date</label>
                                    <p>{new Date(selectedCpr.created_at).toLocaleDateString('en-IN', { 
                                        day: 'numeric', month: 'long', year: 'numeric'
                                    })}</p>
                                </div>
                                <div className="detail-item">
                                    <label>Evaluation Status</label>
                                    <p style={{ color: COLOR_MAP[selectedCpr.color_code?.toUpperCase()] }}>
                                        {selectedCpr.color_code?.toUpperCase()}
                                    </p>
                                </div>
                                <div className="detail-item">
                                    <label>Staff Member</label>
                                    <p>{selectedCpr.staff_name}</p>
                                </div>
                                <div className="detail-item">
                                    <label>Student Name</label>
                                    <p>{info.student_name}</p>
                                </div>
                            </div>

                            <div className="report-section">
                                <h3><span>💬</span> Student Comments</h3>
                                <div className="comment-box">
                                    {selectedCpr.staff_comments || "No comments provided."}
                                </div>
                            </div>

                            {selectedCpr.manager_comments && (
                                <div className="report-section">
                                    <h3><span>👨‍🏫</span> Coach Comments</h3>
                                    <div className="comment-box accent">
                                        {selectedCpr.manager_comments}
                                    </div>
                                </div>
                            )}

                            {selectedCpr.idp && (
                                <div className="report-section">
                                    <h3><span>🎯</span> Individual Development Plan (IDP)</h3>
                                    <div className="comment-box info">
                                        {selectedCpr.idp}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="modal-footer">
                            <button className="btn btn-secondary" onClick={() => setSelectedCpr(null)}>Close</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default StudentReportPage
