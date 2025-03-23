import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser, useAuth } from '@clerk/clerk-react';
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
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
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
    if (user?.primaryEmailAddress?.emailAddress !== 'coleragone@gmail.com') {
      navigate('/');
    }
  }, [user, navigate]);

  // Fetch users and visits from backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const token = await getToken();
        console.log('Admin token received:', token ? 'Token exists' : 'No token');
        console.log('Using API URL:', API_URL);
        
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

  if (loading) return <div className="p-4">Loading...</div>;
  if (error) return <div className="p-4 text-red-600">Error: {error}</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-semibold text-gray-900 mb-6">Admin Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {/* Total Users */}
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <UsersIcon className="h-8 w-8 text-blue-500" />
              <div className="ml-4">
                <p className="text-sm text-gray-600">Total Users</p>
                <p className="text-2xl font-semibold">{stats.totalUsers}</p>
              </div>
            </div>
          </div>

          {/* Active Users */}
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <UserGroupIcon className="h-8 w-8 text-green-500" />
              <div className="ml-4">
                <p className="text-sm text-gray-600">Active Users</p>
                <p className="text-2xl font-semibold">{stats.activeUsers}</p>
              </div>
            </div>
          </div>

          {/* New Users Today */}
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <ClockIcon className="h-8 w-8 text-purple-500" />
              <div className="ml-4">
                <p className="text-sm text-gray-600">New Users Today</p>
                <p className="text-2xl font-semibold">{stats.newUsersToday}</p>
              </div>
            </div>
          </div>

          {/* Total Visits */}
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <ChartBarIcon className="h-8 w-8 text-orange-500" />
              <div className="ml-4">
                <p className="text-sm text-gray-600">Website Visits</p>
                <p className="text-2xl font-semibold">{stats.visits.total}</p>
                <p className="text-sm text-gray-500">Today: {stats.visits.today}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="mt-8 bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6 flex justify-between items-center flex-wrap gap-4">
            <h2 className="text-lg leading-6 font-medium text-gray-900">User Management</h2>
            <button
              onClick={() => window.location.reload()}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Refresh List
            </button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map((user) => (
                  <tr key={user.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {user.firstName} {user.lastName}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{user.emailAddresses[0]?.emailAddress}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        user.blocked ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                      }`}>
                        {user.blocked ? 'Blocked' : 'Active'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <button
                        onClick={() => handleBlockUser(user.id, !user.blocked)}
                        className={`inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-md ${
                          user.blocked
                            ? 'text-green-700 bg-green-100 hover:bg-green-200'
                            : 'text-red-700 bg-red-100 hover:bg-red-200'
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
  );
};

export default AdminPanel; 