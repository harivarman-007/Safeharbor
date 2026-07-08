import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { register, clearAuthError, resetRegisterSuccess } from '../store/slices/authSlice';

const Register = ({ setView }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState('FIELD_RESPONDER');
  const [emergencyContact, setEmergencyContact] = useState('');
  const [assignedRegion, setAssignedRegion] = useState('Global Operations');

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, isSuccess } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isSuccess) {
      // Clear registration form and navigate to login
      setEmail('');
      setPassword('');
      setFullName('');
      setEmergencyContact('');
      setAssignedRegion('');
      dispatch(resetRegisterSuccess());
      if (setView) {
        setView('login');
      } else {
        navigate('/login');
      }
    }
  }, [isSuccess, navigate, setView, dispatch]);

  useEffect(() => {
    if (error) {
      alert(error);
      dispatch(clearAuthError());
    }
  }, [error, dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password || !fullName || !emergencyContact) {
      alert('Please fill out all required fields.');
      return;
    }
    dispatch(
      register({
        username: email,
        password,
        fullName,
        role,
        contactNumber: emergencyContact,
        assignedRegion,
      })
    );
  };

  return (
    <div className="auth-wrapper">
      <div className="glass-panel auth-card">
        <div className="auth-header">
          <div className="auth-logo">SafeHarbor</div>
          <p>Register New Personnel Account</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="reg-email">Email *</label>
            <input
              id="reg-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="operative@safeharbor.org"
            />
          </div>

          <div className="form-group">
            <label htmlFor="reg-password">Password *</label>
            <input
              id="reg-password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Choose a password"
            />
          </div>

          <div className="form-group">
            <label htmlFor="reg-fullname">Full Name *</label>
            <input
              id="reg-fullname"
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="John Doe"
            />
          </div>

          <div className="form-group">
            <label htmlFor="reg-role">Assigned Role *</label>
            <select
              id="reg-role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="FIELD_RESPONDER">Field Responder</option>
              <option value="EMERGENCY_DISPATCHER">Emergency Dispatcher</option>
              <option value="AGENCY_DIRECTOR">Agency Director</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="reg-contact">Contact Number *</label>
            <input
              id="reg-contact"
              type="text"
              required
              value={emergencyContact}
              onChange={(e) => setEmergencyContact(e.target.value)}
              placeholder="+1-234-567-8900"
            />
          </div>

          <div className="form-group">
            <label htmlFor="reg-region">Assigned Region</label>
            <input
              id="reg-region"
              type="text"
              value={assignedRegion}
              onChange={(e) => setAssignedRegion(e.target.value)}
              placeholder="Region HQ"
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', marginTop: '1rem' }}
            disabled={loading}
          >
            {loading ? 'Registering...' : 'Register Account'}
          </button>
        </form>

        <div className="auth-footer">
          Already deployed?{' '}
          <a
            href="#login"
            className="auth-link"
            onClick={(e) => {
              e.preventDefault();
              if (setView) {
                setView('login');
              } else {
                navigate('/login');
              }
            }}
          >
            Authenticate
          </a>
        </div>
      </div>
    </div>
  );
};

export default Register;
