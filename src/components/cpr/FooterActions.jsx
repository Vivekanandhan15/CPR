function FooterActions({ onSubmit, onBack }) {
    return (
        <div className="footer">
            <button className="discard" onClick={onBack}>
                Discard Changes
            </button>

            <button className="submit" onClick={onSubmit}>
                Submit CPR Report
            </button>
        </div>
    )
}

export default FooterActions