import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { logout } from '../../store/slices/authSlice';

const Navbar = ({ activeTab, onTabChange }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    if (onTabChange) {
      onTabChange('home');
    }
    navigate('/');
  };

  const renderLinks = () => {
    if (!user) {
      return (
        <>
          <a
            href="#login"
            className={`nav-link ${activeTab === 'login' ? 'active' : ''}`}
            onClick={(e) => {
              e.preventDefault();
              onTabChange('login');
            }}
          >
            Login
          </a>
          <a
            href="#register"
            className={`nav-link ${activeTab === 'register' ? 'active' : ''}`}
            onClick={(e) => {
              e.preventDefault();
              onTabChange('register');
            }}
          >
            Register
          </a>
        </>
      );
    }

    const role = user.role;

    if (role === 'AGENCY_DIRECTOR') {
      return (
        <>
          <a
            href="#home"
            className={`nav-link ${activeTab === 'home' ? 'active' : ''}`}
            onClick={(e) => {
              e.preventDefault();
              onTabChange('home');
            }}
          >
            Global Stats
          </a>
          <a
            href="#incidents"
            className={`nav-link ${activeTab === 'incidents' ? 'active' : ''}`}
            onClick={(e) => {
              e.preventDefault();
              onTabChange('incidents');
            }}
          >
            All Incidents
          </a>
          <a
            href="#inventory"
            className={`nav-link ${activeTab === 'inventory' ? 'active' : ''}`}
            onClick={(e) => {
              e.preventDefault();
              onTabChange('inventory');
            }}
          >
            Inventory
          </a>
          <a
            href="#personnel"
            className={`nav-link ${activeTab === 'personnel' ? 'active' : ''}`}
            onClick={(e) => {
              e.preventDefault();
              onTabChange('personnel');
            }}
          >
            Personnel
          </a>
        </>
      );
    }

    if (role === 'EMERGENCY_DISPATCHER') {
      return (
        <>
          <a
            href="#incidents"
            className={`nav-link ${activeTab === 'incidents' ? 'active' : ''}`}
            onClick={(e) => {
              e.preventDefault();
              onTabChange('incidents');
            }}
          >
            Active Incidents
          </a>
          <a
            href="#dispatches"
            className={`nav-link ${activeTab === 'dispatches' ? 'active' : ''}`}
            onClick={(e) => {
              e.preventDefault();
              onTabChange('dispatches');
            }}
          >
            Dispatch
          </a>
          <a
            href="#shelters"
            className={`nav-link ${activeTab === 'shelters' ? 'active' : ''}`}
            onClick={(e) => {
              e.preventDefault();
              onTabChange('shelters');
            }}
          >
            Shelters
          </a>
        </>
      );
    }

    if (role === 'FIELD_RESPONDER') {
      return (
        <>
          <a
            href="#home"
            className={`nav-link ${activeTab === 'home' ? 'active' : ''}`}
            onClick={(e) => {
              e.preventDefault();
              onTabChange('home');
            }}
          >
            Task Map
          </a>
          <a
            href="#incidents"
            className={`nav-link ${activeTab === 'incidents' ? 'active' : ''}`}
            onClick={(e) => {
              e.preventDefault();
              onTabChange('incidents');
            }}
          >
            My Assignments
          </a>
        </>
      );
    }

    return null;
  };

  return (
    <nav className="navbar" role="navigation">
      <Link
        to="/"
        className="navbar-brand"
        onClick={() => onTabChange && onTabChange('home')}
      >
        SafeHarbor
      </Link>

      <div className="navbar-links">{renderLinks()}</div>

      {user && (
        <div className="navbar-user">
          <div className="user-info">
            <span className="user-name">{user.fullName}</span>
            <span className="user-role">{user.role.replace('_', ' ')}</span>
          </div>
          <button className="btn btn-secondary" onClick={handleLogout}>
            Logout
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
