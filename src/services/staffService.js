const BASE_URL = import.meta.env.VITE_BASE_URL

export const createStaff = async (
    { username, password, first_name, last_name, email, sub_role },
    token
) => {
    const response = await fetch(`${BASE_URL}/auth/users`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
            username,
            password,
            first_name,
            last_name,
            email,
            sub_role,
        }),
    })

    const data = await response.json()

    if (!response.ok) {
        const detail = typeof data.detail === 'string'
            ? data.detail
            : Array.isArray(data.detail)
                ? data.detail.map((e) => e.msg).join(', ')
                : 'Failed to create staff'
        throw new Error(detail)
    }

    return data
}
