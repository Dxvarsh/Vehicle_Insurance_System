import { useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { Toaster } from 'react-hot-toast';
import store from './store/store';
import AppRoutes from './routes/AppRoutes';
import AppInitializer from './components/layout/AppInitializer';

const App = () => {
  return (
    <Provider store={store}>
      <BrowserRouter>
        {/* Initialize auth state on app load */}
        <AppInitializer>
          <AppRoutes />
        </AppInitializer>

        {/* Toast Notifications */}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#ffffff',
              color: '#1e293b',
              border: '1px solid #e2e8f0',
              borderRadius: '12px',
              padding: '16px',
              fontSize: '14px',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
            },
            success: {
              iconTheme: {
                primary: '#16a34a',
                secondary: '#dcfce7',
              },
            },
            error: {
              iconTheme: {
                primary: '#dc2626',
                secondary: '#fee2e2',
              },
            },
          }}
        />
      </BrowserRouter>
    </Provider>
  );
};

export default App;