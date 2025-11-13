import React, { useState, useEffect } from 'react';

/**
 * Props:
 * - compact (boolean) => smaller UI for hero
 */
export default function EMICalculator({ compact }) {
  const [principal, setPrincipal] = useState(500000);
  const [annualRate, setAnnualRate] = useState(9.5);
  const [tenureMonths, setTenureMonths] = useState(24);

  const [emi, setEmi] = useState(0);
  const [totalPayment, setTotalPayment] = useState(0);
  const [totalInterest, setTotalInterest] = useState(0);

  useEffect(()=> {
    calculate();
    // eslint-disable-next-line
  }, [principal, annualRate, tenureMonths]);

  function calculate(){
    const P = Number(principal) || 0;
    const r = (Number(annualRate) || 0) / 12 / 100;
    const n = Number(tenureMonths) || 0;
    if (P <= 0 || n === 0) {
      setEmi(0); setTotalPayment(0); setTotalInterest(0); return;
    }
    // EMI formula
    const pow = Math.pow(1 + r, n);
    const E = r === 0 ? (P / n) : (P * r * pow) / (pow - 1);
    const total = E * n;
    const totalInt = total - P;
    setEmi(Number(E.toFixed(2)));
    setTotalPayment(Number(total.toFixed(2)));
    setTotalInterest(Number(totalInt.toFixed(2)));
  }

  return (
    <div>
      <div style={{display:'flex', gap:12, marginBottom:8}} className={compact ? '' : ''}>
        <div style={{flex:1}}>
          <label className="small">Loan amount</label>
          <input className="input" type="number" value={principal} onChange={e=>setPrincipal(e.target.value)} />
        </div>
        <div style={{width:120}}>
          <label className="small">Tenure (m)</label>
          <input className="input" type="number" value={tenureMonths} onChange={e=>setTenureMonths(e.target.value)} />
        </div>
      </div>

      <div style={{display:'flex', gap:12, marginBottom:12}}>
        <div style={{flex:1}}>
          <label className="small">Annual interest (%)</label>
          <input className="input" type="number" value={annualRate} onChange={e=>setAnnualRate(e.target.value)} />
        </div>
      </div>

      <div style={{display:'flex', gap:10, marginTop:8, alignItems:'center'}}>
        <div style={{flex:1}}>
          <div className="stat card" style={{padding:12, borderRadius:10}}>
            <div className="label small">Monthly EMI</div>
            <div style={{fontSize:20, fontWeight:800}}>₹{emi.toLocaleString()}</div>
          </div>
        </div>
        <div style={{width:1}} />
        <div style={{width:160}}>
          <div className="stat card" style={{padding:10, borderRadius:10}}>
            <div className="label small">Total</div>
            <div style={{fontWeight:700}}>₹{totalPayment.toLocaleString()}</div>
            <div className="loan-meta">Interest ₹{totalInterest.toLocaleString()}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
