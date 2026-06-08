import { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../../index.js';

interface Exercise {
  name: string;
  id: string;
  sets: string;
  reps: string;
  weight: string;
  description: string;
  muscleGroup: string[];
  video: string;
}

export const useExercises = () => {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const snapshot = await getDocs(collection(db, 'exercises'));
        const allExercises = snapshot.docs.map(doc => ({
          id: doc.id,
          description: doc.data().description,
          muscleGroup: doc.data().muscleGroup,
          video: doc.data().video,
          ...doc.data(),
          sets: "",
          reps: "",
          weight: "",
        } as Exercise));
        setExercises(allExercises);
      } catch (err: any) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []); 

  return { exercises, loading, error };
};
