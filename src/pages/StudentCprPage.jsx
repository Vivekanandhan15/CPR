import { useParams, useNavigate } from "react-router-dom"
import { useState, useEffect } from "react"
import StudentHeader from "../components/cpr/StudentHeader"
import MetricsBox from "../components/cpr/MetricsBox"
import FeedbackSection from "../components/cpr/FeedbackSection"
import FooterActions from "../components/cpr/FooterActions"
import { getStudentById } from "../services/studentService"
import "./StudentCprForm.css"

const BASE_URL = import.meta.env.VITE_BASE_URL

function StudentCprPage() {
    const { id } = useParams()
    const navigate = useNavigate()

    const [student, setStudent] = useState(null)
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    const [ratings, setRatings] = useState({
        attendance: 0,
        punctuality: 0,
        assignment: 0,
        participation: 0
    })

    const [feedback, setFeedback] = useState("")
    const [internal, setInternal] = useState("")
    const [date, setDate] = useState("")

    useEffect(() => {
        fetchStudent()
        fetchUser()
    }, [id])

    const fetchStudent = async () => {
        try {
            const token = localStorage.getItem("token")
            if (!token) throw new Error("No token")

            const data = await getStudentById(id, token)
            setStudent(data)
        } catch {
            setError("Error loading student")
        } finally {
            setLoading(false)
        }
    }

    const fetchUser = async () => {
        try {
            const token = localStorage.getItem("token")
            if (!token) throw new Error("No token")

            const response = await fetch(`${BASE_URL}/auth/me`, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            })
            if (!response.ok) throw new Error("Failed to fetch user")
            const data = await response.json()
            setUser(data)
        } catch (err) {
            console.error(err)
        }
    }

    const handleRating = (key, value) => {
        setRatings(prev => ({ ...prev, [key]: value }))
    }

    const handleSubmit = async () => {
        if (!user) {
            alert("User not loaded")
            return
        }
        const avg = (ratings.attendance + ratings.punctuality + ratings.assignment + ratings.participation) / 4
        let color = 'red'
        if (avg >= 4) color = 'green'
        else if (avg >= 3) color = 'yellow'

        const payload = {
            student_name: student.student_name,
            student_id: id,
            staff_name: user.username,
            staff_comments: feedback,
            manager_comments: internal,
            idp: '',
            color_code: color
        }

        try {
            const token = localStorage.getItem("token")
            const response = await fetch(`${BASE_URL}/cpr`, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            })
            if (!response.ok) throw new Error("Failed to submit CPR")
            alert("CPR submitted successfully")
            navigate(-1)
        } catch (err) {
            console.error(err)
            alert("Failed to submit")
        }
    }

    if (loading) return <p>Loading...</p>
    if (error) return <p style={{ color: "red" }}>{error}</p>

    return (
        <div className="cpr-container">
            <div className="back-btn" onClick={() => navigate(-1)}>← Back</div>

            <StudentHeader student={student} />

            <div className="cpr-grid">
                <MetricsBox ratings={ratings} onRate={handleRating} />
                <FeedbackSection
                    feedback={feedback}
                    setFeedback={setFeedback}
                    internal={internal}
                    setInternal={setInternal}
                    date={date}
                    setDate={setDate}
                />
            </div>

            <FooterActions
                onSubmit={handleSubmit}
                onBack={() => navigate(-1)}
            />
        </div>
    )
}

export default StudentCprPage