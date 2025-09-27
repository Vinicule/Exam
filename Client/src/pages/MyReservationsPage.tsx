import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuthContext } from '../hooks/useAuthContext';
import EditReservationModal from '../components/EditReservationModal';
import { Link } from 'react-router-dom';

interface IResourceDetail {
  _id: string;
  name: string;
}

interface IReservation {
  _id: string;
  resource: IResourceDetail; 
  startTime: string;
  endTime: string;
  status: string;
}

const MyReservationsPage: React.FC = () => {
  const [reservations, setReservations] = useState<IReservation[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null); 
  const { token } = useAuthContext();
  
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [reservationToEdit, setReservationToEdit] = useState<IReservation | null>(null);
  
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [reservationToCancel, setReservationToCancel] = useState<string | null>(null); 


  const fetchReservations = async () => {
    try {
      setError(null);
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const { data } = await axios.get<IReservation[]>('/api/reservations/myreservations', config);
      setReservations(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to fetch reservations', error);
      setError('Failed to load reservations. Please try logging in again.');
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
  
  const handleConfirmCancel = (reservationId: string) => {
      setReservationToCancel(reservationId);
      setIsConfirmModalOpen(true);
  };
  
  const handleCancel = async () => {
    if (!reservationToCancel) return;

    try {
        const config = {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          };
        await axios.delete(`/api/reservations/${reservationToCancel}`, config);
        setReservations(prev => prev.filter(res => res._id !== reservationToCancel));
    } catch (error) {
        console.error('Failed to cancel reservation', error);
    } finally {
        setIsConfirmModalOpen(false);
        setReservationToCancel(null);
    }
  };

  const handleOpenEditModal = (reservation: IReservation) => {
    setReservationToEdit(reservation);
    setIsEditModalOpen(true);
  };
  
  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setReservationToEdit(null);
  };

  if (loading) return <p className="loading-text">Loading reservations...</p>;
  if (error) return <p className="loading-text" style={{ color: 'var(--color-danger)' }}>{error}</p>;

  // This check ensures there's at least one valid reservation to show
  const hasValidReservations = reservations?.some(res => res.resource && res.resource.name);

  return (
    <div>
      <h2>My Reservations</h2>
      {hasValidReservations ? (
        <ul className="reservation-list">
          {reservations.map((res) => {
            // Filter out any malformed reservations before rendering
            if (!res.resource || !res.resource.name || !res._id) {
                return null;
            }
            
            return (
              <li key={res._id} className="reservation-item">
                <h3>{res.resource.name}</h3>
                <p>
                  From: {new Date(res.startTime).toLocaleString()}
                </p>
                <p>
                  To: {new Date(res.endTime).toLocaleString()}
                </p>
                <p>Status: <strong>{res.status}</strong></p>
                
                {(res.status === 'pending' || res.status === 'confirmed') && (
                  <button
                    className="btn"
                    style={{ marginRight: '0.5rem' }}
                    onClick={() => handleOpenEditModal(res)}
                  >
                    Edit
                  </button>
                )}

                {(res.status === 'pending' || res.status === 'confirmed') && (
                  <button 
                    className="btn btn-danger" 
                    onClick={() => handleConfirmCancel(res._id)}
                  >
                    Cancel Reservation
                  </button>
                )}
              </li>
            );
          })}
        </ul>
      ) : (
        <div className="no-reservations-message">
          <p>You have no reservations.</p>
          <Link to="/">
            <button className="auth-button" style={{ width: 'auto', padding: '0.8rem 1.75rem' }}>
              Make a new reservation
            </button>
          </Link>
        </div>
      )}

      <EditReservationModal
          isOpen={isEditModalOpen}
          onClose={handleCloseEditModal}
          onUpdate={fetchReservations}
          reservation={reservationToEdit}
      />
      
      {isConfirmModalOpen && (
          <div className="modal-overlay" onClick={() => setIsConfirmModalOpen(false)}>
              <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '350px' }}>
                  <div className="modal-header">
                    <h2>Confirm Cancellation</h2>
                  </div>
                  <p style={{ color: 'var(--color-text-primary)', marginBottom: '1.5rem' }}>Are you sure you want to cancel this reservation?</p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem' }}>
                      <button className="btn btn-danger" onClick={handleCancel} style={{ width: '50%' }}>Yes, Cancel</button>
                      <button className="btn" onClick={() => setIsConfirmModalOpen(false)} style={{ width: '50%' }}>Keep Reservation</button>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};

export default MyReservationsPage;