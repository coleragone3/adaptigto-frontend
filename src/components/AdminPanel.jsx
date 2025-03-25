import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser, useAuth } from '@clerk/clerk-react';
import { useVisitTracker } from '../hooks/useVisitTracker';
import {
  UserGroupIcon,
  ClockIcon,
  CalendarIcon,
  ShoppingCartIcon,
  ChartBarIcon,
  UsersIcon
} from '@heroicons/react/24/outline';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

const AdminPanel = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const { getToken } = useAuth();
  useVisitTracker();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    newUsersToday: 0,
    visits: {
      total: 0,
      today: 0,
      thisWeek: 0
    }
  });

  // Check if the current user is authorized
  useEffect(() => {
    if (!user || user?.primaryEmailAddress?.emailAddress !== 'coleragone@gmail.com') {
      navigate('/');
      return;
    }
  }, [user, navigate]);

  // Fetch users and visits from backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const token = await getToken();
        if (!token) {
          throw new Error('No authentication token available');
        }

        console.log('Using API URL:', API_URL);
        console.log('Token available:', !!token);
        
        // Fetch users
        const usersResponse = await fetch(`${API_URL}/api/admin/users`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        // Fetch visits
        const visitsResponse = await fetch(`${API_URL}/api/admin/visits`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!usersResponse.ok || !visitsResponse.ok) {
          const errorData = await ((!usersResponse.ok ? usersResponse : visitsResponse)).json();
          throw new Error(errorData.error || 'Failed to fetch data');
        }

        const [usersData, visitsData] = await Promise.all([
          usersResponse.json(),
          visitsResponse.json()
        ]);

        if (!Array.isArray(usersData)) {
          throw new Error('Invalid users response format');
        }

        // Process users data
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const activeUsers = usersData.filter(user => !user.blocked);
        const newUsersToday = activeUsers.filter(user => new Date(user.createdAt) >= today);

        setUsers(usersData);
        setStats({
          totalUsers: usersData.length,
          activeUsers: activeUsers.length,
          newUsersToday: newUsersToday.length,
          visits: visitsData
        });
      } catch (error) {
        console.error('Error fetching data:', error);
        setError(error.message || 'Failed to load data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    if (user?.primaryEmailAddress?.emailAddress === 'coleragone@gmail.com') {
      fetchData();
    }
  }, [user, getToken]);

  const handleBlockUser = async (userId, shouldBlock) => {
    try {
      const token = await getToken();
      if (!token) {
        throw new Error('No authentication token available');
      }

      const response = await fetch(`${API_URL}/api/admin/users/${userId}/${shouldBlock ? 'block' : 'unblock'}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to update user status');
      }

      // Refresh the user list
      const updatedUsers = users.map(u => {
        if (u.id === userId) {
          return { ...u, blocked: shouldBlock };
        }
        return u;
      });
      setUsers(updatedUsers);
    } catch (error) {
      console.error('Error updating user status:', error);
      setError(error.message || 'Failed to update user status. Please try again.');
    }
  };

  if (!user || user?.primaryEmailAddress?.emailAddress !== 'coleragone@gmail.com') {
    return null;
  }

  if (loading) return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-900 via-emerald-800 to-emerald-900 flex items-center justify-center">
      <div className="text-white">Loading...</div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-900 via-emerald-800 to-emerald-900 flex items-center justify-center">
      <div className="text-red-400">Error: {error}</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-900 via-emerald-800 to-emerald-900">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <defs>
            <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
              <path d="M 10 0 L 0 0 0 10" fill="none" stroke="white" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width="100" height="100" fill="url(#grid)" />
        </svg>
      </div>

      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="fixed top-4 left-4 flex items-center text-emerald-400 hover:text-emerald-300 transition-colors z-10"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Back
      </button>

      <div className="container mx-auto px-4 py-8 relative">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-white mb-8 text-center">Admin Dashboard</h1>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-emerald-500/20">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-emerald-500/10">
                  <UserGroupIcon className="h-6 w-6 text-emerald-400" />
                </div>
                <div className="ml-4">
                  <h3 className="text-sm font-medium text-emerald-300">Total Users</h3>
                  <p className="text-2xl font-bold text-white">{stats.totalUsers}</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-emerald-500/20">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-emerald-500/10">
                  <UsersIcon className="h-6 w-6 text-emerald-400" />
                </div>
                <div className="ml-4">
                  <h3 className="text-sm font-medium text-emerald-300">Active Users</h3>
                  <p className="text-2xl font-bold text-white">{stats.activeUsers}</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-emerald-500/20">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-emerald-500/10">
                  <ClockIcon className="h-6 w-6 text-emerald-400" />
                </div>
                <div className="ml-4">
                  <h3 className="text-sm font-medium text-emerald-300">Today's Visits</h3>
                  <p className="text-2xl font-bold text-white">{stats.visits.today}</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-emerald-500/20">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-emerald-500/10">
                  <CalendarIcon className="h-6 w-6 text-emerald-400" />
                </div>
                <div className="ml-4">
                  <h3 className="text-sm font-medium text-emerald-300">Weekly Visits</h3>
                  <p className="text-2xl font-bold text-white">{stats.visits.thisWeek}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Users Table */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-emerald-500/20">
            <h2 className="text-xl font-semibold text-white mb-6">User Management</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-emerald-500/20">
                <thead>
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-emerald-300 uppercase tracking-wider">User</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-emerald-300 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-emerald-300 uppercase tracking-wider">Joined</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-emerald-300 uppercase tracking-wider">Last Sign In</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-emerald-300 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-emerald-500/20">
                  {users.map((user) => (
                    <tr key={user.id} className="hover:bg-emerald-500/5">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div>
                            <div className="text-sm font-medium text-white">{user.firstName} {user.lastName}</div>
                            <div className="text-sm text-emerald-300">{user.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          user.blocked ? 'bg-red-100 text-red-800' : 'bg-emerald-100 text-emerald-800'
                        }`}>
                          {user.blocked ? 'Blocked' : 'Active'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-emerald-300">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-emerald-300">
                        {user.lastSignInAt ? new Date(user.lastSignInAt).toLocaleDateString() : 'Never'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => handleBlockUser(user.id, !user.blocked)}
                          className={`${
                            user.blocked ? 'text-emerald-400 hover:text-emerald-300' : 'text-red-400 hover:text-red-300'
                          }`}
                        >
                          {user.blocked ? 'Unblock' : 'Block'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel; 