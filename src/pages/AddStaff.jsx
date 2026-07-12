import React, { useState } from 'react'
import { STAFF_ROLES } from '../utils/roles'
import { createStaff } from '../services/staffService'
import './AddStaff.css'

const INITIAL_FORM = {
    username: '',
    password: '',
    first_name: '',
    last_name: '',
    email: '',
    sub_role: 'coordinator',
}

function AddStaff() {
    const [formData, setFormData] = useState(INITIAL_FORM)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [success, setSuccess] = useState(null)

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        })
        setError(null)
        setSuccess(null)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError(null)
        setSuccess(null)

        const token = localStorage.getItem('token')
        if (!token) {
            setError('Session expired. Please login again.')
            setLoading(false)
            return
        }

        try {
            await createStaff(formData, token)
            setSuccess(
                `Staff account created for ${formData.first_name} ${formData.last_name} (${formData.sub_role}).`
            )
            setFormData(INITIAL_FORM)
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="add-staff-page">
            <h1>Add Staff</h1>
            <p>Create a new staff account with login credentials and role assignment.</p>

            <form className="add-staff-form" onSubmit={handleSubmit}>
                <div className="form-row">
                    <div className="form-field">
                        <label htmlFor="first_name">First Name</label>
                        <input
                            id="first_name"
                            name="first_name"
                            type="text"
                            placeholder="First name"
                            value={formData.first_name}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-field">
                        <label htmlFor="last_name">Last Name</label>
                        <input
                            id="last_name"
                            name="last_name"
                            type="text"
                            placeholder="Last name"
                            value={formData.last_name}
                            onChange={handleChange}
                            required
                        />
                    </div>
                </div>

                <div className="form-field">
                    <label htmlFor="email">Email</label>
                    <input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="Email address"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-field">
                    <label htmlFor="username">Username</label>
                    <input
                        id="username"
                        name="username"
                        type="text"
                        placeholder="Login username"
                        value={formData.username}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-field">
                    <label htmlFor="password">Password</label>
                    <input
                        id="password"
                        name="password"
                        type="password"
                        placeholder="Login password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        minLength={6}
                    />
                </div>

                <div className="form-field">
                    <label htmlFor="sub_role">Role</label>
                    <select
                        id="sub_role"
                        name="sub_role"
                        value={formData.sub_role}
                        onChange={handleChange}
                        required
                    >
                        {STAFF_ROLES.map((role) => (
                            <option key={role} value={role}>
                                {role.charAt(0).toUpperCase() + role.slice(1)}
                            </option>
                        ))}
                    </select>
                </div>

                {error && <p className="form-error">{error}</p>}
                {success && <p className="form-success">{success}</p>}

                <button type="submit" disabled={loading}>
                    {loading ? 'Creating...' : 'Create Staff'}
                </button>
            </form>
        </div>
    )
}

export default AddStaff
