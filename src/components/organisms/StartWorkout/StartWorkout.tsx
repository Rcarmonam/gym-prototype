import { useEffect, useState } from 'react';
import {
  ChevronLeft24Filled,
  ChevronRight24Filled,
} from '@fluentui/react-icons';
import { useUserWorkouts } from '../../organisms/WeekCalendarNavigator/UseUserWorkouts.tsx';
import './StartWorkout.css';

interface Exercise {
  name: string;
  reps: string;
  sets: string;
  weight: string;
  description?: string;
  video?: string;
}

const StartWorkout = (props: { workoutName: any }) => {
  const { getUserWorkouts } = useUserWorkouts();
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);

  useEffect(() => {
    const fetchWorkoutData = async () => {
      try {
        const workoutData = await getUserWorkouts();
        if (workoutData && workoutData[props.workoutName].exercises) {
          const workoutExercises: Exercise[] = Object.values(
            workoutData[props.workoutName].exercises
          );
          setExercises(workoutExercises);
        }
      } catch (error) {
        console.error('Error fetching workout data:', error);
      }
    };

    fetchWorkoutData();
  }, [props.workoutName]);

  const handleNext = () => {
    setCurrentExerciseIndex((prevIndex) => (prevIndex + 1) % exercises.length);
  };

  const handlePrevious = () => {
    setCurrentExerciseIndex(
      (prevIndex) => (prevIndex - 1 + exercises.length) % exercises.length
    );
  };

  const currentExercise = exercises[currentExerciseIndex];

  return (
    <div className="start-container">
      <div className="main-start-box">
        <div className="chevron-left" onClick={handlePrevious}>
          <ChevronLeft24Filled />
        </div>
        <div className="exercise-desc">
          <div className="exercise-name-start">
            {currentExercise?.name || 'Exercise'}
          </div>
          <div className="rep-set">
            {currentExercise?.reps
              ? `${currentExercise.reps} reps | `
              : '0 reps | '}
            {currentExercise?.sets
              ? `${currentExercise.sets} sets | `
              : '0 sets | '}
            {currentExercise?.weight ? `${currentExercise.weight} lb` : '0 lb'}
          </div>
          <div className="description-start">
            {currentExercise?.description || 'Description of the exercise'}
          </div>
        </div>
        <div className="video-box">
          <iframe
            title="exercise-video"
            src={currentExercise?.video}
            allowFullScreen
            loading="lazy"
            style={{ border: 'none', width: '26.7rem', height: '15rem' }}
          />
        </div>
        <div className="chevron-right" onClick={handleNext}>
          <ChevronRight24Filled />
        </div>
      </div>
    </div>
  );
};

export default StartWorkout;
