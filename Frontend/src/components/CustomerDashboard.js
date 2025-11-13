import React from 'react';
import LoanApply from './LoanApply';
import LoanList from './LoanList';


export default function CustomerDashboard() {
  return (
    <div className="customer-dashboard">
      <div className="dashboard-header">
        <h2>Customer Dashboard</h2>
        <p>Manage your loan applications easily</p>
      </div>

      <div className="dashboard-content">
        <div className="dashboard-card animate">
          <LoanApply />
        </div>

        <div className="dashboard-card animate delay">
          <LoanList />
        </div>
      </div>
    </div>
  );
}
