import { Input } from '@fluentui/react-components';
import { useState } from 'react';
import './ExerciseBox.css';

const ExerciseBoxRepsSets = (props: {
  exercise: any;
  handleDetailChange: any;
}) => {
  const [reps, setReps] = useState(props.exercise.reps);
  const [sets, setSets] = useState(props.exercise.sets);
  const [weight, setWeight] = useState(props.exercise.weight);

  return (
    <div className="exercise-details">
      <Input
        className="exercise-input"
        appearance="underline"
        value={sets}
        onChange={(e) => {
          e.preventDefault();
          setSets(e.target.value);
          props.handleDetailChange(props.exercise.id, 'sets', e.target.value);
        }}
        placeholder="sets"
      />
      <span>×</span>
      <Input
        className="exercise-input"
        appearance="underline"
        value={reps}
        onChange={(e) => {
          e.preventDefault();
          setReps(e.target.value);
          props.handleDetailChange(props.exercise.id, 'reps', e.target.value);
        }}
        placeholder="reps"
      />
      <span>,</span>
      <Input
        className="weight-input"
        appearance="underline"
        value={weight}
        onChange={(e) => {
          e.preventDefault();
          setWeight(e.target.value);
          props.handleDetailChange(props.exercise.id, 'weight', e.target.value);
        }}
        placeholder="lb"
      />
    </div>
  );
};

export default ExerciseBoxRepsSets;
