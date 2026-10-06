import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import { store } from './store/index.js';
import { injectStore } from './services/api.js';
import { ThemeProvider } from './context/ThemeContext.jsx';
import './index.css';

// Wire the Redux store into the Axios interceptor so it can dispatch
// logout() on 401/403 without a hard page reload
injectStore(store);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <ThemeProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </ThemeProvider>
    </Provider>
  </React.StrictMode>
);
