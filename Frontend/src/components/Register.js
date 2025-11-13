import React, { useState } from 'react';
import API from '../api';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('CUSTOMER');
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    try {
      await API.post('/auth/register', { name, email, password, role });
      toast.success('Registered');
      navigate('/login');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Register failed');
    }
  };

  return (
    <form className="register-card" onSubmit={submit} autoComplete="off">
      <div className="reg-brand">
        <h3>Create account</h3>
        <p className="muted">Join and start applying</p>
      </div>

      <label className={`reg-field ${name ? 'filled' : ''}`}>
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder=" "
          required
          aria-label="Full name"
        />
        <span className="label">Full name</span>
        <span className="underline" />
      </label>

      <label className={`reg-field ${email ? 'filled' : ''}`}>
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder=" "
          required
          aria-label="Email address"
        />
        <span className="label">Email</span>
        <span className="underline" />
      </label>

      <label className={`reg-field ${password ? 'filled' : ''}`}>
        <input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder=" "
          required
          aria-label="Password"
        />
        <span className="label">Password</span>
        <span className="underline" />
      </label>

      <div className="reg-select-wrap">
        <select
          value={role}
          onChange={e => setRole(e.target.value)}
          aria-label="Select role"
        >
          <option value="CUSTOMER">Customer</option>
          <option value="OFFICER">Officer</option>
        </select>
      </div>

      <button className="reg-btn" type="submit">Register</button>

      <div className="reg-foot">
        <small>Already have an account? <a href="/login">Login</a></small>
      </div>
    </form>
  );
}
