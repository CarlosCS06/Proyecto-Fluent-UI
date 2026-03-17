import React from 'react';
import { Title1, Text, Divider } from '@fluentui/react-components';
import PizzasPage from './pages/PizzasPage';
import SaucesPage from './pages/SaucesPage';
import ToppingsPage from './pages/ToppingsPage';
import OtherFoodsPage from './pages/OtherFoodsPage';
import { HashRouter, Route, Routes, Link } from 'react-router-dom';
import { Button } from '@fluentui/react-components';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '2rem', color: 'red' }}>
          <h2>Something went wrong in React:</h2>
          <pre>{this.state.error.toString()}</pre>
        </div>
      );
    }
    return this.props.children; 
  }
}

function App() {
  return (
    <ErrorBoundary>
      <HashRouter>
        <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ marginBottom: '1rem' }}>
            <Title1>Pizzas (React + Fluent UI)</Title1>
            <br />
            <Text>The best pizzas in the world.</Text>
          </div>
          <div style={{ display: 'flex', gap: '10px', marginBottom: '1.5rem' }}>
            <Link to="/"><Button appearance="outline">Pizzas</Button></Link>
            <Link to="/sauces"><Button appearance="outline">Sauces</Button></Link>
            <Link to="/toppings"><Button appearance="outline">Toppings</Button></Link>
            <Link to="/otherfoods"><Button appearance="outline">Other Foods</Button></Link>
          </div>
          <Divider style={{ marginBottom: '2rem' }} />
          <Routes>
             <Route path="/" element={<PizzasPage />} />
             <Route path="/sauces" element={<SaucesPage />} />
             <Route path="/toppings" element={<ToppingsPage />} />
             <Route path="/otherfoods" element={<OtherFoodsPage />} />
             <Route path="*" element={<h2>Component Not Found</h2>} />
          </Routes>
        </div>
      </HashRouter>
    </ErrorBoundary>
  );
}

export default App;
