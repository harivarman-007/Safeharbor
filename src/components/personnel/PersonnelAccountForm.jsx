import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { register } from '../../store/slices/authSlice';
import api from '../../services/api';

const PersonnelAccountForm = ({ account, onClose, onAddNotification }) => {
  const dispatch = useDispatch();
  const isEdit = !!account;

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState('FIELD_RESPONDER');
  const [contactNumber, setContactNumber] = useState('');
  const [assignedRegion, setAssignedRegion] = useState('Global Operations');

  useEffect(() => {
    if (account) {
      setUsername(account.username || '');
      setFullName(account.fullName || '');
      setRole(account.role || 'FIELD_RESPONDER');
      setContactNumber(account.contactNumber || '');
      setAssignedRegion(account.assignedRegion || 'Global Operations');
    }
  }, [account]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Verify contact number matches simple format
    const contactRegex = /^\+?[0-9\-\s\(\)]+$/;
    if (!contactRegex.test(contactNumber)) {
      alert('Please enter a valid contact number format (numbers, spaces, parentheses, dashes).');
      return;
    }

    try {
      if (isEdit) {
        // Direct api call for updating personnel
        await api.put(`/auth/personnel/${account.id}`, {
          username,
          fullName,
          role,
          contactNumber,
          assignedRegion,
        });
        if (onAddNotification) {
          onAddNotification('Personnel profile updated successfully.', 'success');
        } else {
          alert('Personnel profile updated successfully.');
        }
      } else {
        if (!password) {
          alert('Password is required for registration.');
          return;
        }
        await dispatch(
          register({
            username,
            password,
            fullName,
            role,
            contactNumber,
            assignedRegion,
          })
        ).unwrap();
        if (onAddNotification) {
          onAddNotification('Personnel account registered successfully.', 'success');
        } else {
          alert('Personnel account registered successfully.');
        }
      }
      onClose();
    } catch (err) {
      alert(err || 'Failed to save personnel account.');
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="modal-close-btn" onClick={onClose}>x</button>
        <h2>Manage Personnel Account</h2>

        <form onSubmit={handleSubmit} style={{ marginTop: '1rem' }}>
          <div className="form-group">
            <label htmlFor="username">Username *</label>
            <input
              id="username"
              type="email"
              required
              disabled={isEdit}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="username@safeharbor.org"
            />
          </div>

          {!isEdit && (
            <div className="form-group">
              <label htmlFor="password">Password *</label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>
          )}

          <div className="form-group">
            <label htmlFor="fullName">Full Name *</label>
            <input
              id="fullName"
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Jane Doe"
            />
          </div>

          <div className="form-group">
            <label htmlFor="role">Assigned Role *</label>
            <select
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="FIELD_RESPONDER">FIELD_RESPONDER</option>
              <option value="EMERGENCY_DISPATCHER">EMERGENCY_DISPATCHER</option>
              <option value="AGENCY_DIRECTOR">AGENCY_DIRECTOR</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="contactNumber">Contact Number *</label>
            <input
              id="contactNumber"
              type="text"
              required
              value={contactNumber}
              onChange={(e) => setContactNumber(e.target.value)}
              placeholder="+1-555-0199"
            />
          </div>

          <div className="form-group">
            <label htmlFor="assignedRegion">Assigned Region</label>
            <input
              id="assignedRegion"
              type="text"
              value={assignedRegion}
              onChange={(e) => setAssignedRegion(e.target.value)}
              placeholder="e.g. Region A"
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1.5rem' }}>
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Save Account
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PersonnelAccountForm;
