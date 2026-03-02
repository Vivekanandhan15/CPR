import './login.css'
import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'


function Signup() {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const navigate = useNavigate()

    const handleSignUp = async (e) => {
        e.preventDefault()
        try {
            const response = await fetch('https://fssa-cpr.onrender.com/auth/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            })
            const data = await response.json()
            if (response.ok) {
                alert('Accont Created Successfuly! Please login.')
                navigate('/login')
            }
            else {
                alert(data.detail || 'sign up failed')
            }
        }
        catch (error) {
            alert('server error. please try again')
        }
    }

    return (
        <div className="login-container">
            <div className="login-left">
                <h1>CPR Portal</h1>
                <p>Track. Report. Grow.</p>
            </div>
            <div className="login-right">
                <form className="login-form" onSubmit={handleSignUp}>
                    <h2>Welcome Back to Create Your Account</h2>
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
                    <button type="submit">SIgn Up</button>
                </form>
            </div>
        </div>
    )
}

export default Signup;