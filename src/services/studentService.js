const BASE_URL = import.meta.env.VITE_BASE_URL;

export const getStudentById = async (id, token) => {
  const res = await fetch(`${BASE_URL}/students/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) throw new Error("Failed to fetch student");

  return res.json();
};
