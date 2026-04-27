function FeedbackSection({
    feedback, setFeedback,
    internal, setInternal,
    date, setDate
}) {
    return (
        <div className="right-box">

            <div className="box">
                <h4>Student Feedback</h4>
                <textarea
                    value={feedback}
                    onChange={e => setFeedback(e.target.value)}
                />
            </div>

            <div className="box">
                <h4>Internal Comments</h4>
                <textarea
                    value={internal}
                    onChange={e => setInternal(e.target.value)}
                />
            </div>

            <div className="box date-box">
                <h4>Next Review Date</h4>
                <input
                    type="date"
                    value={date}
                    onChange={e => setDate(e.target.value)}
                />
            </div>

        </div>
    )
}

export default FeedbackSection