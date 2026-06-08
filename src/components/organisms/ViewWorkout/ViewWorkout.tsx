import {
  Button,
  makeStyles,
  OverlayDrawer,
  DrawerHeaderTitle,
  DrawerHeader,
} from '@fluentui/react-components';
import { Eye16Regular, Dismiss24Regular } from '@fluentui/react-icons';
import background from '../../../assets/Pic1.svg';
import { useUserWorkouts } from '../../organisms/WeekCalendarNavigator/UseUserWorkouts.tsx';
import StartButton from '../../atoms/Buttons/GeneralButton/generalButton.tsx';
import ViewWorkoutTable from '../../../components/atoms/Charts/ViewWorkoutTable/ViewWorkoutTable.tsx';
import Countdown from '../StartWorkout/Countdown.tsx';
import { useStopwatch } from 'react-timer-hook';
import './ViewWorkout.css';
import React, { useEffect, useState } from 'react';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../../index.js';
import { useAuth } from '../../../AuthContext.tsx';

const QUOTES = [
  'Fitness is not about being better than someone else. It’s about being better than you used to be.',
  'Every workout counts, even if it feels small. Progress is progress.',
  "Strength doesn't come from what you can do. It comes from overcoming the things you once thought you couldn't.",
  'The pain you feel today will be the strength you feel tomorrow.',
];

const useStyles = makeStyles({
  viewWorkout: {
    alignSelf: 'flex-start',
    textAlign: 'left',
    justifyContent: 'flex-start',
    width: '100%',
    '&:hover': {
      backgroundColor: 'var(--surface3)',
    },
  },
  closeButton: {
    paddingRight: '0.5rem',
  },
  customDialogSurface: {
    width: '100%',
    height: '90vh',
    display: 'flex',
    backgroundColor: '#070707',
  },
  pictureBackground: {
    backgroundColor: '#070707',
    backgroundImage: 'url(' + background + ')',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    alignSelf: 'center',
    width: '95vw',
    height: '90vh',
  },
});

