import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { registerShelter } from '../../store/slices/shelterSlice';

const ReliefShelterForm = ({ onClose, onAddNotification }) => {
  const dispatch = useDispatch();

  const [shelterName, setShelterName] = useState('');
  const [locationAddress, setLocationAddress] = useState('');
  const [capacity, setCapacity] = useState('');
  const [managerName, setManagerName] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const capVal = parseInt(capacity, 10);
    if (isNaN(capVal) || capVal <= 0) {
      alert('Capacity must be a positive integer.');
      return;
    }

    try {
      await dispatch(
        registerShelter({
          shelterName,
          locationAddress,
          capacity: capVal,
          managerName,
        })
      ).unwrap();

      if (onAddNotification) {
        onAddNotification('Shelter registered successfully!', 'success');
      } else {
        alert('Shelter registered successfully!');
      }
      onClose();
    } catch (err) {
      alert(err || 'Failed to register shelter.');
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="modal-close-btn" onClick={onClose}>x</button>
        <h2>Register Relief Shelter</h2>

        <form onSubmit={handleSubmit} style={{ marginTop: '1.25rem' }}>
          <div className="form-group">
            <label htmlFor="shelterName">Shelter Name *</label>
            <input
              id="shelterName"
              type="text"
              required
              value={shelterName}
              onChange={(e) => setShelterName(e.target.value)}
              placeholder="e.g. Haven High Gymnasium"
            />
          </div>

          <div className="form-group">
            <label htmlFor="locationAddress">Location Address *</label>
            <input
              id="locationAddress"
              type="text"
              required
              value={locationAddress}
              onChange={(e) => setLocationAddress(e.target.value)}
              placeholder="123 Shelter Way, Safe City"
            />
          </div>

          <div className="form-group">
            <label htmlFor="capacity">Maximum Capacity *</label>
            <input
              id="capacity"
              type="number"
              required
              value={capacity}
              onChange={(e) => setCapacity(e.target.value)}
              placeholder="e.g. 500"
            />
          </div>

          <div className="form-group">
            <label htmlFor="managerName">Manager Name</label>
            <input
              id="managerName"
              type="text"
              value={managerName}
              onChange={(e) => setManagerName(e.target.value)}
              placeholder="Coordinator Name"
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1.5rem' }}>
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Register Facility
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReliefShelterForm;
