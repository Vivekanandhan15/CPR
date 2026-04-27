function StudentHeader({ student }) {
    return (
        <div className="student-header">
            <div className="avatar">
                {student?.student_name?.[0] || "?"}
            </div>

            <div>
                <h2>{student?.student_name || "No Name"}</h2>
                <p>
                    Section {student?.section} • {student?.email || ""}
                </p>
            </div>
        </div>
    )
}

export default StudentHeader