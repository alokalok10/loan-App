import React from 'react';
import { Link } from 'react-router-dom';
import EMICalculator from './EMICalculator';

export default function Home(){
  return (
    <div className="app-container">
      <div className="hero">
        <div className="hero-left">
          <h1>Smart Loan Origination & Approval</h1>
          <p className="lead">Apply for loans, get an automatic eligibility score, and track approvals — all in one secure place.</p>
          <div style={{marginTop:18}}>
            <Link to="/register"><button className="btn primary">Get Started</button></Link>
            <Link to="/login"><button className="btn ghost" style={{marginLeft:12}}>Sign In</button></Link>
          </div>

          <div className="features" style={{marginTop:22}}>
            <div className="feature card">
              <h4>Fast Applications</h4>
              <div className="loan-meta">Simple form, instant eligibility decision.</div>
            </div>
            <div className="feature card">
              <h4>Officer Reviews</h4>
              <div className="loan-meta">Loan officers can review & approve with audit trail.</div>
            </div>
            <div className="feature card">
              <h4>Secure Auth</h4>
              <div className="loan-meta">JWT authentication & role-based access control.</div>
            </div>
          </div>
        </div>

        <div className="hero-right">
          <div className="card">
            <h4 style={{marginTop:0}}>EMI Calculator</h4>
            <EMICalculator compact />
          </div>
        </div>
      </div>

      <div className="grid">
        <div>
          <div className="card">
            <h3>Why choose LoanOrig?</h3>
            <p className="loan-meta">We evaluate eligibility using stable scoring and let loan officers manage approvals — all secure and auditable.</p>
            <hr style={{border:'none', height:12}} />
            <h4>Live demo</h4>
            <p className="loan-meta">Register as a customer to apply for a loan and see the automated scoring in action.</p>
          </div>

          <div className="card" style={{marginTop:16}}>
            <h3>Recent Loans</h3>
            <div className="loan-item">
              <div>
                <div style={{fontWeight:700}}>Sample Loan #1</div>
                <div className="loan-meta">₹250,000 • 24 months</div>
              </div>
              <div style={{textAlign:'right'}}>
                <div style={{fontWeight:700}}>APPROVED</div>
                <div className="loan-meta">score: 0.82</div>
              </div>
            </div>
            <div className="loan-item">
              <div>
                <div style={{fontWeight:700}}>Sample Loan #2</div>
                <div className="loan-meta">₹600,000 • 36 months</div>
              </div>
              <div style={{textAlign:'right'}}>
                <div style={{fontWeight:700}}>PENDING</div>
                <div className="loan-meta">score: 0.55</div>
              </div>
            </div>
          </div>
        </div>

        <div>
          <div className="card">
            <h4>Quick Tools</h4>
            <p className="loan-meta">Use the EMI calculator to estimate monthly payments and total cost.</p>
            <EMICalculator />
          </div>
        </div>
      </div>

      <div className="footer">© {new Date().getFullYear()} LoanOrig — Built By Alok Prabhat ❤️</div>
    </div>
  );
}
