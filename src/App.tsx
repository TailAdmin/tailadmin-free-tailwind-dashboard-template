import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Login from './components/Login';
import Dashboard from './components/Dashboard';

import CreateUser from './components/CreateUser';
import UsersList from './components/UsersList';
import Profile from './components/Profile';
import Tiendas from './components/tiendas/Tiendas';
import ProtectedRoute from './components/ProtectedRoute';
import { UserRole } from './models/roles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#db3b2b',
    },
    background: {
      default: '#f6f7f9',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: { fontFamily: 'Outfit, sans-serif' },
    h2: { fontFamily: 'Outfit, sans-serif' },
    h3: { fontFamily: 'Outfit, sans-serif' },
    h4: { fontFamily: 'Outfit, sans-serif' },
    h5: { fontFamily: 'Outfit, sans-serif' },
    h6: { fontFamily: 'Outfit, sans-serif' },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
        },
      },
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
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
          <Route index element={<Navigate to="tiendas" replace />} />
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
          <Route path="tiendas" element={<Tiendas />} />
        </Route>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Router>
    </ThemeProvider>
  );
}

export default App;
