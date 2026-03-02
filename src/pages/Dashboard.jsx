import React from 'react'
import ReportsCards from '../components/ReportsCards'
import './dashboard.css'

function Dashboard() {
  return (
    <div className="Dashboard-content">
      <p>Here are The Most Recent Progress Reports you've Submitted</p>
      <div className="Dashboard-ReportsCards">
        <ReportsCards />
      </div>
    </div>
  )
}

export default Dashboard
