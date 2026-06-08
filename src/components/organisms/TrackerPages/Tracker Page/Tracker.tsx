import './Tracker.css';
import Workout from '../../../../assets/workout5.svg';
import DonutChart from '../../../atoms/Charts/DonutChart/donutChart.tsx';
import ActivityChart from '../../../atoms/Charts/ActivityChart/activityChart.tsx';
import SaveButton from '../../../atoms/Buttons/GeneralButton/generalButton.tsx';
import { useEffect, useId, useState } from 'react';
import { Field, Textarea, Toaster, makeStyles } from '@fluentui/react-components';
import { useUserWorkouts } from '../../WeekCalendarNavigator/UseUserWorkouts.tsx';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../../../index.js';
import { useAuth } from '../../../../AuthContext.tsx';
import {
  Clock28Regular,
} from '@fluentui/react-icons';
import {
  useToastController,
  Toast,
  ToastTitle,
  ToastBody,
} from "@fluentui/react-components";

const useStyles = makeStyles({
  toast: {
      backgroundColor: 'var(--surface1);',
  }
});
interface Exercise {
  description: string;
  id: string;
  muscleGroup: string[];
  name: string;
  reps: string;
  sets: string;
  weight: string;
  video: string;
}

interface Workout {
  repeatWeekly: boolean;
  selectedDays: string[];
  exercises: { [exerciseName: string]: Exercise };
}


