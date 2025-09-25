import React, { useState } from 'react';
import axios from 'axios';
import { useAuthContext } from '../hooks/useAuthContext';

interface IResource {
  _id: string;
  name: string;
}

interface ReservationModalProps {
  isOpen: boolean;
  onClose: () => void;
  resource: IResource | null;
}

const ReservationModal: React.FC<ReservationModalProps> = ({ isOpen, onClose, resource }) => {
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [error, setError] = useState('');
  const { token } = useAuthContext();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!resource) return;

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      await axios.post('/api/reservations', {
        resourceId: resource._id,
        startTime,
        endTime,
      }, config);

      alert('Reservation created successfully!');
      onClose();
    } catch (err: any) {
      console.error('Reservation failed:', err);
      setError(err.response?.data?.message || 'Failed to create reservation.');
    }
  };

  if (!isOpen || !resource) {
    return null;
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Reserve: {resource.name}</h2>
          <button onClick={onClose} className="modal-close-btn">&times;</button>
        </div>
        <div className="modal-body">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="startTime">Start Time</label>
              <input
                type="datetime-local"
                id="startTime"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="endTime">End Time</label>
              <input
                type="datetime-local"
                id="endTime"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                required
              />
            </div>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <button type="submit" className="btn">Confirm Reservation</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ReservationModal;