const ViewWorkout = (props: { workoutName: any, setDuration: any, selectedDay: any }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const { getUserWorkouts } = useUserWorkouts();
  const [quote, setQuote] = useState('');
  const { currentUser } = useAuth();
  const [muscleGroups, setMuscleGroups] = React.useState<string[]>([]);
  const [startWorkout, setStartWorkout] = useState(true);
  const [localDuration, setLocalDuration] = useState(false);
  const [startWorkoutButton, setStartWorkoutButton] = useState(false);
  const stopwatch = useStopwatch({ autoStart: false });
  const styles = useStyles();

  useEffect(() => {
    // Set a random quote
    setQuote(QUOTES[Math.floor(Math.random() * QUOTES.length)]);
    const fetchWorkoutData = async () => {
      try {
        const workoutData = await getUserWorkouts();
        if (workoutData) {
          const muscleGroupsArray = extractMuscleGroups(workoutData);
          setMuscleGroups(muscleGroupsArray);

          // Get the current date
          const today = new Date().toISOString().slice(0, 10);

          // Check if the workout has been started today
          if (workoutData[props.workoutName].singleWorkoutDay && 
            workoutData[props.workoutName].singleWorkoutDay[today] && 
            workoutData[props.workoutName].singleWorkoutDay[today].dateTime === today &&
            workoutData[props.workoutName].singleWorkoutDay[today].selectedWorkoutDay === props.selectedDay) {
            setStartWorkoutButton(true);
            console.log("Start workoutButton is", startWorkoutButton)
          }
          else {
            setStartWorkoutButton(false);
          }
        }
      } catch (error) {
        console.error('Error fetching workout data:', error);
      }
    };

    fetchWorkoutData();
    if(localDuration) {
      setLocalDuration(false);
    }
  }, [localDuration, props.selectedDay, isOpen]);

  // Function to extract muscle groups from the workout data
  const extractMuscleGroups = (workoutsData: any): string[] => {
    const workout = workoutsData[props.workoutName];
    if (!workout || !workout.exercises) return [];

    let uniqueMuscleGroups = new Set<string>();

    // Extract muscle groups from each exercise
    Object.values(workout.exercises).forEach((exercise: any) => {
      if (Array.isArray(exercise.muscleGroup)) {
        exercise.muscleGroup.forEach((muscle: string) => {
          uniqueMuscleGroups.add(muscle.trim().toLowerCase());
        });
      } else if (exercise.muscleGroup) {
        uniqueMuscleGroups.add(exercise.muscleGroup.trim().toLowerCase());
      }
    });

    // Capitalize the first letter of each muscle group
    return Array.from(
      uniqueMuscleGroups,
      (mg) => mg.charAt(0).toUpperCase() + mg.slice(1)
    );
  };

  // Function to start and stop the workout timer
  const toggleView = () => {
    setStartWorkout(!startWorkout);
    if (startWorkout) {
      setTimeout(() => {
        stopwatch.reset();
        stopwatch.start();
      }, 3000);
    } else {
      stopwatch.pause();
      saveDuration();
      stopwatch.pause();
    }
  };

  // Function to save the workout duration
  const saveDuration = async () => {
    if (!currentUser) return;

    // Get the current date
    const today = new Date().toISOString().slice(0, 10);

    // Get the duration as a single string
    const duration = `${stopwatch.hours
      .toString()
      .padStart(2, '0')}:${stopwatch.minutes
      .toString()
      .padStart(2, '0')}:${stopwatch.seconds.toString().padStart(2, '0')}`;

    // Get the user workout reference
    const userWorkoutRef = doc(db, 'customerWorkouts', currentUser.uid);

    // Save the duration to Firestore
    try {
      const userSnapshot = await getDoc(userWorkoutRef);
      if (userSnapshot.exists()) {
      const workoutData = userSnapshot.data()[props.workoutName];
      if (!workoutData.singleWorkoutDay) {
        workoutData.singleWorkoutDay = {};
      }

      // Update or create the workout entry for today with the new duration
      workoutData.singleWorkoutDay[today] = {
        ...(workoutData.singleWorkoutDay[today] || {}),
        dateTime: today,
        duration: duration,
      };

      // Save the updated data back to Firestore
      await updateDoc(userWorkoutRef, {
        [props.workoutName]: workoutData
      });

      props.setDuration(true);
      setLocalDuration(true);
      }
    } catch (error) {
      console.error('Error saving workout duration:', error);
    }
  };

  return (
    <div>
      <OverlayDrawer
        position="bottom"
        open={isOpen}
        modalType="alert"
        className={styles.customDialogSurface}
      >
        <DrawerHeader className={styles.pictureBackground}>
          <DrawerHeaderTitle
            className={styles.closeButton}
            action={
              <Button
                appearance="subtle"
                aria-label="Close"
                icon={<Dismiss24Regular />}
                onClick={() => {setStartWorkoutButton(false); setIsOpen(false)}}
              />
            }
          >
            <div className="workout-name-view">{props.workoutName}</div>
          </DrawerHeaderTitle>
          <div className="top-section">
            <div className="muscle-title">
              Muscle Focus
              <div className="muscle-list">
                <ul>
                  {muscleGroups.map((muscleGroup, index) => (
                    <li key={index}>{muscleGroup}</li>
                  ))}
                  {muscleGroups.length === 0 && <li>None</li>}
                </ul>
              </div>
            </div>
            <div className="workout-qoute">{quote}</div>
          </div>
          <div className="bottom-row">
            <div className="duration-timer">
              <span>{stopwatch.hours.toString().padStart(2, '0')}</span>:
              <span>{stopwatch.minutes.toString().padStart(2, '0')}</span>:
              <span>{stopwatch.seconds.toString().padStart(2, '0')}</span>
            </div>
            {startWorkoutButton ? (
              <div className="start-workout-button">
                <StartButton
                  text={startWorkout ? 'Start Workout' : 'Finish Workout'}
                  styleType="style2"
                  buttonSize="small"
                  onClick={toggleView}
                />
              </div>
            ) : (
              <div className='start-workout-button'></div>
            )}
            
          </div>
          <div className="table-background">
            {startWorkout ? (
              <div className="workout-table">
                <ViewWorkoutTable workoutName={props.workoutName} />
              </div>
            ) : (
              <Countdown workoutName={props.workoutName} />
            )}
          </div>
        </DrawerHeader>
      </OverlayDrawer>
      <Button
        appearance="subtle"
        className={styles.viewWorkout}
        onClick={() => setIsOpen(true)}
        icon={<Eye16Regular />}
      >
        View
      </Button>
    </div>
  );
};

export default ViewWorkout;
