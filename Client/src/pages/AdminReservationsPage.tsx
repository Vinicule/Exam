import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuthContext } from '../hooks/useAuthContext';

interface IAdminReservation {
  _id: string;
  user: {
    _id: string;
    name: string;
  } | null; // Allow user to be null
  resource: {
    _id: string;
    name: string;
  } | null; // Allow resource to be null
  startTime: string;
  endTime: string;
  status: string;
}

const AdminReservationsPage: React.FC = () => {
  const [reservations, setReservations] = useState<IAdminReservation[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { token } = useAuthContext();

  const fetchReservations = async () => {
    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const { data } = await axios.get<IAdminReservation[]>('/api/reservations', config);
      setReservations(data);
    } catch (error) {
      console.error('Failed to fetch reservations', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchReservations();
    }
  }, [token]);

  const handleStatusChange = async (reservationId: string, newStatus: string) => {
    try {
        const config = {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          };
        await axios.put(`/api/reservations/${reservationId}/status`, { status: newStatus }, config);
        fetchReservations();
    } catch (error) {
        console.error('Failed to update status', error);
        alert('Failed to update status.');
    }
  };

  if (loading) return <p className="loading-text">Loading all reservations...</p>;

  return (
    <div>
      <h2>Admin Dashboard: All Reservations</h2>
      {!reservations || reservations.length === 0 ? (
        <p>There are currently no reservations in the system.</p>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>User</th>
              <th>Resource</th>
              <th>Start Time</th>
              <th>End Time</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {reservations.map((res) => (
              <tr key={res._id}>
                <td data-label="User">{res.user?.name || '[Deleted User]'}</td> 
                <td data-label="Resource">{res.resource?.name || '[Deleted Resource]'}</td> 
                <td data-label="Start Time">{new Date(res.startTime).toLocaleString()}</td> 
                <td data-label="End Time">{new Date(res.endTime).toLocaleString()}</td> 
                <td data-label="Status">
                  <select
                      value={res.status} 
                      onChange={(e) => handleStatusChange(res._id, e.target.value)}
                  >
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="rejected">Rejected</option>
                      <option value="completed">Completed</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminReservationsPage;