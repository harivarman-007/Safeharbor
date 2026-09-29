import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchInventory, deleteInventoryItem } from '../../store/slices/inventorySlice';
import EmptyState from '../common/EmptyState';
import Pagination from '../common/Pagination';
import SupplyInventoryForm from './SupplyInventoryForm';

const SupplyInventoryList = ({ onAddNotification }) => {
  const dispatch = useDispatch();
  const { items, loading, pagination } = useSelector((state) => state.inventory);
  const { user } = useSelector((state) => state.auth);

  const [currentPage, setCurrentPage] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const fetchItems = () => {
    dispatch(fetchInventory({ page: currentPage, size: 10 }));
  };

  useEffect(() => {
    fetchItems();
  }, [currentPage, dispatch]);

  const handleEdit = (item) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const handleCreate = () => {
    setSelectedItem(null);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this inventory item permanently?')) {
      try {
        await dispatch(deleteInventoryItem(id)).unwrap();
        if (onAddNotification) onAddNotification('Inventory item deleted.', 'success');
        fetchItems();
      } catch (err) {
        alert(err || 'Failed to delete item.');
      }
    }
  };

  const isDirector = user && user.role === 'AGENCY_DIRECTOR';
  const canManage = user && (user.role === 'AGENCY_DIRECTOR' || user.role === 'EMERGENCY_DISPATCHER');

  return (
    <div className="glass-panel">
      <div className="dashboard-header">
        <h2>Stockpile Inventory Monitor</h2>
        {canManage && (
          <button className="btn btn-primary" onClick={handleCreate}>
            Add Survival Asset
          </button>
        )}
      </div>

      {loading && <p>Loading stockpile...</p>}

      {!loading && items.length === 0 ? (
        <EmptyState message="Survival assets stockpile is currently empty." />
      ) : (
        <>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Item Name</th>
                  <th>Category</th>
                  <th>Quantity Available</th>
                  <th>Reserved Quantity</th>
                  <th>Critical Threshold</th>
                  <th>Unit</th>
                  <th>Status</th>
                  {canManage && <th>Actions</th>}
                </tr>
              </thead>
              <tbody>
                {items.map((item) => {
                  const isLow = item.availableQuantity <= item.criticalThreshold;
                  return (
                    <tr key={item.id}>
                      <td style={{ fontWeight: '600' }}>{item.itemName}</td>
                      <td>{item.category}</td>
                      <td>{item.availableQuantity}</td>
                      <td>{item.reservedQuantity}</td>
                      <td>{item.criticalThreshold}</td>
                      <td>{item.unit}</td>
                      <td>
                        {isLow ? (
                          <span className="badge badge-danger">Low Stock</span>
                        ) : (
                          <span className="badge badge-success">Good</span>
                        )}
                      </td>
                      {canManage && (
                        <td>
                          <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <button
                              className="btn btn-secondary"
                              style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}
                              onClick={() => handleEdit(item)}
                            >
                              Edit
                            </button>
                            {isDirector && (
                              <button
                                className="btn btn-danger"
                                style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}
                                onClick={() => handleDelete(item.id)}
                              >
                                Delete
                              </button>
                            )}
                          </div>
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {pagination && (
            <Pagination
              currentPage={currentPage}
              totalPages={pagination.totalPages}
              onPageChange={(page) => setCurrentPage(page)}
            />
          )}
        </>
      )}

      {isModalOpen && (
        <SupplyInventoryForm
          item={selectedItem}
          onAddNotification={onAddNotification}
          onClose={() => {
            setIsModalOpen(false);
            fetchItems();
          }}
        />
      )}
    </div>
  );
};

export default SupplyInventoryList;
