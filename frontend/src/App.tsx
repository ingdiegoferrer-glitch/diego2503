import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { authStorage } from './services/authStorage';
import type { ReactNode } from 'react';
import { Register } from './components/Register';
import { Login } from './components/Login';
import { Dashboard } from './components/Dashboard';
import './App.css';

const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const user = authStorage.getCurrentUser();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};


function App() {
  return (
    <BrowserRouter>
      <div className="app-layout">
        <header className="main-header">
          <h1>Snail Express</h1>
        </header>

        <main className="main-content">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />

            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </main>
        <footer className="main-footer">
          <p>&copy; 2024 Snail Express. Todos los derechos reservados.</p>
        </footer>
      </div>
    </BrowserRouter>
  );
}

export default App;