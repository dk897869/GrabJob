import { useState } from 'react';
import { getUserCoordinates, DEFAULT_COORDINATES } from '../utils/location';
import { useJobStore } from '../store/jobStore';
import toast from 'react-hot-toast';

export const useLocation = () => {
  const [loading, setLoading] = useState(false);
  const { userCoordinates, setUserCoordinates } = useJobStore();

  const requestLocation = async () => {
    try {
      setLoading(true);
      const coords = await getUserCoordinates();
      setUserCoordinates(coords);
      toast.success('Location detected successfully!');
      return coords;
    } catch {
      toast.error('Location permission was denied or unavailable. Using default location.');
      setUserCoordinates(DEFAULT_COORDINATES);
      return DEFAULT_COORDINATES;
    } finally {
      setLoading(false);
    }
  };

  return {
    coordinates: userCoordinates || DEFAULT_COORDINATES,
    loading,
    requestLocation,
    hasLocation: !!userCoordinates,
  };
};
