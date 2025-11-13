// frontend/src/components/LoanApply.js
import React, { useState } from "react";
import API from "../api";
import { toast } from "react-toastify";

export default function LoanApply() {
  const [amountRequested, setAmountRequested] = useState("");
  const [tenureMonths, setTenureMonths] = useState("");
  const [interestRate, setInterestRate] = useState(12); // default interest

  // EMI Calcuation
  const calculateEMI = () => {
    const P = Number(amountRequested);
    const N = Number(tenureMonths);
    const R = Number(interestRate) / 12 / 100;

    if (!P || !N || !R) return null;

    const emi = (P * R * Math.pow(1 + R, N)) / (Math.pow(1 + R, N) - 1);
    const totalPayable = emi * N;
    const totalInterest = totalPayable - P;

    return {
      emi: Math.round(emi),
      totalInterest: Math.round(totalInterest),
      totalPayable: Math.round(totalPayable),
    };
  };

  const values = calculateEMI();

  const submit = async (e) => {
    e.preventDefault();

    if (!amountRequested || !tenureMonths) {
      toast.error("Please fill all fields");
      return;
    }

    try {
      await API.post("/loans/apply", {
        amountRequested: Number(amountRequested),
        tenureMonths: Number(tenureMonths),
        interestRate,
      });

      toast.success("Loan application submitted!");

      setAmountRequested("");
      setTenureMonths("");
    } catch (err) {
      toast.error(err.response?.data?.message || "Apply failed");
    }
  };

  return (
    <form className="loan-apply-card" onSubmit={submit}>
      <h4 className="loan-title">Apply for Loan</h4>

      {/* Amount */}
      <label className={`loan-field ${amountRequested ? "filled" : ""}`}>
        <input
          type="number"
          placeholder=" "
          value={amountRequested}
          onChange={(e) => setAmountRequested(e.target.value)}
          required
        />
        <span className="label">Amount Requested (₹)</span>
        <span className="underline"></span>
      </label>

      {/* Tenure */}
      <label className={`loan-field ${tenureMonths ? "filled" : ""}`}>
        <input
          type="number"
          placeholder=" "
          value={tenureMonths}
          onChange={(e) => setTenureMonths(e.target.value)}
          required
        />
        <span className="label">Tenure (Months)</span>
        <span className="underline"></span>
      </label>

      {/* Interest */}
      <label className={`loan-field ${interestRate ? "filled" : ""}`}>
        <input
          type="number"
          placeholder=" "
          value={interestRate}
          onChange={(e) => setInterestRate(e.target.value)}
          required
        />
        <span className="label">Interest Rate (%)</span>
        <span className="underline"></span>
      </label>

      {/* EMI Box */}
      {values && (
        <div className="emi-box">
          <h4>Loan Breakdown</h4>

          <div className="emi-row">
            <span>Monthly EMI</span>
            <b>₹{values.emi.toLocaleString()}</b>
          </div>

          <div className="emi-row">
            <span>Total Interest</span>
            <b>₹{values.totalInterest.toLocaleString()}</b>
          </div>

          <div className="emi-row">
            <span>Total Payable</span>
            <b>₹{values.totalPayable.toLocaleString()}</b>
          </div>
        </div>
      )}

      <button type="submit" className="apply-btn">
        Apply
      </button>
    </form>
  );
}
