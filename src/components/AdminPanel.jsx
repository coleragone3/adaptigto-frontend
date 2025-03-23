import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser, useAuth } from '@clerk/clerk-react';
import {
  UserGroupIcon,
  ClockIcon,
  CalendarIcon,
  ShoppingCartIcon
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
  const [userStats, setUserStats] = useState({
    total: 0,
    activeToday: 0,
    activeThisWeek: 0,
    preOrders: 0
  });

  // Check if the current user is authorized
  useEffect(() => {
    if (user?.primaryEmailAddress?.emailAddress !== 'coleragone@gmail.com') {
      navigate('/');
    }
  }, [user, navigate]);

  // Fetch users from Clerk
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const token = await getToken();
        console.log('Admin token received:', token ? 'Token exists' : 'No token');
        console.log('Using API URL:', API_URL);
        
        const response = await fetch(`${API_URL}/api/admin/users`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        console.log('Admin response status:', response.status);

        if (!response.ok) {
          const errorData = await response.json();
          console.error('Admin fetch error:', errorData);
          throw new Error(errorData.error || 'Failed to fetch users');
        }

        const data = await response.json();
        console.log('Fetched users:', data);
        
        if (!Array.isArray(data)) {
          throw new Error('Invalid response format');
        }

        setUsers(data);
        setUserStats({
          total: data.length,
          activeToday: data.filter(u => 
            new Date(u.lastSignInAt) > new Date(Date.now() - 86400000)
          ).length,
          activeThisWeek: data.filter(u => 
            new Date(u.lastSignInAt) > new Date(Date.now() - 604800000)
          ).length,
          preOrders: data.filter(u => u.publicMetadata?.hasPreordered).length
        });
      } catch (error) {
        console.error('Error fetching users:', error);
        setError(error.message || 'Failed to load users. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    if (user?.primaryEmailAddress?.emailAddress === 'coleragone@gmail.com') {
      fetchUsers();
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

  return (
    <div className="min-h-screen bg-background-dark text-white">
      {/* Navigation */}
      <nav className="bg-background-dark border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex-shrink-0">
              <span className="text-2xl font-bold text-primary cursor-pointer" onClick={() => navigate('/')}>
                AdaptiGTO
              </span>
            </div>
            <div>
              <span className="text-gray-300">Admin Panel</span>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="bg-red-500 text-white p-4 rounded-lg mb-8">
            {error}
          </div>
        )}
        
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-2">Total Users</h3>
            <p className="text-3xl font-bold text-primary">{userStats.total}</p>
          </div>
          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-2">Active Today</h3>
            <p className="text-3xl font-bold text-secondary">{userStats.activeToday}</p>
          </div>
          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-2">Active This Week</h3>
            <p className="text-3xl font-bold text-accent">{userStats.activeThisWeek}</p>
          </div>
          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-2">Pre-orders</h3>
            <p className="text-3xl font-bold text-yellow-500">{userStats.preOrders}</p>
          </div>
        </div>

        {/* User List */}
        <div className="bg-gray-800 rounded-lg p-6">
          <h2 className="text-xl font-bold mb-4">User Management</h2>
          {loading ? (
            <div className="text-center py-4">Loading users...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-700">
                <thead>
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Sign Up Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Last Active
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Pre-ordered
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {users.map((user) => (
                    <tr key={user.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {user.imageUrl ? (
                            <img
                              className="h-8 w-8 rounded-full mr-3"
                              src={user.imageUrl}
                              alt=""
                            />
                          ) : (
                            <div className="h-8 w-8 rounded-full bg-gray-600 mr-3" />
                          )}
                          <div>
                            <div className="text-sm font-medium">
                              {user.firstName} {user.lastName}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {user.emailAddresses?.[0]?.emailAddress}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {new Date(user.lastSignInAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          user.publicMetadata?.hasPreordered
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {user.publicMetadata?.hasPreordered ? 'Pre-ordered' : 'Not Pre-ordered'}
                        </span>
                        {user.publicMetadata?.preorderDate && (
                          <div className="text-xs text-gray-400 mt-1">
                            {new Date(user.publicMetadata.preorderDate).toLocaleDateString()}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          user.blocked
                            ? 'bg-red-100 text-red-800'
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {user.blocked ? 'Blocked' : 'Active'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <button
                          onClick={() => setSelectedUser(user)}
                          className="text-primary hover:text-primary-dark mr-3"
                        >
                          View
                        </button>
                        <button
                          onClick={() => handleBlockUser(user.id, !user.blocked)}
                          className="text-red-500 hover:text-red-400"
                        >
                          {user.blocked ? 'Unblock' : 'Block'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* User Detail Modal */}
        {selectedUser && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-gray-800 rounded-lg p-6 max-w-2xl w-full">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold">User Details</h3>
                <button
                  onClick={() => setSelectedUser(null)}
                  className="text-gray-400 hover:text-white"
                >
                  ✕
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-400">User ID</h4>
                  <p>{selectedUser.id}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-400">Name</h4>
                  <p>{selectedUser.firstName} {selectedUser.lastName}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-400">Email</h4>
                  <p>{selectedUser.emailAddresses?.[0]?.emailAddress}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-400">Created At</h4>
                  <p>{new Date(selectedUser.createdAt).toLocaleString()}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-400">Last Active</h4>
                  <p>{new Date(selectedUser.lastSignInAt).toLocaleString()}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-400">Pre-order Status</h4>
                  <p>
                    {selectedUser.publicMetadata?.hasPreordered ? (
                      <>
                        Pre-ordered on {new Date(selectedUser.publicMetadata.preorderDate).toLocaleString()}
                      </>
                    ) : (
                      'Not pre-ordered'
                    )}
                  </p>
                </div>
                <div className="pt-4 flex justify-end space-x-4">
                  <button
                    onClick={() => setSelectedUser(null)}
                    className="px-4 py-2 text-sm font-medium text-gray-400 hover:text-white"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel; 