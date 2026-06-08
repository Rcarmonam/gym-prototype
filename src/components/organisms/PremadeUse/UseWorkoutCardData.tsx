import { useState, useEffect } from 'react';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../../index.js';
import { useAuth } from '../../../AuthContext.tsx';

const useWorkoutCardData = () => {
  const [collectiveWorkouts, setCollectiveWorkouts] = useState<{
    [key: string]: any;
  }>({});
  const [collectiveMuscleGroups, setCollectiveMuscleGroups] = useState<
    string[]
  >([]);
  const { currentUser } = useAuth();

  useEffect(() => {
    const fetchCollectiveWorkouts = async () => {
      try {
        const workoutRef = doc(db, 'Trainers', 'Collective Workouts');
        const workoutSnap = await getDoc(workoutRef);

        if (workoutSnap.exists()) {
          const collectiveWorkoutsData = workoutSnap.data();
          setCollectiveWorkouts(collectiveWorkoutsData);
          fetchMuscleGroups(collectiveWorkoutsData); // Call fetchMuscleGroups with updated data
        } else {
          console.log('No workout data found for trainers workouts');
        }
      } catch (e) {
        console.log(e);
      }
    };

    const fetchMuscleGroups = (collectiveWorkoutsData: {
      [key: string]: any;
    }) => {
      try {
        if (collectiveWorkoutsData) {
          const newMuscleGroups: Set<string> = new Set();

          Object.values(collectiveWorkoutsData).forEach((workout: any) => {
            workout.muscleGroups.forEach((group: string) => {
              newMuscleGroups.add(group);
            });
          });

          setCollectiveMuscleGroups(Array.from(newMuscleGroups)); // Convert Set to array
        }
      } catch (e) {
        console.log(e);
      }
    };

    fetchCollectiveWorkouts();
  }, []);

  const premadeToQuickAdd = async (workoutName: any) => {
    try {
      const workoutRef = doc(db, 'Trainers', 'Collective Workouts');
      const workoutSnap = await getDoc(workoutRef);

      if (workoutSnap.exists()) {
        const collectiveWorkoutsData = workoutSnap.data();
        if (
          collectiveWorkoutsData &&
          collectiveWorkoutsData.hasOwnProperty(workoutName)
        ) {
          const dataToCopy = collectiveWorkoutsData[workoutName];
          const documentID = currentUser?.uid!;

          const userWorkoutRef = doc(db, 'customerWorkouts', documentID);
          const userSnapshot = await getDoc(userWorkoutRef);

          if (userSnapshot.exists()) {
            await updateDoc(userWorkoutRef, { [workoutName]: dataToCopy });
          } else {
            await setDoc(userWorkoutRef, { [workoutName]: dataToCopy });
          }
        } else {
          console.log(
            `Workout ${workoutName} not found in collectiveWorkouts.`
          );
        }
      } else {
        console.log('Collective Workouts document does not exist.');
      }
    } catch (error) {
      console.error('Error copying data:', error);
    }
  };

  return { collectiveWorkouts, collectiveMuscleGroups, premadeToQuickAdd };
};

export default useWorkoutCardData;
