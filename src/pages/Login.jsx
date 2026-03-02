import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import './login.css'

function Login() {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const navigate = useNavigate()

    const handleLogin = async (e) => {
        e.preventDefault()
        try {
            const response = await fetch('https://fssa-cpr.onrender.com/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            })

            const data = await response.json()

            if (response.ok) {
                localStorage.setItem('token', data.access_token)
                navigate('/dashboard')
            } else {
                alert(data.detail || 'Invalid credentials')
            }
        } catch (error) {
            alert('Server error. Please try again.')
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
                    <input
                        type="email"
                        placeholder="Email"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <Link to='/reset-password'>Forgot Password?</Link>
                    <button type="submit">Login</button>
                    <p>Don't have an account? <Link to='/signup'>Sign up</Link></p>
                </form>
            </div>
        </div>
    )
}

export default Login