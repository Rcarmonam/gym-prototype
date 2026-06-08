import './ExerciseBox.css';
import { CheckmarkCircle16Filled } from '@fluentui/react-icons';
import ExerciseBoxRepsSets from './ExerciseBoxRepsSets.tsx';
import InfoWorkoutPopOver from '../../atoms/Buttons/InfoButton/InfoWorkoutPopOver.tsx';

const ExerciseBox = (props: {
  exercises: any;
  selectedExercises: any;
  toggleSelectExercise: any;
  handleDetailChange: any;
}) => {
  return (
    <div className="exercise-container">

      {props.exercises.map((exercise: any) => (
        <div key={exercise.id} className="exercise-item-container">
          <div
            className="exercise-box"
            onClick={() =>
              props.toggleSelectExercise(exercise.id, exercise.name, exercise.description, exercise.muscleGroup, exercise.video)
            }
          >
            <div className="exercise-info">
              <div className="exercise-title"> {exercise.name} </div>
              <CheckmarkCircle16Filled
                className={`exercise-checkmark ${
                  props.selectedExercises[exercise.id] ? 'selected' : ''
                }`}
                style={{
                  color: props.selectedExercises[exercise.id]
                    ? 'var(--primary2)'
                    : 'var(--fontColor)',
                }}
              />
              <InfoWorkoutPopOver exercise={exercise.id} description={exercise.description} muscleGroups={exercise.muscleGroup}/>
            </div>
          </div>
          {props.selectedExercises[exercise.id] && (
            <ExerciseBoxRepsSets handleDetailChange={props.handleDetailChange} exercise={exercise}/>
          )}
        </div> 
      ))}
    </div>
  );
};

export default ExerciseBox;
