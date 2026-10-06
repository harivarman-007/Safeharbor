import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { login, clearAuthError } from '../store/slices/authSlice';

const Login = ({ setView, onAddNotification }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, loading, error } = useSelector((state) => state.auth);

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  useEffect(() => {
    if (error) {
      if (onAddNotification) {
        onAddNotification(error, 'error');
      } else {
        alert(error);
      }
      dispatch(clearAuthError());
    }
  }, [error, dispatch, onAddNotification]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) return;
    dispatch(login({ username: email, password }));
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-logo">SAFEHARBOR</div>
          <p className="auth-subtitle">Operations Authentication System</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Personnel Identity / Username</label>
            <input
              id="email"
              type="text"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. admin or dispatcher"
              autoComplete="username"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Access Secret / Password</label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter account password"
              autoComplete="current-password"
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', marginTop: '0.75rem' }}
            disabled={loading}
          >
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

        <div className="demo-credentials-box">
          <div className="demo-title">Quick Demo Access</div>
          <div className="demo-buttons">
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => {
                setEmail('admin');
                setPassword('admin123');
              }}
            >
              Director (admin)
            </button>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => {
                setEmail('dispatcher');
                setPassword('dispatch123');
              }}
            >
              Dispatcher (dispatcher)
            </button>
          </div>
        </div>

        <div className="auth-footer">
          <span>New personnel enrollment?</span>{' '}
          <a
            href="#register"
            className="auth-link"
            onClick={(e) => {
              e.preventDefault();
              if (setView) {
                setView('register');
              } else {
                navigate('/register');
              }
            }}
          >
            Register Account
          </a>
        </div>
      </div>
    </div>
  );
};

export default Login;
