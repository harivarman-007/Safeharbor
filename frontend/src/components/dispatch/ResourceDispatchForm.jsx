import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchIncidents } from '../../store/slices/incidentSlice';
import { fetchInventory } from '../../store/slices/inventorySlice';
import { requestDispatch } from '../../store/slices/dispatchSlice';

const ResourceDispatchForm = ({ onClose, onAddNotification }) => {
  const dispatch = useDispatch();

  const { items: incidents } = useSelector((state) => state.incidents);
  const { items: inventoryItems } = useSelector((state) => state.inventory);
  const { loading } = useSelector((state) => state.dispatches);

  const [targetIncidentId, setTargetIncidentId] = useState('');
  const [inventoryItemId, setInventoryItemId] = useState('');
  const [dispatchedQuantity, setDispatchedQuantity] = useState('');

  useEffect(() => {
    // Load incidents and inventory items for dropdowns
    dispatch(fetchIncidents({ page: 0, size: 50 }));
    dispatch(fetchInventory({ page: 0, size: 50 }));
  }, [dispatch]);

  // Set default values when items load
  useEffect(() => {
    if (incidents.length > 0 && !targetIncidentId) {
      setTargetIncidentId(incidents[0].id.toString());
    }
  }, [incidents, targetIncidentId]);

  useEffect(() => {
    if (inventoryItems.length > 0 && !inventoryItemId) {
      setInventoryItemId(inventoryItems[0].id.toString());
    }
  }, [inventoryItems, inventoryItemId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!targetIncidentId || !inventoryItemId || !dispatchedQuantity) {
      alert('Please fill out all fields.');
      return;
    }

    const qty = parseInt(dispatchedQuantity, 10);
    const selectedItem = inventoryItems.find(
      (item) => item.id.toString() === inventoryItemId
    );

    if (!selectedItem) {
      alert('Selected inventory item not found.');
      return;
    }

    if (qty > selectedItem.availableQuantity) {
      alert(
        `Insufficient stock! Requested ${qty} but only ${selectedItem.availableQuantity} available.`
      );
      return;
    }

    if (qty <= 0) {
      alert('Dispatched Quantity must be a positive integer.');
      return;
    }

    try {
      await dispatch(
        requestDispatch({
          targetIncidentId: parseInt(targetIncidentId, 10),
          inventoryItemId: parseInt(inventoryItemId, 10),
          dispatchedQuantity: qty,
        })
      ).unwrap();

      if (onAddNotification) {
        onAddNotification('Resource dispatch initiated successfully!', 'success');
      } else {
        alert('Resource dispatch initiated successfully!');
      }
      onClose();
    } catch (err) {
      alert(err || 'Failed to request dispatch.');
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="modal-close-btn" onClick={onClose}>x</button>
        <h2>Initiate Resource Dispatch</h2>

        <form onSubmit={handleSubmit} style={{ marginTop: '1.25rem' }}>
          <div className="form-group">
            <label htmlFor="targetIncident">Select Target Incident *</label>
            <select
              id="targetIncident"
              value={targetIncidentId}
              onChange={(e) => setTargetIncidentId(e.target.value)}
              required
            >
              <option value="">-- Choose Incident --</option>
              {incidents.map((incident) => (
                <option key={incident.id} value={incident.id}>
                  {incident.title} ({incident.incidentType})
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="inventoryItem">Select Inventory Item *</label>
            <select
              id="inventoryItem"
              value={inventoryItemId}
              onChange={(e) => setInventoryItemId(e.target.value)}
              required
            >
              <option value="">-- Choose Stock Item --</option>
              {inventoryItems.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.itemName} (Available: {item.availableQuantity} {item.unit})
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="dispatchedQuantity">Dispatched Quantity *</label>
            <input
              id="dispatchedQuantity"
              type="number"
              required
              value={dispatchedQuantity}
              onChange={(e) => setDispatchedQuantity(e.target.value)}
              placeholder="e.g. 50"
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1.5rem' }}>
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Processing...' : 'Execute Dispatch'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResourceDispatchForm;
