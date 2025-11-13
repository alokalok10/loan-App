import React from 'react';
import PendingLoans from './PendingLoans';

export default function OfficerDashboard() {
  return (
    <div className="officer-dashboard">
      <div className="officer-header">
        <h2>Officer Dashboard</h2>
        <p>Review and process pending loan applications</p>
      </div>

      <div className="officer-content">
        <div className="officer-card animate">
          <PendingLoans />
        </div>
      </div>
    </div>
  );
}
