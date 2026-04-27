import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import './login.css'

const BASE_URL = import.meta.env.VITE_BASE_URL


function ResetPassword() {
    const [username, setUsername] = useState('')
    const [oldPassword, setOldPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState('')
    const navigate = useNavigate()

    const handleReset = async (e) => {
        e.preventDefault()
        setLoading(true)
        setMessage('')

        try {
            const response = await fetch(`${BASE_URL}/auth/reset-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    username,
                    oldPassword,
                    newPassword
                })
            })

            if (response.ok) {
                alert('Password reset successful!')
                navigate('/login')
            } else {
                const data = await response.json()
                setMessage(data.message || 'Failed to reset password')
            }
        }
        catch (error) {
            setMessage('Something went wrong. Please try again.',error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="login-container">
            <div className="login-left">
                <h1>CPR Portal</h1>
                <p>Track. Report. Grow.</p>
            </div>
            <div className="login-right">
                <form className="login-form" onSubmit={handleReset}>
                    <h2>Reset Password</h2>
                    {message && <p className="message" style={{ color: message.includes('success') ? 'green' : 'red', marginBottom: '10px' }}>{message}</p>}

                    <input type="email"
                        placeholder='Email'
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required />

                    <input type='password'
                        placeholder='Old Password'
                        value={oldPassword}
                        onChange={(e) => setOldPassword(e.target.value)} required />

                    <input type="password"
                        placeholder='New Password'
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)} required />

                    <button type="submit" className="login-button" disabled={loading}>
                        {loading ? 'Resetting...' : 'Reset Password'}
                    </button>

                    <p style={{ marginTop: '20px', textAlign: 'center' }}>
                        <Link to="/login" style={{ color: '#007bff', textDecoration: 'none' }}>Back to Login</Link>
                    </p>
                </form>
            </div>
        </div>
    )
}

export default ResetPassword