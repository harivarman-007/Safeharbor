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
      <div className="glass-panel auth-card">
        <div className="auth-header">
          <div className="auth-logo">SafeHarbor</div>
          <p>Disaster Response Coordinator Portal</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Personnel Email *</label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter designated personnel email"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Secured Password *</label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter secured password credentials"
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', marginTop: '1rem' }}
            disabled={loading}
          >
            {loading ? 'Authenticating...' : 'Authenticate'}
          </button>
        </form>

        <div className="auth-footer">
          New deployment personnel?{' '}
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
