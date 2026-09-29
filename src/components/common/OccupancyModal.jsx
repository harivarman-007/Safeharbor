import React, { useState } from 'react';
import './OccupancyModal.css';

const OccupancyModal = ({ isOpen, onClose, onSubmit, currentOccupancy, maxCapacity }) => {
  const [inputValue, setInputValue] = useState('0');
  const [error, setError] = useState('');

  const handleSubmit = () => {
    const intakeCount = parseInt(inputValue, 10);
    
    if (isNaN(intakeCount)) {
      setError('Please enter a valid integer.');
      return;
    }

    if (currentOccupancy + intakeCount < 0) {
      setError('Occupancy cannot fall below 0.');
      return;
    }

    if (currentOccupancy + intakeCount > maxCapacity) {
      setError(`Occupancy cannot exceed max capacity of ${maxCapacity}.`);
      return;
    }

    onSubmit(intakeCount);
    setInputValue('0');
    setError('');
    onClose();
  };

  const handleClose = () => {
    setInputValue('0');
    setError('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h3>Adjust Occupancy</h3>
        <div className="occupancy-info">
          <p><strong>Current Occupancy:</strong> {currentOccupancy}</p>
          <p><strong>Max Capacity:</strong> {maxCapacity}</p>
        </div>
        <div className="form-group">
          <label htmlFor="intakeInput">
            Adjustment Count
            <small>(positive to check-in, negative to check-out)</small>
          </label>
          <input
            id="intakeInput"
            type="number"
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value);
              setError('');
            }}
            placeholder="Enter adjustment count"
            autoFocus
          />
        </div>
        {error && <div className="error-message">{error}</div>}
        <div className="modal-actions">
          <button className="btn btn-secondary" onClick={handleClose}>
            Cancel
          </button>
          <button className="btn btn-primary" onClick={handleSubmit}>
            Update
          </button>
        </div>
      </div>
    </div>
  );
};

export default OccupancyModal;
