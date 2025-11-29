import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-gray-100">
      <nav className="bg-white/80 backdrop-blur-md shadow-soft sticky top-0 z-50 border-b border-gray-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <Link to="/" className="flex items-center group">
                <span className="text-2xl font-bold gradient-text group-hover:scale-105 transition-transform duration-200">
                  🎵 Rwanda Music
                </span>
              </Link>
              <div className="hidden sm:ml-8 sm:flex sm:space-x-1">
                <Link
                  to="/dashboard"
                  className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-rwanda-blue/10 hover:text-rwanda-blue transition-all duration-200"
                >
                  Dashboard
                </Link>
                {user?.role === 'admin' && (
                  <Link
                    to="/admin"
                    className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-rwanda-blue/10 hover:text-rwanda-blue transition-all duration-200"
                  >
                    Admin
                  </Link>
                )}
                {user?.role === 'artist' && (
                  <Link
                    to="/artist"
                    className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-rwanda-blue/10 hover:text-rwanda-blue transition-all duration-200"
                  >
                    My Analytics
                  </Link>
                )}
                <Link
                  to="/top-songs"
                  className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-rwanda-blue/10 hover:text-rwanda-blue transition-all duration-200"
                >
                  Top Songs
                </Link>
                <Link
                  to="/public"
                  className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-rwanda-blue/10 hover:text-rwanda-blue transition-all duration-200"
                >
                  Public Portal
                </Link>
              </div>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:items-center sm:space-x-4">
              {user ? (
                <>
                  <div className="flex items-center space-x-3 px-4 py-2 bg-gradient-to-r from-rwanda-blue/10 to-blue-50 rounded-lg">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-rwanda-blue to-blue-600 flex items-center justify-center text-white font-semibold text-sm">
                      {(user?.name || user?.email || 'U').charAt(0).toUpperCase()}
                    </div>
                    <span className="text-sm font-medium text-gray-700">{user?.name || user?.email}</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-all duration-200"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-rwanda-blue transition-colors duration-200"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="px-6 py-2 text-sm font-semibold text-white bg-gradient-to-r from-rwanda-blue to-blue-600 rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
            <div className="sm:hidden flex items-center">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-gray-700"
              >
                {mobileMenuOpen ? (
                  <XMarkIcon className="h-6 w-6" />
                ) : (
                  <Bars3Icon className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>
        {mobileMenuOpen && (
          <div className="sm:hidden">
            <div className="pt-2 pb-3 space-y-1">
              <Link
                to="/dashboard"
                className="block px-3 py-2 text-base font-medium text-gray-900 hover:bg-gray-50"
              >
                Dashboard
              </Link>
              {user?.role === 'admin' && (
                <Link
                  to="/admin"
                  className="block px-3 py-2 text-base font-medium text-gray-900 hover:bg-gray-50"
                >
                  Admin
                </Link>
              )}
              {user?.role === 'artist' && (
                <Link
                  to="/artist"
                  className="block px-3 py-2 text-base font-medium text-gray-900 hover:bg-gray-50"
                >
                  My Analytics
                </Link>
              )}
              {user ? (
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-3 py-2 text-base font-medium text-gray-900 hover:bg-gray-50"
                >
                  Logout
                </button>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="block px-3 py-2 text-base font-medium text-gray-900 hover:bg-gray-50"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="block px-3 py-2 text-base font-medium text-gray-900 hover:bg-gray-50"
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </nav>
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <Outlet />
      </main>
      {!user && (
        <div className="fixed bottom-4 right-4 bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
          Warning: Not authenticated
        </div>
      )}
    </div>
  );
}

