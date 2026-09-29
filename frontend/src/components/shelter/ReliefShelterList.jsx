import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchShelters, updateOccupancy, deleteShelter } from '../../store/slices/shelterSlice';
import CapacityBar from '../common/CapacityBar';
import EmptyState from '../common/EmptyState';
import Pagination from '../common/Pagination';
import OccupancyModal from '../common/OccupancyModal';
import ReliefShelterForm from './ReliefShelterForm';

const ReliefShelterList = ({ onAddNotification }) => {
  const dispatch = useDispatch();
  const { items, loading, pagination } = useSelector((state) => state.shelters);
  const { user } = useSelector((state) => state.auth);

  const [currentPage, setCurrentPage] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingShelter, setEditingShelter] = useState(null);
  const [occupancyModal, setOccupancyModal] = useState({ isOpen: false, data: null });

  const fetchItems = () => {
    dispatch(fetchShelters({ page: currentPage, size: 10 }));
  };

  useEffect(() => {
    fetchItems();
  }, [currentPage, dispatch]);

  const handleAdjustOccupancy = (id, currentOccupancy, maxCapacity) => {
    setOccupancyModal({
      isOpen: true,
      data: { id, currentOccupancy, maxCapacity }
    });
  };

  const handleOccupancySubmit = async (intakeCount) => {
    const { id } = occupancyModal.data;
    try {
      await dispatch(updateOccupancy({ id, intakeCount })).unwrap();
      if (onAddNotification) {
        onAddNotification('Shelter occupancy updated successfully!', 'success');
      } else {
        alert('Shelter occupancy updated successfully!');
      }
      fetchItems();
    } catch (err) {
      alert(err || 'Failed to adjust occupancy.');
    }
  };

  const handleCreate = () => {
    setEditingShelter(null);
    setIsModalOpen(true);
  };

  const handleEdit = (shelter) => {
    setEditingShelter(shelter);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this shelter permanently?')) {
      try {
        await dispatch(deleteShelter(id)).unwrap();
        if (onAddNotification) onAddNotification('Shelter removed successfully.', 'success');
        fetchItems();
      } catch (err) {
        alert(err || 'Failed to delete shelter.');
      }
    }
  };

  const isDirector = user && user.role === 'AGENCY_DIRECTOR';
  const canManage = user && (user.role === 'AGENCY_DIRECTOR' || user.role === 'EMERGENCY_DISPATCHER');

  return (
    <div className="glass-panel">
      <div className="dashboard-header">
        <h2>Relief Facility Overview</h2>
        {canManage && (
          <button className="btn btn-primary" onClick={handleCreate}>
            Register Shelter
          </button>
        )}
      </div>

      {loading && <p>Loading shelters...</p>}

      {!loading && items.length === 0 ? (
        <EmptyState message="No relief shelters registered." />
      ) : (
        <>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Shelter Name</th>
                  <th>Location</th>
                  <th>Manager</th>
                  <th>Capacity Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {items.map((shelter) => (
                  <tr key={shelter.id}>
                    <td style={{ fontWeight: '600' }}>{shelter.shelterName}</td>
                    <td>{shelter.locationAddress}</td>
                    <td>{shelter.managerName || 'Unassigned'}</td>
                    <td style={{ width: '300px' }}>
                      <CapacityBar
                        current={shelter.currentOccupancy}
                        capacity={shelter.capacity}
                      />
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button
                          className="btn btn-secondary"
                          style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}
                          onClick={() =>
                            handleAdjustOccupancy(
                              shelter.id,
                              shelter.currentOccupancy,
                              shelter.capacity
                            )
                          }
                        >
                          Occupancy
                        </button>
                        {isDirector && (
                          <>
                            <button
                              className="btn btn-secondary"
                              style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}
                              onClick={() => handleEdit(shelter)}
                            >
                              Edit
                            </button>
                            <button
                              className="btn btn-danger"
                              style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}
                              onClick={() => handleDelete(shelter.id)}
                            >
                              Delete
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
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
        <ReliefShelterForm
          shelter={editingShelter}
          onAddNotification={onAddNotification}
          onClose={() => {
            setIsModalOpen(false);
            setEditingShelter(null);
            fetchItems();
          }}
        />
      )}

      {occupancyModal.isOpen && (
        <OccupancyModal
          isOpen={occupancyModal.isOpen}
          onClose={() => setOccupancyModal({ isOpen: false, data: null })}
          onSubmit={handleOccupancySubmit}
          currentOccupancy={occupancyModal.data?.currentOccupancy}
          maxCapacity={occupancyModal.data?.maxCapacity}
        />
      )}
    </div>
  );
};

export default ReliefShelterList;
