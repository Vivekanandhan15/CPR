import React, { useState, useEffect } from 'react'
import './attendance.css'

const BASE_URL = import.meta.env.VITE_BASE_URL
const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

function WorkingDays() {
    const currentMonth = new Date().toISOString().slice(0, 7)
    const [month, setMonth] = useState(currentMonth)
    const [holidays, setHolidays] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [actionMsg, setActionMsg] = useState(null)

    useEffect(() => {
        fetchHolidays()
    }, [month])

    const fetchHolidays = async () => {
        setLoading(true)
        setError(null)
        try {
            const token = localStorage.getItem('token')
            const res = await fetch(`${BASE_URL}/holidays/month/${month}`, {
                headers: { Authorization: `Bearer ${token}` }
            })
            if (!res.ok) throw new Error('Failed to fetch holidays')
            setHolidays(await res.json())
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    const toggleHoliday = async (dateStr, isHoliday) => {
        setActionMsg(null)
        const token = localStorage.getItem('token')
        try {
            if (isHoliday) {
                // Remove holiday
                const holiday = holidays.find(h => h.date === dateStr)
                if (!holiday) return
                const res = await fetch(`${BASE_URL}/holidays/${holiday.id}`, {
                    method: 'DELETE',
                    headers: { Authorization: `Bearer ${token}` }
                })
                if (!res.ok) throw new Error('Failed to remove holiday')
                setActionMsg('Date marked as working day')
            } else {
                // Add holiday - Ask for reason
                const reason = window.prompt(`Enter occasion/reason for holiday on ${dateStr}:`, 'Non-working day')
                if (reason === null) return // User cancelled

                const res = await fetch(`${BASE_URL}/holidays/`, {
                    method: 'POST',
                    headers: { 
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}` 
                    },
                    body: JSON.stringify({ date: dateStr, description: reason })
                })
                if (!res.ok) throw new Error('Failed to mark holiday')
                setActionMsg('Date marked as non-working day')
            }
            fetchHolidays()
            setTimeout(() => setActionMsg(null), 3000)
        } catch (err) {
            setError(err.message)
        }
    }

    const setWeekendsAsHolidays = async () => {
        if (!window.confirm(`Mark all Saturdays and Sundays in ${monthLabel()} as non-working days?`)) return
        
        const [y, m] = month.split('-').map(Number)
        const daysInMonth = new Date(y, m, 0).getDate()
        const weekendDates = []

        for (let d = 1; d <= daysInMonth; d++) {
            const dateObj = new Date(y, m - 1, d)
            const dayOfWeek = dateObj.getDay() // 0 = Sun, 6 = Sat
            if (dayOfWeek === 0 || dayOfWeek === 6) {
                const dateStr = `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`
                weekendDates.push({ date: dateStr, description: 'Weekend' })
            }
        }

        setActionMsg('Processing weekends...')
        const token = localStorage.getItem('token')
        try {
            const res = await fetch(`${BASE_URL}/holidays/bulk`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}` 
                },
                body: JSON.stringify(weekendDates)
            })
            if (!res.ok) throw new Error('Failed to set weekends')
            const result = await res.json()
            setActionMsg(`Successfully set ${result.count} weekends as holidays`)
            fetchHolidays()
            setTimeout(() => setActionMsg(null), 3000)
        } catch (err) {
            setError(err.message)
        }
    }

    const changeMonth = (dir) => {
        const [y, m] = month.split('-').map(Number)
        const d = new Date(y, m - 1 + dir, 1)
        setMonth(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`)
    }

    const monthLabel = () => {
        const [y, m] = month.split('-').map(Number)
        return new Date(y, m - 1, 1).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })
    }

    const buildCalendar = () => {
        const [y, m] = month.split('-').map(Number)
        const firstDay = new Date(y, m - 1, 1).getDay()
        const daysInMonth = new Date(y, m, 0).getDate()

        const holidayMap = {}
        holidays.forEach(h => { holidayMap[h.date] = h.description })

        const cells = []
        for (let i = 0; i < firstDay; i++) cells.push(null)
        for (let d = 1; d <= daysInMonth; d++) {
            const dateStr = `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`
            cells.push({ 
                day: d, 
                date: dateStr, 
                isHoliday: !!holidayMap[dateStr],
                reason: holidayMap[dateStr] || null
            })
        }
        return cells
    }

    const cells = buildCalendar()

    return (
        <div>
            <div className="page-header">
                <div>
                    <h1>Working Day Details</h1>
                    <p>Manage academy holidays and non-working days</p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <button className="btn btn-secondary btn-sm" onClick={setWeekendsAsHolidays}>
                        📅 Set Weekends as Holidays
                    </button>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginLeft: 10 }}>
                        <button className="calendar-nav-btn" onClick={() => changeMonth(-1)}>‹ Prev</button>
                        <span style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text-primary)', minWidth: 160, textAlign: 'center' }}>
                            {monthLabel()}
                        </span>
                        <button className="calendar-nav-btn" onClick={() => changeMonth(1)}>Next ›</button>
                    </div>
                </div>
            </div>

            {actionMsg && (
                <div style={{ background: '#d1fae5', color: '#065f46', borderRadius: 8, padding: '12px 18px', marginBottom: 16, fontSize: '0.88rem' }}>
                    ✅ {actionMsg}
                </div>
            )}
            {error && <div className="error-msg">⚠️ {error}</div>}

            <div className="month-calendar">
                <div className="calendar-header" style={{ justifyContent: 'center' }}>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Click on a date to toggle status. Holidays will prompt for an occasion/reason.</p>
                </div>

                <div className="calendar-grid">
                    {DAYS.map(d => (
                        <div key={d} className="calendar-day-label">{d}</div>
                    ))}
                    {cells.map((cell, i) => (
                        <div 
                            key={i} 
                            className={`calendar-cell ${!cell ? 'empty' : ''} ${cell?.isHoliday ? 'is-holiday' : ''}`}
                            onClick={() => cell && toggleHoliday(cell.date, cell.isHoliday)}
                            style={{ cursor: cell ? 'pointer' : 'default', position: 'relative' }}
                        >
                            {cell && (
                                <>
                                    <span className="day-num">{cell.day}</span>
                                    <span className={`day-status ${cell.isHoliday ? 'off' : 'present'}`}>
                                        {cell.isHoliday ? 'OFF' : 'WORK'}
                                    </span>
                                    {cell.isHoliday && cell.reason && (
                                        <div style={{ 
                                            fontSize: '0.62rem', 
                                            color: 'var(--danger-dark)', 
                                            marginTop: 4, 
                                            fontWeight: 600,
                                            maxWidth: '100%',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            whiteSpace: 'nowrap',
                                            padding: '0 4px'
                                        }} title={cell.reason}>
                                            {cell.reason}
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    ))}
                </div>

                <div style={{ padding: '14px 24px', borderTop: '1px solid var(--border)', display: 'flex', gap: 20, fontSize: '0.8rem' }}>
                    <span><span className="day-status present" style={{ marginRight: 6 }}>WORK</span>Working Day</span>
                    <span><span className="day-status absent" style={{ marginRight: 6 }}>OFF</span>Non-working Day / Holiday</span>
                </div>
            </div>
        </div>
    )
}

export default WorkingDays
