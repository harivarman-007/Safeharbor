import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { addInventoryItem, updateStock } from '../../store/slices/inventorySlice';

const SupplyInventoryForm = ({ item, onClose, onAddNotification }) => {
  const dispatch = useDispatch();
  const isEdit = !!item;

  const [itemName, setItemName] = useState('');
  const [category, setCategory] = useState('MEDICAL');
  const [initialQuantity, setInitialQuantity] = useState('0');
  const [criticalThreshold, setCriticalThreshold] = useState('100');
  const [unit, setUnit] = useState('PIECES');

  useEffect(() => {
    if (item) {
      setItemName(item.itemName || '');
      setCategory(item.category || 'MEDICAL');
      setInitialQuantity(item.availableQuantity !== undefined ? item.availableQuantity.toString() : '0');
      setCriticalThreshold(item.criticalThreshold !== undefined ? item.criticalThreshold.toString() : '100');
      setUnit(item.unit || 'PIECES');
    }
  }, [item]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const thresh = parseInt(criticalThreshold, 10);
    const qty = parseInt(initialQuantity, 10);

    if (isNaN(thresh) || thresh <= 0) {
      alert('Critical Threshold must be a positive integer.');
      return;
    }

    if (isNaN(qty) || qty < 0) {
      alert('Initial Quantity must be a non-negative integer.');
      return;
    }

    try {
      if (isEdit) {
        // Since the requirement says updateInventoryStock endpoint is PATCH, let's call the thunk
        await dispatch(updateStock({ id: item.id, quantity: qty })).unwrap();
        if (onAddNotification) {
          onAddNotification('Stock levels updated successfully.', 'success');
        } else {
          alert('Stock levels updated successfully.');
        }
      } else {
        const payload = {
          itemName,
          category,
          availableQuantity: qty,
          criticalThreshold: thresh,
          unit,
        };
        await dispatch(addInventoryItem(payload)).unwrap();
        if (onAddNotification) {
          onAddNotification('Survival asset added successfully.', 'success');
        } else {
          alert('Survival asset added successfully.');
        }
      }
      onClose();
    } catch (err) {
      alert(err || 'Failed to save inventory item.');
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="modal-close-btn" onClick={onClose}>x</button>
        <h2>Manage Survival Asset</h2>

        <form onSubmit={handleSubmit} style={{ marginTop: '1rem' }}>
          <div className="form-group">
            <label htmlFor="itemName">Item Name *</label>
            <input
              id="itemName"
              type="text"
              required
              disabled={isEdit}
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
              placeholder="e.g. Sterile Bandages"
            />
          </div>

          <div className="form-group">
            <label htmlFor="category">Category</label>
            <select
              id="category"
              disabled={isEdit}
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="MEDICAL">Medical Supplies</option>
              <option value="FOOD">Food Rations</option>
              <option value="WATER">Drinking Water</option>
              <option value="SHELTER">Shelter & Bedding</option>
              <option value="EQUIPMENT">Emergency Equipment</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="initialQuantity">Initial Quantity *</label>
            <input
              id="initialQuantity"
              type="number"
              required
              value={initialQuantity}
              onChange={(e) => setInitialQuantity(e.target.value)}
              placeholder="0"
            />
          </div>

          {!isEdit && (
            <>
              <div className="form-group">
                <label htmlFor="criticalThreshold">Critical Threshold</label>
                <input
                  id="criticalThreshold"
                  type="number"
                  required
                  value={criticalThreshold}
                  onChange={(e) => setCriticalThreshold(e.target.value)}
                  placeholder="100"
                />
              </div>

              <div className="form-group">
                <label htmlFor="unit">Unit of Measure</label>
                <input
                  id="unit"
                  type="text"
                  required
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  placeholder="PIECES, LITERS, BOXES"
                />
              </div>
            </>
          )}

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1.5rem' }}>
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Save Asset
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SupplyInventoryForm;
