import React, { useState, useContext } from 'react';
import API from '../api';
import { AuthContext } from '../contexts/AuthContext';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import './Login.css'; // add this import

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post('/auth/login', { email, password });
      login(res.data.token, res.data.userId, res.data.role);
      toast.success('Logged in');
      if (res.data.role === 'CUSTOMER') navigate('/customer');
      else navigate('/officer');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="login-page">
      <div className="bg-orb"></div>
      <form className="login-card" onSubmit={submit} autoComplete="off">
        <div className="brand">
          <div className="logo">LP</div>
          <h3>Welcome back</h3>
          <p className="sub">Sign in to continue</p>
        </div>

        <label className={`field ${email ? 'filled' : ''}`}>
          <input
            placeholder=" "
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            required
          />
          <span className="label">Email</span>
          <span className="underline" />
        </label>

        <label className={`field ${password ? 'filled' : ''}`}>
          <input
            placeholder=" "
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            required
          />
          <span className="label">Password</span>
          <span className="underline" />
        </label>

        <button className="btn" type="submit">Login</button>

        <div className="footer">
          <a href="/forgot">Forgot password?</a>
          <span>•</span>
          <a href="/signup">Create account</a>
        </div>
      </form>
    </div>
  );
}
