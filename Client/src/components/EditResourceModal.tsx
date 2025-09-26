import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuthContext } from '../hooks/useAuthContext';

interface IResource {
  _id: string;
  name: string;
  type: 'VM' | 'GPU';
  hourlyRate: number;
}

interface EditResourceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdate: () => void;
  resource: IResource | null;
}

const EditResourceModal: React.FC<EditResourceModalProps> = ({ isOpen, onClose, onUpdate, resource }) => {
  const [name, setName] = useState('');
  const [type, setType] = useState<'VM' | 'GPU'>('VM');
  const [hourlyRate, setHourlyRate] = useState('');
  const { token } = useAuthContext();

  useEffect(() => {
    if (resource) {
      setName(resource.name);
      setType(resource.type);
      setHourlyRate(String(resource.hourlyRate));
    }
  }, [resource]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resource) return;

    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const updatedData = { name, type, hourlyRate: parseFloat(hourlyRate) };
      await axios.put(`/api/resources/${resource._id}`, updatedData, config);
      alert('Resource updated successfully!');
      onUpdate();
      onClose();
    } catch (error: any) {
      console.error('Failed to update resource', error);
      alert(error.response?.data?.message || 'Error updating resource.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Edit: {resource?.name}</h2>
          <button onClick={onClose} className="modal-close-btn">&times;</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Name</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div className="form-group">
            <label>Type</label>
            <select value={type} onChange={(e) => setType(e.target.value as 'VM' | 'GPU')}>
              <option value="VM">VM</option>
              <option value="GPU">GPU</option>
            </select>
          </div>
          <div className="form-group">
            <label>Hourly Rate ($)</label>
            <input type="number" step="0.01" value={hourlyRate} onChange={(e) => setHourlyRate(e.target.value)} required />
          </div>
          <button type="submit" className="auth-button">Save Changes</button>
        </form>
      </div>
    </div>
  );
};

export default EditResourceModal;