import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ReservationModal from '../components/ReservationModal';
import { Link } from 'react-router-dom';

interface IResource {
  _id: string;
  name: string;
  type: 'VM' | 'GPU';
  hourlyRate: number;
}

const HomePage: React.FC = () => {
  const [resources, setResources] = useState<IResource[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedResource, setSelectedResource] = useState<IResource | null>(null);

  useEffect(() => {
    const fetchResources = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get<IResource[]>('/api/resources');
        if (Array.isArray(data)) {
          setResources(data);
        } else {
          console.error("API did not return an array for resources:", data);
          setResources([]);
        }
      } catch (error) {
        console.error('Error fetching resources:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchResources();
  }, []);

  const handleOpenModal = (resource: IResource) => {
    setSelectedResource(resource);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedResource(null);
  };

  if (loading) {
    return <h2 className="loading-text">Loading...</h2>;
  }

 return (
    <div className="app-container"> {/* FIX: Wrap content in the main container */}
      <h2>Available Resources</h2>
      {resources.length === 0 ? (
        <p className="no-resources-text">No resources available at the moment.</p>
      ) : (
        <ul className="resource-list">
          {resources.map((resource: IResource) => (
            <li key={resource._id} className="resource-card">
              <h3>{resource.name}</h3>
              <p>Type: {resource.type}</p>
              <p>${resource.hourlyRate.toFixed(2)} / hour</p>
              <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem' }}>
                <Link to={`/resource/${resource._id}`}>
                  {/* FIX: Use the .btn class for consistent styling */}
                  <button className="btn">View Details</button>
                </Link>
                <button className="btn" onClick={() => handleOpenModal(resource)}>
                  Reserve
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
      
      <ReservationModal 
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        resource={selectedResource}
      />
    </div>
  );
};

export default HomePage;