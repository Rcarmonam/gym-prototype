import { useAuth } from '../../../AuthContext.tsx';
import { doc, getDoc, updateDoc, deleteField } from 'firebase/firestore';
import { db } from '../../../index.js';

export const useUserWorkouts = () => {
  const { currentUser } = useAuth();
  const documentID = currentUser?.uid;

  // Fetch user workouts from Firestore
  const getUserWorkouts = async () => {
    try {
      if (documentID) {
        const workoutRef = doc(db, 'customerWorkouts', documentID);
        const workoutSnap = await getDoc(workoutRef);
        if (workoutSnap.exists()) {
          // Data exists, do something with it
          return workoutSnap.data();
        } else {
          console.log('No workout data found for this user');
        }
      } else {
        console.log('Current user not available');
      }
    } catch (e) {
      console.error('Error fetching user workouts:', e);
    }
  };

  // Delete a user workout from Firestore
  const deleteUserWorkout = async (workoutName: string) => {
    try {
      const workoutData = await getUserWorkouts();
      if (workoutData) {
        if (workoutData.hasOwnProperty(workoutName)) {
          if (documentID) {
            const workoutRef = doc(db, 'customerWorkouts', documentID);
            await updateDoc(workoutRef, {
              [workoutName]: deleteField(),
            });
          }
        }
      } else {
        console.log('No workout data found for this user');
      }
    } catch (error) {
      console.error('Error deleting user workout:', error);
    }
  };
  
  return { getUserWorkouts, deleteUserWorkout };
};
