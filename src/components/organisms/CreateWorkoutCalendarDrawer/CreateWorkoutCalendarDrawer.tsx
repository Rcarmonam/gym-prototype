import * as React from 'react';
import { useEffect, useState } from 'react';
import { doc, updateDoc, getDoc, setDoc } from 'firebase/firestore';
import { useAuth } from '../../../AuthContext.tsx';
import { db } from '../../../index.js';
import {
  Button,
  Checkbox,
  Dialog,
  DialogBody,
  DialogContent,
  DialogSurface,
  DialogTitle,
  DialogTrigger,
  Divider,
  makeStyles,
} from '@fluentui/react-components';
import { Dismiss24Regular, AddRegular } from '@fluentui/react-icons';
import { SearchBox } from '@fluentui/react-search-preview';
import DrawerToggleButton from '../../atoms/Buttons/DrawerToggleButton/DrawerToggleButton.tsx';
import ExerciseBox from '../ExerciseBox/ExerciseBox.tsx';
import ExerciseDataGrid from '../../atoms/Charts/DataGrid/DataGrid.tsx';
import SubmissionButton from '../../atoms/Buttons/GeneralButton/generalButton.tsx';
import './CreateWorkoutCalendarDrawer.css';
import { useExercises } from '../ExercisesData/useExercises.tsx';

const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const useStyles = makeStyles({
  customDialogSurface: {
    backgroundColor: 'var(--surface1);',
    height: '100%',
    width: '100%',
    maxHeight: '70vh',
    maxWidth: '70vw',
  },
  customBody: {
    marginTop: '-1rem',
  },
  dismissButton: {
    marginRight: '-0.9rem',
  },
});

