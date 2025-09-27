import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuthContext } from '../hooks/useAuthContext';
import EditResourceModal from '../components/EditResourceModal';

interface IResource {
  _id: string;
  name: string;
  type: 'VM' | 'GPU';
  hourlyRate: number;
  status: string;
  publishStatus: 'published' | 'draft';
}

const AdminEquipmentPage: React.FC = () => {
  const [resources, setResources] = useState<IResource[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { token } = useAuthContext();

  const [name, setName] = useState('');
  const [type, setType] = useState<'VM' | 'GPU'>('VM');
  const [hourlyRate, setHourlyRate] = useState('');
  const [vcpu, setVcpu] = useState('');
  const [ramGB, setRamGB] = useState('');
  const [storageGB, setStorageGB] = useState('');
  const [description, setDescription] = useState('');

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [resourceToEdit, setResourceToEdit] = useState<IResource | null>(null);

  const fetchResources = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
        const { data } = await axios.get<IResource[]>('/api/resources/all-for-admin', config);
        setResources(data);
    } catch (error) {
        console.error('Failed to fetch resources', error);
    } finally {
        setLoading(false);
    }
  };

  useEffect(() => {
    fetchResources();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      
      const details = {
        vcpu: vcpu ? parseInt(vcpu) : undefined,
        ramGB: ramGB ? parseInt(ramGB) : undefined,
        storageGB: storageGB ? parseInt(storageGB) : undefined,
      };
      
      const newResourceData = { 
        name, 
        type, 
        hourlyRate: parseFloat(hourlyRate), 
        details,
        description,
      };

      await axios.post('/api/resources', newResourceData, config);
      alert('Resource created successfully!');
      
      setName('');
      setType('VM');
      setHourlyRate('');
      setVcpu('');
      setRamGB('');
      setStorageGB('');
      setDescription('');
      fetchResources();
    } catch (error: any) {
      console.error('Failed to create resource', error);
      alert(error.response?.data?.message || 'Error creating resource.');
    }
  };

  const handleDelete = async (resourceId: string) => {
    if (window.confirm('Are you sure you want to delete this resource?')) {
      try {
        const config = { headers: { Authorization: `Bearer ${token}` } };
        await axios.delete(`/api/resources/${resourceId}`, config);
        alert('Resource deleted successfully!');
        fetchResources();
      } catch (error) {
        console.error('Failed to delete resource', error);
        alert('Error deleting resource.');
      }
    }
  };
  
  const handleOpenEditModal = (resource: IResource) => {
    setResourceToEdit(resource);
    setIsEditModalOpen(true);
  };
  
  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setResourceToEdit(null);
  };

  const handleStatusChange = async (resourceId: string, newStatus: 'published' | 'draft') => {
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await axios.put(`/api/resources/${resourceId}`, { publishStatus: newStatus }, config);
      fetchResources();
    } catch (error) {
      console.error('Failed to update status', error);
      alert('Error updating status.');
    }
  };

  if (loading) return <p className="loading-text">Loading equipment...</p>;

  return (
    <div>
      <div className="auth-form-container admin-page-form" style={{maxWidth: '800px'}}>
        <h2>Create New Equipment</h2>
        <form onSubmit={handleCreate}>
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div className="form-group">
            <label htmlFor="type">Type</label>
            <select className= "admin-select" id="type" value={type} onChange={(e) => setType(e.target.value as 'VM' | 'GPU')}>
              <option value="VM">VM</option>
              <option value="GPU">GPU</option>
            </select>
          </div>
          {(type === 'VM' || type === 'GPU') && (
            <>
              <div className="form-group">
                <label htmlFor="vcpu">vCPUs</label>
                <input id="vcpu" type="number" value={vcpu} onChange={(e) => setVcpu(e.target.value)} required />
              </div>
              <div className="form-group">
                <label htmlFor="ramGB">RAM (GB)</label>
                <input id="ramGB" type="number" value={ramGB} onChange={(e) => setRamGB(e.target.value)} required />
              </div>
              <div className="form-group">
                <label htmlFor="storageGB">Storage (GB)</label>
                <input id="storageGB" type="number" value={storageGB} onChange={(e) => setStorageGB(e.target.value)} required />
              </div>
            </>
          )}
          <div className="form-group">
            <label htmlFor="hourlyRate">Hourly Rate ($)</label>
            <input id="hourlyRate" type="number" step="0.01" value={hourlyRate} onChange={(e) => setHourlyRate(e.target.value)} required />
          </div>
          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
            />
          </div>
          <button type="submit" className="auth-button">Create Equipment</button>
        </form>
      </div>

      <h2 style={{marginTop: '3rem'}}>Manage Existing Equipment</h2>
      <table className="admin-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Type</th>
            <th>Hourly Rate</th>
            <th>Status</th>
            <th>Publish Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {resources.map((res) => (
            <tr key={res._id}>
              <td data-label="Name">{res.name}</td>
              <td data-label="Type">{res.type}</td>
              <td data-label="Hourly Rate">${res.hourlyRate.toFixed(2)}</td>
              <td data-label="Status">{res.status}</td>
              <td data-label="Publish Status">
                <select 
                    value={res.publishStatus} 
                    onChange={(e) => handleStatusChange(res._id, e.target.value as 'published' | 'draft')}
                >
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                </select>
              </td>
              <td data-label="Actions"> 
                <div className="table-actions-cell">
                  <button
                    className="btn"
                    onClick={() => handleOpenEditModal(res)}
                  >
                    Edit
                  </button>
                  <button 
                    className="btn btn-danger"
                    onClick={() => handleDelete(res._id)}
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
      <EditResourceModal
        isOpen={isEditModalOpen}
        onClose={handleCloseEditModal}
        onUpdate={fetchResources}
        resource={resourceToEdit}
      />
    </div>
  );
};

export default AdminEquipmentPage;