import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
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
      alert(err || 'Operation failed');
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="modal-close-btn" onClick={onClose}>x</button>
        <h2 style={{ marginBottom: '1.5rem' }}>Log Disaster Incident</h2>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title">Incident Title *</label>
            <input
              id="title"
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Sector 7 Flood"
            />
          </div>

          <div className="form-group">
            <label htmlFor="type">Incident Type *</label>
            <select
              id="type"
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
            <label htmlFor="severity">Risk Severity Parameter *</label>
            <select
              id="severity"
              value={severityLevel}
              onChange={(e) => setSeverityLevel(e.target.value)}
            >
              <option value="LOW">LOW</option>
              <option value="MEDIUM">MEDIUM</option>
              <option value="HIGH">HIGH</option>
              <option value="CRITICAL">CRITICAL</option>
            </select>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label htmlFor="latitude">Latitude *</label>
              <input
                id="latitude"
                type="number"
                step="any"
                required
                value={latitude}
                onChange={(e) => setLatitude(e.target.value)}
                placeholder="34.0522"
              />
            </div>
            <div className="form-group">
              <label htmlFor="longitude">Longitude *</label>
              <input
                id="longitude"
                type="number"
                step="any"
                required
                value={longitude}
                onChange={(e) => setLongitude(e.target.value)}
                placeholder="-118.2437"
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
    </div>
  );
};

export default DisasterIncidentForm;
