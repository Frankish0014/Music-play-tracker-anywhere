import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Layout from './components/Layout';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';
import ArtistDashboard from './pages/ArtistDashboard';
import PublicPortal from './pages/PublicPortal';
import TopSongs from './pages/TopSongs';
import ArtistProfile from './pages/ArtistProfile';

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/public" element={<PublicPortal />} />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <PrivateRoute allowedRoles={['admin']}>
                <AdminDashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/artist"
            element={
              <PrivateRoute allowedRoles={['artist', 'admin']}>
                <ArtistDashboard />
              </PrivateRoute>
            }
          />
          <Route path="/top-songs" element={<TopSongs />} />
          <Route path="/artists/:id" element={<ArtistProfile />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}

export default App;

