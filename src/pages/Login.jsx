import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import './login.css'

const BASE_URL = import.meta.env.VITE_BASE_URL

function Login() {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    const handleLogin = async (e) => {
        e.preventDefault()
        setLoading(true)
        try {
            const response = await fetch(`${BASE_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            })

            const data = await response.json()

            if (response.ok) {
                localStorage.setItem('token', data.access_token)
                localStorage.setItem('Username', data.username || username)
                localStorage.setItem('UserRole', data.role || 'User')
                navigate('/dashboard')
            } else {
                alert(data.detail || 'Invalid credentials')
            }
        } catch (error) {
            alert('Server error. Please try again.')
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
                <form className="login-form" onSubmit={handleLogin}>
                    <h2>Welcome Back</h2>
                    <p className="form-subtitle">Log in to manage student reports</p>
                    
                    <div className="input-group">
                        <label>Username</label>
                        <input
                            type="text"
                            placeholder="Enter your username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    
                    <div className="input-group">
                        <label>Password</label>
                        <input
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    
                    <div className="form-options">
                        <Link to='/reset-password'>Forgot Password?</Link>
                    </div>
                    
                    <button type="submit" disabled={loading}>
                        {loading ? "Logging in..." : "Login"}
                    </button>
                    
                    <p className="signup-prompt">
                        Don't have an account? <Link to='/signup'>Sign up</Link>
                    </p>
                </form>
            </div>
        </div>
    )
}

export default Login