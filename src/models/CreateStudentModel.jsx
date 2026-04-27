import React, { useState } from 'react'
import './CreateStudentModel.css'

const BASE_URL = import.meta.env.VITE_BASE_URL

function CreateStudentModel({ onClose, onStudentCreated }) {
    const [formData, setFormData] = useState({
        student_name: "",
        email: "",
        section: "",
        batch: "",
        folder_link: ""
    })
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }
    const handleSubmit = async (e) => {
        e.preventDefault()
        const token = localStorage.getItem("token")
        try {
            const response = await fetch(
                `${BASE_URL}/students/`,
                {
                    method: 'POST',
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                    body: JSON.stringify(formData)
                }
            )
            if (!response.ok) {
                throw new Error("Failed to create student")
            }
            onStudentCreated()   
            onClose()            
        } catch (err) {
            console.error(err)
            alert("Something went wrong!")
        }
    }

    return (
        <div className="modal-overlay">
            <div className="modal-box">
                <h2>Create Student</h2>
                <form onSubmit={handleSubmit}>
                    <input
                        name="student_name"
                        value={formData.student_name}
                        placeholder="Student Name"
                        onChange={handleChange}
                        required
                    />
                    <input
                        name="email"
                        type="email"
                        value={formData.email}
                        placeholder="Student Email"
                        onChange={handleChange}
                        required
                        style={{ marginTop: 10 }}
                    />
                    <div style={{ display: 'flex', gap: 10, marginTop: 10 }}>
                        <input
                            name="section"
                            value={formData.section}
                            placeholder="Section"
                            onChange={handleChange}
                            required
                        />
                        <input
                            name="batch"
                            value={formData.batch}
                            placeholder="Batch"
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <input
                        name="folder_link"
                        value={formData.folder_link}
                        placeholder="Folder Link"
                        onChange={handleChange}
                        required
                        style={{ marginTop: 10 }}
                    />
                    <div className="modal-buttons">
                        <button type="submit" className="create">
                            Create
                        </button>
                        <button
                            type="button"
                            className="cancel"
                            onClick={onClose}
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default CreateStudentModel