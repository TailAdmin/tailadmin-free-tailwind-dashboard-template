import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import DashboardHome from './components/DashboardHome';
import CreateUser from './components/CreateUser';
import UsersList from './components/UsersList';
import Profile from './components/Profile';
import ProtectedRoute from './components/ProtectedRoute';
import { UserRole } from './models/roles';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/auth/login" element={<Login />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        >
          <Route index element={<DashboardHome />} />
          <Route
            path="users"
            element={
              <ProtectedRoute requiredRole={UserRole.SUPER_USER}>
                <UsersList />
              </ProtectedRoute>
            }
          />
          <Route
            path="users/create"
            element={
              <ProtectedRoute requiredRole={UserRole.SUPER_USER}>
                <CreateUser />
              </ProtectedRoute>
            }
          />
          <Route path="profile" element={<Profile />} />
        </Route>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
