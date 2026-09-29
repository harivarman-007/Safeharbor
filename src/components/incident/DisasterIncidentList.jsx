import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchIncidents, removeIncident, assignIncidentResponder, changeIncidentStatus } from '../../store/slices/incidentSlice';
import { fetchPersonnel } from '../../store/slices/personnelSlice';
import SearchFilterBar from '../common/SearchFilterBar';
import EmptyState from '../common/EmptyState';
import Pagination from '../common/Pagination';
import DisasterIncidentForm from './DisasterIncidentForm';

const DisasterIncidentList = ({ onAddNotification }) => {
  const dispatch = useDispatch();
  const { items, loading, error, pagination } = useSelector((state) => state.incidents);
  const { user } = useSelector((state) => state.auth);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [currentPage, setCurrentPage] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingIncident, setEditingIncident] = useState(null);
  const [selectedResponderByIncident, setSelectedResponderByIncident] = useState({});

  const fetchFilteredIncidents = () => {
    const params = {
      page: currentPage,
      size: 10,
    };
    if (filterStatus !== 'ALL') {
      params.status = filterStatus;
    }
    dispatch(fetchIncidents(params));
  };

  useEffect(() => {
    fetchFilteredIncidents();
  }, [currentPage, filterStatus, dispatch]);

  const canDirectorAssign = user && user.role === 'AGENCY_DIRECTOR';
  const { items: personnelItems } = useSelector((state) => state.personnel);
  const activeResponders = useMemo(
    () => personnelItems.filter((person) => person.role === 'FIELD_RESPONDER' && person.isActive),
    [personnelItems]
  );

  useEffect(() => {
    if (canDirectorAssign) {
      dispatch(fetchPersonnel({ role: 'FIELD_RESPONDER', page: 0, size: 100 }));
    }
  }, [canDirectorAssign, dispatch]);

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const handleFilter = (status) => {
    setFilterStatus(status);
    setCurrentPage(0); // Reset page on filter change
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this incident?')) {
      try {
        const result = await dispatch(removeIncident(id)).unwrap();
        // Retrieve backend response message if present
        const message = result.response?.message || 'DisasterIncident deleted successfully.';
        if (onAddNotification) {
          onAddNotification(message, 'success');
        } else {
          alert(message);
        }
        fetchFilteredIncidents();
      } catch (err) {
        alert(err || 'Failed to delete incident.');
      }
    }
  };

  const openEditModal = (incident) => {
    setEditingIncident(incident);
    setIsModalOpen(true);
  };

  const openCreateModal = () => {
    setEditingIncident(null);
    setIsModalOpen(true);
  };

  const handleResponderChange = (incidentId, personnelId) => {
    setSelectedResponderByIncident((prev) => ({
      ...prev,
      [incidentId]: personnelId,
    }));
  };

  const handleAssignResponder = async (incidentId) => {
    const personnelId = selectedResponderByIncident[incidentId];
    if (!personnelId) {
      alert('Please select a responder to assign.');
      return;
    }
    try {
      await dispatch(assignIncidentResponder({ id: incidentId, personnelId })).unwrap();
      if (onAddNotification) {
        onAddNotification('Responder assigned successfully.', 'success');
      } else {
        alert('Responder assigned successfully.');
      }
      setSelectedResponderByIncident((prev) => ({ ...prev, [incidentId]: null }));
      fetchFilteredIncidents();
    } catch (err) {
      alert(err || 'Failed to assign responder.');
    }
  };

  const handleStatusChange = async (incidentId, newStatus) => {
    try {
      await dispatch(changeIncidentStatus({ id: incidentId, status: newStatus })).unwrap();
      if (onAddNotification) {
        onAddNotification(`Incident marked as ${newStatus}.`, 'success');
      }
      fetchFilteredIncidents();
    } catch (err) {
      alert(err || 'Failed to update status.');
    }
  };

  // Filter items locally by search term
  const displayedItems = items.filter((item) =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.incidentType.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const canManage = user && (user.role === 'AGENCY_DIRECTOR' || user.role === 'EMERGENCY_DISPATCHER');

  return (
    <div className="glass-panel">
      <div className="dashboard-header">
        <h2>Emergency Incident Dashboard</h2>
        {canManage && (
          <button className="btn btn-primary" onClick={openCreateModal}>
            Report Incident
          </button>
        )}
      </div>

      <SearchFilterBar
        placeholder="Search incidents by title or type..."
        selectedFilter={filterStatus}
        filterOptions={[
          { label: 'Reported', value: 'REPORTED' },
          { label: 'Assigned', value: 'ASSIGNED' },
          { label: 'Resolved', value: 'RESOLVED' },
          { label: 'Cancelled', value: 'CANCELLED' },
        ]}
        onSearch={handleSearch}
        onFilter={handleFilter}
      />

      {loading && <p>Loading incidents...</p>}

      {!loading && displayedItems.length === 0 ? (
        <EmptyState message="No active incidents reported." />
      ) : (
        <>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Type</th>
                  <th>Severity</th>
                  <th>Location (Lat, Lng)</th>
                  <th>Responder</th>
                  <th>Status</th>
                  {canManage && <th>Actions</th>}
                </tr>
              </thead>
              <tbody>
                {displayedItems.map((incident) => {
                  let statusBadge = 'badge-info';
                  if (incident.status === 'RESOLVED') statusBadge = 'badge-success';
                  if (incident.status === 'CANCELLED') statusBadge = 'badge-danger';
                  if (incident.status === 'ASSIGNED') statusBadge = 'badge-warning';

                  const selectedResponder = selectedResponderByIncident[incident.id] || '';

                  return (
                    <tr key={incident.id}>
                      <td>{incident.title}</td>
                      <td>{incident.incidentType}</td>
                      <td>{incident.severityLevel}</td>
                      <td>
                        {incident.latitude?.toFixed(4)}, {incident.longitude?.toFixed(4)}
                      </td>
                      <td>{incident.assignedResponderUsername || 'Unassigned'}</td>
                      <td>
                        <span className={`badge ${statusBadge}`}>{incident.status}</span>
                      </td>
                      {canManage && (
                        <td>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                              <button
                                className="btn btn-secondary"
                                style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}
                                title="Edit Incident"
                                onClick={() => openEditModal(incident)}
                              >
                                Edit
                              </button>
                              <button
                                className="btn btn-danger"
                                style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}
                                title="Delete Incident"
                                onClick={() => handleDelete(incident.id)}
                              >
                                Delete
                              </button>
                            </div>
                            {canDirectorAssign && !['RESOLVED', 'CANCELLED'].includes(incident.status) && (
                              <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <button
                                  className="btn btn-primary"
                                  style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', background: 'var(--success, #22c55e)' }}
                                  onClick={() => handleStatusChange(incident.id, 'RESOLVED')}
                                >
                                  ✓ Resolve
                                </button>
                                <button
                                  className="btn btn-secondary"
                                  style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}
                                  onClick={() => handleStatusChange(incident.id, 'CANCELLED')}
                                >
                                  ✕ Cancel
                                </button>
                              </div>
                            )}
                            {canDirectorAssign && incident.status === 'REPORTED' && (
                              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                <select
                                  value={selectedResponder}
                                  onChange={(e) => handleResponderChange(incident.id, e.target.value)}
                                  style={{ minWidth: '12rem', padding: '0.35rem' }}
                                >
                                  <option value="">Select responder</option>
                                  {activeResponders.map((responder) => (
                                    <option key={responder.id} value={responder.id}>
                                      {responder.fullName} ({responder.username})
                                    </option>
                                  ))}
                                </select>
                                <button
                                  className="btn btn-primary"
                                  style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}
                                  title="Assign Responder"
                                  onClick={() => handleAssignResponder(incident.id)}
                                >
                                  Assign
                                </button>
                              </div>
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
        <DisasterIncidentForm
          incident={editingIncident}
          onAddNotification={onAddNotification}
          onClose={() => {
            setIsModalOpen(false);
            fetchFilteredIncidents();
          }}
        />
      )}
    </div>
  );
};

export default DisasterIncidentList;
