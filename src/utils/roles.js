export const STAFF_ROLES = ['coordinator', 'lead', 'coach']

export function normalizeRole(role) {
    return (role || '').toLowerCase().replace(/_/g, ' ').trim()
}

export function isSuperAdmin(role) {
    const normalized = normalizeRole(role)
    return normalized === 'super admin' || normalized === 'superadmin'
}
