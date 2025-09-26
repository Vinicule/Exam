import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import ReservationModal from '../components/ReservationModal';

// Define the type for the detailed resource object
interface IResourceDetails {
  _id: string;
  name: string;
  type: 'VM' | 'GPU';
  hourlyRate: number;
  status: string;
  details: {
    vcpu?: number;
    ramGB?: number;
    storageGB?: number;
    gpuModel?: string;
  };
}

const ResourceDetailPage: React.FC = () => {
  const [resource, setResource] = useState<IResourceDetails | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const { id } = useParams<{ id: string }>();

  // State for managing the reservation modal
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchResource = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const { data } = await axios.get<IResourceDetails>(`/api/resources/${id}`);
        setResource(data);
      } catch (error) {
        console.error('Failed to fetch resource details', error);
      } finally {
        setLoading(false);
      }
    };
    fetchResource();
  }, [id]);

  if (loading) return <p className="loading-text">Loading details...</p>;
  if (!resource) return <p>Resource not found. <Link to="/">Go back home</Link></p>;

  // A simplified version of the resource for the modal prop
  const resourceForModal = {
      _id: resource._id,
      name: resource.name,
  }

  return (
    <>
      <div className="detail-container">
        <div className="detail-header">
          <h1>{resource.name}</h1>
          <p>Status: <strong>{resource.status}</strong></p>
        </div>

        <h2>Specifications</h2>
        <div className="detail-specs">
          <div className="spec-item"><strong>Type</strong><span>{resource.type}</span></div>
          <div className="spec-item"><strong>Hourly Rate</strong><span>${resource.hourlyRate.toFixed(2)}</span></div>
          {resource.details.vcpu && <div className="spec-item"><strong>vCPUs</strong><span>{resource.details.vcpu}</span></div>}
          {resource.details.ramGB && <div className="spec-item"><strong>RAM (GB)</strong><span>{resource.details.ramGB}</span></div>}
          {resource.details.storageGB && <div className="spec-item"><strong>Storage (GB)</strong><span>{resource.details.storageGB}</span></div>}
        </div>

        <div className="detail-actions">
          <Link to="/">
            <button className="btn">Back to All Resources</button>
          </Link>
          <button className="btn" onClick={() => setIsModalOpen(true)}>
            Reserve This Item
          </button>
        </div>
      </div>

      <ReservationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        resource={resourceForModal}
      />
    </>
  );
};

export default ResourceDetailPage;