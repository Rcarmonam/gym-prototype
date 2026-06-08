import { useEffect, useState } from 'react';
import {
  Table,
  TableHeader,
  TableHeaderCell,
  TableBody,
  TableRow,
  TableCell,
  TableCellLayout,
  Button,
  Input,
} from '@fluentui/react-components';
import { Dismiss16Regular } from '@fluentui/react-icons';
import './EditWorkoutTable.css';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import SubmissionButton from '../../Buttons/GeneralButton/generalButton.tsx';
import { useUserWorkouts } from '../../../../components/organisms/WeekCalendarNavigator/UseUserWorkouts.tsx';
import { useAuth } from '../../../../AuthContext.tsx';
import { db } from '../../../../index.js';

interface WorkoutItem {
  exercise: { label: any };
  sets: { label: any };
  reps: { label: any };
  weight: { label: any };
}

interface Exercise {
  name: string;
  id: string;
  sets: string;
  reps: string;
  weight: string;
  description: string;
  muscleGroup: string[];
}

const columns = [
  { columnKey: 'excercise', label: 'Excercise' },
  { columnKey: 'sets', label: 'Sets' },
  { columnKey: 'reps', label: 'Reps' },
  { columnKey: 'weight', label: 'Weight' },
  { columnKey: 'actions', label: 'Actions' },
];

