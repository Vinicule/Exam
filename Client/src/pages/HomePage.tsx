import React, { useState, useEffect } from 'react';
import axios from 'axios';

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
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default HomePage;
