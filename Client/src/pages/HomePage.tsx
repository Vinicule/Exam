import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ReservationModal from '../components/ReservationModal';

// Define the type for a single resource object
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
        
        // Add a check to ensure data is an array before setting state
        if (Array.isArray(data)) {
          setResources(data);
        } else {
          // If data is not an array, log an error and keep resources as an empty array
          console.error("API did not return an array for resources:", data);
          setResources([]);
        }

      } catch (error) {
        console.error('Error fetching resources:', error);
      } finally {
        // This will run whether the try succeeds or fails
        setLoading(false);
      }
    };

    fetchResources();
  }, []);

    // Functions to handle modal visibility ***
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
    <div>
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
              <button className="btn" onClick={() => handleOpenModal(resource)}>
                Reserve
              </button>
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
