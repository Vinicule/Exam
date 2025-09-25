import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuthContext } from '../hooks/useAuthContext';

interface IAdminReservation {
  _id: string;
  user: {
    _id: string;
    name: string;
  };
  resource: {
    _id: string;
    name: string;
  };
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
        // Refresh the list to show the change
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
              <td>{res.user.name}</td>
              <td>{res.resource.name}</td>
              <td>{new Date(res.startTime).toLocaleString()}</td>
              <td>{new Date(res.endTime).toLocaleString()}</td>
              <td>
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
    </div>
  );
};

export default AdminReservationsPage;