const CreateWorkoutCalendarDrawer = (props: {
  setWorkoutAdded: any;
  workoutAdded: any;
}) => {
  const styles = useStyles();
  const { exercises } = useExercises();
  const [isOpen, setIsOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [workoutName, setWorkoutName] = React.useState('');
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [filteredExercises, setFilteredExercises] =
    useState<Exercise[]>(exercises);
  const [selectedExercises, setSelectedExercises] = useState<{
    [key: string]: Exercise;
  }>({});
  const [singleWorkouts, setSingleWorkouts] = useState<{
    [key: string]: SingleWorkoutDay;
  }>({});

  interface WorkoutData {
    selectedDays: string[];
    exercises: { [exerciseName: string]: Exercise };
    singleWorkoutDay: { [day: string]: SingleWorkoutDay };
  }

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

  interface SingleWorkoutDay {
    dateTime: string;
    duration: string;
    selectedWorkoutDay: string;
  }

  // Function to toggle the selected days
  const toggleDay = (day: string) => {
    setSelectedDays((prevDays) => {
      if (prevDays.includes(day)) {
        // If the day is already selected, remove it from the array
        return prevDays.filter((selectedDay) => selectedDay !== day);
      } else {
        // If the day is not selected, add it to the array
        return [...prevDays, day];
      }
    });
  };

  // Function to handle the search input change
  const handleSearchChange = (
    _event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>,
    newValue?: string
  ) => {
    setSearchQuery(newValue || '');
  };

  // Function to toggle the selected exercises
  const toggleSelectExercise = (id: string, name: string, description: string, muscleGroup: string[], video:string) => {
    setSelectedExercises((prevState) => {
      if (prevState[id]) {
        const newState = { ...prevState };
        delete newState[id];
        return newState;
      } else {
        const newExercise = {
          name: name,
          id: id,
          sets: '0',
          reps: '0',
          weight: '0',
          description: description,
          muscleGroup: muscleGroup,
          video: video,
        };
        return { ...prevState, [id]: newExercise };
      }
    });
  };

  // Function to handle the change in exercise details
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

  // Function to filter the exercises based on the search query
  useEffect(() => {
    if (searchQuery.trim()) {
      const lowerCaseQuery = searchQuery.toLowerCase();
      const filtered = exercises.filter((exercise) => {
        return (
          exercise.name.toLowerCase().includes(lowerCaseQuery) ||
          exercise.muscleGroup.some((muscle) =>
            muscle.toLowerCase().includes(lowerCaseQuery)
          )
        );
      });
      console.log(filtered);

      setFilteredExercises(filtered);
    } else {
      setFilteredExercises(exercises);
    }
  }, [searchQuery, exercises]);

  const { currentUser } = useAuth();

  // Function to construct and save the workout data
  const constructAndSaveWorkoutData = (
    documentID: string,
    workoutData: WorkoutData
  ) => {
    return saveWorkout(documentID, workoutData); // Save the workout data to Firebase
  };

  const handleSaveWorkout = () => {
    const newSingleWorkouts: { [key: string]: any } = {};
  
    const today = new Date();
    const currentDayOfWeek = today.getDay(); // Sunday - 0, Monday - 1, ..., Saturday - 6
  
    for (const day of selectedDays) {
      let daysToAdd;
      switch (day) {
        case 'Sun':
          daysToAdd = 0 - currentDayOfWeek;
          break;
        case 'Mon':
          daysToAdd = 1 - currentDayOfWeek;
          break;
        case 'Tue':
          daysToAdd = 2 - currentDayOfWeek;
          break;
        case 'Wed':
          daysToAdd = 3 - currentDayOfWeek;
          break;
        case 'Thu':
          daysToAdd = 4 - currentDayOfWeek;
          break;
        case 'Fri':
          daysToAdd = 5 - currentDayOfWeek;
          break;
        case 'Sat':
          daysToAdd = 6 - currentDayOfWeek;
          break;

        default:
          daysToAdd = 0;
          break;
      }
  
      const projectedDate = new Date(today);
      projectedDate.setDate(today.getDate() + daysToAdd);
      const formattedDate = projectedDate.toISOString().slice(0, 10); // Format as YYYY-MM-DD
  
      newSingleWorkouts[formattedDate] = {
        dateTime: formattedDate,
        duration: 'N/A', // This will be updated after the workout
        selectedWorkoutDay: day
      };
    }
  
    // Now that you have constructed newSingleWorkouts with the right dates, you can continue to save it
    const workoutData = {
      selectedDays: selectedDays, // These are the days of the week
      exercises: selectedExercises, // This is the exercise data
      singleWorkoutDay: newSingleWorkouts, // This includes the scheduled days with dates
    };
  
    const documentID = currentUser?.uid!;
    constructAndSaveWorkoutData(documentID, workoutData)
      .then(() => {
        setIsOpen(false);
        setWorkoutName('');
        setSelectedDays([]);
        setSelectedExercises({});
        setSingleWorkouts({});
        props.setWorkoutAdded(true);
        console.log('Workout saved successfully');
      })
      .catch((error) => {
        console.error('Error saving workout: ', error);
      });
  };

  // Function to save the workout data to Firebase
  const saveWorkout = async (documentID: string, workoutData: WorkoutData) => {
    try {
      const userWorkoutRef = doc(db, 'customerWorkouts', documentID);
      const userSnapshot = await getDoc(userWorkoutRef);

      // Construct the data to save
      const dataToSave: { [key: string]: any } = {};
      dataToSave[workoutName.trim()] = workoutData;

      if (userSnapshot.exists()) {
        await updateDoc(userWorkoutRef, dataToSave);
        console.log('Document updated in Firebase');
      } else {
        await setDoc(userWorkoutRef, dataToSave);
        console.log('Document created in Firebase');
      }
    } catch (e) {
      console.error('Error saving workout: ', e);
      throw e;
    }
  };

  return (
    <div>
      <Dialog
        modalType="non-modal"
        open={isOpen}
        onOpenChange={(_e, data) => setIsOpen(data.open)}
      >
        <DialogTrigger disableButtonEnhancement>
          <DrawerToggleButton
            icon={<AddRegular />}
            onClick={() => setIsOpen(true)}
            text={'Create Workout'}
          />
        </DialogTrigger>

        <DialogSurface className={styles.customDialogSurface}>
          <DialogBody className={styles.customBody}>
            <DialogTitle
              action={
                <DialogTrigger action="close">
                  <Button
                    className={styles.dismissButton}
                    appearance="subtle"
                    aria-label="close"
                    icon={<Dismiss24Regular />}
                  />
                </DialogTrigger>
              }
            />
            <DialogContent>
              <div className="menu-containers">
                <div className="left-menu-container">
                  <input
                    type="text"
                    value={workoutName}
                    onChange={(e) => setWorkoutName(e.target.value)}
                    className={`workout-name-input ${
                      workoutName ? 'filled' : ''
                    }`}
                    placeholder="Enter workout name"
                    maxLength={35}
                  />
                  <div className="workout-calendar-repeat">
                    <div className="workout-calendar-repeat-title">
                      Repeat on
                    </div>
                    <div className="workout-calendar-repeat-options">
                      {daysOfWeek.map((day) => (
                        <button
                          key={day}
                          className={`day-circle ${
                            selectedDays.includes(day) ? 'selected' : ''
                          }`}
                          onClick={() => toggleDay(day)}
                        >
                          {day}
                        </button>
                      ))}
                    </div>
                    <div className="hori-divider">
                      <Divider />
                    </div>
                    <div className="data-grid">
                      <div className="data-grid-title">
                        Exercises Currently Added
                      </div>
                      <ExerciseDataGrid
                        selectedExercises={selectedExercises}
                        toggleSelectExercise={toggleSelectExercise}
                      />
                    </div>
                  </div>
                </div>
                <div className="ver-divider">
                  <Divider vertical style={{ height: '90%' }} />
                </div>
                <div className="right-menu-container">
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
                <div className="save-button">
                  <SubmissionButton
                    text="Save Workout"
                    styleType="style2"
                    buttonSize="small"
                    onClick={handleSaveWorkout}
                  />
                </div>
              </div>
            </DialogContent>
          </DialogBody>
        </DialogSurface>
      </Dialog>
    </div>
  );
};

export default CreateWorkoutCalendarDrawer;