const EditWorkoutTable = (props: {
  workoutName: any;
  toggleSelectExercise: any;
  selectedExercises: { [key: string]: Exercise };
  setSelectedExercises: any;
  onSaveSuccess: () => void;
}) => {
  const { currentUser } = useAuth();
  const { getUserWorkouts } = useUserWorkouts();
  const [items, setItems] = useState<WorkoutItem[]>([]);
  const [modifiedFirebaseData, setModifiedFirebaseData] = useState(false);
  const [firebaseItems, setFirebaseItems] = useState<WorkoutItem[]>([]);
  const [updatedItems, setUpdatedItems] = useState<WorkoutItem[]>([]);

  // useEffect for checking firebase data once.
  useEffect(() => {
    const fetchUserWorkout = async () => {
      try {
        const workoutsData = await getUserWorkouts();
        if (workoutsData) {
          const newItems = createFirebaseItem(workoutsData);
          setItems(newItems);
          setFirebaseItems(newItems);
        }
      } catch (error) {
        console.error('Failure to gather user workout data', error);
      }
    };

    if (modifiedFirebaseData) {
      setModifiedFirebaseData(false);
    }
    fetchUserWorkout();
  }, [modifiedFirebaseData]);

  // useEffect for checking selected exercises and merge with firebase data.
  useEffect(() => {
    const combinedItems = mergeExercises(
      firebaseItems,
      props.selectedExercises
    );
    setItems(combinedItems);
  }, [props.selectedExercises]);

  // Create existing exercise Item
  const createFirebaseItem = (workoutsData: any): WorkoutItem[] => {
    const workout = workoutsData[props.workoutName];
    if (!workout || !workout.exercises) return [];

    return Object.entries(workout.exercises).reduce(
      (acc: WorkoutItem[], [exerciseId, exercise]: [string, any]) => {
        acc.push({
          exercise: { label: exercise.name },
          sets: { label: exercise.sets },
          reps: { label: exercise.reps },
          weight: { label: exercise.weight },
        });
        return acc;
      },
      []
    );
  };

  // Create selected exercise Item
  const createSelectedExerciseItem = (selectedExercises: {
    [key: string]: Exercise;
  }): WorkoutItem[] => {
    return Object.values(selectedExercises).map((exercise) => {
      return {
        exercise: { label: exercise.name },
        sets: { label: exercise.sets },
        reps: { label: exercise.reps },
        weight: { label: exercise.weight },
      };
    });
  };

  //Merge selected exercises with firebase data
  const mergeExercises = (
    firebaseItems: WorkoutItem[],
    selectedExercises: { [key: string]: Exercise }
  ): WorkoutItem[] => {
    const firebaseExerciseLabels = firebaseItems.map(
      (item) => item.exercise.label
    );
    const selectedExerciseLabels = Object.values(selectedExercises).map(
      (exercise) => exercise.name
    );

    const newFirebaseItems = firebaseItems.filter(
      (item) => !selectedExerciseLabels.includes(item.exercise.label)
    );
    const newSelectedItems = createSelectedExerciseItem(selectedExercises);

    return newFirebaseItems.concat(newSelectedItems);
  };

  const handleConfirm = async () => {
    const documentID = currentUser?.uid!;
    const userWorkoutRef = doc(db, 'customerWorkouts', documentID);

    try {
      const userSnapshot = await getDoc(userWorkoutRef);
      // Make sure we have an object to work with, even if the document does not exist
      const workoutData =
        userSnapshot.exists() && userSnapshot.data() ? userSnapshot.data() : {};
      // Safely access the exercises object, defaulting to an empty object if necessary
      const existingExercises = workoutData[props.workoutName]?.exercises || {};

      // Combine existing exercises with selectedExercises, without overwriting existing ones
      const updatedExercises = {
        ...existingExercises,
        ...Object.entries(props.selectedExercises).reduce(
          (acc: { [key: string]: Exercise }, [key, exercise]) => {
            // Only add the exercise if it's not already in the existing ones
            if (!existingExercises[key]) {
              acc[key] = {
                id: '',
                description: '',
                muscleGroup: [],
                name: exercise.name,
                sets: exercise.sets,
                reps: exercise.reps,
                weight: exercise.weight,
              };
            }
            return acc;
          },
          {}
        ),
      };

      // Update the sets, reps, and weight for each updated item
      updatedItems.forEach((item) => {
        if (item.exercise.label in updatedExercises) {
          const updatedExercise = {
            ...updatedExercises[item.exercise.label],
            sets: item.sets.label,
            reps: item.reps.label,
            weight: item.weight.label,
          };
          updatedExercises[item.exercise.label] = updatedExercise;
        }
      });

      // Prepare the data for the update
      const updatedWorkoutData = {
        ...workoutData,
        [props.workoutName]: {
          ...workoutData[props.workoutName],
          exercises: updatedExercises,
        },
      };

      // Perform the update
      await setDoc(userWorkoutRef, updatedWorkoutData);

      console.log('Workout updated successfully');
      props.setSelectedExercises({});
      props.onSaveSuccess();
    } catch (error) {
      console.error('Error updating workout:', error);
    }
  };

  const removeRowAndExercise = async (exerciseName: string) => {
    try {
      if (props.selectedExercises[exerciseName]) {
        props.toggleSelectExercise(
          props.selectedExercises[exerciseName].id,
          exerciseName
        );
      } else {
        setItems(items.filter((item) => item.exercise.label !== exerciseName));
        const documentID = currentUser?.uid!;
        const userWorkoutRef = doc(db, 'customerWorkouts', documentID);
        const userSnapshot = await getDoc(userWorkoutRef);

        if (userSnapshot.exists()) {
          const workoutData = userSnapshot.data();
          if (workoutData) {
            delete workoutData[props.workoutName].exercises[exerciseName];
            await setDoc(userWorkoutRef, workoutData);
          }
        }
        setModifiedFirebaseData(true);
      }
    } catch (error) {
      console.log('Failed to remove row and exercise', error);
    }
  };

  return (
    <div className="editTable">
      <Table size="medium">
        <TableHeader>
          <TableRow>
            {columns.map((column) => (
              <TableHeaderCell key={column.columnKey}>
                {column.label}
              </TableHeaderCell>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item, index) => (
            <TableRow key={index}>
              <TableCell style={{ marginLeft: '-1rem' }}>
                <TableCellLayout>{item.exercise.label}</TableCellLayout>
              </TableCell>
              <TableCell>
                <TableCellLayout>
                  <div className="exercise-details-edit">
                    <Input
                      className="exercise-input-edit"
                      appearance="underline"
                      value={item.sets.label}
                      onChange={(e) => {
                        const updatedItems = [...items];
                        updatedItems[index].sets.label = e.target.value;
                        setUpdatedItems(updatedItems);
                      }}
                    />
                  </div>
                </TableCellLayout>
              </TableCell>
              <TableCell>
                <TableCellLayout style={{ marginLeft: '0.1rem' }}>
                  <div className="exercise-details-edit">
                    <Input
                      className="exercise-input-edit"
                      appearance="underline"
                      value={item.reps.label}
                      onChange={(e) => {
                        const updatedItems = [...items];
                        updatedItems[index].reps.label = e.target.value;
                        setUpdatedItems(updatedItems);
                      }}
                    />
                  </div>
                </TableCellLayout>
              </TableCell>
              <TableCell>
                <TableCellLayout>
                  <div className="exercise-details-edit">
                    <Input
                      className="exercise-input-edit"
                      appearance="underline"
                      value={item.weight.label}
                      onChange={(e) => {
                        const updatedItems = [...items];
                        updatedItems[index].weight.label = e.target.value;
                        setUpdatedItems(updatedItems);
                      }}
                    />
                  </div>
                </TableCellLayout>
              </TableCell>
              <TableCell>
                <TableCellLayout>
                  <Button
                    icon={<Dismiss16Regular />}
                    aria-label="Delete"
                    appearance="subtle"
                    onClick={() => removeRowAndExercise(item.exercise.label)}
                  />
                </TableCellLayout>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="save-button-edit">
        <SubmissionButton
          text="Save Edits"
          styleType="style2"
          buttonSize="small"
          onClick={handleConfirm}
        />
      </div>
    </div>
  );
};

export default EditWorkoutTable;
