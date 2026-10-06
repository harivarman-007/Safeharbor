import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import ReactDOM from 'react-dom';
import { reportIncident, modifyIncident } from '../../store/slices/incidentSlice';

const DisasterIncidentForm = ({ incident, onClose, onAddNotification }) => {
  const dispatch = useDispatch();
  const isEdit = !!incident;

  const [title, setTitle] = useState('');
  const [incidentType, setIncidentType] = useState('FLOOD');
  const [severityLevel, setSeverityLevel] = useState('MEDIUM');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (incident) {
      setTitle(incident.title || '');
      setIncidentType(incident.incidentType || 'FLOOD');
      setSeverityLevel(incident.severityLevel || 'MEDIUM');
      setLatitude(incident.latitude !== undefined ? incident.latitude.toString() : '');
      setLongitude(incident.longitude !== undefined ? incident.longitude.toString() : '');
      setDescription(incident.description || '');
    }
  }, [incident]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const latVal = parseFloat(latitude);
    const lngVal = parseFloat(longitude);

    if (isNaN(latVal) || latVal < -90 || latVal > 90) {
      alert('Latitude must validate between -90 and 90.');
      return;
    }

    if (isNaN(lngVal) || lngVal < -180 || lngVal > 180) {
      alert('Longitude must validate between -180 and 180.');
      return;
    }

    const payload = {
      title,
      description,
      incidentType,
      severityLevel,
      latitude: latVal,
      longitude: lngVal,
    };

    try {
      if (isEdit) {
        await dispatch(modifyIncident({ id: incident.id, data: payload })).unwrap();
        if (onAddNotification) {
          onAddNotification('DisasterIncident updated successfully.', 'success');
        } else {
          alert('DisasterIncident updated successfully.');
        }
      } else {
        await dispatch(reportIncident(payload)).unwrap();
        if (onAddNotification) {
          onAddNotification('Incident logged successfully!', 'success');
        } else {
          alert('Incident logged successfully!');
        }
      }
      onClose();
    } catch (err) {
      console.error(err);
      // err is the structured { status, message } payload from rejectWithValue
      const status = err?.status;
      let msg;
      if (status >= 500 || status === undefined) {
        msg = 'Incident could not be logged due to a server error. Please retry.';
      } else {
        // 400 / 409 — surface the backend message directly
        msg = err?.message || 'Operation failed. Please retry.';
      }
      if (onAddNotification) {
        onAddNotification(msg, 'error');
      } else {
        alert(msg);
      }
    }
  };

  return ReactDOM.createPortal(
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Log Disaster Incident</h2>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">×</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title">Incident Title *</label>
            <input
              id="title"
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Chennai Flood"
            />
          </div>

          <div className="form-group">
            <label htmlFor="incidentType">Incident Type *</label>
            <select
              id="incidentType"
              value={incidentType}
              onChange={(e) => setIncidentType(e.target.value)}
            >
              <option value="FLOOD">FLOOD</option>
              <option value="EARTHQUAKE">EARTHQUAKE</option>
              <option value="WILDFIRE">WILDFIRE</option>
              <option value="CYCLONE">CYCLONE</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="severityLevel">Severity Level *</label>
            <select
              id="severityLevel"
              value={severityLevel}
              onChange={(e) => setSeverityLevel(e.target.value)}
            >
              <option value="LOW">LOW</option>
              <option value="MEDIUM">MEDIUM</option>
              <option value="HIGH">HIGH</option>
              <option value="CRITICAL">CRITICAL</option>
            </select>
          </div>

          <div style={{ display: 'flex', gap: '1rem' }}>
            <div className="form-group" style={{ flex: 1 }}>
              <label htmlFor="latitude">Latitude *</label>
              <input
                id="latitude"
                type="number"
                step="any"
                required
                value={latitude}
                onChange={(e) => setLatitude(e.target.value)}
                placeholder="e.g. 13.0827"
              />
            </div>
            <div className="form-group" style={{ flex: 1 }}>
              <label htmlFor="longitude">Longitude *</label>
              <input
                id="longitude"
                type="number"
                step="any"
                required
                value={longitude}
                onChange={(e) => setLongitude(e.target.value)}
                placeholder="e.g. 80.2707"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="description">Scenario Description *</label>
            <textarea
              id="description"
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide complete scenario..."
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1.5rem' }}>
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Commit Incident
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
};

export default DisasterIncidentForm;
