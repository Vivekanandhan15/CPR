import React, { useState, useEffect } from 'react'
import './Student.css'
import CreateStudentModel from '../models/CreateStudentModel'
import BulkCreateStudentModel from '../models/BulkCreateStudentModel'
import StudentListPage from '../components/StudentListPage'

const BASE_URL = import.meta.env.VITE_BASE_URL

function Student() {
    const [showForm, setShowForm] = useState(false)
    const [showBulkForm, setShowBulkForm] = useState(false)
    const [students, setStudents] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [selectedSection, setSelectedSection] = useState('')
    const [selectedBatch, setSelectedBatch] = useState('')
    const [search, setSearch] = useState('')

    useEffect(() => {
        fetchStudents()
    }, [])

    const fetchStudents = async () => {
        try {
            const token = localStorage.getItem("token")
            if (!token) {
                setError("No token found, please login")
                setLoading(false)
                return
            }

            const response = await fetch(
                `${BASE_URL}/students/`,
                {
                    method: 'GET',
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                }
            )

            if (!response.ok) {
                throw new Error(`Server Error ${response.status}`)
            }

            const data = await response.json()
            setStudents(data)
            setLoading(false)

        } catch (err) {
            console.error(err)
            setError("Failed to fetch students")
            setLoading(false)
        }
    }

    const sections = [...new Set(students.map(s => s.section).filter(Boolean))]
    const batches = [...new Set(students.map(s => s.batch).filter(Boolean))]

    const filteredStudents = students
        .filter(student => selectedSection ? student.section === selectedSection : true)
        .filter(student => selectedBatch ? student.batch === selectedBatch : true)
        .filter(student => search ? student.student_name.toLowerCase().includes(search.toLowerCase()) : true)

    return (
        <div>
            <div className="student-content">
                <div>
                    <h1>Students Management</h1>
                    <p>View, add, edit, and manage student records.</p>
                </div>

                <div className="filters">
                    <select value={selectedBatch} onChange={(e) => setSelectedBatch(e.target.value)}>
                        <option value="">All Batches</option>
                        {batches.map(batch => (
                            <option key={batch} value={batch}>{batch}</option>
                        ))}
                    </select>
                    <select value={selectedSection} onChange={(e) => setSelectedSection(e.target.value)}>
                        <option value="">All Sections</option>
                        {sections.map(section => (
                            <option key={section} value={section}>{section}</option>
                        ))}
                    </select>
                    <input
                        type="text"
                        placeholder="Search students..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                <div className="create-btn">
                    <button onClick={() => setShowForm(true)}>
                        + Create Student
                    </button>
                    <button onClick={() => setShowBulkForm(true)}>
                        + Bulk Create Students
                    </button>
                </div>
            </div>

            {showForm && (
                <CreateStudentModel
                    onClose={() => setShowForm(false)}
                    onStudentCreated={fetchStudents}
                />
            )}

            {showBulkForm && (
                <BulkCreateStudentModel
                    onClose={() => setShowBulkForm(false)}
                    onStudentsCreated={fetchStudents}
                />
            )}

            <StudentListPage
                students={filteredStudents}
                loading={loading}
                error={error}
                onRefresh={fetchStudents} // ✅ Added onRefresh prop
            />
        </div>
    )
}

export default Student