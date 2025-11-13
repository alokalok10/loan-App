import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import { useNavigate } from 'react-router-dom';

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

   const handleLogout = () => {
    logout();             // clears token and user
    navigate('/login');   // redirect to login page
  };

  return (
    <nav className="nav-bar">
      <div className="nav-left">
        <Link className="nav-logo" to="/">LoanPortal</Link>
      </div>

      <div className="nav-links">
        {!user && (
          <>
            <Link className="nav-item" to="/login">Login</Link>
            <Link className="nav-item" to="/register">Register</Link>
          </>
        )}

        {user && (
          <>
            {user.role === "CUSTOMER" && (
              <Link className="nav-item" to="/customer">Customer</Link>
            )}

            {user.role === "OFFICER" && (
              <Link className="nav-item" to="/officer">Officer</Link>
            )}

            <button className="nav-logout" onClick={handleLogout}>
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}
