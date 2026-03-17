import React from 'react';
import ProductsPage from './pages/ProductsPage';
import DashboardPage from './pages/DashboardPage';
import { HashRouter, Route, Routes, Link } from 'react-router-dom';
import { Button, Divider, FluentProvider, webLightTheme } from '@fluentui/react-components';

function App() {
  return (
    <FluentProvider theme={webLightTheme}>
      <HashRouter>
        <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ display: 'flex', gap: '10px', marginBottom: '1.5rem' }}>
            <Link to="/products"><Button appearance="outline">Productos Almacén</Button></Link>
            <Link to="/dashboard"><Button appearance="primary">Dashboard Almacén</Button></Link>
          </div>
          <Divider style={{ marginBottom: '2rem' }} />
          <Routes>
             <Route path="/" element={<DashboardPage />} />
             <Route path="/products" element={<ProductsPage />} />
             <Route path="/dashboard" element={<DashboardPage />} />
             <Route path="*" element={<h2>Component Not Found</h2>} />
          </Routes>
        </div>
      </HashRouter>
    </FluentProvider>
  );
}

export default App;
