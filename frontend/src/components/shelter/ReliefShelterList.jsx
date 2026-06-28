import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchShelters, updateOccupancy } from '../../store/slices/shelterSlice';
import CapacityBar from '../common/CapacityBar';
import EmptyState from '../common/EmptyState';
import Pagination from '../common/Pagination';
import ReliefShelterForm from './ReliefShelterForm';

const ReliefShelterList = ({ onAddNotification }) => {
  const dispatch = useDispatch();
  const { items, loading, pagination } = useSelector((state) => state.shelters);
  const { user } = useSelector((state) => state.auth);

  const [currentPage, setCurrentPage] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchItems = () => {
    dispatch(fetchShelters({ page: currentPage, size: 10 }));
  };

  useEffect(() => {
    fetchItems();
  }, [currentPage, dispatch]);

  const handleAdjustOccupancy = async (id, currentOccupancy, maxCapacity) => {
    const promptVal = window.prompt(
      'Enter adjustment count (positive number to check-in, negative number to check-out):',
      '0'
    );
    if (promptVal === null) return;

    const intakeCount = parseInt(promptVal, 10);
    if (isNaN(intakeCount)) {
      alert('Please enter a valid integer.');
      return;
    }

    if (currentOccupancy + intakeCount < 0) {
      alert('Occupancy cannot fall below 0.');
      return;
    }

    if (currentOccupancy + intakeCount > maxCapacity) {
      alert(`Occupancy cannot exceed max capacity of ${maxCapacity}.`);
      return;
    }

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
    setIsModalOpen(true);
  };

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
                        Adjust Occupancy
                      </button>
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

export default ReliefShelterList;
