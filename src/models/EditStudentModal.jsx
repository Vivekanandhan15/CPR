import { useState } from "react"
import "./EditStudentModal.css"

const BASE_URL = import.meta.env.VITE_BASE_URL || "http://127.0.0.1:8000"

function EditStudentModal({ student, onClose }) {

    const [form, setForm] = useState(() => ({
        student_name: student?.student_name || "",
        email: student?.email || "",
        section: student?.section || "",
        batch: student?.batch || "",
        folder_link: student?.folder_link || ""
    }))

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")

    const handleChange = (e) => {
        const { name, value } = e.target
        setForm(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleSubmit = async () => {
        if (!student?.id) {
            setError("Invalid student data")
            return
        }
    const token = localStorage.getItem('token')
        try {
            setLoading(true)
            setError("")

            const res = await fetch(`${BASE_URL}/students/${student.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(form)
            })

            if (!res.ok) {
                throw new Error("Failed to update student")
            }

            const data = await res.json()
            console.log("Updated:", data)

            onClose()

        } catch (err) {
            setError(err.message || "Something went wrong")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="modal-overlay">
            <div className="modal-box">
                <h3>Edit Student</h3>

                {error && <p style={{ color: "red" }}>{error}</p>}

                <div className="form-group">
                    <label>Student Name</label>
                    <input
                        name="student_name"
                        value={form.student_name}
                        onChange={handleChange}
                        placeholder="Name"
                    />
                </div>

                <div className="form-group">
                    <label>Email Address</label>
                    <input
                        name="email"
                        type="email"
                        value={form.email}
                        onChange={handleChange}
                        placeholder="Email Address"
                    />
                </div>

                <div style={{ display: 'flex', gap: 10 }}>
                    <div className="form-group" style={{ flex: 1 }}>
                        <label>Section</label>
                        <input
                            name="section"
                            value={form.section}
                            onChange={handleChange}
                            placeholder="Section"
                        />
                    </div>
                    <div className="form-group" style={{ flex: 1 }}>
                        <label>Batch</label>
                        <input
                            name="batch"
                            value={form.batch}
                            onChange={handleChange}
                            placeholder="Batch"
                        />
                    </div>
                </div>

                <div className="form-group">
                    <label>Folder Link</label>
                    <input
                        name="folder_link"
                        value={form.folder_link}
                        onChange={handleChange}
                        placeholder="Folder Link"
                    />
                </div>

                <div className="actions" style={{ marginTop: 20 }}>
                    <button onClick={onClose} disabled={loading}>
                        Cancel
                    </button>

                    <button onClick={handleSubmit} disabled={loading} className="save-btn" style={{ background: 'var(--primary)', color: 'white' }}>
                        {loading ? "Saving..." : "Save"}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default EditStudentModal