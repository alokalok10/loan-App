// frontend/src/components/PendingLoans.js
import React, { useEffect, useState } from 'react';
import API from '../api';
import { toast } from 'react-toastify';

export default function PendingLoans() {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(false);
  const [commentMap, setCommentMap] = useState({}); // loanId -> comment text

  const fetch = async () => {
    try {
      setLoading(true);
      const res = await API.get('/officer/loans/pending');
      setLoans(res.data);
    } catch (err) {
      toast.error('Fetch failed');
    } finally {
      setLoading(false);
    }
  };

  useEffect(()=>{ fetch(); }, []);

  const setComment = (id, text) => {
    setCommentMap(prev => ({ ...prev, [id]: text }));
  };

  const review = async (id, action) => {
    try {
      const payload = { action, comment: commentMap[id] || '' };
      const res = await API.post(`/officer/loans/${id}/review`, payload);
      toast.success(res.data?.message || 'Updated');
      setCommentMap(prev => ({ ...prev, [id]: '' }));
      fetch();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    }
  };

  return (
    <div>
      <h4>Pending Loans</h4>
      {loading && <div className="card">Loading...</div>}
      {!loading && loans.length === 0 && <div className="card">No pending loans</div>}
      <div style={{marginTop:12}}>
        {loans.map(l => (
          <div key={l._id} className="card" style={{marginBottom:12}}>
            <div style={{display:'flex', justifyContent:'space-between', gap:12}}>
              <div>
                <div style={{fontWeight:700}}>{l.customerId?.userId?.name || 'Customer'}</div>
                <div className="loan-meta">₹{Number(l.amountRequested).toLocaleString()} • {l.tenureMonths} months</div>
                <div className="loan-meta">score: {l.eligibilityScore ?? 'N/A'}</div>
              </div>

              <div style={{width:260}}>
                <textarea
                  placeholder="Add a comment for the customer (e.g. missing document XYZ)"
                  value={commentMap[l._id] || ''}
                  onChange={e => setComment(l._id, e.target.value)}
                  style={{width:'100%', minHeight:80, padding:10, borderRadius:8, border:'1px solid rgba(255,255,255,0.04)', background:'transparent', color:'inherit'}}
                />
                <div style={{display:'flex', gap:8, marginTop:8, justifyContent:'flex-end'}}>
                  <button className="btn secondary" onClick={()=>review(l._id, 'REJECT')}>Reject</button>
                  <button className="btn" onClick={()=>review(l._id, 'APPROVE')}>Approve</button>
                </div>
              </div>
            </div>

            {l.officerComments && l.officerComments.length > 0 && (
              <div style={{marginTop:12}}>
                <strong>Previous comments</strong>
                <ul style={{marginTop:6}}>
                  {l.officerComments.map((c, idx) => (
                    <li key={idx} className="loan-meta">
                      <strong>{c.officerName || (c.officerId?.userId?.name) || 'Officer'}</strong> — {new Date(c.createdAt).toLocaleString()}<br />
                      <span>{c.text}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
