import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPersonnel, deactivatePersonnel } from '../../store/slices/personnelSlice';
import EmptyState from '../common/EmptyState';
import Pagination from '../common/Pagination';
import PersonnelAccountForm from './PersonnelAccountForm';

const PersonnelAccountList = ({ onAddNotification }) => {
  const dispatch = useDispatch();
  const { items, loading, pagination } = useSelector((state) => state.personnel);
  const { user } = useSelector((state) => state.auth);

  const [currentPage, setCurrentPage] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState(null);

  const fetchItems = () => {
    dispatch(fetchPersonnel({ page: currentPage, size: 10 }));
  };

  useEffect(() => {
    fetchItems();
  }, [currentPage, dispatch]);

  const handleDeactivate = async (id) => {
    if (window.confirm('Are you sure you want to deactivate this personnel account?')) {
      try {
        await dispatch(deactivatePersonnel(id)).unwrap();
        if (onAddNotification) {
          onAddNotification('Personnel account deactivated.', 'success');
        } else {
          alert('Personnel account deactivated.');
        }
        fetchItems();
      } catch (err) {
        alert(err || 'Failed to deactivate account.');
      }
    }
  };

  const handleEdit = (account) => {
    setSelectedAccount(account);
    setIsModalOpen(true);
  };

  const handleCreate = () => {
    setSelectedAccount(null);
    setIsModalOpen(true);
  };

  const isDirector = user && user.role === 'AGENCY_DIRECTOR';

  return (
    <div className="glass-panel">
      <div className="dashboard-header">
        <h2>Personnel Directory</h2>
        {isDirector && (
          <button className="btn btn-primary" onClick={handleCreate}>
            Register Personnel
          </button>
        )}
      </div>

      {loading && <p>Loading personnel directory...</p>}

      {!loading && items.length === 0 ? (
        <EmptyState message="No personnel accounts registered." />
      ) : (
        <>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Username</th>
                  <th>Full Name</th>
                  <th>Role</th>
                  <th>Contact Number</th>
                  <th>Assigned Region</th>
                  <th>Status</th>
                  {isDirector && <th>Actions</th>}
                </tr>
              </thead>
              <tbody>
                {items.map((acc) => (
                  <tr key={acc.id}>
                    <td>{acc.username}</td>
                    <td style={{ fontWeight: '600' }}>{acc.fullName}</td>
                    <td>
                      <span className="badge badge-info">{acc.role.replace('_', ' ')}</span>
                    </td>
                    <td>{acc.contactNumber}</td>
                    <td>{acc.assignedRegion}</td>
                    <td>
                      {acc.isActive ? (
                        <span className="badge badge-success">Active</span>
                      ) : (
                        <span className="badge badge-danger">Inactive</span>
                      )}
                    </td>
                    {isDirector && (
                      <td>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <button
                            className="btn btn-secondary"
                            style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}
                            onClick={() => handleEdit(acc)}
                          >
                            Edit
                          </button>
                          {acc.isActive && (
                            <button
                              className="btn btn-danger"
                              style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}
                              onClick={() => handleDeactivate(acc.id)}
                            >
                              Deactivate
                            </button>
                          )}
                        </div>
                      </td>
                    )}
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
        <PersonnelAccountForm
          account={selectedAccount}
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

export default PersonnelAccountList;
