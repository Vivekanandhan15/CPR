import { Navigate, useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import './fillcpr.css'

const BASE_URL = import.meta.env.VITE_BASE_URL

function FillCpr() {
  const navigate = useNavigate()

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
        setError("No token found. Please login.")
        setLoading(false)
        return <Navigate to={'/login'} />
      }

      const res = await fetch(`${BASE_URL}/students/`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      })

      if (!res.ok) {
        throw new Error("Failed to fetch students")
      }

      const data = await res.json()
      setStudents(data)

    } catch (err) {
      console.error(err)
      setError("Error loading students")
    } finally {
      setLoading(false)
    }
  }

  const handleSelectStudent = (student) => {
    navigate(`/fill-cpr/${student.id}`, { state: student })
  }

  const sections = [...new Set(students.map(s => s.section).filter(s => s))]
  const batches = [...new Set(students.map(s => s.batch).filter(s => s))]

  const filteredStudents = students
    .filter(student => selectedSection ? student.section === selectedSection : true)
    .filter(student => selectedBatch ? student.batch === selectedBatch : true)
    .filter(student => search ? student.student_name.toLowerCase().includes(search.toLowerCase()) : true)

  if (loading) return <p>Loading...</p>
  if (error) return <p style={{ color: "red" }}>{error}</p>

  return (
    <div className="fillcpr-container">
      <h2 className="fillcpr-title">Select Student to Fill CPR</h2>

      <div className="toolbar" style={{ marginBottom: '24px' }}>
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
          placeholder="🔍  Search students..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ flex: 1 }}
        />
      </div>

      <div className="student-list">
        {filteredStudents.length === 0 ? (
          <div className="empty-state" style={{ gridColumn: '1/-1' }}>
             <p>No students found matching your criteria.</p>
          </div>
        ) : (
          filteredStudents.map((student) => (
            <div
              key={student.id}
              className="student-card"
              onClick={() => handleSelectStudent(student)}
            >
              <div className="student-avatar">
                {student.student_name?.[0] || "?"}
              </div>

              <div className="student-name">
                {student.student_name}
              </div>

              <div className="student-email" style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: 8 }}>
                {student.email || 'No Email'}
              </div>

              <div style={{ display: 'flex', gap: 6 }}>
                <span className="batch-pill" style={{ background: '#eef2ff', color: '#4f46e5', padding: '1px 8px', borderRadius: 999, fontSize: '0.7rem', fontWeight: 700 }}>
                    {student.batch || 'No Batch'}
                </span>
                <span className="section-pill" style={{ background: '#f1f5f9', color: '#64748b', padding: '1px 8px', borderRadius: 999, fontSize: '0.7rem', fontWeight: 700 }}>
                    Sec {student.section}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default FillCpr