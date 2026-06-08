import './WeekCalendarNavigator.css';
import WeekCalendarNextBtn from '../../atoms/Buttons/WeekCalendarButtons/WeekCalendarNextBtn.tsx';
import WeekCalendarPrevBtn from '../../atoms/Buttons/WeekCalendarButtons/WeekCalendarPrevBtn.tsx';
import QuickAddCalendarDrawer from '../QuickAddCalendarDrawer/QuickAddCalendarDrawer.tsx';
import CreateWorkoutCalendarDrawer from '../CreateWorkoutCalendarDrawer/CreateWorkoutCalendarDrawer.tsx';
import {
  formatDate,
  generateWeekDates,
  renderMonthDateDisplay,
  useWeekNavigation,
} from './UseWeekNavigation.tsx';
import { useUserWorkouts } from './UseUserWorkouts.tsx';
import { useEffect, useState } from 'react';
import WorkoutBox from '../WorkoutBox/WorkoutBox.tsx';

const WeekCalendarNavigator = () => {
  const { getUserWorkouts } = useUserWorkouts();
  const { startWeekDate, handleNextWeek, handlePrevWeek } = useWeekNavigation();
  const weekDates = generateWeekDates(startWeekDate);
  const [workoutAdded, setWorkoutAdded] = useState<boolean>(false);
  const [workoutDeleted, setWorkoutDeleted] = useState<boolean>(false);
  const [duration, setDuration] = useState<boolean>(false);
  const [workoutContainers, setworkoutContainers] = useState<{
    [key: string]: JSX.Element[];
  }>({
    Sun: [],
    Mon: [],
    Tue: [],
    Wed: [],
    Thu: [],
    Fri: [],
    Sat: [],
  });

  // Fetch workout data and update workout containers
  useEffect(() => {
    const fetchWorkoutData = async () => {
      try {
        const workoutData = await getUserWorkouts();
        if (workoutData) {
          const updatedworkoutContainers: { [key: string]: JSX.Element[] } = {
            Sun: [],
            Mon: [],
            Tue: [],
            Wed: [],
            Thu: [],
            Fri: [],
            Sat: [],
          };

          // Loop through each workout and add it to the appropriate day
          Object.keys(workoutData).forEach((key) => {
            const workout = workoutData[key];
            if (workout.selectedDays) {
              workout.selectedDays.forEach((selectedDay: string) => {
                if (updatedworkoutContainers[selectedDay]) {
                  const filteredWorkouts = Object.values(workout.singleWorkoutDay).filter((inner: any) => inner.selectedWorkoutDay === selectedDay);
                  if (filteredWorkouts && filteredWorkouts.length > 0) {
                    updatedworkoutContainers[selectedDay].push(
                      <WorkoutBox
                        key={key}
                        selectedDay={selectedDay}
                        workoutName={key}
                        time={(filteredWorkouts[0] as any).duration}
                        setWorkoutDeleted={setWorkoutDeleted}
                        setDuration={setDuration}
                      />
                    );
                  }
                  else {
                    updatedworkoutContainers[selectedDay].push(
                      <WorkoutBox
                        key={key}
                        selectedDay={selectedDay}
                        workoutName={key}
                        time={'N/A'}
                        setWorkoutDeleted={setWorkoutDeleted}
                        setDuration={setDuration}
                      />
                    );
                  }
                }
              });
            }
          });

          setworkoutContainers(updatedworkoutContainers);
        } else {
          //No workout data is available
        }
      } catch (error) {
        console.error('Error fetching and processing workout data:', error);
      }
    };

    // Fetch workout data
    fetchWorkoutData();
    if (workoutAdded) {
      setWorkoutAdded(false);
    }
    if (workoutDeleted) {
      setWorkoutDeleted(false);
    }
    if (duration) {
      setDuration(false);
    }
  }, [workoutAdded, workoutDeleted, duration]);

  // Function to get the day of the week
  const getDayOfWeek = (date: Date) => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return days[date.getDay()];
  };

  return (
    <div>
      <div className="topContainer">
        <div className="dateDisplay">{renderMonthDateDisplay(weekDates)}</div>
        <div className="nextPrevButtons">
          <WeekCalendarPrevBtn onClick={handlePrevWeek} />
          <WeekCalendarNextBtn onClick={handleNextWeek} />
        </div>
        <div className="functionButtons">
          <QuickAddCalendarDrawer
            setWorkoutAdded={setWorkoutAdded}
            workoutAdded={workoutAdded}
            setWorkoutDeleted={setWorkoutDeleted}
            workoutDeleted={workoutDeleted}
          />
          <CreateWorkoutCalendarDrawer
            setWorkoutAdded={setWorkoutAdded}
            workoutAdded={workoutAdded}
          />
        </div>
      </div>
      <div className="mid-container">
        <ul className="week-day-list-container">
          {weekDates.map((date, index) => (
            <div className="week-day" key={index}>
              {formatDate(date)}
            </div>
          ))}
        </ul>
        <div className="display-workouts-container">
          {weekDates.map((date, index) => (
            <div className="workouts-holder" key={index}>
              <div className="workout-box">
                {workoutContainers[getDayOfWeek(date)].sort((a, b) => {
                  // Sort workout boxes based on their keys
                  const keyA = a.key as string; 
                  const keyB = b.key as string;
                  return keyA.localeCompare(keyB);
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WeekCalendarNavigator;
