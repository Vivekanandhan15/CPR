import React, { useState, useEffect } from 'react'
import './attendance.css'

const BASE_URL = import.meta.env.VITE_BASE_URL

const STATUS_FILTERS = ['ALL', 'PENDING', 'APPROVED', 'REJECTED']

function AcademyLeaves() {
    const [leaves, setLeaves] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [filter, setFilter] = useState('ALL')
    const [selectedBatch, setSelectedBatch] = useState('')
    const [selectedSection, setSelectedSection] = useState('')
    const [search, setSearch] = useState('')
    const [actionMsg, setActionMsg] = useState(null)
    const [actionError, setActionError] = useState(null)

    useEffect(() => { fetchLeaves() }, [])

    const fetchLeaves = async () => {
        setLoading(true)
        setError(null)
        try {
            const token = localStorage.getItem('token')
            const res = await fetch(`${BASE_URL}/leaves/all`, {
                headers: { Authorization: `Bearer ${token}` }
            })
            if (!res.ok) throw new Error(`Server error ${res.status}`)
            setLeaves(await res.json())
        } catch (err) {
            setError('Failed to load leave requests. You may need ADMIN/TEACHER access.')
        } finally {
            setLoading(false)
        }
    }

    const handleAction = async (leaveId, status) => {
        setActionMsg(null)
        setActionError(null)
        try {
            const token = localStorage.getItem('token')
            const res = await fetch(`${BASE_URL}/leaves/${leaveId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify({ status })
            })
            if (!res.ok) {
                const err = await res.json()
                throw new Error(err.detail || 'Action failed')
            }
            setActionMsg(`Leave #${leaveId} has been ${status.toLowerCase()}.`)
            fetchLeaves()
            setTimeout(() => setActionMsg(null), 3000)
        } catch (err) {
            setActionError(err.message)
            setTimeout(() => setActionError(null), 4000)
        }
    }

    const batches = [...new Set(leaves.map(l => l.batch).filter(Boolean))]
    const sections = [...new Set(leaves.map(l => l.section).filter(Boolean))]

    const filtered = leaves.filter(l => {
        const matchesStatus = filter === 'ALL' ? true : l.status === filter || (filter === 'PENDING' && l.status === 'PENDING_ADMIN');
        const matchesBatch = selectedBatch ? l.batch === selectedBatch : true;
        const matchesSection = selectedSection ? l.section === selectedSection : true;
        const matchesSearch = search ? l.student_name.toLowerCase().includes(search.toLowerCase()) : true;
        return matchesStatus && matchesBatch && matchesSection && matchesSearch;
    })

    const counts = {
        ALL: leaves.length,
        PENDING: leaves.filter(l => l.status === 'PENDING' || l.status === 'PENDING_ADMIN').length,
        APPROVED: leaves.filter(l => l.status === 'APPROVED').length,
        REJECTED: leaves.filter(l => l.status === 'REJECTED').length,
    }

    return (
        <div>
            <div className="page-header">
                <div>
                    <h1>Leave Management</h1>
                    <p>Review and manage student leave requests</p>
                </div>
            </div>

            {/* Toolbar */}
            <div className="toolbar" style={{ marginBottom: 20 }}>
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

            {/* Filter tabs */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap' }}>
                {STATUS_FILTERS.map(f => (
                    <button
                        key={f}
                        onClick={() => setFilter(f)}
                        style={{
                            padding: '8px 20px',
                            borderRadius: 999,
                            border: '1.5px solid',
                            borderColor: filter === f ? 'var(--primary)' : 'var(--border)',
                            background: filter === f ? 'var(--primary)' : '#fff',
                            color: filter === f ? '#fff' : 'var(--text-secondary)',
                            fontWeight: 600,
                            fontSize: '0.85rem',
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            fontFamily: 'Inter, sans-serif',
                        }}
                    >
                        {f} {counts[f] > 0 && <span style={{ opacity: 0.8 }}>({counts[f]})</span>}
                    </button>
                ))}
            </div>

            {/* Alerts */}
            {actionMsg && (
                <div style={{ background: '#d1fae5', color: '#065f46', borderRadius: 8, padding: '12px 18px', marginBottom: 16, fontSize: '0.88rem' }}>
                    ✅ {actionMsg}
                </div>
            )}
            {actionError && <div className="error-msg">⚠️ {actionError}</div>}
            {error && <div className="error-msg">⚠️ {error}</div>}

            {/* Leave List */}
            {loading ? (
                <div className="loading-spinner">⏳ Loading leave requests...</div>
            ) : filtered.length === 0 ? (
                <div className="empty-state">
                    <div className="empty-icon">📋</div>
                    <p>No {filter !== 'ALL' ? filter.toLowerCase() : ''} leave requests found.</p>
                </div>
            ) : (
                <div className="leaves-card">
                    <div className="leaves-card-header">
                        <h2>Leave Requests</h2>
                        <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>{filtered.length} records</span>
                    </div>

                    {filtered.map(leave => (
                        <div key={leave.leave_id} className="leave-item">
                            <div className="att-avatar" style={{ width: 42, height: 42, fontSize: '1rem', flexShrink: 0 }}>
                                {leave.student_name?.[0]?.toUpperCase() || '?'}
                            </div>
                            <div className="leave-info">
                                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                    <div className="leave-student">{leave.student_name}</div>
                                    <span className="batch-pill" style={{ background: '#eef2ff', color: '#4f46e5', padding: '1px 8px', borderRadius: 999, fontSize: '0.7rem', fontWeight: 700 }}>
                                        {leave.batch}
                                    </span>
                                </div>
                                <div className="leave-date">
                                    📅 {new Date(leave.date + 'T00:00:00').toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                                    <span style={{ marginLeft: 12, color: 'var(--text-muted)' }}>Section {leave.section}</span>
                                    {leave.requested_at && (
                                        <span style={{ marginLeft: 12, color: 'var(--text-muted)' }}>
                                            · {leave.requested_at}
                                        </span>
                                    )}
                                </div>
                                {leave.reason && <div className="leave-reason">"{leave.reason}"</div>}
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
                                <span className={`status-badge ${leave.status}`}>{leave.status.replace('_', ' ')}</span>

                                {(leave.status === 'PENDING' || leave.status === 'PENDING_ADMIN') && (
                                    <div className="leave-actions">
                                        <button
                                            className="btn btn-success btn-sm"
                                            onClick={() => handleAction(leave.leave_id, 'APPROVED')}
                                        >✓ Approve</button>
                                        <button
                                            className="btn btn-danger btn-sm"
                                            onClick={() => handleAction(leave.leave_id, 'REJECTED')}
                                        >✗ Reject</button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default AcademyLeaves
