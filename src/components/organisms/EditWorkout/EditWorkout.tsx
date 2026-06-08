import {
  Dialog,
  DialogTrigger,
  DialogSurface,
  DialogTitle,
  DialogBody,
  DialogContent,
  Button,
  makeStyles,
  Divider,
} from '@fluentui/react-components';
import { Edit16Regular, Dismiss24Regular } from '@fluentui/react-icons';
import { SearchBox } from '@fluentui/react-search-preview';
import { useEffect, useState } from 'react';
import { useExercises } from '../ExercisesData/useExercises.tsx';
import { useUserWorkouts } from '../WeekCalendarNavigator/UseUserWorkouts.tsx';
import EditWorkoutTable from '../../../components/atoms/Charts/EditWorkoutTable/EditWorkoutTable.tsx';
import ExerciseBox from '../ExerciseBox/ExerciseBox.tsx';
import './EditWorkout.css';
import React from 'react';

const useStyles = makeStyles({
  editWorkout: {
    alignSelf: 'flex-start',
    textAlign: 'left',
    justifyContent: 'flex-start',
    width: '100%',
    '&:hover': {
      backgroundColor: 'var(--surface3)',
    },
  },
  customDialogSurface: {
    backgroundColor: 'var(--surface1);',
    height: '100%',
    width: '100%',
    maxHeight: '70vh',
    maxWidth: '70vw',
  },
  dismissButton: {
    marginTop: '2rem',
    marginLeft: '55rem',
    position: 'fixed',
  },
});

interface Exercise {
  name: string;
  id: string;
  sets: string;
  reps: string;
  weight: string;
  description: string;
  muscleGroup: string[];
}

const EditWorkout = (props: { workoutName: any }) => {
  const styles = useStyles();
  const { exercises } = useExercises();
  const { getUserWorkouts } = useUserWorkouts();
  const [searchQuery, setSearchQuery] = useState('');
  const [isOpen, setIsOpen] = React.useState(false);
  const [selectedExercises, setSelectedExercises] = useState<{
    [key: string]: Exercise;
  }>({});
  const [filteredExercises, setFilteredExercises] =
    useState<Exercise[]>(exercises);
  const [currentWorkoutExerciseIds, setCurrentWorkoutExerciseIds] = useState<
    string[]
  >([]);

  // Fetch current workout exercises when component mounts or when workoutName changes
  useEffect(() => {
    const fetchCurrentWorkoutExercises = async () => {
      try {
        const workoutsData = await getUserWorkouts();
        if (workoutsData && props.workoutName in workoutsData) {
          const workout = workoutsData[props.workoutName];
          // Store the exercise IDs in the state
          if (workout && workout.exercises) {
            setCurrentWorkoutExerciseIds(Object.keys(workout.exercises));
          }
        }
      } catch (error) {
        console.error('Error fetching current workout exercises:', error);
      }
    };

    fetchCurrentWorkoutExercises();
  }, [props.workoutName, isOpen]);

  // Combined useEffect for search and filtering logic
  useEffect(() => {
    let filtered = exercises;

    // Filter based on search query
    if (searchQuery.trim()) {
      const lowerCaseQuery = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (exercise) =>
          exercise.name.toLowerCase().includes(lowerCaseQuery) ||
          exercise.muscleGroup.some((muscle) =>
            muscle.toLowerCase().includes(lowerCaseQuery)
          )
      );
    }

    // Filter out current workout exercises
    const currentExerciseIdsSet = new Set(currentWorkoutExerciseIds);
    filtered = filtered.filter(
      (exercise) => !currentExerciseIdsSet.has(exercise.id)
    );

    setFilteredExercises(filtered);
  }, [searchQuery, exercises, currentWorkoutExerciseIds, isOpen]);

  const handleSearchChange = (
    _event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>,
    newValue?: string
  ) => {
    setSearchQuery(newValue || '');
  };

  const handleSaveSuccess = () => {
    setIsOpen(false); // Close the dialog
  };

  const toggleSelectExercise = (id: string, name: string) => {
    setSelectedExercises((prevState) => {
      if (prevState[id]) {
        console.log('prevstate', prevState[id]);
        const newState = { ...prevState };
        delete newState[id];
        console.log('newstate', newState);
        return newState;
      } else {
        const newExercise = {
          name: name,
          id: id,
          sets: '0',
          reps: '0',
          weight: '0',
          description: '',
          muscleGroup: [],
        };
        return { ...prevState, [id]: newExercise };
      }
    });
    console.log('selectedExercisesIneditworkout', selectedExercises);
  };

  const handleDetailChange = (
    id: string,
    detail: 'sets' | 'reps' | 'weight',
    value: string
  ) => {
    if (detail === 'sets') {
      setSelectedExercises((prev) => ({
        ...prev,
        [id]: { ...prev[id], sets: value },
      }));
    } else if (detail === 'reps') {
      setSelectedExercises((prev) => ({
        ...prev,
        [id]: { ...prev[id], reps: value },
      }));
    } else if (detail === 'weight') {
      setSelectedExercises((prev) => ({
        ...prev,
        [id]: { ...prev[id], weight: value },
      }));
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(_e, data) => setIsOpen(data.open)}>
      <DialogTrigger disableButtonEnhancement>
        <Button
          icon={<Edit16Regular />}
          className={styles.editWorkout}
          appearance="transparent"
          onClick={() => setIsOpen(true)}
        >
          Edit
        </Button>
      </DialogTrigger>
      <DialogSurface className={styles.customDialogSurface}>
        <DialogBody>
          <DialogTitle
            action={
              <DialogTrigger action="close">
                <Button
                  appearance="subtle"
                  aria-label="close"
                  icon={<Dismiss24Regular />}
                />
              </DialogTrigger>
            }
          />
          <DialogContent>
            <div className="edit-container">
              <div className="left-edit-container">
                <div className="left-edit-title">{props.workoutName}</div>
                <div className="edit-subtitle">Edit Exercises</div>
                <EditWorkoutTable
                  workoutName={props.workoutName}
                  selectedExercises={selectedExercises}
                  toggleSelectExercise={toggleSelectExercise}
                  setSelectedExercises={setSelectedExercises}
                  onSaveSuccess={handleSaveSuccess}
                />
              </div>
              <div className="ver-divider">
                <Divider vertical style={{ height: '90%' }} />
              </div>
              <div className="right-edit-container">
                <div className="edit-subtitle">Add Exercises</div>
                <div className="exercise-searchbar">
                  <SearchBox
                    appearance="underline"
                    style={{ width: '80%' }}
                    placeholder="Search exercises"
                    onChange={(event: any, data) =>
                      handleSearchChange(event, data?.value)
                    }
                    value={searchQuery}
                  />
                  {exercises && exercises.length > 0 && (
                    <div className="exer-box">
                      <ExerciseBox
                        exercises={filteredExercises}
                        selectedExercises={selectedExercises}
                        toggleSelectExercise={toggleSelectExercise}
                        handleDetailChange={handleDetailChange}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </DialogContent>
        </DialogBody>
      </DialogSurface>
    </Dialog>
  );
};

export default EditWorkout;
