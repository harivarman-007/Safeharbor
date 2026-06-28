import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';

import Navbar from './components/layout/Navbar';
import Login from './components/Login';
import Register from './components/Register';
import ErrorHandler from './components/ErrorHandler';
import NotificationStack from './components/NotificationStack';

import StatCards from './components/dashboard/StatCards';
import DomainChart from './components/dashboard/DomainChart';
import RecentActivity from './components/dashboard/RecentActivity';

import DisasterIncidentList from './components/incident/DisasterIncidentList';
import SupplyInventoryList from './components/inventory/SupplyInventoryList';
import ResourceDispatchList from './components/dispatch/ResourceDispatchList';
import ReliefShelterList from './components/shelter/ReliefShelterList';
import PersonnelAccountList from './components/personnel/PersonnelAccountList';

import { fetchIncidents } from './store/slices/incidentSlice';
import { fetchInventory } from './store/slices/inventorySlice';
import { fetchDispatches } from './store/slices/dispatchSlice';
import { fetchShelters } from './store/slices/shelterSlice';

const App = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { token, user } = useSelector((state) => state.auth);
  const incidents = useSelector((state) => state.incidents.items);
  const inventory = useSelector((state) => state.inventory.items);
  const shortages = useSelector((state) => state.inventory.shortages);
  const dispatches = useSelector((state) => state.dispatches.items);
  const shelters = useSelector((state) => state.shelters.items);

  // Errors from slices
  const authError = useSelector((state) => state.auth.error);
  const incidentError = useSelector((state) => state.incidents.error);
  const inventoryError = useSelector((state) => state.inventory.error);
  const dispatchError = useSelector((state) => state.dispatches.error);
  const shelterError = useSelector((state) => state.shelters.error);
  const personnelError = useSelector((state) => state.personnel.error);
  const globalError = authError || incidentError || inventoryError || dispatchError || shelterError || personnelError;

  const [activeTab, setActiveTab] = useState('home');
  const [notifications, setNotifications] = useState([]);

  // Toast alert manager
  const addNotification = (message, type = 'success') => {
    const id = Date.now() + Math.random().toString(36).substr(2, 9);
    setNotifications((prev) => [...prev, { id, message, type }]);

    // Auto-dismiss after 5s
    setTimeout(() => {
      dismissNotification(id);
    }, 5000);
  };

  const dismissNotification = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!token && location.pathname !== '/login' && location.pathname !== '/register') {
      navigate('/login');
    }
  }, [token, location.pathname, navigate]);

  // Load dashboard data if authenticated
  useEffect(() => {
    if (token) {
      dispatch(fetchIncidents({ page: 0, size: 100 }));
      dispatch(fetchInventory({ page: 0, size: 100 }));
      dispatch(fetchDispatches({ page: 0, size: 100 }));
      dispatch(fetchShelters({ page: 0, size: 100 }));
    }
  }, [token, dispatch]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab === 'login') {
      navigate('/login');
    } else if (tab === 'register') {
      navigate('/register');
    } else {
      navigate('/');
    }
  };

  // Synchronize view tab state if route changes directly
  useEffect(() => {
    if (location.pathname === '/login') {
      setActiveTab('login');
    } else if (location.pathname === '/register') {
      setActiveTab('register');
    }
  }, [location.pathname]);

  // Calculations for dashboard
  const activeIncidentsCount = incidents.filter(
    (i) => i.status === 'REPORTED' || i.status === 'ASSIGNED'
  ).length;

  const pendingDispatchesCount = dispatches.filter(
    (d) => d.dispatchStatus === 'PENDING_APPROVAL' || d.dispatchStatus === 'IN_TRANSIT'
  ).length;

  const availableSheltersCount = shelters.filter(
    (s) => s.isActive && s.currentOccupancy < s.capacity
  ).length;

  const shortagesCount = shortages.length;

  // Incident distributions for DomainChart
  const types = ['FLOOD', 'EARTHQUAKE', 'WILDFIRE', 'CYCLONE'];
  const chartData = types.map((type) => ({
    label: type,
    value: incidents.filter((i) => i.incidentType === type).length,
  }));

  // Create mock recent activity logs
  const recentActivities = [
    ...incidents.slice(0, 3).map((i) => ({
      title: `Incident logged: ${i.title} (${i.incidentType})`,
      date: i.reportedAt || new Date().toISOString(),
    })),
    ...dispatches.slice(0, 2).map((d) => ({
      title: `Resource dispatch [${d.dispatchStatus}]: ${d.itemName} (${d.dispatchedQuantity})`,
      date: d.initiatedAt || new Date().toISOString(),
    })),
  ].sort((a, b) => new Date(b.date) - new Date(a.date));

  return (
    <div className="app-container">
      <Navbar activeTab={activeTab} onTabChange={handleTabChange} />

      <main className="main-content">
        <ErrorHandler error={globalError} />

        <Routes>
          <Route
            path="/login"
            element={<Login setView={(v) => handleTabChange(v)} />}
          />
          <Route
            path="/register"
            element={<Register setView={(v) => handleTabChange(v)} />}
          />
          <Route
            path="/"
            element={
              token ? (
                <>
                  {activeTab === 'home' && (
                    <div style={{ animation: 'fadeIn 0.4s ease-out' }}>
                      <div className="dashboard-header">
                        <div>
                          <h1>Operations Command Center</h1>
                          <p>SafeHarbor Disaster Response Coordination Platform</p>
                        </div>
                      </div>

                      <StatCards
                        activeIncidents={activeIncidentsCount}
                        pendingDispatches={pendingDispatchesCount}
                        availableShelters={availableSheltersCount}
                        criticalShortages={shortagesCount}
                      />

                      <div className="dashboard-details-grid" style={{ marginTop: '2rem' }}>
                        <div className="glass-panel">
                          <DomainChart data={chartData} />
                        </div>
                        <div className="glass-panel">
                          <RecentActivity activities={recentActivities} />
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === 'incidents' && (
                    <DisasterIncidentList onAddNotification={addNotification} />
                  )}

                  {activeTab === 'inventory' && (
                    <SupplyInventoryList onAddNotification={addNotification} />
                  )}

                  {activeTab === 'dispatches' && (
                    <ResourceDispatchList onAddNotification={addNotification} />
                  )}

                  {activeTab === 'shelters' && (
                    <ReliefShelterList onAddNotification={addNotification} />
                  )}

                  {activeTab === 'personnel' && (
                    <PersonnelAccountList onAddNotification={addNotification} />
                  )}
                </>
              ) : null
            }
          />
        </Routes>
      </main>

      <NotificationStack
        notifications={notifications}
        removeNotification={dismissNotification}
      />
    </div>
  );
};

export default App;