const Tracker = (props: { firstName: any }) => {
  const { getUserWorkouts } = useUserWorkouts();
  const [workoutDuration, setWorkoutDuration] = useState('0');
  const [workoutName, setWorkoutName] = useState('');
  const [notes, setNotes] = useState('');
  const toasterId = useId();
  const { dispatchToast } = useToastController(toasterId);
  const styles = useStyles();
  const { currentUser } = useAuth();
  const [chartData, setChartData] = useState<
    { name: string; duration: number }[]
  >([]);
  const [pieData, setPieData] = useState<{ name: string; value: number }[]>([]);

  // Convert time string to minutes
  const convertToMinutes = (timeStr: string) => {
    if (!timeStr) return 0;
    const parts = timeStr.split(':').map(Number);
    if (parts.includes(NaN)) return 0;
    const [hours, minutes, seconds] = parts;
    return hours * 60 + minutes + seconds / 60;
  };

  useEffect(() => {
    const fetchWorkoutData = async () => {
      try {
        const workoutData = await getUserWorkouts();
        if (!workoutData) return;

        const today = new Date();

        const dayOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][
          today.getDay()
        ];

        const durationsByDay: { [day: string]: number } = {
          Sun: 0,
          Mon: 0,
          Tue: 0,
          Wed: 0,
          Thu: 0,
          Fri: 0,
          Sat: 0,
        };

        // Iterate over each workout and process durations
        Object.keys(workoutData).forEach((key) => {
          const workout = workoutData[key];
          if (!workout || !workout.singleWorkoutDay) return;

          // Check if today is one of the selected days and if so, update today's workout details
          if (workout.selectedDays.includes(dayOfWeek)) {
            setWorkoutName(key);

            if (workout.singleWorkoutDay[today.toISOString().slice(0, 10)]) {
              const duration =
                workout.singleWorkoutDay[today.toISOString().slice(0, 10)]
                  .duration;
              setWorkoutDuration(duration);
            }
          }

          // Iterate over each recorded workout day and accumulate duration
          Object.values(workout.singleWorkoutDay).forEach((dayInfo: any) => {
            if (
              dayInfo.duration &&
              durationsByDay[dayInfo.selectedWorkoutDay] !== undefined
            ) {
              if (dayInfo.duration === '0') {
              } else {
                const durationInMinutes = convertToMinutes(dayInfo.duration);
                durationsByDay[dayInfo.selectedWorkoutDay] += durationInMinutes;
              }
            }
          });
        });

        // Prepare data for the chart
        const formattedChartData = Object.keys(durationsByDay).map((day) => ({
          name: day,
          duration: isNaN(durationsByDay[day])
            ? 0
            : Math.round(durationsByDay[day]),
        }));

        setChartData(formattedChartData);
      } catch (error) {
        console.error('Error fetching and processing workout data:', error);
      }
    };

    fetchWorkoutData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const workoutData = await getUserWorkouts();
        if (!workoutData) return;

        // Count the number of times each muscle group appears in the workout data
        const muscleGroupCounts: { [key: string]: number } = {};

        // Iterate over each workout and process muscle groups
        Object.values(workoutData).forEach((workout) => {
          if (workout && workout.exercises) {
            Object.values(workout.exercises).forEach((exercise: any) => {
              if (exercise.muscleGroup) {
                exercise.muscleGroup.forEach((muscle: any) => {
                  const muscleClean = muscle.trim().toLowerCase();
                  muscleGroupCounts[muscleClean] =
                    (muscleGroupCounts[muscleClean] || 0) + 1;
                });
              }
            });
          }
        });

        // Prepare data for the pie chart
        const formattedPieData = Object.keys(muscleGroupCounts).map((key) => ({
          name: key.charAt(0).toUpperCase() + key.slice(1),
          value: muscleGroupCounts[key],
        }));

        // Sort the data by value in descending order
        setPieData(formattedPieData);
      } catch (error) {
        console.error('Error fetching and processing workout data:', error);
      }
    };
    fetchData();
  }, []);

  // This useEffect hook will fetch notes from the database when the user logs in
  useEffect(() => {
    if (currentUser?.uid) {
      const notesRef = doc(db, 'customerWorkouts', currentUser.uid);
      const fetchNotes = async () => {
        const docSnap = await getDoc(notesRef);
        if (docSnap.exists()) {
          setNotes(docSnap.data().notes);
        } else {
          console.log(
            'No existing document for notes, a new one will be created upon save.'
          );
        }
      };
      fetchNotes();
    }
  }, [currentUser?.uid]);

  // Function to save notes
  const saveNotes = async () => {
    if (currentUser?.uid) {
      const notesRef = doc(db, 'customerWorkouts', currentUser.uid);
      try {
        await updateDoc(notesRef, { notes });
        console.log('Notes saved successfully');
        dispatchToast(  // Call notify directly here after successful save
          <Toast className={styles.toast}>
            <ToastTitle>Notes Saved!</ToastTitle>
            <ToastBody>Your notes have been successfully saved.</ToastBody>
          </Toast>,
          { position: "top-end", intent: "success" }
        );
      } catch (error) {
        console.error('Error saving notes:', error);
      }
    } else {
      console.error('No user id available to save notes');
    }
  };

  return (
    <div className="Tracker">
      <Toaster toasterId={toasterId} limit={5} />
      <div className="tracker-content">
        <div className="hello-message">
          <div className="greetingTracker">Hello, </div>
          <div className="customer-name">{props.firstName}</div>
        </div>
        <div className="row1">
          <div className="workout-container">
            <div className="session-title">Today's Session</div>
            <img src={Workout} alt="Workout" className="workout-img" />
            <div className="overlay">
              <div className="time-row">
                <div className="clock-icon">
                  <Clock28Regular />
                </div>
                <div className="time-text">{workoutDuration}</div>
              </div>
              <div className="workout-row">
                <div className="workout-text">{workoutName}</div>
              </div>
            </div>
          </div>
          <div className="goals-container">
            <div className="goals-title">Goals</div>
            <Field size="large" className="text-area-container">
              <Textarea
                placeholder="Type your goals and notes here..." 
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </Field>
            <div className="note-button">
              <SaveButton
                text="Save Notes"
                styleType="style2"
                buttonSize="small"
                onClick={saveNotes}
              />
            </div>
          </div>
        </div>
        <div className="row2">
          <div className="activity-container-tracker">
            <div className="activity-title">Workout Duration</div>
            <div className="activity-chart">
              <ActivityChart data={chartData} />
            </div>
          </div>
          <div className="overview-container">
            <div className="overview-title">Muscle Overview</div>
            <div className="donut-chart">
              <DonutChart data={pieData} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tracker;
