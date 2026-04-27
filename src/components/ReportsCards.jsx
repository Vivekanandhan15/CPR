import React from "react";
import "./reportscard.css";
import reports from '../config/Reports'


function ReportsCards() {
  return (
    <div className="reports-wrapper">
      {reports.map((report, index) => (
        <div key={index} className="report-card">
          <div className="card-header">
            <div>
              <h2>{report.name}</h2>
              <p className="subject">{report.subject}</p>
            </div>
            <span className={`badge ${report.grade === "Excellent" ? "excellent" : "track"}`}>
              {report.grade}
            </span>
          </div>
          <p className="review">"{report.review}"</p>
          <div className="card-footer">
            <span>Reviewed on: {report.date}</span>
            <a href="#">View Full Report</a>
          </div>
        </div>
      ))}
    </div>
  );
}

export default ReportsCards;