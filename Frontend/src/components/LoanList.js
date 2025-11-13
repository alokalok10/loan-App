// frontend/src/components/LoanList.js
import React, { useEffect, useState } from 'react';
import API from '../api';
import { toast } from 'react-toastify';

function formatCurrency(x) {
  try {
    return Number(x).toLocaleString('en-IN', { maximumFractionDigits: 0 });
  } catch {
    return x;
  }
}

function StatusBadge({ status }) {
  const color = status === 'APPROVED' ? '#16a34a' : status === 'REJECTED' ? '#ef4444' : '#f59e0b';
  return (
    <div style={{
      display: 'inline-block',
      padding: '6px 10px',
      borderRadius: 8,
      background: `rgba(255,255,255,0.02)`,
      border: `1px solid rgba(255,255,255,0.03)`,
      color,
      fontWeight: 700,
      fontSize: 13
    }}>{status}</div>
  );
}

function LoanRow({ loan, onUpdated, onDeleted }) {
  const [editing, setEditing] = useState(false);
  const [amount, setAmount] = useState(loan.amountRequested || '');
  const [tenure, setTenure] = useState(loan.tenureMonths || '');
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    // keep local inputs in sync when loan prop changes (e.g. after server update)
    setAmount(loan.amountRequested || '');
    setTenure(loan.tenureMonths || '');
  }, [loan.amountRequested, loan.tenureMonths]);

  const isPending = loan.status === 'PENDING';

  const save = async () => {
    // validation
    const amt = Number(amount);
    const t = Number(tenure);
    if (!amt || amt <= 0) return toast.error('Enter valid amount');
    if (!t || t <= 0) return toast.error('Enter valid tenure (months)');

    try {
      setSaving(true);
      await API.put(`/loans/${loan._id}`, { amountRequested: amt, tenureMonths: t });
      toast.success('Loan updated');
      setEditing(false);
      onUpdated();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    } finally {
      setSaving(false);
    }
  };

  const remove = async () => {
    if (!window.confirm('Delete this loan? This action cannot be undone.')) return;
    try {
      setDeleting(true);
      await API.delete(`/loans/${loan._id}`);
      toast.success('Loan deleted');
      onDeleted();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Delete failed');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="loan-item" style={{ alignItems: 'flex-start' }}>
      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
          <div>
            <div style={{ fontWeight: 700 }}>{new Date(loan.createdAt).toLocaleString()}</div>
            <div className="loan-meta">₹{formatCurrency(loan.amountRequested)} • {loan.tenureMonths} months</div>
            <div className="loan-meta">score: {loan.eligibilityScore ?? 'N/A'}</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <StatusBadge status={loan.status} />
          </div>
        </div>

        {/* officer comments (if any) */}
        {loan.officerComments && loan.officerComments.length > 0 && (
          <div style={{ marginTop: 12 }}>
            <strong style={{ display: 'block', marginBottom: 8 }}>Officer notes</strong>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {loan.officerComments.map((c, i) => (
                <div key={i} style={{ padding: 10, borderRadius: 8, background: 'rgba(255,255,255,0.02)' }}>
                  <div style={{ fontSize: 13, fontWeight: 700 }}>{c.officerName || 'Officer'} <span style={{ fontWeight: 500, color: '#9fb0c6', fontSize: 12 }}>— {new Date(c.createdAt).toLocaleString()}</span></div>
                  <div style={{ marginTop: 6 }}>{c.text}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div style={{ marginLeft: 12, width: 300 }}>
        {editing ? (
          <div>
            <label className="small">Amount (₹)</label>
            <input className="input" type="number" value={amount} onChange={e => setAmount(e.target.value)} />
            <label className="small">Tenure (months)</label>
            <input className="input" type="number" value={tenure} onChange={e => setTenure(e.target.value)} />
            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 8 }}>
              <button className="btn secondary" onClick={() => setEditing(false)} disabled={saving}>Cancel</button>
              <button className="btn" onClick={save} disabled={saving}>{saving ? 'Saving...' : 'Save'}</button>
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <button className="btn" onClick={() => setEditing(true)} disabled={!isPending}>Edit</button>
            <button className="btn danger" onClick={remove} disabled={!isPending || deleting}>{deleting ? 'Deleting...' : 'Delete'}</button>
            {!isPending && <div className="loan-meta" style={{ marginTop: 6 }}>Only PENDING loans can be edited/deleted</div>}
          </div>
        )}
      </div>
    </div>
  );
}

export default function LoanList() {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetch = async () => {
    try {
      setLoading(true);
      const res = await API.get('/loans/mine');
      setLoans(res.data);
    } catch (err) {
      toast.error('Fetch failed');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetch(); }, []);

  return (
    <div>
      <h4>My Loans</h4>
      <div style={{ marginTop: 12 }}>
        {loading && <div className="card">Loading...</div>}
        {!loading && loans.length === 0 && <div className="card">You have no loans yet — apply to get started.</div>}
        {!loading && loans.map(l => (
          <div key={l._id} className="card" style={{ padding: 12, marginBottom: 10 }}>
            <LoanRow loan={l} onUpdated={fetch} onDeleted={fetch} />
          </div>
        ))}
      </div>
    </div>
  );
}
