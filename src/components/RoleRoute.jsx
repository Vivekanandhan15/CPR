import React from 'react'
import { Navigate } from 'react-router-dom'
import { isSuperAdmin } from '../utils/roles'

function RoleRoute({ children, requireSuperAdmin = false }) {
    const token = localStorage.getItem('token')
    const role = localStorage.getItem('UserRole')

    if (!token) {
        return <Navigate to="/login" replace />
    }

    if (requireSuperAdmin && !isSuperAdmin(role)) {
        return <Navigate to="/dashboard" replace />
    }

    return children
}

export default RoleRoute
