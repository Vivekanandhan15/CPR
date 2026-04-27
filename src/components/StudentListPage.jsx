import React, { useState } from 'react'
import './StudentPageList.css'
import EditStudentModal from '../models/EditStudentModal'

const BASE_URL = import.meta.env.VITE_BASE_URL

function StudentListPage({ students = [], loading, error, onRefresh }) {

    const [selectedStudent, setSelectedStudent] = useState(null)
    const [showModal, setShowModal] = useState(false)
    const [deletingId, setDeletingId] = useState(null)

    if (loading) return <p>Loading...</p>
    if (error) return <p style={{ color: "red" }}>{error}</p>

    const handleEdit = (student) => {
        setSelectedStudent(student)
        setShowModal(true)
    }

    const handleDelete = async (student) => {
        if (!window.confirm(`Are you sure you want to delete ${student.student_name}? This action cannot be undone.`)) {
            return
        }

        const token = localStorage.getItem("token")
        try {
            setDeletingId(student.id)
            const response = await fetch(`${BASE_URL}/students/${student.id}`, {
                method: 'DELETE',
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            })

            if (!response.ok) {
                throw new Error("Failed to delete student")
            }

            alert("Student deleted successfully")
            if (onRefresh) onRefresh()
        } catch (err) {
            console.error(err)
            alert(err.message || "Failed to delete student")
        } finally {
            setDeletingId(null)
        }
    }

    return (
        <div className="students-container">
            <h2 className="page-title">Students Table</h2>

            <div className="table-card">
                <table className="students-table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Batch</th>
                            <th>Section</th>
                            <th>Created At</th>
                            <th>Folder Link</th>
                            <th>Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {students.length === 0 ? (
                            <tr>
                                <td colSpan="7">No students found</td>
                            </tr>
                        ) : (
                            students.map((student) => (
                                <tr key={student.id} style={{ opacity: deletingId === student.id ? 0.5 : 1 }}>
                                    <td style={{ fontWeight: 600 }}>{student.student_name}</td>
                                    <td style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                                        {student.email || '—'}
                                    </td>
                                    <td>
                                        <span className="batch-pill" style={{ background: '#eef2ff', color: '#4f46e5', padding: '2px 8px', borderRadius: 999, fontSize: '0.75rem', fontWeight: 700 }}>
                                            {student.batch || '—'}
                                        </span>
                                    </td>
                                    <td>{student.section}</td>

                                    <td>
                                        {student.created_at
                                            ? new Date(student.created_at).toLocaleDateString('en-IN')
                                            : "N/A"}
                                    </td>

                                    <td style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                                        {student.folder_link ? (
                                            <a href={student.folder_link} target="_blank" rel="noreferrer" style={{ color: 'inherit' }}>
                                                Link ↗
                                            </a>
                                        ) : '—'}
                                    </td>

                                    <td>
                                        <div style={{ display: 'flex', gap: 6 }}>
                                            <button
                                                className='btn btnedit'
                                                onClick={() => handleEdit(student)}
                                                disabled={deletingId === student.id}
                                                style={{ padding: '4px 10px', fontSize: '0.75rem' }}>
                                                Edit
                                            </button>

                                            <button
                                                className='btn btndelete'
                                                onClick={() => handleDelete(student)}
                                                disabled={deletingId === student.id}
                                                style={{ padding: '4px 10px', fontSize: '0.75rem', background: '#fee2e2', color: '#dc2626', border: '1px solid #fecaca' }}>
                                                {deletingId === student.id ? '...' : 'Delete'}
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {showModal && (
                <EditStudentModal
                    student={selectedStudent}
                    onClose={() => {
                        setShowModal(false)
                        if (onRefresh) onRefresh()
                    }}
                />
            )}
        </div>
    )
}

export default StudentListPage