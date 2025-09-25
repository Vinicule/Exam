import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuthContext } from '../hooks/useAuthContext';

interface IReservation {
  _id: string;
  resource: {
    _id: string;
    name: string;
  };
  startTime: string;
  endTime: string;
  status: string;
}

const MyReservationsPage: React.FC = () => {
  const [reservations, setReservations] = useState<IReservation[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { token } = useAuthContext();

  const fetchReservations = async () => {
    // This function can be defined outside useEffect to be reusable
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const { data } = await axios.get<IReservation[]>('/api/reservations/myreservations', config);
      setReservations(data);
    } catch (error) {
      console.error('Failed to fetch reservations', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      setLoading(true);
      fetchReservations();
    }
  }, [token]);
  
  // Handle reservation cancellation
  const handleCancel = async (reservationId: string) => {
    if (window.confirm('Are you sure you want to cancel this reservation?')) {
        try {
            const config = {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              };
            await axios.delete(`/api/reservations/${reservationId}`, config);
            // Refresh the list by filtering out the cancelled reservation
            setReservations(prev => prev.filter(res => res._id !== reservationId));
            alert('Reservation cancelled.');
        } catch (error) {
            console.error('Failed to cancel reservation', error);
            alert('Could not cancel the reservation.');
        }
    }
  };


  if (loading) return <p className="loading-text">Loading reservations...</p>;

  return (
    <div>
      <h2>My Reservations</h2>
      {reservations.length === 0 ? (
        <p>You have no reservations.</p>
      ) : (
        <ul className="reservation-list">
          {reservations.map((res) => (
            <li key={res._id} className="reservation-item">
              <h3>{res.resource.name}</h3>
              <p>
                From: {new Date(res.startTime).toLocaleString()}
              </p>
              <p>
                To: {new Date(res.endTime).toLocaleString()}
              </p>
              <p>Status: <strong>{res.status}</strong></p>
              {/* *** NEW: Add Cancel Button conditionally *** */}
              {(res.status === 'pending' || res.status === 'confirmed') && (
                <button 
                    className="btn" 
                    style={{backgroundColor: '#e74c3c'}}
                    onClick={() => handleCancel(res._id)}
                >
                    Cancel
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MyReservationsPage;
