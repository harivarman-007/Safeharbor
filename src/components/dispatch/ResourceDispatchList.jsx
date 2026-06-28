import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDispatches, fulfillDispatch } from '../../store/slices/dispatchSlice';
import EmptyState from '../common/EmptyState';
import Pagination from '../common/Pagination';
import ResourceDispatchForm from './ResourceDispatchForm';

const ResourceDispatchList = ({ onAddNotification }) => {
  const dispatch = useDispatch();
  const { items, loading, pagination } = useSelector((state) => state.dispatches);
  const { user } = useSelector((state) => state.auth);

  const [currentPage, setCurrentPage] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchItems = () => {
    dispatch(fetchDispatches({ page: currentPage, size: 10 }));
  };

  useEffect(() => {
    fetchItems();
  }, [currentPage, dispatch]);

  const handleFulfill = async (id) => {
    try {
      await dispatch(fulfillDispatch(id)).unwrap();
      if (onAddNotification) {
        onAddNotification('Dispatch status updated successfully!', 'success');
      } else {
        alert('Dispatch status updated successfully!');
      }
      fetchItems();
    } catch (err) {
      alert(err || 'Failed to fulfill dispatch.');
    }
  };

  const handleCreate = () => {
    setIsModalOpen(true);
  };

  const canManage = user && (user.role === 'AGENCY_DIRECTOR' || user.role === 'EMERGENCY_DISPATCHER');
  const canFulfill = user && (user.role === 'AGENCY_DIRECTOR' || user.role === 'LOGISTICS_COORDINATOR');

  return (
    <div className="glass-panel">
      <div className="dashboard-header">
        <h2>Resource Logistics Monitor</h2>
        {canManage && (
          <button className="btn btn-primary" onClick={handleCreate}>
            Request Resource Dispatch
          </button>
        )}
      </div>

      {loading && <p>Loading logistics dispatches...</p>}

      {!loading && items.length === 0 ? (
        <EmptyState message="No dispatch records found." />
      ) : (
        <>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Target Incident</th>
                  <th>Supply Item</th>
                  <th>Dispatched Qty</th>
                  <th>Status</th>
                  <th>Initiated At</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map((disp) => {
                  let badgeClass = 'badge-info';
                  if (disp.dispatchStatus === 'DELIVERED') badgeClass = 'badge-success';
                  if (disp.dispatchStatus === 'CANCELLED') badgeClass = 'badge-danger';
                  if (disp.dispatchStatus === 'IN_TRANSIT') badgeClass = 'badge-warning';

                  // Verify is IN_TRANSIT dispatch for fulfillment
                  const showFulfillBtn = canFulfill && disp.dispatchStatus === 'IN_TRANSIT';

                  return (
                    <tr key={disp.id}>
                      <td>{disp.incidentTitle || 'N/A'}</td>
                      <td style={{ fontWeight: '600' }}>{disp.itemName || 'N/A'}</td>
                      <td>{disp.dispatchedQuantity}</td>
                      <td>
                        <span className={`badge ${badgeClass}`}>{disp.dispatchStatus}</span>
                      </td>
                      <td>
                        {disp.initiatedAt ? new Date(disp.initiatedAt).toLocaleString() : 'N/A'}
                      </td>
                      <td>
                        {showFulfillBtn ? (
                          <button
                            className="btn btn-primary"
                            style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}
                            onClick={() => handleFulfill(disp.id)}
                          >
                            Fulfill
                          </button>
                        ) : (
                          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                            No action
                          </span>
                        )}
                      </td>
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
        <ResourceDispatchForm
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

export default ResourceDispatchList;
