import React, { useState } from 'react'
import * as XLSX from 'xlsx'
import './BulkCreateStudentModel.css'

const BASE_URL = import.meta.env.VITE_BASE_URL

function BulkCreateStudentModel({ onClose, onStudentsCreated }) {
    const [file, setFile] = useState(null)
    const [previewData, setPreviewData] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0]
        if (!selectedFile) return

        setFile(selectedFile)
        setError(null)

        const reader = new FileReader()
        reader.onload = (evt) => {
            try {
                const bstr = evt.target.result
                const wb = XLSX.read(bstr, { type: 'binary' })
                const wsname = wb.SheetNames[0]
                const ws = wb.Sheets[wsname]
                const data = XLSX.utils.sheet_to_json(ws)
                
                // Map columns to match our schema
                // Expected columns: Name, Email, Batch, Section, Folder Link
                const mappedData = data.map(row => ({
                    student_name: row.Name || row.name || row.student_name || "",
                    email: row.Email || row.email || "",
                    batch: row.Batch || row.batch || "",
                    section: row.Section || row.section || "",
                    folder_link: row["Folder Link"] || row.folder_link || ""
                })).filter(s => s.student_name) // Skip empty rows

                setPreviewData(mappedData)
            } catch (err) {
                setError("Failed to parse Excel file. Please ensure it is a valid .xlsx or .csv file.")
            }
        }
        reader.readAsBinaryString(selectedFile)
    }

    const handleSubmit = async () => {
        if (previewData.length === 0) {
            setError("No student data found in file.")
            return
        }

        setLoading(true)
        const token = localStorage.getItem("token")
        
        try {
            const response = await fetch(`${BASE_URL}/students/bulk`, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(previewData)
            })

            if (!response.ok) {
                throw new Error("Failed to upload students.")
            }

            onStudentsCreated()
            onClose()
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="modal-overlay">
            <div className="modal-box bulk-modal">
                <h2>Bulk Upload Students</h2>
                <p className="help-text">
                    Upload an Excel file (.xlsx) with columns: 
                    <strong> Name, Email, Batch, Section, Folder Link</strong>
                </p>

                <div className="upload-area">
                    <input 
                        type="file" 
                        accept=".xlsx, .xls, .csv" 
                        onChange={handleFileChange}
                        id="excel-upload"
                        hidden
                    />
                    <label htmlFor="excel-upload" className="upload-label">
                        {file ? `📄 ${file.name}` : "Click to select Excel file"}
                    </label>
                </div>

                {previewData.length > 0 && (
                    <div className="preview-container">
                        <h3>Preview ({previewData.length} students)</h3>
                        <div className="preview-table-wrapper">
                            <table className="preview-table">
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Batch</th>
                                        <th>Section</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {previewData.slice(0, 5).map((s, i) => (
                                        <tr key={i}>
                                            <td>{s.student_name}</td>
                                            <td>{s.batch}</td>
                                            <td>{s.section}</td>
                                        </tr>
                                    ))}
                                    {previewData.length > 5 && (
                                        <tr>
                                            <td colSpan="3" style={{ textAlign: 'center', color: '#64748b' }}>
                                                ... and {previewData.length - 5} more
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {error && <p className="error-msg">⚠️ {error}</p>}

                <div className="modal-buttons">
                    <button 
                        onClick={handleSubmit} 
                        className="create" 
                        disabled={loading || previewData.length === 0}
                    >
                        {loading ? "Uploading..." : "Confirm Upload"}
                    </button>
                    <button onClick={onClose} className="cancel" disabled={loading}>
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    )
}

export default BulkCreateStudentModel