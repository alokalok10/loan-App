import React, { useState } from 'react';
import API from '../api';

export default function LoanStatus() {
  const [loanId, setLoanId] = useState('');
  const [status, setStatus] = useState(null);

  const fetchStatus = async () => {
    try {
      const res = await API.get(`/loans/${loanId}/status`);
      setStatus(res.data);
    } catch (err) {
      setStatus({ error: err.response?.data?.message || 'Error' });
    }
  };

  return (
    <div>
      <h4>Check Loan Status</h4>
      <div><input placeholder="loanId" value={loanId} onChange={e=>setLoanId(e.target.value)} /></div>
      <button onClick={fetchStatus}>Get Status</button>
      <pre>{status ? JSON.stringify(status, null, 2) : 'No status'}</pre>
    </div>
  );
}
