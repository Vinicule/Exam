import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuthContext } from '../hooks/useAuthContext';

interface IReservation {
  _id: string;
  resource: {
    name: string;
  };
  startTime: string;
  endTime: string;
}

interface EditReservationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdate: () => void; // To refresh the parent list
  reservation: IReservation | null;
}

// Helper to format dates for datetime-local input
const toDateTimeLocal = (isoDate: string) => {
    if (!isoDate) return '';
    const date = new Date(isoDate);
    // Adjust for timezone offset
    const timezoneOffset = date.getTimezoneOffset() * 60000;
    const localDate = new Date(date.getTime() - timezoneOffset);
    return localDate.toISOString().slice(0, 16);
};

const EditReservationModal: React.FC<EditReservationModalProps> = ({ isOpen, onClose, onUpdate, reservation }) => {
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [error, setError] = useState('');
  const { token } = useAuthContext();

  useEffect(() => {
    if (reservation) {
      setStartTime(toDateTimeLocal(reservation.startTime));
      setEndTime(toDateTimeLocal(reservation.endTime));
    }
  }, [reservation]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reservation) return;
    setError('');

    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const updatedData = { startTime, endTime };

      await axios.put(`/api/reservations/${reservation._id}`, updatedData, config);
      alert('Reservation updated successfully! It is now pending admin approval.');
      onUpdate();
      onClose();
    } catch (error: any) {
      console.error('Failed to update reservation', error);
      setError(error.response?.data?.message || 'Failed to update reservation.');
    }
  };

  if (!isOpen || !reservation) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Edit Reservation: {reservation.resource.name}</h2>
          <button onClick={onClose} className="modal-close-btn">&times;</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="startTime">New Start Time</label>
            <input
              type="datetime-local"
              id="startTime"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="endTime">New End Time</label>
            <input
              type="datetime-local"
              id="endTime"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              required
            />
          </div>
          {error && <p style={{ color: 'red' }}>{error}</p>}
          <button type="submit" className="auth-button">Save Changes</button>
        </form>
      </div>
    </div>
  );
};

export default EditReservationModal;