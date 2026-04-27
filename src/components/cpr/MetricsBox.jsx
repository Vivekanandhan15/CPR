function MetricsBox({ ratings, onRate }) {
    const metrics = [
        { label: "Attendance & Regularity", key: "attendance" },
        { label: "Punctuality", key: "punctuality" },
        { label: "Assignment Completion", key: "assignment" },
        { label: "Class Participation", key: "participation" }
    ]

    return (
        <div className="metrics-box">
            <h3>Performance Metrics</h3>

            {metrics.map(item => (
                <div key={item.key} className="metric">
                    <p>{item.label}</p>

                    <div className="rating">
                        {[1, 2, 3, 4, 5].map(num => (
                            <button
                                key={num}
                                className={ratings[item.key] >= num ? "active" : ""}
                                onClick={() => onRate(item.key, num)}
                            >
                                {num}
                            </button>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    )
}

export default MetricsBox